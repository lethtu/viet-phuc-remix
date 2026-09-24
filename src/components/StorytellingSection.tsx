import React, { useState } from 'react';
import { STORY_CHAPTERS, StoryChapter } from '../data/storyTimeline';
import { BookOpen, Sparkles, ArrowRight, ShieldCheck, Clock, Compass } from 'lucide-react';

interface StorytellingSectionProps {
  onGoToStudio: () => void;
}

export const StorytellingSection: React.FC<StorytellingSectionProps> = ({ onGoToStudio }) => {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const chapter = STORY_CHAPTERS[activeChapterIndex];

  return (
    <section id="storytelling" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background decorative glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#cba135]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#cba135]/15 border border-[#cba135]/30 text-[#cba135] text-xs font-semibold uppercase tracking-wider mb-4">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Hành Trình Di Sản Ngàn Năm</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif-royal text-gold-gradient tracking-tight mb-4">
          Dòng Chảy Y Quan Đại Việt
        </h2>
        <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
          Khám phá triết lý nhân sinh, cấu trúc trang phục và cuộc chuyển mình ngoạn mục của cổ phục Việt Nam từ chốn cung đình đến góc phố Gen Z.
        </p>
      </div>

      {/* Chapter Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
        {STORY_CHAPTERS.map((chap, idx) => {
          const isActive = idx === activeChapterIndex;
          return (
            <button
              key={chap.id}
              onClick={() => setActiveChapterIndex(idx)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-[#cba135] text-black border-[#cba135] shadow-glow-gold font-semibold scale-105'
                  : 'bg-white/5 text-stone-300 border-white/10 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-black' : 'bg-[#cba135]'}`} />
              <span>{chap.chapterNumber}: {chap.title.split('&')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Story Card */}
      <div className={`relative rounded-3xl p-6 sm:p-10 lg:p-12 glass-panel border border-[#cba135]/30 bg-gradient-to-br ${chapter.bgGradient} shadow-2xl transition-all duration-500`}>
        {/* Floating time badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-300/90 font-medium">
            <Clock className="w-4 h-4 text-[#cba135]" />
            <span>{chapter.timePeriod}</span>
          </div>
          <span className="text-xs uppercase tracking-widest text-[#cba135]/80 font-bold">
            {chapter.chapterNumber}
          </span>
        </div>

        {/* Title & Subtitle */}
        <div className="mb-8">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif-royal text-white mb-2">
            {chapter.title}
          </h3>
          <p className="text-lg text-amber-200/90 font-serif italic">
            {chapter.subtitle}
          </p>
        </div>

        {/* Quote banner */}
        <blockquote className="mb-8 p-4 sm:p-5 rounded-2xl bg-black/40 border-l-4 border-[#cba135] text-stone-200 italic text-sm sm:text-base font-serif">
          {chapter.quote}
        </blockquote>

        {/* Story Body Paragraphs */}
        <div className="space-y-4 mb-10 text-stone-300 text-sm sm:text-base leading-relaxed">
          {chapter.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Key Highlights Grid */}
        <div className="mb-10">
          <h4 className="text-xs uppercase tracking-wider text-[#cba135] font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Từ Khóa Văn Hóa Cốt Lõi</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {chapter.keyHighlights.map((hl, i) => (
              <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="inline-block text-amber-300 font-semibold text-sm mb-1">
                  {hl.term}
                </span>
                <p className="text-stone-300 text-xs leading-relaxed">
                  {hl.definition}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <button
              disabled={activeChapterIndex === 0}
              onClick={() => setActiveChapterIndex(Math.max(0, activeChapterIndex - 1))}
              className="px-4 py-2 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-stone-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Chương Trước
            </button>
            <button
              disabled={activeChapterIndex === STORY_CHAPTERS.length - 1}
              onClick={() => setActiveChapterIndex(Math.min(STORY_CHAPTERS.length - 1, activeChapterIndex + 1))}
              className="px-4 py-2 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-stone-300 disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              Chương Tiếp Theo
            </button>
          </div>

          <button
            onClick={onGoToStudio}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c02739] to-[#9b1b30] hover:from-[#d93044] hover:to-[#b32035] text-white font-semibold text-sm shadow-glow-crimson transition-all hover:scale-105"
          >
            <span>Phối Đồ Ngay Tại Studio 2D</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
