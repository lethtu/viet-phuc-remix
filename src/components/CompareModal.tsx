import React from 'react';
import { CurrentOutfit, CulturalCheckResult, ColorHarmonyResult } from '../types/costume';
import { evaluateCulturalOutfit } from '../data/culturalRules';
import { analyzeColorHarmony } from '../data/colorHarmony';
import { X, Check, ArrowRightLeft, Sparkles, ShieldCheck } from 'lucide-react';

interface CompareModalProps {
  outfitA: CurrentOutfit;
  outfitB: CurrentOutfit;
  isOpen: boolean;
  onClose: () => void;
  onSelectOutfit: (outfit: CurrentOutfit) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  outfitA,
  outfitB,
  isOpen,
  onClose,
  onSelectOutfit,
}) => {
  if (!isOpen) return null;

  const culturalA = evaluateCulturalOutfit(outfitA);
  const culturalB = evaluateCulturalOutfit(outfitB);

  const harmonyA = analyzeColorHarmony(outfitA);
  const harmonyB = analyzeColorHarmony(outfitB);

  const renderOutfitColumn = (
    outfit: CurrentOutfit,
    cultural: CulturalCheckResult,
    harmony: ColorHarmonyResult,
    label: string,
    badgeColor: string
  ) => (
    <div className="flex-1 rounded-2xl glass-card border border-white/10 p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
            {label}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400">Văn hóa:</span>
            <span className="text-xs font-bold text-emerald-400">{cultural.score}đ</span>
            <span className="text-xs text-stone-400 ml-1">Ngũ hành:</span>
            <span className="text-xs font-bold text-[#cba135]">{harmony.score}đ</span>
          </div>
        </div>

        {/* Main item header */}
        <h4 className="text-xl font-bold font-serif-royal text-white mb-1">
          {outfit.mainTop.name}
        </h4>
        <p className="text-xs text-amber-200/80 italic mb-4">
          {outfit.mainTop.era}
        </p>

        {/* Items breakdown list */}
        <div className="space-y-2 text-xs text-stone-300 mb-6">
          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
            <span className="text-stone-400">Lớp Phối:</span>
            <span className="font-medium text-white">{outfit.layer ? outfit.layer.name : 'Nguyên bản'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
            <span className="text-stone-400">Trang Phục Dưới:</span>
            <span className="font-medium text-white">{outfit.bottom.name}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
            <span className="text-stone-400">Phụ Kiện Đầu:</span>
            <span className="font-medium text-white">{outfit.headwear ? outfit.headwear.name : 'Tóc tự nhiên'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
            <span className="text-stone-400">Phụ Kiện Thân:</span>
            <span className="font-medium text-white">{outfit.accessory ? outfit.accessory.name : 'Không có'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
            <span className="text-stone-400">Giày Dép:</span>
            <span className="font-medium text-white">{outfit.footwear.name}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between">
            <span className="text-stone-400">Cài Vạt Áo:</span>
            <span className={`font-semibold ${outfit.vatStyle === 'right' ? 'text-emerald-400' : 'text-red-400'}`}>
              {outfit.vatStyle === 'right' ? 'Hữu Nhậm (Chuẩn)' : 'Tả Nhậm (Lỗi cấm kỵ)'}
            </span>
          </div>
        </div>

        {/* Color Palette Indicators */}
        <div className="mb-4">
          <span className="text-[11px] font-semibold text-stone-400 block mb-1.5 uppercase">
            Bảng màu chủ đạo:
          </span>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: outfit.mainColor }}
              title="Màu áo chính"
            />
            <div
              className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
              style={{ backgroundColor: outfit.bottomColor }}
              title="Màu trang phục dưới"
            />
            {outfit.layerColor && (
              <div
                className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: outfit.layerColor }}
                title="Màu áo khoác"
              />
            )}
            <span className="text-xs text-stone-400 ml-1">
              ({harmony.paletteType})
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          onSelectOutfit(outfit);
          onClose();
        }}
        className="w-full mt-4 py-2.5 rounded-xl bg-white/10 hover:bg-[#cba135] hover:text-black font-semibold text-xs sm:text-sm text-white transition-all"
      >
        Chọn Phương Án Này Cho Studio
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-[#cba135]/40 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cba135]/20 text-[#cba135] text-xs font-semibold uppercase tracking-wider mb-2">
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>So Sánh Song Song 2 Phương Án</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif-royal text-white">
            Đối Chiếu Outfit A & B
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Đánh giá trực quan sự khác biệt giữa hai phương án phối để tìm ra sự kết hợp hoàn hảo nhất cho sự kiện của bạn.
          </p>
        </div>

        {/* Side by Side Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {renderOutfitColumn(outfitA, culturalA, harmonyA, 'Phương Án A (Hiện Tại)', 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30')}
          {renderOutfitColumn(outfitB, culturalB, harmonyB, 'Phương Án B (Thử Nghiệm)', 'bg-amber-500/20 text-amber-400 border border-amber-500/30')}
        </div>

        {/* Close / Action footer */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all"
          >
            Đóng Bảng So Sánh
          </button>
        </div>
      </div>
    </div>
  );
};
