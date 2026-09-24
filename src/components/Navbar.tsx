import React from 'react';
import { AudioPlayer } from './AudioPlayer';
import { Sparkles, Shirt, BookOpen, Compass, Layers } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('hero')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#cba135] to-[#c02739] p-[1px] shadow-glow-gold transition-all group-hover:scale-105">
            <div className="w-full h-full bg-[#11131c] rounded-2xl flex items-center justify-center">
              <span className="text-xl">👘</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel font-black tracking-wider text-base sm:text-lg text-white">
                VIỆT PHỤC
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-[#cba135] text-black font-extrabold tracking-wider">
                REMIX
              </span>
            </div>
            <p className="text-[10px] tracking-widest text-[#cba135] uppercase font-medium">
              Heritage x Gen Z Aesthetics
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => onNavigate('hero')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'hero'
                ? 'bg-white/15 text-[#cba135]'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Trang Chủ
          </button>
          <button
            onClick={() => onNavigate('storytelling')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'storytelling'
                ? 'bg-white/15 text-[#cba135]'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Hành Trình Di Sản
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'studio'
                ? 'bg-[#cba135] text-black font-bold shadow-glow-gold'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Phòng Thử Đồ 3D
          </button>
        </nav>

        {/* Right Tools (Audio Player & CTA) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AudioPlayer />

          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#c02739] to-[#9b1b30] hover:from-[#d93044] hover:to-[#b32035] text-white font-semibold text-xs sm:text-sm shadow-glow-crimson transition-all hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phối Đồ Ngay</span>
          </button>
        </div>
      </div>
    </header>
  );
};
