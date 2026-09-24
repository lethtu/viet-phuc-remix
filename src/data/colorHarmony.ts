import { ColorHarmonyResult, CurrentOutfit, ElementType } from '../types/costume';
import { TRADITIONAL_COLORS } from './costumes';

// Map color hex to Element
export function getElementFromHex(hex: string): ElementType {
  const match = TRADITIONAL_COLORS.find(c => c.hex.toLowerCase() === hex.toLowerCase());
  if (match) return match.element;

  // Fallback by basic RGB analysis
  const r = parseInt(hex.slice(1, 3), 16) || 0;
  const g = parseInt(hex.slice(3, 5), 16) || 0;
  const b = parseInt(hex.slice(5, 7), 16) || 0;

  if (r > 180 && g < 100 && b < 100) return 'hoa';
  if (g > 140 && b < 100) return 'moc';
  if (b > 140 && r < 100) return 'thuy';
  if (r > 180 && g > 150 && b < 100) return 'tho';
  return 'kim';
}

const ELEMENT_NAMES: Record<ElementType, string> = {
  kim: 'Hành Kim (Thanh khiết, Sang trọng)',
  moc: 'Hành Mộc (Tươi mới, Phát triển)',
  thuy: 'Hành Thủy (Bình yên, Trí tuệ)',
  hoa: 'Hành Hỏa (Rực rỡ, Đam mê)',
  tho: 'Hành Thổ (Vững chãi, Trung dung)',
};

// Quan hệ Tương sinh
const GENERATING_PAIRS: Record<ElementType, ElementType> = {
  moc: 'hoa',   // Mộc sinh Hỏa
  hoa: 'tho',   // Hỏa sinh Thổ
  tho: 'kim',   // Thổ sinh Kim
  kim: 'thuy',  // Kim sinh Thủy
  thuy: 'moc',  // Thủy sinh Mộc
};

// Quan hệ Tương khắc
const OVERCOMING_PAIRS: Record<ElementType, ElementType> = {
  moc: 'tho',   // Mộc khắc Thổ
  tho: 'thuy',  // Thổ khắc Thủy
  thuy: 'hoa',  // Thủy khắc Hỏa
  hoa: 'kim',   // Hỏa khắc Kim
  kim: 'moc',   // Kim khắc Mộc
};

export function analyzeColorHarmony(outfit: CurrentOutfit): ColorHarmonyResult {
  const mainElem = getElementFromHex(outfit.mainColor);
  const bottomElem = getElementFromHex(outfit.bottomColor);
  const layerElem = outfit.layerColor ? getElementFromHex(outfit.layerColor) : null;

  const elements: ElementType[] = [mainElem, bottomElem];
  if (layerElem) elements.push(layerElem);

  // Check Ngũ Hành relationship between Top and Bottom
  let isGenerating = false;
  let isOvercoming = false;
  let isSame = false;

  if (GENERATING_PAIRS[mainElem] === bottomElem || GENERATING_PAIRS[bottomElem] === mainElem) {
    isGenerating = true;
  } else if (OVERCOMING_PAIRS[mainElem] === bottomElem || OVERCOMING_PAIRS[bottomElem] === mainElem) {
    isOvercoming = true;
  } else if (mainElem === bottomElem) {
    isSame = true;
  }

  let score = 85;
  let paletteType: ColorHarmonyResult['paletteType'] = 'Bổ Túc Tinh Tế';
  let harmonyDescription = '';
  let stylingTip = '';

  if (isGenerating) {
    score = 96;
    paletteType = 'Ngũ Hành Tương Sinh';
    harmonyDescription = `Sự kết hợp tuyệt hảo giữa ${ELEMENT_NAMES[mainElem]} và ${ELEMENT_NAMES[bottomElem]}. Theo triết lý phương Đông, hai hành này hỗ trợ, nuôi dưỡng năng lượng cho nhau.`;
    stylingTip = 'Bảng màu mang lại cảm giác dễ chịu, cân bằng thị giác và thu hút ánh nhìn một cách tự nhiên nhất.';
  } else if (isSame) {
    score = 92;
    paletteType = 'Đơn Sắc Thanh Lịch';
    harmonyDescription = `Phong cách Tone-sur-tone đồng điệu cùng ${ELEMENT_NAMES[mainElem]}. Tạo cảm giác người mặc cao ráo hơn, phong thái đĩnh đạc và liền mạch.`;
    stylingTip = 'Bạn có thể tạo điểm nhấn bằng một chiếc kiềng bạc sáng bóng hoặc đôi sneaker có chi tiết màu tương phản.';
  } else if (isOvercoming) {
    score = 82;
    paletteType = 'Tương Phản Cá Tính';
    harmonyDescription = `Sự đối lập giữa ${ELEMENT_NAMES[mainElem]} và ${ELEMENT_NAMES[bottomElem]}. Trong thẩm mỹ hiện đại, đây là thủ pháp "Color Blocking" cực kỳ được Gen Z ưa chuộng.`;
    stylingTip = 'Sự đối kháng này tạo nên năng lượng bùng nổ, phá cách; hãy giữ các phụ kiện còn lại ở gam màu trung tính để trang phục không bị rối mắt.';
  } else {
    score = 88;
    paletteType = 'Ngũ Hành Tương Hòa';
    harmonyDescription = 'Hai sắc thái màu sắc hòa quyện nhịp nhàng, tạo nên một tổng thể trang phục văn nhã và có chiều sâu.';
    stylingTip = 'Thích hợp cho cả không gian trang trọng lẫn những buổi dạo phố cuối tuần.';
  }

  // Count distribution
  const counts: Record<ElementType, number> = { kim: 0, moc: 0, thuy: 0, hoa: 0, tho: 0 };
  elements.forEach(e => counts[e]++);
  const total = elements.length;

  const elementBreakdown = (['kim', 'moc', 'thuy', 'hoa', 'tho'] as ElementType[])
    .filter(e => counts[e] > 0)
    .map(e => ({
      element: e,
      elementName: ELEMENT_NAMES[e],
      percentage: Math.round((counts[e] / total) * 100),
      colorHex: TRADITIONAL_COLORS.find(c => c.element === e)?.hex || '#d4af37',
    }));

  return {
    score,
    paletteType,
    elementBreakdown,
    harmonyDescription,
    stylingTip,
  };
}
