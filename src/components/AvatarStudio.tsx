import React, { useState, useEffect, useRef } from 'react';
import { CurrentOutfit } from '../types/costume';
import { Scene3D } from './3d/Scene3D';
import { 
  Sparkles, 
  RotateCw, 
  Flower2, 
  Volume2, 
  VolumeX, 
  User, 
  Heart,
  Fan,
  Wind,
  Eye,
  EyeOff,
  Flame,
  Sparkle
} from 'lucide-react';

interface AvatarStudioProps {
  outfit: CurrentOutfit;
  lightingPreset: 'studio' | 'hoian' | 'hue' | 'cyber';
  onLightingChange: (preset: 'studio' | 'hoian' | 'hue' | 'cyber') => void;
  cameraView: 'full' | 'torso' | 'head';
  onCameraViewChange: (view: 'full' | 'torso' | 'head') => void;
}

type PoseType = 'runway' | 'phat_quat' | 'ban_tim' | 'cung_kinh';
type WindSpeed = 'none' | 'light' | 'strong';

export const AvatarStudio: React.FC<AvatarStudioProps> = ({
  outfit,
}) => {
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [activePose, setActivePose] = useState<PoseType>('runway');
  const [isBaseModelOnly, setIsBaseModelOnly] = useState(false);
  const [activeEffects, setActiveEffects] = useState<string[]>(['hoa_sen', 'bui_vang']);
  const [windSpeed, setWindSpeed] = useState<WindSpeed>('light');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [equipToast, setEquipToast] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prevOutfitRef = useRef<CurrentOutfit>(outfit);

  const playSoundEffect = (highNote = false) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const notes = highNote 
        ? [880.0, 987.77, 1174.66, 1318.51] 
        : [587.33, 659.25, 739.99, 880.0, 987.77];
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.35);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const checkOutfitChanges = () => {
      const parts: ('mainTop' | 'layer' | 'bottom' | 'headwear' | 'footwear' | 'accessory')[] = ['mainTop', 'layer', 'bottom', 'headwear', 'footwear', 'accessory'];
      for (const part of parts) {
        const item = outfit[part];
        const prevItem = prevOutfitRef.current[part];
        if (item?.id !== prevItem?.id) {
          if (item) {
            playSoundEffect(true);
            setEquipToast(`✨ Đã mặc: ${item.name}`);
            if (isBaseModelOnly) setIsBaseModelOnly(false);
            setTimeout(() => setEquipToast(null), 3000);
            break;
          }
        }
      }
      prevOutfitRef.current = outfit;
    };
    checkOutfitChanges();
  }, [outfit, isBaseModelOnly]);

  const toggleEffect = (effect: string) => {
    setActiveEffects(prev => 
      prev.includes(effect) ? prev.filter(e => e !== effect) : [...prev, effect]
    );
  };

  const cycleWindSpeed = () => {
    const speeds: WindSpeed[] = ['none', 'light', 'strong'];
    const nextIdx = (speeds.indexOf(windSpeed) + 1) % speeds.length;
    setWindSpeed(speeds[nextIdx]);
  };

  return (
    <div className="relative w-full h-full min-h-[580px] md:min-h-[740px] overflow-hidden bg-transparent">
      
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <Scene3D 
          gender={gender} 
          clothes={outfit.mainTop || outfit.bottom} 
          pose={activePose} 
          activeEffects={activeEffects} 
          windSpeed={windSpeed} 
          isBaseModelOnly={isBaseModelOnly} 
        />
      </div>

      {/* Floating Equip Toast Notification */}
      {equipToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-bold text-xs shadow-glow-gold animate-bounce flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-black animate-spin-slow" />
          <span>{equipToast}</span>
        </div>
      )}

      {/* Top Bar for Avatar Mode: Base Model Toggle & Gender */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Toggle Base Model vs Clothed */}
        <button
          onClick={() => {
            setIsBaseModelOnly(!isBaseModelOnly);
            playSoundEffect();
          }}
          className={`px-3.5 py-2 rounded-2xl text-sm font-bold shadow-lg pointer-events-auto flex items-center gap-1.5 border transition-all ${
            isBaseModelOnly
              ? 'bg-rose-500 text-white border-rose-400'
              : 'bg-black/80 text-amber-300 border-[#cba135]/40 hover:bg-white/10'
          }`}
        >
          {isBaseModelOnly ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span>{isBaseModelOnly ? '👙 Xem Mẫu Gốc (Chưa Mặc)' : '👗 Xem Mẫu Đã Mặc'}</span>
        </button>

        {/* Controls Right */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Gender Switcher */}
          <button
            onClick={() => {
              setGender(gender === 'female' ? 'male' : 'female');
              playSoundEffect();
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-black/80 hover:bg-white/20 text-amber-300 border border-[#cba135]/40 transition-all shadow-lg flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            <span>{gender === 'female' ? '👩 Nữ' : '👨 Nam'}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl bg-black/80 text-amber-300 border border-[#cba135]/40 hover:bg-white/20 transition-all shadow-lg"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Fashion Pose Dock (Center Bottom) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center gap-1 p-1.5 rounded-2xl bg-black/75 backdrop-blur-md border border-[#cba135]/30 shadow-2xl pointer-events-auto">
        <button
          onClick={() => setActivePose('runway')}
          className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activePose === 'runway'
              ? 'bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-semibold shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>✨ Runway</span>
        </button>
        <button
          onClick={() => setActivePose('phat_quat')}
          className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activePose === 'phat_quat'
              ? 'bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-semibold shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Fan className="w-4 h-4" />
          <span>Phất Quạt</span>
        </button>
        <button
          onClick={() => setActivePose('ban_tim')}
          className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activePose === 'ban_tim'
              ? 'bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-semibold shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Heart className="w-4 h-4 text-pink-400" />
          <span>Bắn Tim</span>
        </button>
        <button
          onClick={() => setActivePose('cung_kinh')}
          className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activePose === 'cung_kinh'
              ? 'bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-semibold shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>🙏 Cung Kính</span>
        </button>
      </div>

      {/* Visual Effects Dock (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="flex items-center gap-1 p-1 rounded-2xl bg-black/85 backdrop-blur-md border border-white/10 shadow-lg">
          <button
            onClick={() => toggleEffect('hoa_sen')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              activeEffects.includes('hoa_sen') ? 'bg-pink-500/80 text-white' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Flower2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleEffect('bui_vang')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              activeEffects.includes('bui_vang') ? 'bg-amber-500 text-black shadow-glow-gold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Sparkle className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleEffect('dom_dom')}
            className={`p-2 rounded-xl text-xs flex items-center gap-1 transition-all ${
              activeEffects.includes('dom_dom') ? 'bg-amber-600 text-white shadow-glow-gold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Flame className="w-4 h-4" />
          </button>
          <button
            onClick={cycleWindSpeed}
            className="px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 bg-white/10 text-cyan-300 font-semibold hover:bg-white/20 transition-all border border-cyan-400/30"
          >
            <Wind className="w-4 h-4" />
            <span>{windSpeed === 'none' ? 'Lặng Gió' : windSpeed === 'light' ? 'Gió Thoảng' : 'Gió Mạnh'}</span>
          </button>
        </div>
      </div>

      {/* Help Hint (Bottom Right) */}
      <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md text-xs text-amber-200 border border-amber-500/30 shadow-xl pointer-events-none">
        <RotateCw className="w-3.5 h-3.5 text-[#cba135] animate-spin-slow" />
        <span>Kéo chuột để xoay 3D</span>
      </div>
    </div>
  );
};
