import React, { useState, useEffect, useRef } from 'react';
import { CurrentOutfit } from '../types/costume';
import { 
  Sparkles, 
  Flower2, 
  Volume2, 
  VolumeX, 
  User, 
  Heart, 
  Fan, 
  Sun, 
  Moon, 
  Flame, 
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface Avatar2DCanvasProps {
  outfit: CurrentOutfit;
  lightingPreset: 'studio' | 'hoian' | 'hue' | 'cyber';
  onLightingChange: (preset: 'studio' | 'hoian' | 'hue' | 'cyber') => void;
  cameraView: 'full' | 'torso' | 'head';
  onCameraViewChange: (view: 'full' | 'torso' | 'head') => void;
  gender?: 'male' | 'female';
  onGenderChange?: (gender: 'male' | 'female') => void;
  compactMode?: boolean;
  onToggleExpand?: () => void;
  isExpanded?: boolean;
}

export type PoseType = 'runway' | 'fan' | 'peace' | 'traditional';

export const Avatar2DCanvas: React.FC<Avatar2DCanvasProps> = ({
  outfit,
  lightingPreset,
  onLightingChange,
  cameraView,
  onCameraViewChange,
  gender: propGender,
  onGenderChange,
  compactMode = false,
  onToggleExpand,
  isExpanded = false,
}) => {
  const [internalGender, setInternalGender] = useState<'male' | 'female'>('male');
  const gender = propGender || internalGender;
  const setGender = onGenderChange || setInternalGender;

  const [activePose, setActivePose] = useState<PoseType>('runway');
  const [showPetals, setShowPetals] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isBlinking, setIsBlinking] = useState(false);
  const [equipToast, setEquipToast] = useState<string | null>(null);
  const [isEquipPopping, setIsEquipPopping] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Web Audio synthesizer chime
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freqs = [784, 880, 988, 1175]; // G5, A5, B5, D6 Pentatonic scale
      osc.frequency.setValueAtTime(freqs[Math.floor(Math.random() * freqs.length)], now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.28);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio policy
    }
  };

  // Garment equip trigger
  const prevTopIdRef = useRef<string>(outfit.mainTop.id);
  useEffect(() => {
    if (prevTopIdRef.current !== outfit.mainTop.id) {
      prevTopIdRef.current = outfit.mainTop.id;
      playChime();
      setIsEquipPopping(true);
      setEquipToast(`Đã khoác: ${outfit.mainTop.name}`);
      const t1 = setTimeout(() => setIsEquipPopping(false), 400);
      const t2 = setTimeout(() => setEquipToast(null), 2200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [outfit.mainTop.id]);

  // Natural eye blink timer
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 130);
    }, 3600 + Math.random() * 2200);
    return () => clearInterval(blinkInterval);
  }, []);

  // Background lighting themes
  const getLightingBackground = () => {
    switch (lightingPreset) {
      case 'hoian':
        return 'from-[#2b1206] via-[#1c0c07] to-[#0c0503] border-amber-500/40';
      case 'hue':
        return 'from-[#2d1033] via-[#1a0821] to-[#0d0412] border-purple-500/40';
      case 'cyber':
        return 'from-[#0b1f33] via-[#091126] to-[#1c0828] border-cyan-400/40';
      case 'studio':
      default:
        return 'from-[#141824] via-[#0d1017] to-[#07090f] border-[#cba135]/40';
    }
  };

  const getGlowColor = () => {
    switch (lightingPreset) {
      case 'hoian': return '#f59e0b';
      case 'hue': return '#c084fc';
      case 'cyber': return '#00f2fe';
      case 'studio':
      default: return '#cba135';
    }
  };

  // Character interactive tap reaction
  const handleCharacterTap = () => {
    setIsInteracting(true);
    playChime();
    setTimeout(() => setIsInteracting(false), 1200);
  };

  // Garment specific attributes
  const isRightLapel = outfit.vatStyle === 'right';
  const mainColor = outfit.mainColor || outfit.mainTop.defaultColor;
  const bottomColor = outfit.bottomColor || '#fcf8f2';
  const isBroadSleeve = outfit.mainTop.id === 'ao_tac';
  const isNhatBinh = outfit.mainTop.id === 'nhat_binh';
  const isTuThan = outfit.mainTop.id === 'tu_than_kinh_bac';
  const isGiaoLinh = outfit.mainTop.id === 'giao_linh_dai_viet';
  const isModernGenZ = outfit.mainTop.id === 'ao_dai_genz_2026';

  // Zoom scale based on cameraView
  const getZoomStyle = () => {
    switch (cameraView) {
      case 'head':
        return 'scale-[1.65] translate-y-[24%]';
      case 'torso':
        return 'scale-[1.28] translate-y-[9%]';
      case 'full':
      default:
        return 'scale-100 translate-y-0';
    }
  };

  return (
    <div className={`relative w-full overflow-hidden glass-panel border shadow-2xl flex flex-col items-center justify-between transition-all duration-500 select-none ${getLightingBackground()} ${
      compactMode 
        ? 'h-[270px] sm:h-[310px] rounded-2xl p-2 sm:p-3' 
        : 'h-full min-h-[380px] sm:min-h-[500px] lg:min-h-[640px] rounded-3xl p-3 sm:p-4'
    }`}>
      
      {/* Dynamic Ambient Background Glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 rounded-full blur-[100px] pointer-events-none opacity-30 transition-all duration-700"
        style={{ backgroundColor: getGlowColor() }}
      />

      {/* Falling Lotus Petals Overlay */}
      {showPetals && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(compactMode ? 6 : 12)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-petal-fall"
              style={{
                left: `${(i * 12 + 3) % 94}%`,
                top: `-35px`,
                animationDuration: `${5 + (i % 4) * 1.5}s`,
                animationDelay: `${(i * 0.6) % 3.5}s`,
              }}
            >
              <div 
                className="w-3.5 h-2 rounded-full rotate-45 opacity-80 shadow-sm"
                style={{
                  backgroundColor: i % 2 === 0 ? '#ffb7c5' : '#f472b6',
                  transform: `rotate(${i * 40}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* TOP HEADER CONTROLS (Mobile Compact & Responsive) */}
      <div className="relative z-20 w-full flex items-center justify-between gap-1.5 sm:gap-2">
        {/* Left: Gender Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setGender(gender === 'male' ? 'female' : 'male');
              playChime();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/60 hover:bg-white/15 text-amber-200 border border-[#cba135]/40 text-[11px] sm:text-xs font-bold backdrop-blur-md transition-all active:scale-95 shadow-md"
            title="Chuyển đổi giới tính nhân vật"
          >
            <User className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-[#cba135]" />
            <span>Mẫu {gender === 'male' ? 'Nam' : 'Nữ'}</span>
          </button>

          {/* Quick Poses pills in compact mode header */}
          {compactMode && (
            <div className="flex items-center gap-1 p-0.5 rounded-full bg-black/60 backdrop-blur-md border border-[#cba135]/30">
              {(['runway', 'fan', 'peace', 'traditional'] as PoseType[]).map((p) => {
                const icon = p === 'runway' ? '💃' : p === 'fan' ? '🪭' : p === 'peace' ? '✌️' : '🙏';
                return (
                  <button
                    key={p}
                    onClick={() => setActivePose(p)}
                    className={`w-6 h-6 rounded-full text-xs flex items-center justify-center transition-all active:scale-95 ${
                      activePose === p ? 'bg-[#cba135] text-black shadow-md font-bold' : 'text-stone-300 hover:text-white'
                    }`}
                    title={p}
                  >
                    {icon}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Expand Toggle, Lighting Preset Pill, Petals & Sound */}
        <div className="flex items-center gap-1">
          {/* Quick Expand Button in compact mode */}
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#cba135] hover:bg-[#e5a93b] text-black font-bold text-[11px] sm:text-xs shadow-glow-gold transition-all active:scale-95"
              title={isExpanded ? 'Thu gọn chế độ thử đồ' : 'Phóng to xem chi tiết'}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              <span className="hidden xs:inline">{isExpanded ? 'Thu Gọn' : 'Phóng To'}</span>
            </button>
          )}

          {!compactMode && (
            <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
              <button
                onClick={() => onLightingChange('studio')}
                title="Studio Runway"
                className={`p-1.5 rounded-full text-xs transition-all ${
                  lightingPreset === 'studio' ? 'bg-[#cba135] text-black shadow-glow-gold' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLightingChange('hoian')}
                title="Phố Cổ Hội An"
                className={`p-1.5 rounded-full text-xs transition-all ${
                  lightingPreset === 'hoian' ? 'bg-amber-500 text-black shadow-glow-gold' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLightingChange('hue')}
                title="Hoàng Hôn Cố Đô"
                className={`p-1.5 rounded-full text-xs transition-all ${
                  lightingPreset === 'hue' ? 'bg-purple-600 text-white shadow-glow-gold' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onLightingChange('cyber')}
                title="Cyberpunk Sài Gòn"
                className={`p-1.5 rounded-full text-xs transition-all ${
                  lightingPreset === 'cyber' ? 'bg-cyan-400 text-black shadow-glow-cyan' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            <button
              onClick={() => setShowPetals(!showPetals)}
              title="Cánh hoa sen"
              className={`p-1 rounded-full text-xs transition-all ${
                showPetals ? 'bg-pink-500/80 text-white' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Flower2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title="Âm thanh hiệu ứng"
              className="p-1 rounded-full text-xs text-amber-300 hover:text-white transition-all"
            >
              {soundEnabled ? <Volume2 className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> : <VolumeX className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-stone-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Equip Toast */}
      {equipToast && (
        <div className="absolute top-12 sm:top-14 z-30 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-bold text-[11px] sm:text-xs shadow-glow-gold animate-bounce flex items-center gap-1.5 pointer-events-none">
          <Sparkles className="w-3 h-3 text-black" />
          <span>{equipToast}</span>
        </div>
      )}

      {/* MAIN 2D VECTOR AVATAR STAGE */}
      <div 
        onClick={handleCharacterTap}
        className={`relative z-10 w-full flex items-center justify-center transition-transform duration-500 ease-out origin-center cursor-pointer ${
          compactMode
            ? 'h-[195px] sm:h-[240px]'
            : 'max-w-[280px] sm:max-w-[340px] lg:max-w-[400px] h-[280px] sm:h-[380px] lg:h-[480px]'
        } ${getZoomStyle()} ${isEquipPopping ? 'animate-equip-pop' : ''}`}
        title="Chạm vào nhân vật để tương tác"
      >
        {/* SVG Mannequin Character Canvas */}
        <svg 
          viewBox="0 0 400 620" 
          className="w-full h-full drop-shadow-2xl animate-gentle-breathe"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Fabric Glow Gradient */}
            <linearGradient id="mainTopGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={mainColor} stopOpacity="1" />
              <stop offset="100%" stopColor={mainColor} stopOpacity="0.85" />
            </linearGradient>

            {/* Silk Sheen Overlay */}
            <linearGradient id="silkSheen2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.15" />
            </linearGradient>

            {/* Gold Trim Gradient */}
            <linearGradient id="goldTrim2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>

            {/* Nhat Binh 5-Element Neck Trim */}
            <linearGradient id="nhatBinhStripes2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="25%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>

            {/* Pedestal Shadow */}
            <radialGradient id="pedestalShadow2" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Pedestal Stand & Shadow */}
          <ellipse cx="200" cy="590" rx="115" ry="20" fill="url(#pedestalShadow2)" />
          <ellipse cx="200" cy="585" rx="95" ry="15" fill="#181c28" stroke="#d4af37" strokeWidth="2.5" />
          <ellipse cx="200" cy="583" rx="85" ry="11" fill="#242b3d" stroke="#cba135" strokeWidth="1" opacity="0.6" />

          {/* 2. Legs & Silk Trousers (Quần lụa) */}
          <g id="trousers" className="animate-silk-wave">
            {/* Left Leg */}
            <path 
              d="M 172 380 L 160 560 L 192 562 L 196 385 Z" 
              fill={bottomColor} 
              stroke="#000000" 
              strokeWidth="0.8"
              opacity="0.95" 
            />
            {/* Right Leg */}
            <path 
              d="M 204 385 L 208 562 L 240 560 L 228 380 Z" 
              fill={bottomColor} 
              stroke="#000000" 
              strokeWidth="0.8"
              opacity="0.95" 
            />
            {/* Trousers folds */}
            <line x1="176" y1="410" x2="173" y2="540" stroke="#000000" strokeWidth="1" opacity="0.15" />
            <line x1="224" y1="410" x2="227" y2="540" stroke="#000000" strokeWidth="1" opacity="0.15" />
          </g>

          {/* 3. Footwear (Giày / Hài) */}
          <g id="shoes">
            <ellipse cx="176" cy="564" rx="14" ry="6" fill="#1c1917" stroke="#ca8a04" strokeWidth="1" />
            <ellipse cx="224" cy="564" rx="14" ry="6" fill="#1c1917" stroke="#ca8a04" strokeWidth="1" />
            {outfit.footwear.id === 'hai_theu_mui_cong' && (
              <>
                <path d="M 162 563 Q 156 558 159 554" stroke="#ca8a04" strokeWidth="2" fill="none" />
                <path d="M 238 563 Q 244 558 241 554" stroke="#ca8a04" strokeWidth="2" fill="none" />
              </>
            )}
          </g>

          {/* 4. Torso Body & Main Robe */}
          <g id="main-robe">
            {/* Back Flap */}
            <path 
              d="M 165 240 L 150 495 L 250 495 L 235 240 Z" 
              fill="url(#mainTopGrad2)" 
              opacity="0.9"
            />

            {/* Front Main Body Flap with animated silk wave */}
            <path 
              d="M 160 215 L 142 505 Q 200 515 258 505 L 240 215 Z" 
              fill="url(#mainTopGrad2)" 
              stroke="#000000"
              strokeWidth="0.8"
              className="animate-silk-wave"
            />
            {/* Fabric sheen reflection */}
            <path 
              d="M 180 220 L 170 500 L 210 502 L 205 220 Z" 
              fill="url(#silkSheen2)" 
              className="animate-silk-wave"
            />

            {/* Lapel Overlap Style */}
            {isRightLapel ? (
              // HỮU NHẬM (Chuẩn truyền thống): Vạt phải cài sang bên phải
              <path 
                d="M 200 178 Q 220 186 226 215 Q 230 250 218 310" 
                stroke="url(#goldTrim2)" 
                strokeWidth="2.8" 
                fill="none" 
              />
            ) : (
              // TẢ NHẬM (Lỗi Cấm Kỵ): Vạt cài sang trái
              <path 
                d="M 200 178 Q 180 186 174 215 Q 170 250 182 310" 
                stroke="#ef4444" 
                strokeWidth="3.2" 
                strokeDasharray="4,3"
                fill="none" 
              />
            )}

            {/* Cúc Áo Hoàng Gia (5 Cúc Ngũ Thường) */}
            {isRightLapel ? (
              <g id="royal-buttons" fill="url(#goldTrim2)" stroke="#78350f" strokeWidth="0.8">
                <circle cx="204" cy="180" r="3" />
                <circle cx="218" cy="192" r="3" />
                <circle cx="226" cy="216" r="3" />
                <circle cx="225" cy="245" r="3" />
                <circle cx="221" cy="280" r="3" />
              </g>
            ) : (
              <g id="taboo-buttons" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.8">
                <circle cx="196" cy="180" r="3" />
                <circle cx="182" cy="192" r="3" />
                <circle cx="174" cy="216" r="3" />
                <circle cx="175" cy="245" r="3" />
                <circle cx="179" cy="280" r="3" />
              </g>
            )}

            {/* Special Garment Embellishments */}
            {/* Nhật Bình: Viền cổ vuông ngũ sắc & Thủy Ba ở tà */}
            {isNhatBinh && (
              <g id="nhat-binh-features">
                <rect x="186" y="176" width="28" height="110" rx="4" fill="url(#nhatBinhStripes2)" opacity="0.94" stroke="#d4af37" strokeWidth="1.5" />
                <path d="M 143 490 Q 170 480 200 490 Q 230 480 257 490 L 258 505 Q 200 515 142 505 Z" fill="#38bdf8" opacity="0.8" />
                <path d="M 144 496 Q 170 488 200 496 Q 230 488 256 496 L 257 505 Q 200 515 143 505 Z" fill="#f43f5e" opacity="0.8" />
              </g>
            )}

            {/* Tứ Thân: Dải Yếm Đào e ấp bên trong */}
            {isTuThan && (
              <g id="tu-than-features">
                <path d="M 188 178 L 212 178 L 222 225 L 178 225 Z" fill="#fb7185" stroke="#f43f5e" strokeWidth="1" />
                <rect x="164" y="275" width="72" height="12" rx="3" fill="#10b981" />
                <path d="M 194 287 L 188 360 L 198 360 L 202 287 Z" fill="#10b981" opacity="0.9" />
                <path d="M 200 287 L 206 375 L 216 375 L 208 287 Z" fill="#ec4899" opacity="0.9" />
              </g>
            )}

            {/* Giao Lĩnh */}
            {isGiaoLinh && (
              <g id="giao-linh-collar">
                <path d="M 178 176 L 200 220 L 224 176" stroke="#fef08a" strokeWidth="4" fill="none" />
                <path d="M 182 176 L 226 245" stroke="#d4af37" strokeWidth="3" fill="none" />
              </g>
            )}

            {/* Gen Z Remix */}
            {isModernGenZ && (
              <g id="genz-remix-details">
                <line x1="168" y1="230" x2="232" y2="230" stroke="#00f2fe" strokeWidth="2" strokeDasharray="6,4" />
                <line x1="150" y1="460" x2="250" y2="460" stroke="#ff2a85" strokeWidth="2.5" />
              </g>
            )}
          </g>

          {/* 5. Layer (Áo khoác đối khâm voan nhẹ) */}
          {outfit.layer && outfit.layer.id !== 'layer_none' && (
            <g id="outer-layer" opacity="0.45">
              <path 
                d="M 154 212 L 132 505 L 165 505 L 175 220 Z" 
                fill={outfit.layerColor || '#f8fafc'} 
                stroke="#cba135" 
                strokeWidth="1"
              />
              <path 
                d="M 246 212 L 268 505 L 235 505 L 225 220 Z" 
                fill={outfit.layerColor || '#f8fafc'} 
                stroke="#cba135" 
                strokeWidth="1"
              />
            </g>
          )}

          {/* 6. Arms & Dynamic Poses */}
          <g id="arms-and-hands">
            {activePose === 'runway' && (
              <>
                <path 
                  d="M 160 215 Q 128 270 148 315 L 168 310 Q 146 270 172 220 Z" 
                  fill={isBroadSleeve ? 'url(#mainTopGrad2)' : mainColor} 
                  stroke="#000000" strokeWidth="0.8" 
                />
                <circle cx="152" cy="316" r="6.5" fill="#f6b896" />

                <path 
                  d="M 240 215 Q 262 270 258 335 L 244 335 Q 248 270 230 220 Z" 
                  fill={isBroadSleeve ? 'url(#mainTopGrad2)' : mainColor} 
                  stroke="#000000" strokeWidth="0.8" 
                />
                <circle cx="251" cy="342" r="6.5" fill="#f6b896" />
              </>
            )}

            {activePose === 'fan' && (
              <>
                <path 
                  d="M 160 215 Q 140 260 148 320 L 162 318 Q 155 260 172 220 Z" 
                  fill={mainColor} stroke="#000000" strokeWidth="0.8" 
                />
                <circle cx="154" cy="324" r="6.5" fill="#f6b896" />

                <path 
                  d="M 240 215 Q 256 260 220 270 L 215 255 Q 240 248 230 220 Z" 
                  fill={mainColor} stroke="#000000" strokeWidth="0.8" 
                />
                <circle cx="214" cy="262" r="5.5" fill="#f6b896" />
                {/* Traditional Fan */}
                <g transform="translate(195, 230) rotate(-15)">
                  <path d="M 20 20 L -10 -15 A 35 35 0 0 1 50 -15 Z" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
                  <path d="M 20 20 L 0 -10 M 20 20 L 20 -15 M 20 20 L 40 -10" stroke="#b45309" strokeWidth="1" />
                  <circle cx="20" cy="20" r="3" fill="#dc2626" />
                </g>
              </>
            )}

            {activePose === 'peace' && (
              <>
                <path 
                  d="M 160 215 Q 130 265 150 315 L 165 310 Q 145 265 172 220 Z" 
                  fill={mainColor} stroke="#000000" strokeWidth="0.8" 
                />
                <circle cx="152" cy="316" r="6.5" fill="#f6b896" />

                <path 
                  d="M 240 215 Q 268 220 252 170 L 240 175 Q 250 215 230 220 Z" 
                  fill={mainColor} stroke="#000000" strokeWidth="0.8" 
                />
                <circle cx="248" cy="168" r="6" fill="#f6b896" />
                {/* Tiny Floating Heart */}
                <path 
                  d="M 252 150 C 252 146 246 142 243 146 C 240 142 234 146 234 150 C 234 156 243 162 243 162 C 243 162 252 156 252 150 Z" 
                  fill="#f43f5e" 
                  className="animate-bounce" 
                />
              </>
            )}

            {activePose === 'traditional' && (
              <>
                <path 
                  d="M 160 215 Q 165 270 196 265 L 194 250 Q 170 255 172 220 Z" 
                  fill={isBroadSleeve ? 'url(#mainTopGrad2)' : mainColor} stroke="#000000" strokeWidth="0.8" 
                />
                <path 
                  d="M 240 215 Q 235 270 204 265 L 206 250 Q 230 255 228 220 Z" 
                  fill={isBroadSleeve ? 'url(#mainTopGrad2)' : mainColor} stroke="#000000" strokeWidth="0.8" 
                />
                <ellipse cx="200" cy="256" rx="9" ry="6.5" fill="#f6b896" stroke="#d97706" strokeWidth="0.8" />
              </>
            )}
          </g>

          {/* 7. Neck & Lập Lĩnh */}
          <g id="neck-and-collar">
            <rect x="193" y="160" width="14" height="18" fill="#f6b896" rx="3" />
            <path 
              d="M 188 174 Q 200 168 212 174 L 214 182 Q 200 176 186 182 Z" 
              fill={mainColor} 
              stroke="url(#goldTrim2)" 
              strokeWidth="1.5" 
            />
            <circle cx="200" cy="177" r="2.8" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
          </g>

          {/* 8. Accessories */}
          {outfit.accessory && outfit.accessory.id !== 'acc_none' && (
            <g id="neck-accessory">
              {outfit.accessory.id === 'kieng_bac_hiphop' && (
                <path 
                  d="M 184 186 Q 200 206 216 186" 
                  fill="none" 
                  stroke="#e2e8f0" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                  filter="drop-shadow(0 1px 2px rgba(0,0,0,0.4))"
                />
              )}
            </g>
          )}

          {/* 9. HEAD & FACIAL FEATURES */}
          <g id="head-group" transform={isInteracting ? 'rotate(-4 200 140)' : ''} className="transition-transform duration-300">
            {/* Ears */}
            <circle cx="177" cy="138" r="6" fill="#f6b896" />
            <circle cx="223" cy="138" r="6" fill="#f6b896" />

            {/* Smooth Head Oval */}
            <ellipse cx="200" cy="136" rx="24" ry="29" fill="#f6b896" />

            {/* Cheeks */}
            <ellipse cx="188" cy="144" rx="5" ry="3.2" fill="#fb7185" opacity={isInteracting ? "0.75" : "0.45"} />
            <ellipse cx="212" cy="144" rx="5" ry="3.2" fill="#fb7185" opacity={isInteracting ? "0.75" : "0.45"} />

            {/* Eyes & Blinking */}
            {isBlinking || isInteracting ? (
              <g stroke="#1c1917" strokeWidth="1.8" strokeLinecap="round" fill="none">
                <path d="M 186 137 Q 190 140 194 137" />
                <path d="M 206 137 Q 210 140 214 137" />
              </g>
            ) : (
              <g id="open-eyes">
                <ellipse cx="190" cy="136" rx="3.5" ry="4.5" fill="#1c1917" />
                <circle cx="191" cy="134.5" r="1.4" fill="#ffffff" />
                <ellipse cx="210" cy="136" rx="3.5" ry="4.5" fill="#1c1917" />
                <circle cx="211" cy="134.5" r="1.4" fill="#ffffff" />
                {gender === 'female' && (
                  <>
                    <path d="M 186 133 Q 190 131 194 133" stroke="#1c1917" strokeWidth="1.2" fill="none" />
                    <path d="M 206 133 Q 210 131 214 133" stroke="#1c1917" strokeWidth="1.2" fill="none" />
                  </>
                )}
              </g>
            )}

            {/* Eyebrows */}
            <path d="M 185 130 Q 190 128 195 130" stroke="#292524" strokeWidth="1.4" strokeLinecap="round" fill="none" />
            <path d="M 205 130 Q 210 128 215 130" stroke="#292524" strokeWidth="1.4" strokeLinecap="round" fill="none" />

            {/* Nose */}
            <path d="M 200 138 Q 199 143 201 143" stroke="#ea580c" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.6" />

            {/* Smile */}
            <path d="M 195 150 Q 200 154 205 150" stroke="#dc2626" strokeWidth="1.6" strokeLinecap="round" fill="none" />

            {/* Hair */}
            {gender === 'female' ? (
              <g id="female-hair">
                <path d="M 176 134 Q 174 112 200 110 Q 226 112 224 134 Q 216 118 200 118 Q 184 118 176 134 Z" fill="#1c1917" />
                <ellipse cx="200" cy="106" rx="10" ry="7" fill="#1c1917" />
                <line x1="190" y1="106" x2="210" y2="106" stroke="#ca8a04" strokeWidth="1.5" />
              </g>
            ) : (
              <g id="male-hair">
                <path d="M 176 134 Q 173 110 200 108 Q 227 110 224 134 Q 216 117 200 116 Q 184 117 176 134 Z" fill="#1c1917" />
              </g>
            )}

            {/* Headwear */}
            {outfit.headwear && outfit.headwear.id !== 'head_none' && (
              <g id="headwear-item">
                {outfit.headwear.id === 'man_cuon_hoang_gia' && (
                  <g transform="translate(200, 114)">
                    <ellipse cx="0" cy="0" rx="27" ry="10" fill="url(#goldTrim2)" stroke="#92400e" strokeWidth="1.5" />
                    <ellipse cx="0" cy="-2" rx="25" ry="8" fill="#eab308" />
                    <circle cx="0" cy="-1" r="3.5" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
                  </g>
                )}
                {outfit.headwear.id === 'non_la_quai_thao' && (
                  <g transform="translate(200, 108)">
                    <polygon points="0,-22 -38,4 38,4" fill="#fef3c7" stroke="#b45309" strokeWidth="1.5" opacity="0.95" />
                    <line x1="-30" y1="4" x2="-22" y2="35" stroke="#f43f5e" strokeWidth="2" />
                    <line x1="30" y1="4" x2="22" y2="35" stroke="#f43f5e" strokeWidth="2" />
                  </g>
                )}
                {outfit.headwear.id === 'kinh_cyber_neon' && (
                  <g transform="translate(200, 136)">
                    <rect x="-18" y="-4" width="36" height="8" rx="2" fill="#00f2fe" opacity="0.85" stroke="#ffffff" strokeWidth="1" filter="drop-shadow(0 0 4px #00f2fe)" />
                  </g>
                )}
              </g>
            )}
          </g>
        </svg>

        {/* Taboo Lapel Warning Badge */}
        {!isRightLapel && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-red-600/90 text-white text-[11px] font-bold shadow-glow-crimson flex items-center gap-1.5 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Phát hiện lỗi Tả Nhậm (Vạt Trái)!</span>
          </div>
        )}
      </div>

      {/* BOTTOM SINGLE UNIFIED DOCK (Mobile Clean & Accessible) */}
      {!compactMode && (
        <div className="relative z-20 w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-white/10">
          {/* Poses Pills */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-md border border-[#cba135]/30 shadow-lg w-full sm:w-auto justify-center overflow-x-auto">
            <button
              onClick={() => setActivePose('runway')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                activePose === 'runway' ? 'bg-[#cba135] text-black shadow-md' : 'text-stone-300 hover:text-white'
              }`}
            >
              💃 Runway
            </button>
            <button
              onClick={() => setActivePose('fan')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                activePose === 'fan' ? 'bg-[#cba135] text-black shadow-md' : 'text-stone-300 hover:text-white'
              }`}
            >
              🪭 Quạt
            </button>
            <button
              onClick={() => setActivePose('peace')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                activePose === 'peace' ? 'bg-[#cba135] text-black shadow-md' : 'text-stone-300 hover:text-white'
              }`}
            >
              ✌️ Tim
            </button>
            <button
              onClick={() => setActivePose('traditional')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                activePose === 'traditional' ? 'bg-[#cba135] text-black shadow-md' : 'text-stone-300 hover:text-white'
              }`}
            >
              🙏 Chào
            </button>
          </div>

          {/* View Angles Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
            <button
              onClick={() => onCameraViewChange('full')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                cameraView === 'full' ? 'bg-white/20 text-[#cba135] font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Toàn Thân
            </button>
            <button
              onClick={() => onCameraViewChange('torso')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                cameraView === 'torso' ? 'bg-white/20 text-[#cba135] font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Cổ Áo
            </button>
            <button
              onClick={() => onCameraViewChange('head')}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                cameraView === 'head' ? 'bg-white/20 text-[#cba135] font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Gương Mặt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
