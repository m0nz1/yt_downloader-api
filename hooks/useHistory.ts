'use client';

import { useState, useEffect, useCallback } from 'react';
import { DownloadHistory } from '@/types';

const STORAGE_KEY = 'yt-downloader-history';
const MAX_HISTORY = 20;

export function useHistory() {
  const [history, setHistory] = useState<DownloadHistory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  const addToHistory = useCallback((item: Omit<DownloadHistory, 'date'>) => {
    setHistory((prev) => {
      const newItem: DownloadHistory = { ...item, date: new Date().toISOString() };
      const filtered = prev.filter((h) => h.id !== item.id);
      return [newItem, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addToHistory, removeFromHistory, clearHistory, isLoaded };
}
