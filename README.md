# 🎬 NeoTube - Modern YouTube Downloader

> Neo Brutalism YouTube Downloader with MP4 & MP3 support. Fast, beautiful, and free.
> **Frontend:** Next.js (Vercel) | **Backend:** Flask + yt-dlp (Railway)

![Neo Brutalism](https://img.shields.io/badge/Design-Neo%20Brutalism-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Flask](https://img.shields.io/badge/Flask-3.0-white?style=for-the-badge&logo=flask)
![yt-dlp](https://img.shields.io/badge/yt--dlp-latest-red?style=for-the-badge)

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Vercel    │─────▶│  Railway Flask   │─────▶│  YouTube    │
│  (Next.js)  │◀─────│  (yt-dlp + FFmpeg)│◀─────│             │
└─────────────┘      └──────────────────┘      └─────────────┘
        │                       │
        │              ┌────────┴────────┐
        │              │  downloads/     │
        │              │  (temp files)   │
        │              └─────────────────┘
        ▼
   User downloads
   MP4 / MP3 file
```

## 📁 Project Structure

```
yt-downloader-neo-brutalism/
├── backend/                 ← Railway deploys THIS folder
│   ├── app.py              # Flask API (yt-dlp)
│   ├── requirements.txt    # Python deps
│   ├── Procfile            # Railway process
│   └── nixpacks.toml      # Auto-install ffmpeg
│
├── app/                     ← Vercel deploys ROOT (this)
│   ├── about/
│   ├── faq/
│   ├── terms/
│   ├── privacy/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Downloader.tsx      # Main download UI
│   ├── Toast.tsx
│   └── ThemeProvider.tsx
├── hooks/
├── lib/
├── types/
├── public/
├── package.json            # Next.js deps
├── next.config.js
├── tailwind.config.ts
└── README.md
```

## 🚀 Deploy Step-by-Step

### Step 1: Push ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/yt-downloader-neo-brutalism.git
git push -u origin main
```

### Step 2: Deploy Backend ke Railway

1. Buka [railway.app](https://railway.app) → Login dengan GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Pilih repo `yt-downloader-neo-brutalism`
4. **Settings** → **Root Directory** → isi: `backend`
5. **Builder** → **Nixpacks** (auto-detect dari `nixpacks.toml`)
6. Klik **Deploy**
7. Tunggu sampai 🟢 **Healthy**
8. Copy domain Railway (contoh: `https://neotube-api.up.railway.app`)

> ⚠️ **Jangan add variable `NEXT_PUBLIC_API_URL` di Railway!** Itu variable untuk frontend (Vercel).

### Step 3: Deploy Frontend ke Vercel

1. Buka [vercel.com](https://vercel.com) → Import GitHub repo
2. Framework Preset: **Next.js**
3. Masuk ke **Settings → Environment Variables**
4. Add variable:
   ```
   NEXT_PUBLIC_API_URL = https://neotube-api.up.railway.app
   ```
5. Klik **Deploy**

## 🔌 API Endpoints (Backend)

| Endpoint | Method | Body | Response |
|----------|--------|------|----------|
| `POST /info` | `{"url": "..."}` | Video info + semua format |
| `POST /mp4` | `{"url": "...", "quality": "720p"}` | File download URL |
| `POST /mp3` | `{"url": "..."}` | File download URL |
| `GET /download/<file>` | — | File attachment |
| `GET /health` | — | Status OK |

## 🛠️ Tech Stack

### Frontend (Vercel)
| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React Framework |
| TypeScript | Type Safety |
| TailwindCSS | Styling |
| Lucide React | Icons |

### Backend (Railway)
| Technology | Purpose |
|-----------|---------|
| Flask 3 | Python Web Framework |
| yt-dlp | YouTube Video Downloader |
| FFmpeg | Audio/Video Processing |
| Gunicorn | WSGI Server |

## 🎨 Design System

### Colors (Light Mode)
- Primary: `#3b82f6` (Blue)
- Secondary: `#fbbf24` (Yellow)
- Background: `#f9fafb` (Gray 50)
- Card: `#ffffff` (White)
- Border: `#1a1a1a` (Black)

### Colors (Dark Mode)
- Primary: `#7c3aed` (Purple)
- Secondary: `#fbbf24` (Yellow)
- Background: `#0f0f1a` (Dark)
- Card: `#1a1a2e` (Dark Card)
- Border: `#ffffff` (White)

## ⚠️ Important Notes

### Railway Limitations
- **Hobby Plan:** 500 hours/month (auto-sleeps after inactivity)
- **File Storage:** Ephemeral (files deleted on redeploy, auto-cleanup after 1 hour)
- **Timeout:** 300 seconds max per request
- For production with heavy usage, upgrade to Railway Pro or self-host on VPS

### Legal
- Only download content you have permission to use
- Respect copyright and YouTube's Terms of Service
- This tool is for personal/educational use only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

Made with ❤️ by NeoTube Team
