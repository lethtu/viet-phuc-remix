import React from 'react';
import { Sparkles, ArrowDown, BookOpen, Compass, ShieldCheck, Palette, Wand2 } from 'lucide-react';

interface HeroSectionProps {
  onGoToStudio: () => void;
  onGoToStory: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGoToStudio, onGoToStory }) => {
  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#c02739]/15 via-[#cba135]/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative Traditional Patterns Watermark */}
      <div className="absolute inset-0 bg-[radial-gradient(#cba135_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Top Heritage Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#cba135]/15 border border-[#cba135]/30 text-[#cba135] text-xs font-semibold uppercase tracking-widest shadow-glow-gold animate-float-slow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Đề Thi Audition • Phối Trang Phục Truyền Thống Theo Phong Cách Gen Z</span>
        </div>

        {/* Main Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold font-serif-royal tracking-tight text-white leading-tight">
          Hồn Cổ Ngàn Năm <br className="hidden sm:inline" />
          <span className="text-gold-gradient">Nhịp Thở Gen Z</span>
        </h1>

        {/* Subtitle description */}
        <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-lg leading-relaxed font-light">
          Khám phá vẻ đẹp bất tận của Áo Ngũ Thân, Áo Tấc, Nhật Bình, Tứ Thân và cách thế hệ trẻ tái định hình di sản bằng thời trang đường phố thông minh, chuẩn mực văn hóa.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={onGoToStudio}
            className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-[#cba135] to-[#e5a93b] hover:from-[#dcb547] hover:to-[#f0b94d] text-black font-bold text-sm sm:text-base shadow-glow-gold transition-all hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            <span>Vào Phòng Thử Đồ 3D Ngay</span>
          </button>

          <button
            onClick={onGoToStory}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base border border-white/15 transition-all hover:scale-105"
          >
            <BookOpen className="w-5 h-5 text-[#cba135]" />
            <span>Đọc Hành Trình Di Sản</span>
          </button>
        </div>

        {/* Quick Stats Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-2xl glass-card border border-white/10">
            <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
            <div className="text-lg font-bold text-white font-cinzel">100% Chuẩn</div>
            <div className="text-xs text-stone-400">Radar kiểm soát cấm kỵ & quy tắc vạt áo</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/10">
            <Compass className="w-5 h-5 text-[#cba135] mb-1" />
            <div className="text-lg font-bold text-white font-cinzel">3D Studio</div>
            <div className="text-xs text-stone-400">Xoay 360°, đổi ánh sáng phố cổ & neon</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/10">
            <Palette className="w-5 h-5 text-amber-400 mb-1" />
            <div className="text-lg font-bold text-white font-cinzel">Ngũ Hành</div>
            <div className="text-xs text-stone-400">Chấm điểm độ hài hòa màu sắc thời gian thực</div>
          </div>

          <div className="p-4 rounded-2xl glass-card border border-white/10">
            <Wand2 className="w-5 h-5 text-purple-400 mb-1" />
            <div className="text-lg font-bold text-white font-cinzel">Lookbook</div>
            <div className="text-xs text-stone-400">Xuất thẻ tạp chí Vogue/Elle độ phân giải cao</div>
          </div>
        </div>
      </div>

      {/* Down arrow scroll hint */}
      <div className="mt-14 animate-bounce">
        <button
          onClick={onGoToStudio}
          className="p-2 rounded-full text-stone-400 hover:text-white transition-all"
          title="Cuộn xuống phòng thử đồ"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};
