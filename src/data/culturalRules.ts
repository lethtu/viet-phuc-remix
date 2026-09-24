import { CurrentOutfit, CulturalCheckResult, OccasionType } from '../types/costume';

export function evaluateCulturalOutfit(
  outfit: CurrentOutfit,
  selectedOccasion: OccasionType = 'all'
): CulturalCheckResult {
  const warnings: CulturalCheckResult['warnings'] = [];
  const badges: string[] = [];
  let score = 100;

  // 1. RULE SỐ 1 (ĐẠI KỴ): VẠT ÁO TẢ NHẬM VS HỮU NHẬM
  if (outfit.vatStyle === 'left') {
    score -= 45;
    warnings.push({
      level: 'danger',
      title: 'ĐẠI KỴ: Cài vạt áo sang bên trái (Tả Nhậm)',
      message: 'Trong phong tục truyền thống của người Việt và văn hóa Á Đông, áo luôn luôn phải cài vạt sang bên phải (Hữu Nhậm).',
      culturalContext: 'Cài vạt sang trái (Tả Nhậm) là cách mặc duy nhất dành riêng cho việc liệm người đã khuất, hoặc trang phục của các dân tộc dị tộc ngoài biên ải thời xưa. Đây là lỗi cấm kỵ hàng đầu mà người yêu cổ phục cần tuyệt đối tránh!',
    });
  } else {
    badges.push('Chuẩn vạt Hữu Nhậm');
    warnings.push({
      level: 'success',
      title: 'Chuẩn mực: Vạt Hữu Nhậm (Cài sang phải)',
      message: 'Bộ trang phục tuân thủ đúng quy tắc cài vạt áo truyền thống của người Việt, thể hiện sự am hiểu và tôn trọng cổ nhân.',
      culturalContext: 'Từ áo Giao lĩnh, Ngũ thân cho tới Áo dài tân thời, nếp cài vạt phải thể hiện trật tự âm dương và nét đoan chính.',
    });
  }

  // 2. RULE SỐ 2: TÍNH TÔN NGHIÊM CỦA TRANG PHỤC CUNG ĐÌNH & ĐẠI LỄ
  const isRoyalCeremonial = outfit.mainTop.id === 'nhat_binh' || outfit.mainTop.id === 'ao_tac';
  const isShortBottom = outfit.bottom.id === 'chan_vay_tennis_pleated';
  const isRippedJeans = outfit.bottom.id === 'quan_jean_rach_ong_rong';

  if (isRoyalCeremonial && isShortBottom) {
    score -= 25;
    warnings.push({
      level: 'warning',
      title: 'Cảnh báo: Phối lễ phục cung đình với váy ngắn xếp ly',
      message: 'Áo Nhật Bình và Áo Tấc là biểu trưng tối cao của nghi lễ hoàng gia triều Nguyễn. Việc mặc cùng váy ngắn làm mất đi tính trang nghiêm và phom dáng che phủ tôn quý của tiền nhân.',
      culturalContext: 'Cổ nhân quy định khi mặc áo Tấc hay Nhật Bình phải mặc quần dài phủ kín chân (thường là quần lụa trắng hoặc quần cùng màu). Bạn nên đổi sang Quần lụa ống suông hoặc Quần túi hộp cách tân kín đáo.',
    });
  } else if (isRoyalCeremonial && isRippedJeans) {
    score -= 10;
    warnings.push({
      level: 'info',
      title: 'Lưu ý phong cách: Nhật Bình / Áo Tấc phối Jeans rách',
      message: 'Sự phá cách này rất ấn tượng trên sàn diễn thời trang đường phố (avant-garde), tuy nhiên không phù hợp với các không gian thờ tự hoặc nghi lễ trang nghiêm.',
      culturalContext: 'Hãy tự tin diện bộ này khi chụp ảnh nghệ thuật hoặc triển lãm thời trang, nhưng hãy đổi quần lụa khi đến thăm Đại Nội hoặc đình chùa.',
    });
  } else if (isRoyalCeremonial && outfit.bottom.id === 'quan_lua_truyen_thong') {
    badges.push('Chuẩn Hoàng Cung');
  }

  // 3. RULE SỐ 3: ÁO TỨ THÂN & YẾM ĐÀO
  if (outfit.mainTop.id === 'tu_than_kinh_bac') {
    if (outfit.headwear?.id === 'kinh_cyber_neon') {
      warnings.push({
        level: 'info',
        title: 'Thử nghiệm thú vị: Liền chị Kinh Bắc x Cyberpunk',
        message: 'Kính râm Neon tạo sự tương phản cực mạnh với nét mộc mạc của áo tứ thân Bắc Bộ.',
        culturalContext: 'Một cú remix táo bạo đậm chất nhạc điện tử dân gian đương đại (như phong cách Hoàng Thùy Linh hay DTAP)!',
      });
    }
  }

  // 4. RULE SỐ 4: KHEN NGỢI PHỐI ĐỒ GEN Z ĐỈNH CAO
  const isNguThan = outfit.mainTop.id === 'ngu_than_tay_chen';
  const hasSneaker = outfit.footwear.id === 'sneaker_chunky_retro';
  const hasKiengBac = outfit.accessory?.id === 'kieng_bac_hiphop';
  const hasBlazer = outfit.layer?.id === 'blazer_oversize';

  if (isNguThan && hasSneaker) {
    badges.push('Iconic Gen Z Streetwear');
    warnings.push({
      level: 'success',
      title: 'Phối đồ xuất sắc: Áo Ngũ Thân x Sneaker Chunky',
      message: 'Đây là công thức phối đồ biểu tượng của giới trẻ Việt Nam thế kỷ 21: vừa tôn trọng cấu trúc 5 thân 5 cúc cổ truyền, vừa thoải mái di chuyển năng động trên phố.',
      culturalContext: 'Các nhà nghiên cứu văn hóa đánh giá rất cao xu hướng này vì nó đưa cổ phục bước ra khỏi tủ kính bảo tàng để hòa vào nhịp sống thường nhật.',
    });
  }

  if (hasKiengBac) {
    badges.push('Điểm nhấn Kiềng Bạc');
  }

  if (isNguThan && hasBlazer) {
    badges.push('Smart Heritage Vibe');
  }

  // 5. ĐÁNH GIÁ SỰ PHÙ HỢP THEO BỐI CẢNH / SỰ KIỆN
  let suitabilityAppropriate = true;
  let suitabilityReason = 'Trang phục hài hòa với hoàn cảnh sử dụng.';

  if (selectedOccasion === 'school') {
    if (outfit.bottom.id === 'chan_vay_tennis_pleated' && isRoyalCeremonial) {
      suitabilityAppropriate = false;
      suitabilityReason = 'Đi học hoặc thuyết trình nên ưu tiên sự kín đáo, lịch thiệp của áo dài/ngũ thân phối quần suông hoặc jeans trơn.';
    } else {
      suitabilityReason = 'Trang phục rất sáng tạo và phù hợp cho các buổi thuyết trình văn hóa, ngày hội truyền thống tại trường!';
    }
  } else if (selectedOccasion === 'tet_festival' || selectedOccasion === 'wedding') {
    if (outfit.bottom.id === 'quan_jean_rach_ong_rong') {
      suitabilityAppropriate = false;
      suitabilityReason = 'Ngày Tết cổ truyền và đám cưới ưu tiên sự trang trọng, đĩnh đạc; quần jeans rách có thể chưa thật sự phù hợp với không khí gia đình.';
    } else {
      suitabilityReason = 'Rực rỡ, may mắn và ngập tràn tinh thần ngày hội non sông!';
    }
  } else if (selectedOccasion === 'prom_party') {
    suitabilityReason = 'Nổi bật giữa đám đông, khẳng định chất tôi Gen Z tự hào nguồn cội trong đêm dạ hội!';
  }

  // Final score clamping
  score = Math.max(20, Math.min(100, score));

  let status: CulturalCheckResult['status'] = 'passed';
  let title = 'Bộ Trang Phục Đạt Chuẩn Văn Hóa & Phong Cách';
  let summary = 'Sự kết hợp hài hòa giữa cấu trúc trang phục truyền thống và hơi thở thời trang hiện đại.';

  if (score < 60) {
    status = 'danger';
    title = 'Cần Điều Chỉnh: Có Yếu Tố Sai Lệch Văn Hóa';
    summary = 'Bộ trang phục vi phạm một số nguyên tắc bất di bất dịch của tiền nhân (đặc biệt là quy tắc cài vạt áo).';
  } else if (score < 85) {
    status = 'warning';
    title = 'Khá Ấn Tượng - Nên Lưu Ý Hoàn Cảnh';
    summary = 'Bộ đồ có nét phá cách độc đáo nhưng cần lưu ý chọn đúng không gian để không gây phản cảm.';
  }

  return {
    score,
    status,
    title,
    summary,
    warnings,
    culturalBadges: badges,
    suitabilityForOccasion: {
      occasion: selectedOccasion,
      isAppropriate: suitabilityAppropriate,
      reason: suitabilityReason,
    },
  };
}
