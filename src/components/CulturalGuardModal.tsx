import React from 'react';
import { CulturalCheckResult } from '../types/costume';
import { ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, Info, X, Sparkles, BookOpen } from 'lucide-react';

interface CulturalGuardModalProps {
  result: CulturalCheckResult;
  isOpen: boolean;
  onClose: () => void;
  onFixTaboo?: () => void;
}

export const CulturalGuardModal: React.FC<CulturalGuardModalProps> = ({
  result,
  isOpen,
  onClose,
  onFixTaboo,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-panel border border-[#cba135]/40 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-2xl ${
            result.status === 'passed'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : result.status === 'warning'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {result.status === 'passed' ? (
              <ShieldCheck className="w-8 h-8" />
            ) : result.status === 'warning' ? (
              <AlertTriangle className="w-8 h-8" />
            ) : (
              <AlertOctagon className="w-8 h-8" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#cba135] font-bold">
                Radar Kiểm Soát Chuẩn Mực Văn Hóa
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                result.score >= 85 ? 'bg-emerald-500/20 text-emerald-400' :
                result.score >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {result.score}/100 Điểm
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif-royal text-white mt-1">
              {result.title}
            </h3>
          </div>
        </div>

        {/* Summary Description */}
        <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 p-4 rounded-2xl bg-white/5 border border-white/10">
          {result.summary}
        </p>

        {/* Cultural Badges */}
        {result.culturalBadges.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs uppercase tracking-wider text-amber-300 font-bold mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chứng Nhận Di Sản & Phong Cách</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.culturalBadges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-[#cba135]/15 border border-[#cba135]/40 text-[#cba135] text-xs font-semibold flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Warnings & Taboos List */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs uppercase tracking-wider text-stone-400 font-bold">
            Chi Tiết Đánh Giá & Góp Ý Chuyên Môn
          </h4>

          {result.warnings.map((warn, i) => (
            <div
              key={i}
              className={`p-4 rounded-2xl border transition-all ${
                warn.level === 'danger'
                  ? 'bg-red-950/40 border-red-500/40 text-red-200'
                  : warn.level === 'warning'
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : warn.level === 'success'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-blue-950/40 border-blue-500/40 text-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {warn.level === 'danger' && <AlertOctagon className="w-5 h-5 text-red-400" />}
                  {warn.level === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                  {warn.level === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {warn.level === 'info' && <Info className="w-5 h-5 text-blue-400" />}
                </div>

                <div className="flex-1">
                  <h5 className="font-semibold text-sm mb-1 text-white">
                    {warn.title}
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed mb-2 opacity-90">
                    {warn.message}
                  </p>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-stone-300 leading-relaxed">
                    <strong className="text-amber-300 flex items-center gap-1.5 mb-1">
                      <BookOpen className="w-3 h-3" />
                      Góc Nhìn Văn Hóa & Lịch Sử:
                    </strong>
                    {warn.culturalContext}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Occasion suitability */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
              Đánh Giá Hoàn Cảnh Sử Dụng:
            </span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
              result.suitabilityForOccasion.isAppropriate
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/20 text-amber-400'
            }`}>
              {result.suitabilityForOccasion.isAppropriate ? 'Rất Phù Hợp' : 'Cần Cân Nhắc'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            {result.suitabilityForOccasion.reason}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          {result.status === 'danger' && onFixTaboo && (
            <button
              onClick={() => {
                onFixTaboo();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#cba135] text-black font-semibold text-xs sm:text-sm hover:scale-105 transition-all shadow-glow-gold"
            >
              Chỉnh Lại Vạt Hữu Nhậm Ngay
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all"
          >
            Đã Hiểu & Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
