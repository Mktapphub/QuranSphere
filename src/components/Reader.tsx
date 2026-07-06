import React, { useEffect, useRef } from 'react';
import { Surah, Ayah } from '../types';
import { useAppContext } from '../context/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Play, Pause, Bookmark as BookmarkIcon } from 'lucide-react';

interface ReaderProps {
  surah: Surah | null;
  loading: boolean;
}

export function Reader({ surah, loading }: ReaderProps) {
  const { settings, activeAyah, setActiveAyah, isBookmark, addBookmark, removeBookmark, isPlaying, setIsPlaying } = useAppContext();
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (activeAyah && ayahRefs.current[activeAyah]) {
      ayahRefs.current[activeAyah]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeAyah]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center h-full">
        <div className="animate-pulse space-y-8 w-full max-w-3xl px-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="space-y-4 text-right">
              <div className="h-4 bg-muted rounded w-3/4 ml-auto"></div>
              <div className="h-4 bg-muted rounded w-1/2 ml-auto"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!surah) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center space-y-4">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <BookOpenIcon className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">Bismillah</h2>
        <p>Select a Surah from the index to start reading.</p>
      </div>
    );
  }

  const toggleBookmark = (ayah: number) => {
    if (isBookmark(surah.number, ayah)) {
      removeBookmark(surah.number, ayah);
    } else {
      addBookmark(surah.number, ayah);
    }
  };

  return (
    <ScrollArea className="flex-1 h-full pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <div className="w-full max-w-2xl mx-auto text-center mb-12 mt-4">
          <h2 className="text-4xl font-serif italic text-primary mb-2">{surah.englishName}</h2>
          <p className="text-sm text-primary/60 tracking-widest uppercase mb-6">
            {surah.englishNameTranslation} • {surah.numberOfAyahs} Verses • {surah.revelationType}
          </p>
          <div className="h-[1px] w-24 bg-primary/20 mx-auto"></div>
          
          {surah.number !== 1 && surah.number !== 9 && (
            <div className="pt-12 pb-4 text-4xl font-arabic text-primary" dir="rtl">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
          )}
        </div>

        <div className="space-y-12">
          {surah.ayahs.map((ayah) => {
            const isActive = activeAyah === ayah.numberInSurah;
            const isPlayingAyah = isActive && isPlaying;
            const bookmarked = isBookmark(surah.number, ayah.numberInSurah);
            
            // Remove Bismillah from the first Ayah if it's not Surah Al-Fatiha
            let displayArabic = ayah.text;
            if (surah.number !== 1 && ayah.numberInSurah === 1 && displayArabic.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
              displayArabic = displayArabic.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
            }

            return (
              <div 
                key={ayah.numberInSurah}
                ref={(el) => ayahRefs.current[ayah.numberInSurah] = el}
                className={`relative group p-8 rounded-3xl transition-all duration-300 flex flex-col items-center ${
                  isActive ? 'bg-card border border-primary/10 shadow-sm' : 'hover:bg-card/50 border border-transparent'
                }`}
              >
                {/* Actions Toolbar */}
                <div className={`absolute left-4 top-4 md:left-8 md:top-8 transition-opacity flex flex-col gap-2 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full h-8 w-8 ${isPlayingAyah ? 'text-primary bg-primary/10' : ''}`}
                    onClick={() => {
                      if (isPlayingAyah) {
                        setIsPlaying(false);
                      } else {
                        setActiveAyah(ayah.numberInSurah);
                        setIsPlaying(true);
                      }
                    }}
                  >
                    {isPlayingAyah ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full h-8 w-8 ${bookmarked ? 'text-primary' : ''}`}
                    onClick={() => toggleBookmark(ayah.numberInSurah)}
                  >
                    <BookmarkIcon className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
                  </Button>
                </div>

                <div className="w-full pl-12 md:pl-16">
                  <p 
                    className="text-right font-arabic text-primary mb-6 w-full" 
                    style={{ fontSize: `${settings.fontSize}px`, lineHeight: 2.2 }}
                    dir="rtl"
                  >
                    {displayArabic}
                  </p>
                  
                  {(settings.showTranslation || settings.showBanglaTranslation) && (
                    <div className="flex items-start space-x-4 md:space-x-6 w-full">
                      <span className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isActive ? 'bg-primary text-primary-foreground' : 'border border-primary/20 text-primary'
                      }`}>
                        {ayah.numberInSurah}
                      </span>
                      <div className="flex-1 space-y-4">
                        {settings.showTranslation && ayah.translation && (
                          <p className={`text-lg ${
                            isActive ? 'text-primary' : 'text-primary/80'
                          }`} style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                            {ayah.translation}
                          </p>
                        )}
                        {settings.showBanglaTranslation && ayah.banglaTranslation && (
                          <p className={`text-lg font-serif ${
                            isActive ? 'text-primary' : 'text-primary/80'
                          }`}>
                            {ayah.banglaTranslation}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}

function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
