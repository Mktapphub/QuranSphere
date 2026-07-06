import React, { useEffect, useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { SurahList } from './components/SurahList';
import { Reader } from './components/Reader';
import { AudioPlayer } from './components/AudioPlayer';
import { SettingsDialog } from './components/SettingsDialog';
import { fetchSurah } from './api/quran';
import { Surah } from './types';
import { Book, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

function QuranApp() {
  const { activeSurah } = useAppContext();
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeSurah) {
      setLoading(true);
      fetchSurah(activeSurah)
        .then(data => setCurrentSurah(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [activeSurah]);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-80 md:w-72 shrink-0 border-r border-primary/10 bg-card/30">
        <SurahList />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative bg-background">
        {/* Navbar */}
        <header className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-primary/10 bg-background z-10">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <SurahList />
              </SheetContent>
            </Sheet>
            
            <div className="flex items-center gap-2 text-primary font-serif font-bold text-2xl tracking-tight">
              <Book className="h-6 w-6" />
              <span>QuranSphere</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <SettingsDialog />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden bg-background">
          <Reader surah={currentSurah} loading={loading} />
        </main>
      </div>

      {/* Audio Player */}
      <AudioPlayer surah={currentSurah} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <QuranApp />
    </AppProvider>
  );
}
