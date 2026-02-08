'use client';

import { useEffect, useRef } from 'react';
import { useMathStore } from '@/store/useMathStore';

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { isMusicMuted } = useMathStore();

  useEffect(() => {
    // Create audio element if not exists
    if (!audioRef.current) {
      const audio = new Audio('/bgm.mp3');
      audio.loop = true;
      audio.volume = 0.15; // Low background volume
      audioRef.current = audio;
    }

    const audio = audioRef.current;

    // Handle Play/Pause based on mute state
    if (!isMusicMuted) {
      // Try to play
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play might be blocked until user interaction
          console.log("BGM Auto-play blocked, waiting for interaction:", error);

          // Add a one-time click listener to start music
          const startAudio = () => {
            audio.play();
            document.removeEventListener('click', startAudio);
            document.removeEventListener('keydown', startAudio);
          };

          document.addEventListener('click', startAudio);
          document.addEventListener('keydown', startAudio);
        });
      }
    } else {
      audio.pause();
    }

    return () => {
      // Cleanup? Maybe pause on unmount?
      // For persistence across pages, we might want to keep it playing if we lift state up?
      // Since this component will be mounted in Page/Layout, unmount means stop.
      audio.pause();
    };
  }, [isMusicMuted]);

  return null; // Invisible component
}
