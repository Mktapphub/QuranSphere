import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bookmark } from '../types';

interface Settings {
  fontSize: number; // For Arabic text
  showTranslation: boolean;
  showBanglaTranslation: boolean;
  theme: 'light' | 'dark' | 'system';
}

interface AppContextType {
  activeSurah: number | null;
  setActiveSurah: (surah: number | null) => void;
  activeAyah: number | null;
  setActiveAyah: (ayah: number | null) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  bookmarks: Bookmark[];
  addBookmark: (surah: number, ayah: number) => void;
  removeBookmark: (surah: number, ayah: number) => void;
  isBookmark: (surah: number, ayah: number) => boolean;
}

const defaultSettings: Settings = {
  fontSize: 32,
  showTranslation: true,
  showBanglaTranslation: true,
  theme: 'light',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeSurah, setActiveSurah] = useState<number | null>(null);
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const saved = localStorage.getItem('quran-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('quran-bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('quran-settings', JSON.stringify(settings));
    
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    let effectiveTheme = settings.theme;
    if (settings.theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    root.classList.add(effectiveTheme);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('quran-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addBookmark = (surahNumber: number, ayahNumber: number) => {
    setBookmarks(prev => {
      if (prev.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)) return prev;
      return [...prev, { surahNumber, ayahNumber, timestamp: Date.now() }];
    });
  };

  const removeBookmark = (surahNumber: number, ayahNumber: number) => {
    setBookmarks(prev => prev.filter(b => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)));
  };

  const isBookmark = (surahNumber: number, ayahNumber: number) => {
    return bookmarks.some(b => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber);
  };

  return (
    <AppContext.Provider value={{
      activeSurah, setActiveSurah,
      activeAyah, setActiveAyah,
      isPlaying, setIsPlaying,
      settings, updateSettings,
      bookmarks, addBookmark, removeBookmark, isBookmark
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
