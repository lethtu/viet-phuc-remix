import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  // Vietnamese Pentatonic Scale (Hò - Xự - Xang - Xê - Cống): C4, D4, F4, G4, A4, C5, D5
  const PENTATONIC_FREQUENCIES = [261.63, 293.66, 349.23, 392.00, 440.00, 523.25, 587.33];

  const playBambooFluteTone = (freq: number, duration: number = 1.2) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Sine tone with subtle warmth like bamboo flute (sáo trúc)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Soft attack & long decay
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      setIsPlaying(false);
    } else {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      setIsPlaying(true);
      // Play a peaceful random pentatonic loop
      let step = 0;
      const melody = [0, 2, 4, 3, 1, 4, 5, 2];

      const playNext = () => {
        const noteIndex = melody[step % melody.length];
        const freq = PENTATONIC_FREQUENCIES[noteIndex] || 349.23;
        playBambooFluteTone(freq, 1.4);
        step++;
      };

      playNext();
      timerRef.current = window.setInterval(playNext, 1800);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      onClick={togglePlay}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        isPlaying
          ? 'bg-[#cba135]/20 text-[#cba135] border border-[#cba135]/50 shadow-glow-gold'
          : 'bg-black/40 text-stone-400 hover:text-white border border-white/10'
      }`}
      title={isPlaying ? 'Tắt nhạc nền Cổ Phong Lofi' : 'Bật nhạc nền Cổ Phong Lofi'}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#cba135] animate-pulse" />
          <div className="flex items-center gap-0.5">
            <span className="w-1 h-2.5 bg-[#cba135] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-3.5 bg-[#cba135] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-[#cba135] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="hidden sm:inline">Cổ Phong Lo-fi</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bật Nhạc Nền</span>
        </>
      )}
    </button>
  );
};
