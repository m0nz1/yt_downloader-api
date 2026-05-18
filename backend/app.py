from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
import subprocess
import os
import uuid
import json
import threading
import time
import logging
from urllib.parse import urlparse, parse_qs

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app, origins=["*"], supports_credentials=True)

DOWNLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "downloads")
COOKIES_FILE = "cookies.txt"

os.makedirs(DOWNLOAD_DIR, exist_ok=True)

# ─── CORS Fix ─────────────────────────────────────────────────────────
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# ─── Helpers ──────────────────────────────────────────────────────────

def extract_video_id(url):
    if "youtube.com" in url or "youtu.be" in url:
        parsed = urlparse(url)
        if parsed.hostname == "youtu.be":
            return parsed.path[1:]
        if parsed.hostname in ("www.youtube.com", "youtube.com", "m.youtube.com"):
            qs = parse_qs(parsed.query)
            return qs.get("v", [None])[0]
    return None

def cleanup_old_files():
    """Delete files older than 1 hour"""
    now = time.time()
    deleted = 0
    for f in os.listdir(DOWNLOAD_DIR):
        path = os.path.join(DOWNLOAD_DIR, f)
        if os.path.isfile(path) and now - os.path.getmtime(path) > 3600:
            try:
                os.remove(path)
                deleted += 1
            except:
                pass
    if deleted > 0:
        logger.info(f"Cleaned up {deleted} old files")

