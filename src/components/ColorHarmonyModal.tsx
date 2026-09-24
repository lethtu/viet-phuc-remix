import React from 'react';
import { ColorHarmonyResult, ElementType } from '../types/costume';
import { Palette, Sparkles, X, Check, Compass, Flame, Droplets, Leaf, Shield, Mountain } from 'lucide-react';

interface ColorHarmonyModalProps {
  result: ColorHarmonyResult;
  isOpen: boolean;
  onClose: () => void;
}

const ELEMENT_ICONS: Record<ElementType, React.ReactNode> = {
  kim: <Shield className="w-4 h-4 text-slate-200" />,
  moc: <Leaf className="w-4 h-4 text-emerald-400" />,
  thuy: <Droplets className="w-4 h-4 text-blue-400" />,
  hoa: <Flame className="w-4 h-4 text-red-400" />,
  tho: <Mountain className="w-4 h-4 text-amber-500" />,
};

export const ColorHarmonyModal: React.FC<ColorHarmonyModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-[#cba135]/40 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Palette className="w-8 h-8" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#cba135] font-bold">
                Phân Tích Hài Hòa Màu Sắc & Ngũ Hành
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#cba135]/20 text-[#cba135]">
                {result.score}/100 Điểm
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-royal text-white mt-1">
              {result.paletteType}
            </h3>
          </div>
        </div>

        {/* Harmony Description */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <p className="text-stone-200 text-sm sm:text-base leading-relaxed mb-3">
            {result.harmonyDescription}
          </p>
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#cba135] flex-shrink-0 mt-0.5" />
            <span>
              <strong>Gợi ý phối đồ từ Stylist:</strong> {result.stylingTip}
            </span>
          </div>
        </div>

        {/* Element Breakdown */}
        <div className="mb-6">
          <h4 className="text-xs uppercase tracking-wider text-[#cba135] font-bold mb-3 flex items-center gap-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Phân Bổ Hành Khí Trong Trang Phục</span>
          </h4>
          <div className="space-y-3">
            {result.elementBreakdown.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-black/40">
                    {ELEMENT_ICONS[item.element]}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {item.elementName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: item.colorHex }}
                  />
                  <span className="text-xs font-bold text-amber-300 min-w-[36px] text-right">
                    {item.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ngũ Hành cycle quick reference */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-stone-300">
          <span className="font-semibold text-amber-300 block mb-1">
            Quy luật Ngũ Hành trong thẩm mỹ Việt:
          </span>
          <p className="leading-relaxed">
            🌿 <strong>Tương sinh:</strong> Mộc sinh Hỏa → Hỏa sinh Thổ → Thổ sinh Kim → Kim sinh Thủy → Thủy sinh Mộc.
            Phối màu tương sinh tạo cảm giác nuôi dưỡng, an hòa và thanh lịch cho người mặc.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/10 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#cba135] text-black font-semibold text-xs sm:text-sm hover:scale-105 transition-all shadow-glow-gold"
          >
            Áp Dụng Bảng Màu Này
          </button>
        </div>
      </div>
    </div>
  );
};
