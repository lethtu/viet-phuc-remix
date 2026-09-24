import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StorytellingSection } from './components/StorytellingSection';
import { Avatar2DCanvas } from './components/Avatar2DCanvas';
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
  User,
  Shirt,
  Home,
  Camera,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [studioLayoutMode, setStudioLayoutMode] = useState<'split' | 'fullscreen_model' | 'wardrobe_only'>('split');
  const [gender, setGender] = useState<'male' | 'female'>('male');

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

      {/* 2D Interactive Fitting Room Studio */}
      <section id="studio" className="relative py-12 sm:py-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cba135]/15 border border-[#cba135]/30 text-[#cba135] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phòng Thử Đồ Tương Tác 2D</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-serif-royal text-gold-gradient tracking-tight mb-2 sm:mb-3">
            Việt Phục Remix Studio
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mx-auto px-2">
            Tự do thử nghiệm các bộ trang phục truyền thống, phối ghép phụ kiện Gen Z thời thượng, theo dõi phản hồi văn hóa và xuất tạp chí thời trang.
          </p>
        </div>

        {/* Live Status Bar (Scores & Warnings Overview) */}
        <div className="mb-5 sm:mb-6 p-3 sm:p-4 rounded-2xl glass-card border border-white/10 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          {/* Cultural Respect Score */}
          <div
            onClick={() => setIsCulturalModalOpen(true)}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className={`p-2 sm:p-2.5 rounded-xl transition-all group-hover:scale-105 ${
              culturalResult.score >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
              culturalResult.score >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {culturalResult.status === 'passed' ? (
                <ShieldCheck className="w-5 sm:w-6 h-5 sm:h-6" />
              ) : (
                <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6 animate-pulse" />
              )}
            </div>
            <div>
              <div className="text-[11px] sm:text-xs text-stone-400 flex items-center gap-1.5">
                <span>Điểm Văn Hóa:</span>
                <span className="text-[10px] sm:text-[11px] underline text-[#cba135] group-hover:text-white">Xem radar</span>
              </div>
              <div className="text-xs sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <span>{culturalResult.score}/100</span>
                <span className="text-[11px] sm:text-xs font-normal text-stone-300 line-clamp-1">
                  • {culturalResult.title}
                </span>
              </div>
            </div>
          </div>

          {/* Color Harmony Score */}
          <div
            onClick={() => setIsHarmonyModalOpen(true)}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/20 text-amber-400 transition-all group-hover:scale-105">
              <Palette className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <div className="text-[11px] sm:text-xs text-stone-400 flex items-center gap-1.5">
                <span>Ngũ Hành & Bảng Màu:</span>
                <span className="text-[10px] sm:text-[11px] underline text-[#cba135] group-hover:text-white">Chi tiết</span>
              </div>
              <div className="text-xs sm:text-base font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <span>{harmonyResult.score}/100</span>
                <span className="text-[11px] sm:text-xs font-normal text-amber-200">
                  • {harmonyResult.paletteType}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Cultural Taboo Alert Trigger if Left Lapel */}
          {currentOutfit.vatStyle === 'left' && (
            <button
              onClick={handleFixTaboo}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 animate-pulse shadow-glow-crimson"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Khắc Phục Lỗi Cài Vạt Trái (Tả Nhậm) Ngay</span>
            </button>
          )}
        </div>

        {/* Mobile / Tablet Studio Mode Controller (< lg) */}
        <div className="lg:hidden mb-4 p-1 rounded-2xl glass-panel border border-[#cba135]/35 flex items-center justify-between gap-1 sticky top-16 sm:top-20 z-30 shadow-2xl backdrop-blur-xl">
          <button
            onClick={() => setStudioLayoutMode('split')}
            className={`flex-1 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              studioLayoutMode === 'split'
                ? 'bg-[#cba135] text-black shadow-glow-gold'
                : 'text-stone-300 hover:text-white bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Thử Đồ Trực Tiếp</span>
          </button>
          <button
            onClick={() => setStudioLayoutMode('fullscreen_model')}
            className={`flex-1 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              studioLayoutMode === 'fullscreen_model'
                ? 'bg-[#cba135] text-black shadow-glow-gold'
                : 'text-stone-300 hover:text-white bg-white/5'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Người Mẫu 2D</span>
          </button>
          <button
            onClick={() => setStudioLayoutMode('wardrobe_only')}
            className={`flex-1 py-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              studioLayoutMode === 'wardrobe_only'
                ? 'bg-[#cba135] text-black shadow-glow-gold'
                : 'text-stone-300 hover:text-white bg-white/5'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Tủ Đồ Rộng</span>
          </button>
        </div>

        {/* Studio Main Workspace: 2D Stage & Controls Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* 2D Model Canvas: Sticky on Desktop, Adaptive on Mobile */}
          <div className={`lg:col-span-5 lg:sticky lg:top-24 ${
            studioLayoutMode === 'wardrobe_only'
              ? 'hidden lg:block lg:h-[700px]'
              : studioLayoutMode === 'fullscreen_model'
              ? 'block h-[540px] sm:h-[620px] lg:h-[700px]'
              : 'block lg:h-[700px]'
          }`}>
            <Avatar2DCanvas
              outfit={currentOutfit}
              lightingPreset={lightingPreset}
              onLightingChange={setLightingPreset}
              cameraView={cameraView}
              onCameraViewChange={setCameraView}
              gender={gender}
              onGenderChange={setGender}
              compactMode={studioLayoutMode === 'split'}
              onToggleExpand={() => setStudioLayoutMode(studioLayoutMode === 'split' ? 'fullscreen_model' : 'split')}
              isExpanded={studioLayoutMode === 'fullscreen_model'}
            />

            {/* Quick button in fullscreen mode on mobile to switch to wardrobe */}
            {studioLayoutMode === 'fullscreen_model' && (
              <div className="mt-3 lg:hidden flex justify-center">
                <button
                  onClick={() => setStudioLayoutMode('split')}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#cba135] to-[#e5a93b] text-black font-bold text-xs shadow-glow-gold flex items-center justify-center gap-2 active:scale-95"
                >
                  <Shirt className="w-4 h-4" />
                  <span>Quay Lại Thử Đồ & Đổi Trang Phục</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Mix & Match Fitting Room Controls */}
          <div className={`lg:col-span-7 ${
            studioLayoutMode === 'fullscreen_model' ? 'hidden lg:block' : 'block'
          }`}>
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
            <div className="mt-5 sm:mt-6 p-4 sm:p-5 rounded-2xl glass-card border border-[#cba135]/30">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider text-[#cba135] font-bold flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Nguồn Gốc & Ý Nghĩa: {currentOutfit.mainTop.name}</span>
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

        {/* Floating Mini Preview Button on Mobile when in wardrobe_only mode */}
        {studioLayoutMode === 'wardrobe_only' && (
          <button
            onClick={() => setStudioLayoutMode('split')}
            className="lg:hidden fixed bottom-20 right-4 z-40 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#c02739] to-[#cba135] text-white font-bold text-xs shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce active:scale-95"
          >
            <User className="w-4 h-4 text-amber-200" />
            <span>Xem Mẫu Mặc ({currentOutfit.mainTop.name.slice(0, 11)}...)</span>
          </button>
        )}
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
      <footer className="mt-auto border-t border-white/10 bg-black/70 py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-stone-400 pb-24 lg:pb-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">👘</span>
            <span className="font-cinzel font-bold text-white">VIỆT PHỤC REMIX</span>
            <span>— Tôn Vinh Di Sản Trong Nhịp Thở Gen Z</span>
          </div>

          <p>© 2026 Đề thi Audition. Thiết kế và phát triển với niềm tự hào văn hóa Việt Nam.</p>
        </div>
      </footer>

      {/* FLOATING MOBILE BOTTOM NAVIGATION DOCK */}
      {!(isCulturalModalOpen || isHarmonyModalOpen || isLookbookModalOpen || isCompareModalOpen) && (
        <div className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-[380px] p-1.5 rounded-full bg-[#0d0f17]/90 backdrop-blur-2xl border border-[#cba135]/40 shadow-2xl flex items-center justify-around animate-fadeIn">
          <button
            onClick={() => handleNavigate('hero')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-full transition-all active:scale-90 ${
              activeSection === 'hero' ? 'text-[#cba135] font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Trang Chủ</span>
          </button>

          <button
            onClick={() => handleNavigate('storytelling')}
            className={`flex flex-col items-center py-1 px-2.5 rounded-full transition-all active:scale-90 ${
              activeSection === 'storytelling' ? 'text-[#cba135] font-bold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Di Sản</span>
          </button>

          <button
            onClick={() => handleNavigate('studio')}
            className={`flex flex-col items-center py-1 px-3 rounded-full transition-all active:scale-90 ${
              activeSection === 'studio' ? 'bg-[#cba135] text-black font-bold shadow-glow-gold' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Thử Đồ 2D</span>
          </button>

          <button
            onClick={() => setIsLookbookModalOpen(true)}
            className="flex flex-col items-center py-1 px-2.5 rounded-full text-stone-400 hover:text-white transition-all active:scale-90"
          >
            <Camera className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] mt-0.5">Tạp Chí</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
