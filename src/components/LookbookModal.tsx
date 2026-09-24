import React, { useState, useRef } from 'react';
import { CurrentOutfit, OccasionType } from '../types/costume';
import { Download, Share2, Sparkles, X, Check, Camera, BookmarkCheck, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LookbookModalProps {
  outfit: CurrentOutfit;
  culturalScore: number;
  harmonyScore: number;
  selectedOccasion: OccasionType;
  isOpen: boolean;
  onClose: () => void;
  onApplyPresetOutfit?: (preset: Partial<CurrentOutfit>) => void;
}

export const LookbookModal: React.FC<LookbookModalProps> = ({
  outfit,
  culturalScore,
  harmonyScore,
  selectedOccasion,
  isOpen,
  onClose,
}) => {
  const [magazineTitle, setMagazineTitle] = useState('VOGUE VIỆT NAM');
  const [collectionName, setCollectionName] = useState('DI SẢN TRONG NHỊP THỞ GEN Z');
  const [stylistName, setStylistName] = useState('Gen Z Stylist');
  const [magazineTheme, setMagazineTheme] = useState<'vogue' | 'elle' | 'heritage' | 'cyber'>('vogue');
  const [isCopied, setIsCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#cba135', '#c02739', '#00f2fe', '#fcf8f2'],
    });
  };

  const handleDownloadImage = () => {
    triggerCelebration();

    // Draw high quality canvas export
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1100);
    if (magazineTheme === 'cyber') {
      grad.addColorStop(0, '#0a0d1a');
      grad.addColorStop(0.5, '#1e0c2b');
      grad.addColorStop(1, '#05070d');
    } else if (magazineTheme === 'heritage') {
      grad.addColorStop(0, '#1c1511');
      grad.addColorStop(0.5, '#2e1e17');
      grad.addColorStop(1, '#110c0a');
    } else {
      grad.addColorStop(0, '#12141c');
      grad.addColorStop(0.5, '#1a1d29');
      grad.addColorStop(1, '#0a0b10');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 1100);

    // Decorative Borders
    ctx.strokeStyle = '#cba135';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 740, 1040);

    ctx.strokeStyle = 'rgba(203, 161, 53, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(38, 38, 724, 1024);

    // Header Magazine Name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 54px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(magazineTitle, 400, 110);

    // Subtitle
    ctx.fillStyle = '#cba135';
    ctx.font = '600 18px "Be Vietnam Pro", sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('SPECIAL EDITION • HERITAGE REMIX 2026', 400, 145);

    // Decorative separator line
    ctx.strokeStyle = '#cba135';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(120, 165);
    ctx.lineTo(680, 165);
    ctx.stroke();

    // Central Outfit Summary Card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.fillRect(80, 200, 640, 480);
    ctx.strokeStyle = 'rgba(203, 161, 53, 0.3)';
    ctx.strokeRect(80, 200, 640, 480);

    // Garment Illustration Text Representation
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText(outfit.mainTop.name, 400, 270);

    ctx.fillStyle = '#f3cf7a';
    ctx.font = 'italic 20px "Playfair Display", serif';
    ctx.fillText(`Thời kỳ: ${outfit.mainTop.era}`, 400, 310);

    // Outfit Details Box
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`• Lớp phối: ${outfit.layer ? outfit.layer.name : 'Nguyên bản'}`, 120, 380);
    ctx.fillText(`• Trang phục dưới: ${outfit.bottom.name}`, 120, 420);
    ctx.fillText(`• Phụ kiện đầu: ${outfit.headwear ? outfit.headwear.name : 'Tóc tự nhiên'}`, 120, 460);
    ctx.fillText(`• Phụ kiện thân: ${outfit.accessory ? outfit.accessory.name : 'Không'}`, 120, 500);
    ctx.fillText(`• Giày dép: ${outfit.footwear.name}`, 120, 540);
    ctx.fillText(`• Quy cách vạt: ${outfit.vatStyle === 'right' ? 'Hữu Nhậm (Chuẩn)' : 'Tả Nhậm (Cần sửa)'}`, 120, 580);

    // Score Badges
    ctx.fillStyle = 'rgba(203, 161, 53, 0.2)';
    ctx.fillRect(120, 610, 240, 45);
    ctx.fillRect(440, 610, 240, 45);

    ctx.fillStyle = '#f7d779';
    ctx.font = 'bold 16px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`VĂN HÓA: ${culturalScore}/100 ĐIỂM`, 240, 638);
    ctx.fillText(`HÀI HÒA: ${harmonyScore}/100 ĐIỂM`, 560, 638);

    // Collection title & Stylist signature
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px "Playfair Display", serif';
    ctx.textAlign = 'center';
    ctx.fillText(`"${collectionName}"`, 400, 750);

    ctx.fillStyle = '#e0a96d';
    ctx.font = 'italic 18px "Playfair Display", serif';
    ctx.fillText(outfit.mainTop.historicalMeaning.slice(0, 70) + '...', 400, 790);

    // Stylist Credits
    ctx.fillStyle = '#cba135';
    ctx.font = '600 16px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`STYLING BY: ${stylistName.toUpperCase()}`, 400, 870);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '14px "Be Vietnam Pro", sans-serif';
    ctx.fillText('ĐỀ THI AUDITION • VIỆT PHỤC REMIX • THỜI TRANG & DI SẢN', 400, 910);

    // Download trigger
    const link = document.createElement('a');
    link.download = `VietPhucRemix_Lookbook_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = () => {
    setIsCopied(true);
    triggerCelebration();
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setIsCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl glass-panel border border-[#cba135]/40 shadow-2xl p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Magazine Cover Preview (Left 7 Cols) */}
          <div className="lg:col-span-7 flex justify-center">
            <div
              ref={cardRef}
              className={`relative w-full max-w-[380px] aspect-[1/1.42] rounded-2xl p-6 shadow-2xl flex flex-col justify-between overflow-hidden border-2 border-[#cba135] transition-all duration-300 ${
                magazineTheme === 'cyber'
                  ? 'bg-gradient-to-b from-[#0a0d1a] via-[#1e0c2b] to-[#05070d]'
                  : magazineTheme === 'heritage'
                  ? 'bg-gradient-to-b from-[#1c1511] via-[#2e1e17] to-[#110c0a]'
                  : 'bg-gradient-to-b from-[#12141c] via-[#1a1d29] to-[#0a0b10]'
              }`}
            >
              {/* Gold inner frame */}
              <div className="absolute inset-2 border border-[#cba135]/30 rounded-xl pointer-events-none" />

              {/* Cover Top Heading */}
              <div className="text-center z-10 pt-2">
                <h1 className="text-3xl sm:text-4xl font-black font-cinzel tracking-wider text-white">
                  {magazineTitle}
                </h1>
                <p className="text-[10px] tracking-[0.25em] text-[#cba135] font-semibold mt-1 uppercase">
                  Special Edition • Heritage Remix 2026
                </p>
                <div className="w-24 h-[1px] bg-[#cba135] mx-auto mt-2" />
              </div>

              {/* Cover Middle: Garment visual text and highlights */}
              <div className="z-10 text-center my-auto py-4">
                <span className="inline-block px-3 py-1 rounded-full bg-[#cba135]/20 text-[#cba135] text-xs font-semibold uppercase tracking-wider mb-2">
                  {outfit.mainTop.era}
                </span>
                <h2 className="text-2xl font-bold font-serif-royal text-white mb-2">
                  {outfit.mainTop.name}
                </h2>
                <p className="text-xs text-stone-300 font-serif italic max-w-[280px] mx-auto line-clamp-2 mb-4">
                  "{outfit.mainTop.description}"
                </p>

                {/* Layering tags */}
                <div className="flex flex-wrap justify-center gap-1.5 text-[11px] text-amber-200">
                  <span className="px-2 py-0.5 rounded-md bg-white/10">{outfit.bottom.name}</span>
                  {outfit.layer && outfit.layer.id !== 'layer_none' && (
                    <span className="px-2 py-0.5 rounded-md bg-white/10">{outfit.layer.name}</span>
                  )}
                  {outfit.accessory && outfit.accessory.id !== 'acc_none' && (
                    <span className="px-2 py-0.5 rounded-md bg-white/10">{outfit.accessory.name}</span>
                  )}
                </div>
              </div>

              {/* Cover Bottom: Collection name, Stylist & Scores */}
              <div className="z-10 text-center pb-2">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="px-2.5 py-1 rounded-lg bg-black/50 border border-[#cba135]/40 text-xs text-[#cba135] font-bold">
                    Văn Hóa: {culturalScore}/100
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-black/50 border border-[#cba135]/40 text-xs text-[#cba135] font-bold">
                    Ngũ Hành: {harmonyScore}/100
                  </div>
                </div>

                <h3 className="text-sm font-bold font-serif-royal text-white uppercase tracking-wider">
                  "{collectionName}"
                </h3>
                <p className="text-[11px] text-[#cba135] font-medium mt-0.5">
                  Styled by: {stylistName}
                </p>
              </div>
            </div>
          </div>

          {/* Controls & Customization (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#cba135] font-bold">
                Trình Tạo Thẻ Bìa Tạp Chí Thời Trang
              </span>
              <h3 className="text-2xl font-bold font-serif-royal text-white mt-1">
                Xuất Lookbook Việt Phục
              </h3>
              <p className="text-xs text-stone-300 mt-1">
                Tạo thẻ lookbook phong cách tạp chí cao cấp để lưu về máy hoặc chia sẻ lên Facebook/Instagram/TikTok.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Tên Tạp Chí:
                </label>
                <input
                  type="text"
                  value={magazineTitle}
                  onChange={(e) => setMagazineTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:border-[#cba135] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Tên Bộ Phối (Collection):
                </label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:border-[#cba135] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Tên Stylist (Người Phối):
                </label>
                <input
                  type="text"
                  value={stylistName}
                  onChange={(e) => setStylistName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:border-[#cba135] outline-none"
                />
              </div>

              {/* Theme Selector */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Phong Cách Bìa Tạp Chí:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMagazineTheme('vogue')}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      magazineTheme === 'vogue'
                        ? 'bg-[#cba135] text-black border-[#cba135] font-semibold'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Vogue Dark
                  </button>
                  <button
                    onClick={() => setMagazineTheme('heritage')}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      magazineTheme === 'heritage'
                        ? 'bg-amber-700 text-white border-amber-600 font-semibold'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Cổ Phong
                  </button>
                  <button
                    onClick={() => setMagazineTheme('cyber')}
                    className={`py-2 rounded-xl text-xs font-medium border ${
                      magazineTheme === 'cyber'
                        ? 'bg-purple-600 text-white border-purple-500 font-semibold'
                        : 'bg-white/5 text-stone-300 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Cyber Neon
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={handleDownloadImage}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#cba135] to-[#e5a93b] hover:from-[#dcb547] hover:to-[#f0b94d] text-black font-bold text-sm flex items-center justify-center gap-2 shadow-glow-gold transition-all hover:scale-[1.02]"
              >
                <Download className="w-4 h-4" />
                <span>Tải Thẻ Lookbook PNG Độ Nét Cao</span>
              </button>

              <button
                onClick={handleShare}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Đã Sao Chép Link Chia Sẻ!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Sao Chép Link Lookbook</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
