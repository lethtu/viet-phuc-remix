import React from 'react';
import { Sparkles, ArrowDown, BookOpen, Compass, ShieldCheck, Palette, Wand2, Heart } from 'lucide-react';

interface HeroSectionProps {
  onGoToStudio: () => void;
  onGoToStory: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGoToStudio, onGoToStory }) => {
  return (
    <section id="hero" className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden">
      {/* Dynamic Ambient Glow Rings */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[320px] sm:w-[600px] lg:w-[800px] h-[300px] sm:h-[450px] bg-gradient-to-tr from-[#c02739]/20 via-[#cba135]/20 to-purple-600/15 rounded-full blur-[90px] sm:blur-[140px] pointer-events-none animate-pulse-glow" />

      {/* Decorative Radial Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cba135_1px,transparent_1px)] [background-size:24px_24px] sm:[background-size:32px_32px] opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-5 sm:space-y-7">
        {/* Top Heritage Pill with Float Animation */}
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#cba135]/15 border border-[#cba135]/35 text-[#cba135] text-[11px] sm:text-xs font-semibold uppercase tracking-widest shadow-glow-gold animate-float-slow">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow text-[#cba135]" />
          <span>Đề Thi Audition • Phối Trang Phục Truyền Thống Gen Z</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-serif-royal tracking-tight text-white leading-tight">
          Hồn Cổ Ngàn Năm <br className="hidden sm:inline" />
          <span className="text-gold-gradient">Nhịp Thở Gen Z</span>
        </h1>

        {/* Subtitle description */}
        <p className="max-w-2xl mx-auto text-stone-300 text-xs sm:text-base md:text-lg leading-relaxed font-light px-2">
          Khám phá vẻ đẹp bất tận của Áo Ngũ Thân, Áo Tấc, Nhật Bình, Tứ Thân và cách thế hệ trẻ tái định hình di sản bằng thời trang đường phố thông minh, chuẩn mực văn hóa.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full max-w-md mx-auto">
          <button
            onClick={onGoToStudio}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-[#cba135] to-[#e5a93b] hover:from-[#dcb547] hover:to-[#f0b94d] text-black font-bold text-sm sm:text-base shadow-glow-gold transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-black" />
            <span>Phòng Thử Đồ Tương Tác</span>
          </button>

          <button
            onClick={onGoToStory}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 sm:py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/15 transition-all hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-[#cba135]" />
            <span>Hành Trình Di Sản</span>
          </button>
        </div>

        {/* Quick Stats Badges (Optimized for Mobile Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 pt-6 sm:pt-10 max-w-4xl mx-auto text-left">
          <div className="p-3 sm:p-4 rounded-2xl glass-card border border-white/10 hover:border-[#cba135]/50 transition-all hover:-translate-y-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
            <div className="text-base sm:text-lg font-bold text-white font-cinzel">100% Chuẩn</div>
            <div className="text-[10px] sm:text-xs text-stone-400 leading-tight">Radar kiểm soát cấm kỵ & quy tắc vạt áo</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl glass-card border border-white/10 hover:border-[#cba135]/50 transition-all hover:-translate-y-1">
            <Compass className="w-5 h-5 text-[#cba135] mb-1" />
            <div className="text-base sm:text-lg font-bold text-white font-cinzel">Phòng Thử 2D</div>
            <div className="text-[10px] sm:text-xs text-stone-400 leading-tight">Mượt mà, đổi dáng điệu & ánh sáng</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl glass-card border border-white/10 hover:border-[#cba135]/50 transition-all hover:-translate-y-1">
            <Palette className="w-5 h-5 text-amber-400 mb-1" />
            <div className="text-base sm:text-lg font-bold text-white font-cinzel">Ngũ Hành</div>
            <div className="text-[10px] sm:text-xs text-stone-400 leading-tight">Chấm điểm độ hài hòa màu sắc thời gian thực</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl glass-card border border-white/10 hover:border-[#cba135]/50 transition-all hover:-translate-y-1">
            <Wand2 className="w-5 h-5 text-purple-400 mb-1" />
            <div className="text-base sm:text-lg font-bold text-white font-cinzel">Lookbook</div>
            <div className="text-[10px] sm:text-xs text-stone-400 leading-tight">Xuất thẻ tạp chí Vogue/Elle độ phân giải cao</div>
          </div>
        </div>
      </div>

      {/* Down arrow scroll hint */}
      <div className="mt-8 sm:mt-12 animate-bounce">
        <button
          onClick={onGoToStudio}
          className="p-2 rounded-full text-stone-400 hover:text-white transition-all active:scale-90"
          title="Cuộn xuống phòng thử đồ"
        >
          <ArrowDown className="w-5 h-5 text-[#cba135]" />
        </button>
      </div>
    </section>
  );
};
