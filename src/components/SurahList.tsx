import React, { useEffect, useState } from 'react';
import { fetchSurahs } from '../api/quran';
import { SurahMeta } from '../types';
import { useAppContext } from '../context/AppContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Bookmark } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function SurahList() {
  const [surahs, setSurahs] = useState<SurahMeta[]>([]);
  const [search, setSearch] = useState('');
  const { activeSurah, setActiveSurah, activeAyah, setActiveAyah, bookmarks } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahs()
      .then(data => {
        setSurahs(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(search.toLowerCase()) || 
    s.name.includes(search)
  );

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground animate-pulse">Loading Surahs...</div>;
  }

  const navigateToBookmark = (surahNumber: number, ayahNumber: number) => {
    setActiveSurah(surahNumber);
    // Slight delay to allow the surah to load before setting the active ayah to scroll to it
    setTimeout(() => {
      setActiveAyah(ayahNumber);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border/50">
      <Tabs defaultValue="index" className="flex flex-col h-full">
        <div className="p-4 border-b border-border/50 space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="index" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Index
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" /> Bookmarks
            </TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Search surah..." 
              className="pl-9 bg-background/50 border-border/50 focus-visible:ring-primary"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value="index" className="flex-1 mt-0 data-[state=inactive]:hidden min-h-0">
          <ScrollArea className="h-full">
            <div className="p-2 pb-24">
              {filteredSurahs.map((surah) => (
                <button
                  key={surah.number}
                  onClick={() => { setActiveSurah(surah.number); setActiveAyah(1); }}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeSurah === surah.number 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-primary hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`font-mono text-xs ${
                      activeSurah === surah.number ? '' : 'opacity-40'
                    }`}>
                      {surah.number.toString().padStart(3, '0')}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{surah.englishName}</div>
                      <div className={`text-xs ${
                        activeSurah === surah.number ? 'opacity-70' : 'opacity-50'
                      }`}>{surah.englishNameTranslation}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-arabic text-lg">{surah.name.replace('سُورَةُ ', '')}</div>
                    <div className={`text-xs ${
                      activeSurah === surah.number ? 'opacity-70' : 'opacity-50'
                    }`}>{surah.numberOfAyahs} Ayahs</div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="bookmarks" className="flex-1 mt-0 data-[state=inactive]:hidden min-h-0">
          <ScrollArea className="h-full">
            <div className="p-2 pb-24">
              {bookmarks.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-20" />
                  <p>No bookmarks yet.</p>
                </div>
              ) : (
                [...bookmarks]
                  .sort((a, b) => b.timestamp - a.timestamp)
                  .map((bookmark) => {
                    const surah = surahs.find(s => s.number === bookmark.surahNumber);
                    if (!surah) return null;
                    return (
                      <button
                        key={`${bookmark.surahNumber}-${bookmark.ayahNumber}`}
                        onClick={() => navigateToBookmark(bookmark.surahNumber, bookmark.ayahNumber)}
                        className={`w-full flex flex-col p-3 rounded-md transition-colors mb-1 border border-border/50 ${
                          activeSurah === bookmark.surahNumber && activeAyah === bookmark.ayahNumber
                            ? 'bg-primary/10 border-primary/20' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <span className="font-medium">{surah.englishName}</span>
                          <span className="font-arabic">{surah.name.replace('سُورَةُ ', '')}</span>
                        </div>
                        <div className="text-xs text-muted-foreground flex justify-between w-full">
                          <span>Ayah {bookmark.ayahNumber}</span>
                          <span>{new Date(bookmark.timestamp).toLocaleDateString()}</span>
                        </div>
                      </button>
                    );
                  })
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