def run_ytdlp(args):
    """Run yt-dlp and return result"""
    cmd = ["yt-dlp"] + args
    logger.info(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result

# ─── Routes ─────────────────────────────────────────────────────────

@app.route("/")
def home():
    return jsonify({
        "status": True,
        "message": "NeoTube Flask API Running",
        "version": "1.0.0",
        "endpoints": {
            "info": "POST /info - Get video info & formats",
            "mp4": "POST /mp4 - Download video",
            "mp3": "POST /mp3 - Download audio",
            "download": "GET /download/<filename> - Serve file",
            "health": "GET /health - Health check"
        }
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "ok",
        "downloads_dir": os.path.exists(DOWNLOAD_DIR),
        "downloads_count": len(os.listdir(DOWNLOAD_DIR))
    })


@app.route("/info", methods=["POST"])
def info():
    data = request.get_json() or {}
    url = data.get("url")

    if not url:
        return jsonify({"status": False, "message": "URL is required"}), 400

    video_id = extract_video_id(url)
    if not video_id:
        return jsonify({"status": False, "message": "Invalid YouTube URL"}), 400

    try:
        # Get info JSON
        result = run_ytdlp([
            "--dump-json",
            "--no-download",
            "-f", "best[ext=mp4]/best",
            url
        ])

        if result.returncode != 0:
            logger.error(f"yt-dlp error: {result.stderr}")
            return jsonify({"status": False, "message": result.stderr}), 500

        info_json = json.loads(result.stdout.strip().split("\n")[0])

        # Get ALL available formats - include everything yt-dlp returns
        video_formats = []
        audio_formats = []
        seen_video = set()
        seen_audio = set()

        for f in info_json.get("formats", []):
            format_id = f.get("format_id", "")
            quality = f.get("quality_label") or f.get("format_note") or f.get("resolution", "unknown")
            ext = f.get("ext", "mp4")
            vcodec = f.get("vcodec", "none")
            acodec = f.get("acodec", "none")

            size_mb = None
            if f.get("filesize"):
                size_mb = round(f["filesize"] / (1024 * 1024), 1)
            elif f.get("filesize_approx"):
                size_mb = round(f["filesize_approx"] / (1024 * 1024), 1)

            format_data = {
                "itag": format_id,
                "quality": quality,
                "ext": ext,
                "size_mb": size_mb,
                "bitrate": f.get("abr"),
                "format_note": f.get("format_note"),
                "vcodec": vcodec,
                "acodec": acodec,
            }

            # Categorize: video+audio combined, video-only, audio-only
            has_video = vcodec != "none"
            has_audio = acodec != "none"

            if has_video and has_audio:
                # Combined video+audio - prefer these for video download
                key = f"video_{quality}"
                if key not in seen_video:
                    seen_video.add(key)
                    video_formats.append({**format_data, "type": "video"})
            elif has_video and not has_audio:
                # Video-only (needs merging with audio) - skip for simplicity
                # Or include if you want highest quality options
                key = f"video_only_{quality}"
                if key not in seen_video:
                    seen_video.add(key)
                    video_formats.append({**format_data, "type": "video"})
            elif not has_video and has_audio:
                # Audio-only
                key = f"audio_{quality}_{f.get('abr', '0')}"
                if key not in seen_audio:
                    seen_audio.add(key)
                    audio_formats.append({**format_data, "type": "audio"})

        # Sort by quality
        quality_order = {
            "audio only": 0, "144p": 1, "240p": 2, "360p": 3, 
            "480p": 4, "720p": 5, "1080p": 6, 
            "1440p": 7, "2160p": 8, "4K": 9, "8K": 10
        }

        def get_quality_sort(fmt):
            q = fmt["quality"]
            for key in quality_order:
                if key in q:
                    return quality_order[key]
            return 99

        video_formats.sort(key=get_quality_sort)
        audio_formats.sort(key=lambda x: x.get("bitrate") or 0, reverse=True)

        video_fmts = video_formats
        audio_fmts = audio_formats

        return jsonify({
            "status": True,
            "data": {
                "id": video_id,
                "title": info_json.get("title", "Unknown"),
                "thumbnail": info_json.get("thumbnail"),
                "duration": info_json.get("duration"),
                "author": info_json.get("uploader"),
                "formats": {
                    "video": video_fmts,
                    "audio": audio_fmts
                }
            }
        })

    except Exception as e:
        logger.exception("Error in /info")
        return jsonify({"status": False, "message": str(e)}), 500


@app.route("/mp4", methods=["POST"])
def mp4():
    data = request.get_json() or {}
    url = data.get("url")
    quality = data.get("quality", "best")

    if not url:
        return jsonify({"status": False, "message": "URL is required"}), 400

    uid = str(uuid.uuid4())[:8]
    output_template = os.path.join(DOWNLOAD_DIR, f"{uid}.%(ext)s")

    # Determine format selector
    if quality and quality != "best":
        height = quality.replace('p', '').replace('P', '')
        format_sel = f"best[height<={height}][ext=mp4]/best[height<={height}]"
    else:
        format_sel = "best[ext=mp4]/best"

    args = [
        "-f", format_sel,
        "--merge-output-format", "mp4",
        "--ffmpeg-location", "/usr/bin/ffmpeg",
        "-o", output_template,
        "--newline",
        url
    ]

    if os.path.exists(COOKIES_FILE):
        args = ["--cookies", COOKIES_FILE] + args

    try:
        result = run_ytdlp(args)

        if result.returncode != 0:
            logger.error(f"yt-dlp mp4 error: {result.stderr}")
            return jsonify({"status": False, "message": result.stderr}), 500

        # Find the downloaded file
        downloaded = None
        for f in os.listdir(DOWNLOAD_DIR):
            if f.startswith(uid):
                downloaded = f
                break

        if not downloaded:
            return jsonify({"status": False, "message": "Download failed: file not found"}), 500

        # Start cleanup thread
        threading.Thread(target=cleanup_old_files, daemon=True).start()

        return jsonify({
            "status": True,
            "filename": downloaded,
            "download_url": request.host_url.rstrip("/") + "/download/" + downloaded,
            "title": data.get("title", "video")
        })

    except Exception as e:
        logger.exception("Error in /mp4")
        return jsonify({"status": False, "message": str(e)}), 500


@app.route("/mp3", methods=["POST"])
def mp3():
    data = request.get_json() or {}
    url = data.get("url")

    if not url:
        return jsonify({"status": False, "message": "URL is required"}), 400

    uid = str(uuid.uuid4())[:8]
    output_template = os.path.join(DOWNLOAD_DIR, f"{uid}.%(ext)s")

    args = [
        "-x",  # extract audio
        "--audio-format", "mp3",
        "--audio-quality", "0",  # best
        "--embed-thumbnail",
        "--add-metadata",
        "--ffmpeg-location", "/usr/bin/ffmpeg",
        "-o", output_template,
        "--newline",
        url
    ]

    if os.path.exists(COOKIES_FILE):
        args = ["--cookies", COOKIES_FILE] + args

    try:
        result = run_ytdlp(args)

        if result.returncode != 0:
            logger.error(f"yt-dlp mp3 error: {result.stderr}")
            return jsonify({"status": False, "message": result.stderr}), 500

        # Find the downloaded file
        downloaded = None
        for f in os.listdir(DOWNLOAD_DIR):
            if f.startswith(uid):
                downloaded = f
                break

        if not downloaded:
            return jsonify({"status": False, "message": "Download failed: file not found"}), 500

        threading.Thread(target=cleanup_old_files, daemon=True).start()

        return jsonify({
            "status": True,
            "filename": downloaded,
            "download_url": request.host_url.rstrip("/") + "/download/" + downloaded,
            "title": data.get("title", "audio")
        })

    except Exception as e:
        logger.exception("Error in /mp3")
        return jsonify({"status": False, "message": str(e)}), 500


@app.route("/download/<filename>")
def download(filename):
    safe_name = os.path.basename(filename)
    file_path = os.path.join(DOWNLOAD_DIR, safe_name)

    if not os.path.exists(file_path):
        return jsonify({"status": False, "message": "File not found or expired"}), 404

    return send_from_directory(
        DOWNLOAD_DIR,
        safe_name,
        as_attachment=True,
        download_name=safe_name
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
        
