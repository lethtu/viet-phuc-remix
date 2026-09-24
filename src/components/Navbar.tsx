import React, { useState } from 'react';
import { AudioPlayer } from './AudioPlayer';
import { Sparkles, Menu, X, Shirt, BookOpen, Home, Compass } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigate(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#cba135] to-[#c02739] p-[1px] shadow-glow-gold transition-all group-hover:scale-105">
            <div className="w-full h-full bg-[#11131c] rounded-2xl flex items-center justify-center">
              <span className="text-lg sm:text-xl">👘</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel font-black tracking-wider text-sm sm:text-base md:text-lg text-white">
                VIỆT PHỤC
              </span>
              <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-md bg-[#cba135] text-black font-extrabold tracking-wider">
                REMIX
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] tracking-widest text-[#cba135] uppercase font-medium">
              Heritage x Gen Z Aesthetics
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-black/40 p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => handleNavClick('hero')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'hero'
                ? 'bg-white/15 text-[#cba135]'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Trang Chủ
          </button>
          <button
            onClick={() => handleNavClick('storytelling')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'storytelling'
                ? 'bg-white/15 text-[#cba135]'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Hành Trình Di Sản
          </button>
          <button
            onClick={() => handleNavClick('studio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeSection === 'studio'
                ? 'bg-[#cba135] text-black font-bold shadow-glow-gold'
                : 'text-stone-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Phòng Thử Đồ 2D
          </button>
        </nav>

        {/* Right Tools (Audio Player, CTA & Mobile Hamburger) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <AudioPlayer />

          <button
            onClick={() => handleNavClick('studio')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#c02739] to-[#9b1b30] hover:from-[#d93044] hover:to-[#b32035] text-white font-semibold text-xs sm:text-sm shadow-glow-crimson transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Phối Đồ Ngay</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-300" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d101a]/95 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fadeIn shadow-2xl">
          <button
            onClick={() => handleNavClick('hero')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeSection === 'hero' ? 'bg-[#cba135] text-black' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Trang Chủ</span>
          </button>
          <button
            onClick={() => handleNavClick('storytelling')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeSection === 'storytelling' ? 'bg-[#cba135] text-black' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Hành Trình Di Sản Cổ Phong</span>
          </button>
          <button
            onClick={() => handleNavClick('studio')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeSection === 'studio' ? 'bg-[#cba135] text-black' : 'text-stone-300 hover:bg-white/10'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Phòng Thử Đồ Tương Tác 2D</span>
          </button>
          <button
            onClick={() => handleNavClick('studio')}
            className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-[#c02739] to-[#cba135] text-white font-bold text-sm shadow-glow-gold"
          >
            <Sparkles className="w-4 h-4" />
            <span>Bắt Đầu Thử Trang Phục Ngay</span>
          </button>
        </div>
      )}
    </header>
  );
};
