import React, { useEffect, useRef } from 'react';
import { Surah } from '../types';
import { useAppContext } from '../context/AppContext';

interface AudioPlayerProps {
  surah: Surah | null;
}

export function AudioPlayer({ surah }: AudioPlayerProps) {
  const { activeAyah, setActiveAyah, isPlaying, setIsPlaying } = useAppContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element on mount, only once
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Handle ended event separately
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (!surah) return;
      if (activeAyah && activeAyah < surah.numberOfAyahs) {
        setActiveAyah(activeAyah + 1);
      } else {
        setIsPlaying(false);
        setActiveAyah(null);
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [surah, activeAyah, setActiveAyah, setIsPlaying]);

  // When activeAyah changes, update source and play if isPlaying
  useEffect(() => {
    if (!surah || !activeAyah || !audioRef.current) return;
    
    const ayah = surah.ayahs.find(a => a.numberInSurah === activeAyah);
    if (ayah && ayah.audio) {
      if (audioRef.current.src !== ayah.audio) {
        audioRef.current.src = ayah.audio;
      }
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [activeAyah, surah, isPlaying]);

  if (!surah) return null;

  return null;
}
