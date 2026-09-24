import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StorytellingSection } from './components/StorytellingSection';
import { ThreeCanvas } from './components/ThreeCanvas';
import { FittingRoomControls } from './components/FittingRoomControls';
import { CulturalGuardModal } from './components/CulturalGuardModal';
import { ColorHarmonyModal } from './components/ColorHarmonyModal';
import { LookbookModal } from './components/LookbookModal';
import { CompareModal } from './components/CompareModal';
import { CurrentOutfit, OccasionType, WeatherType } from './types/costume';
import {
  MAIN_TOPS,
  BOTTOMS,
  FOOTWEAR,
  ACCESSORIES,
  LAYERS,
  HEADWEAR,
  TRADITIONAL_COLORS,
} from './data/costumes';
import { evaluateCulturalOutfit } from './data/culturalRules';
import { analyzeColorHarmony } from './data/colorHarmony';
import {
  Sparkles,
  ShieldCheck,
  Palette,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Info,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [activeSection, setActiveSection] = useState('hero');

  // Default initial outfit: Iconic Gen Z Vietnamese Heritage outfit
  const [currentOutfit, setCurrentOutfit] = useState<CurrentOutfit>({
    mainTop: MAIN_TOPS[0], // Áo Ngũ Thân Tay Chẽn
    layer: LAYERS[0],      // Không khoác ngoài
    bottom: BOTTOMS[0],    // Quần lụa ống suông
    headwear: null,        // Tóc tự nhiên
    accessory: ACCESSORIES[1], // Kiềng bạc phối xích hiphop
    footwear: FOOTWEAR[1], // Sneaker chunky retro
    mainColor: '#1e3d59',  // Xanh chàm phố thị
    bottomColor: '#fcf8f2',// Trắng tơ lụa
    pattern: 'van_may',    // Gấm vân mây
    vatStyle: 'right',     // Hữu Nhậm (Chuẩn)
  });

  // Outfit B for A/B comparison
  const [outfitB, setOutfitB] = useState<CurrentOutfit>({
    mainTop: MAIN_TOPS[2], // Áo Nhật Bình Hoàng Gia
    layer: LAYERS[1],      // Áo đối khâm voan
    bottom: BOTTOMS[0],    // Quần lụa ống suông
    headwear: HEADWEAR[1], // Mấn cuốn truyền thống
    accessory: ACCESSORIES[2], // Quạt xếp thủy mặc
    footwear: FOOTWEAR[3], // Hài thêu mũi cong
    mainColor: '#d4af37',  // Vàng hoàng kim
    bottomColor: '#fcf8f2',// Trắng tơ lụa
    pattern: 'rong_phuong',
    vatStyle: 'right',
  });

  // Studio lighting & Camera controls
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'hoian' | 'hue' | 'cyber'>('studio');
  const [cameraView, setCameraView] = useState<'full' | 'torso' | 'head'>('full');

  // Filter context
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionType>('all');
  const [selectedWeather, setSelectedWeather] = useState<WeatherType>('sunny');

  // Modals state
  const [isCulturalModalOpen, setIsCulturalModalOpen] = useState(false);
  const [isHarmonyModalOpen, setIsHarmonyModalOpen] = useState(false);
  const [isLookbookModalOpen, setIsLookbookModalOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Real-time analysis results
  const culturalResult = evaluateCulturalOutfit(currentOutfit, selectedOccasion);
  const harmonyResult = analyzeColorHarmony(currentOutfit);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Smart AI Stylist: Generates optimal presets according to occasion
  const handleRandomRemix = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#cba135', '#00f2fe', '#c02739'],
    });

    let top = MAIN_TOPS[Math.floor(Math.random() * MAIN_TOPS.length)];
    let bottom = BOTTOMS[Math.floor(Math.random() * BOTTOMS.length)];
    let layer = Math.random() > 0.4 ? LAYERS[Math.floor(Math.random() * LAYERS.length)] : null;
    let headwear = Math.random() > 0.5 ? HEADWEAR[Math.floor(Math.random() * HEADWEAR.length)] : null;
    let accessory = Math.random() > 0.3 ? ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)] : null;
    let footwear = FOOTWEAR[Math.floor(Math.random() * FOOTWEAR.length)];

    // If wedding or tet festival, ensure respectful bottoms
    if (selectedOccasion === 'tet_festival' || selectedOccasion === 'wedding') {
      bottom = BOTTOMS[0]; // Quần lụa
    }

    const mainColor = TRADITIONAL_COLORS[Math.floor(Math.random() * TRADITIONAL_COLORS.length)].hex;
    const bottomColor = Math.random() > 0.5 ? '#fcf8f2' : '#1c1c1e';

    setCurrentOutfit({
      mainTop: top,
      layer: layer?.id === 'layer_none' ? null : layer,
      bottom,
      headwear: headwear?.id === 'head_none' ? null : headwear,
      accessory: accessory?.id === 'acc_none' ? null : accessory,
      footwear,
      mainColor,
      bottomColor,
      pattern: Math.random() > 0.5 ? 'van_may' : 'hoa_sen',
      vatStyle: 'right', // Always ensure correct lapel on AI pick
    });
  };

  const handleFixTaboo = () => {
    setCurrentOutfit(prev => ({ ...prev, vatStyle: 'right' }));
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#cba135'],
    });
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-[#fcf8f2] flex flex-col font-sans selection:bg-[#c02739] selection:text-white">
      {/* Navigation Header */}
      <Navbar onNavigate={handleNavigate} activeSection={activeSection} />

      {/* Hero Section */}
      <HeroSection
        onGoToStudio={() => handleNavigate('studio')}
        onGoToStory={() => handleNavigate('storytelling')}
      />

      {/* Storytelling Heritage Journey Section */}
      <StorytellingSection onGoToStudio={() => handleNavigate('studio')} />

      {/* 3D Interactive Fitting Room Studio */}
      <section id="studio" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cba135]/15 border border-[#cba135]/30 text-[#cba135] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phòng Thử Đồ Tương Tác 3D</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-royal text-gold-gradient tracking-tight mb-3">
            Việt Phục Remix Studio
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto">
            Tự do thử nghiệm các bộ trang phục truyền thống, phối ghép phụ kiện Gen Z thời thượng, theo dõi phản hồi văn hóa và xuất tạp chí thời trang.
          </p>
        </div>

        {/* Live Status Bar (Scores & Warnings Overview) */}
        <div className="mb-6 p-4 rounded-2xl glass-card border border-white/10 flex flex-wrap items-center justify-between gap-4">
          {/* Cultural Respect Score */}
          <div
            onClick={() => setIsCulturalModalOpen(true)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`p-2.5 rounded-xl transition-all group-hover:scale-105 ${
              culturalResult.score >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
              culturalResult.score >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {culturalResult.status === 'passed' ? (
                <ShieldCheck className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              )}
            </div>
            <div>
              <div className="text-xs text-stone-400 flex items-center gap-1.5">
                <span>Điểm Văn Hóa:</span>
                <span className="text-[11px] underline text-[#cba135] group-hover:text-white">Xem radar</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{culturalResult.score}/100</span>
                <span className="text-xs font-normal text-stone-300 line-clamp-1">
                  • {culturalResult.title}
                </span>
              </div>
            </div>
          </div>

          {/* Color Harmony Score */}
          <div
            onClick={() => setIsHarmonyModalOpen(true)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 transition-all group-hover:scale-105">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-stone-400 flex items-center gap-1.5">
                <span>Ngũ Hành & Bảng Màu:</span>
                <span className="text-[11px] underline text-[#cba135] group-hover:text-white">Chi tiết</span>
              </div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>{harmonyResult.score}/100</span>
                <span className="text-xs font-normal text-amber-200">
                  • {harmonyResult.paletteType}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Cultural Taboo Alert Trigger if Left Lapel */}
          {currentOutfit.vatStyle === 'left' && (
            <button
              onClick={handleFixTaboo}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse shadow-glow-crimson"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Khắc Phục Lỗi Cài Vạt Trái (Tả Nhậm) Ngay</span>
            </button>
          )}
        </div>

        {/* Studio Main Workspace: 3D Stage & Controls Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: 3D Model Canvas (5 Cols on large screens) */}
          <div className="lg:col-span-5 h-[540px] lg:h-[700px] sticky top-24">
            <ThreeCanvas
              outfit={currentOutfit}
              lightingPreset={lightingPreset}
              onLightingChange={setLightingPreset}
              cameraView={cameraView}
              onCameraViewChange={setCameraView}
            />
          </div>

          {/* Right Column: Mix & Match Fitting Room Controls (7 Cols) */}
          <div className="lg:col-span-7">
            <FittingRoomControls
              outfit={currentOutfit}
              onChangeOutfit={setCurrentOutfit}
              selectedOccasion={selectedOccasion}
              onChangeOccasion={setSelectedOccasion}
              selectedWeather={selectedWeather}
              onChangeWeather={setSelectedWeather}
              onOpenCulturalModal={() => setIsCulturalModalOpen(true)}
              onOpenHarmonyModal={() => setIsHarmonyModalOpen(true)}
              onOpenLookbookModal={() => setIsLookbookModalOpen(true)}
              onOpenCompareModal={() => setIsCompareModalOpen(true)}
              onRandomRemix={handleRandomRemix}
            />

            {/* Cultural Information Card for Selected Garment */}
            <div className="mt-6 p-5 rounded-2xl glass-card border border-[#cba135]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-wider text-[#cba135] font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Nguồn Gốc & Ý Nghĩa Lịch Sử: {currentOutfit.mainTop.name}</span>
                </span>
                <span className="text-xs text-amber-200/80 font-medium">
                  {currentOutfit.mainTop.era}
                </span>
              </div>
              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-3">
                {currentOutfit.mainTop.historicalMeaning}
              </p>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-[#cba135]">Lưu ý văn hóa khi phối đồ:</strong> {currentOutfit.mainTop.culturalNote}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <CulturalGuardModal
        result={culturalResult}
        isOpen={isCulturalModalOpen}
        onClose={() => setIsCulturalModalOpen(false)}
        onFixTaboo={handleFixTaboo}
      />

      <ColorHarmonyModal
        result={harmonyResult}
        isOpen={isHarmonyModalOpen}
        onClose={() => setIsHarmonyModalOpen(false)}
      />

      <LookbookModal
        outfit={currentOutfit}
        culturalScore={culturalResult.score}
        harmonyScore={harmonyResult.score}
        selectedOccasion={selectedOccasion}
        isOpen={isLookbookModalOpen}
        onClose={() => setIsLookbookModalOpen(false)}
      />

      <CompareModal
        outfitA={currentOutfit}
        outfitB={outfitB}
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        onSelectOutfit={(selected) => setCurrentOutfit(selected)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-black/70 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">👘</span>
            <span className="font-cinzel font-bold text-white">VIỆT PHỤC REMIX</span>
            <span>— Tôn Vinh Di Sản Trong Nhịp Thở Gen Z</span>
          </div>

          <p>© 2026 Đề thi Audition. Thiết kế và phát triển với niềm tự hào văn hóa Việt Nam.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
