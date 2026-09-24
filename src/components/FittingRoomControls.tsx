import React, { useState } from 'react';
import { CurrentOutfit, GarmentCategory, GarmentItem, OccasionType, WeatherType } from '../types/costume';
import {
  MAIN_TOPS,
  LAYERS,
  BOTTOMS,
  HEADWEAR,
  ACCESSORIES,
  FOOTWEAR,
  TRADITIONAL_COLORS,
  PATTERNS,
} from '../data/costumes';
import {
  Shirt,
  Sparkles,
  Layers as LayersIcon,
  Crown,
  Footprints,
  Watch,
  Palette,
  Compass,
  AlertTriangle,
  RotateCcw,
  Wand2,
  Calendar,
  CloudSun,
  Eye,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface FittingRoomControlsProps {
  outfit: CurrentOutfit;
  onChangeOutfit: (updated: CurrentOutfit) => void;
  selectedOccasion: OccasionType;
  onChangeOccasion: (occ: OccasionType) => void;
  selectedWeather: WeatherType;
  onChangeWeather: (w: WeatherType) => void;
  onOpenCulturalModal: () => void;
  onOpenHarmonyModal: () => void;
  onOpenLookbookModal: () => void;
  onOpenCompareModal: () => void;
  onRandomRemix: () => void;
}

export const FittingRoomControls: React.FC<FittingRoomControlsProps> = ({
  outfit,
  onChangeOutfit,
  selectedOccasion,
  onChangeOccasion,
  selectedWeather,
  onChangeWeather,
  onOpenCulturalModal,
  onOpenHarmonyModal,
  onOpenLookbookModal,
  onOpenCompareModal,
  onRandomRemix,
}) => {
  const [activeTab, setActiveTab] = useState<GarmentCategory | 'colors' | 'patterns'>('main');

  const tabs: { id: GarmentCategory | 'colors' | 'patterns'; label: string; icon: React.ReactNode }[] = [
    { id: 'main', label: 'Áo Chính', icon: <Shirt className="w-4 h-4" /> },
    { id: 'layer', label: 'Lớp Phối', icon: <LayersIcon className="w-4 h-4" /> },
    { id: 'bottom', label: 'Trang Phục Dưới', icon: <Compass className="w-4 h-4" /> },
    { id: 'headwear', label: 'Mấn & Nón', icon: <Crown className="w-4 h-4" /> },
    { id: 'accessory', label: 'Phụ Kiện', icon: <Watch className="w-4 h-4" /> },
    { id: 'footwear', label: 'Giày Dép', icon: <Footprints className="w-4 h-4" /> },
    { id: 'colors', label: 'Bảng Màu', icon: <Palette className="w-4 h-4" /> },
    { id: 'patterns', label: 'Hoa Văn', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const occasions: { id: OccasionType; label: string }[] = [
    { id: 'all', label: 'Tất Cả Sự Kiện' },
    { id: 'school', label: 'Đi Học / Thuyết Trình' },
    { id: 'tet_festival', label: 'Lễ Tết / Du Xuân' },
    { id: 'prom_party', label: 'Prom / Dạ Hội Y2K' },
    { id: 'yearbook', label: 'Chụp Kỷ Yếu Cổ Phong' },
    { id: 'street_walk', label: 'Dạo Phố Cà Phê' },
    { id: 'wedding', label: 'Dự Đám Cưới Hỷ Sự' },
  ];

  const weathers: { id: WeatherType; label: string }[] = [
    { id: 'sunny', label: 'Nắng Ấm' },
    { id: 'breeze', label: 'Thu Mát' },
    { id: 'cold', label: 'Đông Lạnh' },
    { id: 'rainy', label: 'Mưa Rào' },
  ];

  return (
    <div className="w-full flex flex-col space-y-5">
      {/* 1. Occasion & Weather Filter Bar (Mobile Optimized) */}
      <div className="p-3 sm:p-4 rounded-2xl glass-panel border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Left Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Occasion Dropdown */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#cba135]" />
            <span className="text-[11px] sm:text-xs text-stone-400 font-medium">Bối Cảnh:</span>
            <select
              value={selectedOccasion}
              onChange={(e) => onChangeOccasion(e.target.value as OccasionType)}
              className="px-2.5 py-1.5 rounded-xl bg-black/60 border border-white/15 text-xs text-amber-200 outline-none focus:border-[#cba135] max-w-[150px] sm:max-w-none"
            >
              {occasions.map((occ) => (
                <option key={occ.id} value={occ.id} className="bg-stone-900 text-white">
                  {occ.label}
                </option>
              ))}
            </select>
          </div>

          {/* Weather Selector */}
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <div className="flex items-center gap-1">
              {weathers.map((w) => (
                <button
                  key={w.id}
                  onClick={() => onChangeWeather(w.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs transition-all ${
                    selectedWeather === w.id
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/40 font-semibold'
                      : 'text-stone-400 hover:text-white bg-white/5'
                  }`}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Random Stylist Button */}
        <button
          onClick={onRandomRemix}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-semibold shadow-glow-cyan transition-all hover:scale-105 active:scale-95"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Gợi Ý AI Remix</span>
        </button>
      </div>

      {/* 2. Category Navigation Tabs (Smooth Momentum Scroll on Phone) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none px-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border active:scale-95 ${
              activeTab === tab.id
                ? 'bg-[#cba135] text-black border-[#cba135] shadow-glow-gold'
                : 'bg-white/5 text-stone-300 border-white/10 hover:border-white/20 hover:bg-white/10'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Items Selection Content */}
      <div className="p-3 sm:p-5 rounded-2xl glass-panel border border-[#cba135]/25 min-h-[260px]">
        {/* TAB: Áo Chính */}
        {activeTab === 'main' && (
          <div className="space-y-3.5">
            {/* Rule warning info banner */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/10 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#cba135] shrink-0" />
                <span className="text-[11px] sm:text-xs">Quy cách vạt áo truyền thống:</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onChangeOutfit({ ...outfit, vatStyle: 'right' })}
                  className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all active:scale-95 ${
                    outfit.vatStyle === 'right'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                      : 'text-stone-400 hover:text-white bg-white/5'
                  }`}
                  title="Vạt phải đè lên vạt trái - Chuẩn y quan người Việt"
                >
                  ✓ Hữu Nhậm (Vạt Phải - Chuẩn)
                </button>
                <button
                  onClick={() => onChangeOutfit({ ...outfit, vatStyle: 'left' })}
                  className={`flex-1 sm:flex-none px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-semibold transition-all active:scale-95 ${
                    outfit.vatStyle === 'left'
                      ? 'bg-red-500/30 text-red-300 border border-red-500/50 shadow-glow-crimson'
                      : 'text-stone-400 hover:text-white bg-white/5'
                  }`}
                  title="Cảnh báo: Tả Nhậm chỉ dùng khi liệm người đã khuất!"
                >
                  ⚠️ Tả Nhậm (Cấm Kỵ)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {MAIN_TOPS.map((item) => {
                const isSelected = outfit.mainTop.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => onChangeOutfit({ ...outfit, mainTop: item })}
                    className={`cursor-pointer p-3 sm:p-4 rounded-xl transition-all border active:scale-95 flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#cba135]/20 border-[#cba135] shadow-glow-gold scale-[1.01]'
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] sm:text-xs font-bold text-amber-300 truncate">
                          {item.era}
                        </span>
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-[#cba135] shrink-0" />
                        ) : item.isHeritageCore ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold shrink-0">
                            Di Sản
                          </span>
                        ) : item.isGenZRemix ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-semibold shrink-0">
                            Gen Z
                          </span>
                        ) : null}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white mb-1 line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed mb-2">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-[9px] sm:text-[11px] text-[#cba135] italic truncate">
                      {item.tags.join(' • ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: Lớp Phối Ngoài (Layers) */}
        {activeTab === 'layer' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {LAYERS.map((item) => {
              const isSelected = outfit.layer?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onChangeOutfit({ ...outfit, layer: item.id === 'layer_none' ? null : item })}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl transition-all border active:scale-95 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#cba135]/20 border-[#cba135] shadow-glow-gold scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] sm:text-xs font-bold text-amber-300">
                        {item.era}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#cba135] shrink-0" />}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white mb-1 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: Trang Phục Dưới (Bottoms) */}
        {activeTab === 'bottom' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {BOTTOMS.map((item) => {
              const isSelected = outfit.bottom.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onChangeOutfit({ ...outfit, bottom: item })}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl transition-all border active:scale-95 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#cba135]/20 border-[#cba135] shadow-glow-gold scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] sm:text-xs font-bold text-amber-300">
                        {item.era}
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#cba135] shrink-0" />}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white mb-1 line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: Mấn & Nón (Headwear) */}
        {activeTab === 'headwear' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {HEADWEAR.map((item) => {
              const isSelected = outfit.headwear?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onChangeOutfit({ ...outfit, headwear: item.id === 'head_none' ? null : item })}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl transition-all border active:scale-95 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#cba135]/20 border-[#cba135] shadow-glow-gold scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {item.name}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#cba135] shrink-0" />}
                    </div>
                    <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: Phụ Kiện Thân & Tay (Accessories) */}
        {activeTab === 'accessory' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {ACCESSORIES.map((item) => {
              const isSelected = outfit.accessory?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onChangeOutfit({ ...outfit, accessory: item.id === 'acc_none' ? null : item })}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl transition-all border active:scale-95 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#cba135]/20 border-[#cba135] shadow-glow-gold scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {item.name}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#cba135] shrink-0" />}
                    </div>
                    <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: Giày Dép (Footwear) */}
        {activeTab === 'footwear' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {FOOTWEAR.map((item) => {
              const isSelected = outfit.footwear.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onChangeOutfit({ ...outfit, footwear: item })}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl transition-all border active:scale-95 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#cba135]/20 border-[#cba135] shadow-glow-gold scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {item.name}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#cba135] shrink-0" />}
                    </div>
                    <p className="text-[10px] sm:text-xs text-stone-300 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB: Bảng Màu (Colors) */}
        {activeTab === 'colors' && (
          <div className="space-y-5">
            <div>
              <span className="text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                1. Màu Sắc Áo Chính:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                {TRADITIONAL_COLORS.map((col) => {
                  const isChosen = outfit.mainColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={col.name}
                      onClick={() => onChangeOutfit({ ...outfit, mainColor: col.hex })}
                      className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
                        isChosen
                          ? 'border-[#cba135] bg-[#cba135]/25 shadow-glow-gold scale-105'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div
                        className="w-7 sm:w-8 h-7 sm:h-8 rounded-full shadow-inner border border-white/20"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[10px] sm:text-[11px] font-medium text-white text-center line-clamp-1">
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider block mb-2">
                2. Màu Sắc Trang Phục Dưới:
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
                {TRADITIONAL_COLORS.slice(0, 6).map((col) => {
                  const isChosen = outfit.bottomColor.toLowerCase() === col.hex.toLowerCase();
                  return (
                    <button
                      key={col.name}
                      onClick={() => onChangeOutfit({ ...outfit, bottomColor: col.hex })}
                      className={`p-2 sm:p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
                        isChosen
                          ? 'border-[#cba135] bg-[#cba135]/25 shadow-glow-gold scale-105'
                          : 'border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      <div
                        className="w-7 sm:w-8 h-7 sm:h-8 rounded-full shadow-inner border border-white/20"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="text-[10px] sm:text-[11px] font-medium text-white text-center line-clamp-1">
                        {col.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB: Hoa Văn (Patterns) */}
        {activeTab === 'patterns' && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
            {PATTERNS.map((pat) => {
              const isSelected = outfit.pattern === pat.id;
              return (
                <div
                  key={pat.id}
                  onClick={() => onChangeOutfit({ ...outfit, pattern: pat.id })}
                  className={`cursor-pointer p-3 sm:p-4 rounded-xl transition-all border active:scale-95 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#cba135]/20 border-[#cba135] shadow-glow-gold scale-[1.01]'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                        {pat.name}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-[#cba135] shrink-0" />}
                    </div>
                    <p className="text-[10px] sm:text-xs text-stone-300 leading-relaxed line-clamp-2">
                      {pat.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Quick Action Floating Dock (Optimized for Mobile Grid) */}
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-between gap-2 sm:gap-3 pt-2">
        <button
          onClick={onOpenCulturalModal}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] sm:text-xs md:text-sm font-semibold transition-all active:scale-95 hover:scale-105"
        >
          <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400 shrink-0" />
          <span className="truncate">Radar Văn Hóa</span>
        </button>

        <button
          onClick={onOpenHarmonyModal}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-[#cba135]/20 hover:bg-[#cba135]/30 text-amber-300 border border-[#cba135]/40 text-[11px] sm:text-xs md:text-sm font-semibold transition-all active:scale-95 hover:scale-105"
        >
          <Palette className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#cba135] shrink-0" />
          <span className="truncate">Bảng Màu Ngũ Hành</span>
        </button>

        <button
          onClick={onOpenCompareModal}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[11px] sm:text-xs md:text-sm font-semibold transition-all active:scale-95 hover:scale-105"
        >
          <span className="truncate">So Sánh A / B</span>
        </button>

        <button
          onClick={onOpenLookbookModal}
          className="flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c02739] to-[#9b1b30] hover:from-[#d93044] hover:to-[#b32035] text-white font-bold text-[11px] sm:text-xs md:text-sm shadow-glow-crimson transition-all active:scale-95 hover:scale-105 col-span-2 sm:col-span-1"
        >
          <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 shrink-0" />
          <span className="truncate">Xuất Lookbook Tạp Chí</span>
        </button>
      </div>
    </div>
  );
};
