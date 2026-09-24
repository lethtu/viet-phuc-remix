export type GarmentCategory = 'main' | 'layer' | 'bottom' | 'headwear' | 'footwear' | 'accessory';

export type Gender = 'female' | 'male' | 'unisex';

export type OccasionType = 
  | 'all' 
  | 'school' 
  | 'tet_festival' 
  | 'prom_party' 
  | 'yearbook' 
  | 'street_walk' 
  | 'wedding';

export type WeatherType = 'sunny' | 'breeze' | 'rainy' | 'cold';

export type ElementType = 'kim' | 'moc' | 'thuy' | 'hoa' | 'tho';

export interface ColorOption {
  name: string;
  hex: string;
  element: ElementType;
  meaning: string;
}

export interface PatternOption {
  id: string;
  name: string;
  description: string;
  svgPattern?: string;
}

export interface GarmentItem {
  id: string;
  name: string;
  era: string; // e.g., 'Triều Nguyễn (1802-1945)', 'Kinh Bắc', 'Lê - Trần'
  category: GarmentCategory;
  gender: Gender;
  description: string;
  historicalMeaning: string;
  culturalNote: string;
  tags: string[];
  defaultColor: string;
  availableColors: ColorOption[];
  isHeritageCore?: boolean;
  isGenZRemix?: boolean;
  meshType: string;
  previewIcon?: string;
  compatibleOccasions: OccasionType[];
}

export interface CurrentOutfit {
  mainTop: GarmentItem;
  layer?: GarmentItem | null;
  bottom: GarmentItem;
  headwear?: GarmentItem | null;
  footwear: GarmentItem;
  accessory?: GarmentItem | null;
  mainColor: string;
  bottomColor: string;
  layerColor?: string;
  pattern: string;
  vatStyle: 'right' | 'left'; // Right = Hữu nhậm (Chuẩn), Left = Tả nhậm (Đại kỵ)
}

export interface CulturalCheckResult {
  score: number; // 0 - 100
  status: 'passed' | 'warning' | 'danger';
  title: string;
  summary: string;
  warnings: {
    level: 'info' | 'warning' | 'danger' | 'success';
    title: string;
    message: string;
    culturalContext: string;
  }[];
  culturalBadges: string[];
  suitabilityForOccasion: {
    occasion: OccasionType;
    isAppropriate: boolean;
    reason: string;
  };
}

export interface ColorHarmonyResult {
  score: number;
  paletteType: 'Ngũ Hành Tương Sinh' | 'Ngũ Hành Tương Hòa' | 'Đơn Sắc Thanh Lịch' | 'Tương Phản Cá Tính' | 'Bổ Túc Tinh Tế';
  elementBreakdown: {
    element: ElementType;
    elementName: string;
    percentage: number;
    colorHex: string;
  }[];
  harmonyDescription: string;
  stylingTip: string;
}

export interface LookbookEntry {
  id: string;
  title: string;
  stylistName: string;
  date: string;
  outfit: CurrentOutfit;
  occasion: OccasionType;
  culturalScore: number;
  harmonyScore: number;
  quote: string;
  coverStyle: 'vogue' | 'elle' | 'indochine' | 'cyber';
}
