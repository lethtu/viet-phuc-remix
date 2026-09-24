export interface StoryChapter {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  timePeriod: string;
  quote: string;
  content: string[];
  keyHighlights: {
    term: string;
    definition: string;
  }[];
  accentColor: string;
  bgGradient: string;
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'giao_linh_tu_than',
    chapterNumber: 'CHƯƠNG I',
    title: 'Ngàn Năm Hồn Đất & Tơ Tằm',
    subtitle: 'Áo Giao Lĩnh & Áo Tứ Thân Kinh Bắc',
    timePeriod: 'Thế kỷ X - XIX (Lý - Trần - Lê & Dân Gian)',
    quote: '"Thắt lưng hoa đào, yếm lụa hoa sen, tà áo thướt tha hòa vào câu hát Quan họ ngọt ngào."',
    content: [
      'Trước khi có chiếc áo dài ngày nay, người Việt đã có hàng ngàn năm sáng tạo y phục mang bản sắc riêng biệt. Thời Lý - Trần - Lê, chiếc áo Giao Lĩnh với cổ áo vắt chéo sang bên phải thể hiện khí tiết đoan chính của những bậc hào kiệt Đại Việt.',
      'Dưới lũy tre làng Kinh Bắc, chiếc Áo Tứ Thân ra đời từ đôi bàn tay cần cù của phụ nữ đồng bằng châu thổ sông Hồng. Bốn vạt áo tượng trưng cho tứ thân phụ mẫu (cha mẹ đôi bên), chở che cho người mặc vượt qua bao thăng trầm.',
      'Tấm yếm đào e ấp, dải bao xanh thắt eo, nón quai thao nghiêng nghiêng trong ngày hội Lim... tất cả dệt nên một vẻ đẹp mộc mạc mà lắng đọng tâm hồn người Việt.'
    ],
    keyHighlights: [
      { term: 'Hữu Nhậm', definition: 'Quy tắc cài vạt áo sang bên phải, tượng trưng cho trật tự vũ trụ và sự đoan chính của người Đại Việt.' },
      { term: 'Yếm Đào', definition: 'Nội y truyền thống bằng lụa tơ tằm, vừa nâng niu cơ thể vừa là điểm nhấn màu sắc rạng ngời.' },
      { term: 'Tứ Thân Phụ Mẫu', definition: 'Bốn vạt áo mang triết lý đạo hiếu: hai vạt sau là cha mẹ ruột, hai vạt trước là cha mẹ bên nhà chồng.' }
    ],
    accentColor: '#2d6a4f',
    bgGradient: 'from-emerald-950/40 via-stone-900/30 to-black',
  },
  {
    id: 'ngu_than_cai_cach',
    chapterNumber: 'CHƯƠNG II',
    title: 'Đại Cải Cách 1744 & 1836',
    subtitle: 'Áo Ngũ Thân - Cột Mốc Định Hình Quốc Phục',
    timePeriod: 'Triều Nguyễn (Chúa Nguyễn Phúc Khoát & Vua Minh Mạng)',
    quote: '"Năm thân áo chở che người nhỏ bé, năm chiếc cúc gói trọn đạo làm người."',
    content: [
      'Năm 1744, Võ Vương Nguyễn Phúc Khoát thực hiện cuộc đại cải cách trang phục tại xứ Đàng Trong để phân định rõ ràng y quan của người Việt. Đến năm 1836, Hoàng đế Minh Mạng chính thức ban chiếu thống nhất toàn bộ trang phục Bắc - Nam theo mẫu Áo Ngũ Thân.',
      'Chiếc áo Ngũ Thân không đơn thuần là quần áo mặc hằng ngày, mà là một công trình triết học: 5 thân áo gồm 4 vạt ngoài che chở cho 1 thân áo con kín đáo bên trong (biểu thị tình phụ mẫu ôm ấp con cái).',
      'Đặc biệt, 5 chiếc cúc áo cài chéo từ cổ xuống nách tượng trưng cho Ngũ Thường của đạo Nho: NHÂN - LỄ - NGHĨA - TRÍ - TÍN. Mặc chiếc áo lên người là tự nhắc nhở bản thân sống có đạo đức và nhân cách cao đẹp.'
    ],
    keyHighlights: [
      { term: '5 Thân Áo', definition: '4 thân ngoài may ghép biểu thị cha mẹ, thân con thứ 5 nằm bên trong thể hiện sự che chở bao bọc.' },
      { term: '5 Cúc Ngũ Thường', definition: 'Nhân (tình người), Lễ (phép tắc), Nghĩa (chính nghĩa), Trí (trí tuệ), Tín (chữ tín danh dự).' },
      { term: 'Cổ Lập Lĩnh', definition: 'Cổ đứng vuông góc kín đáo, ôm lấy cổ tôn lên tư thế thẳng thắn, trang nghiêm của người mặc.' }
    ],
    accentColor: '#1e3d59',
    bgGradient: 'from-blue-950/40 via-stone-900/30 to-black',
  },
  {
    id: 'cung_dinh_sac_toc',
    chapterNumber: 'CHƯƠNG III',
    title: 'Sắc Phục Cung Đình Vàng Son',
    subtitle: 'Áo Tấc & Nhật Bình Hoàng Triều',
    timePeriod: 'Cố Đô Huế (Thế kỷ XIX - XX)',
    quote: '"Dải cổ viền ngũ sắc tượng trưng ngũ hành, sóng nước vỗ quanh bờ cõi thái bình."',
    content: [
      'Tại chốn cung đình Huế trầm mặc, y phục đạt đến đỉnh cao của sự tinh xảo và nghi lễ. Áo Tấc (áo thụng) với tay áo rộng thênh thang buông dài quá bàn tay, là lễ phục cho vua quan, sĩ tử và các cặp đôi trong ngày cưới.',
      'Dành riêng cho Hoàng hậu, Công chúa và Cung tần là chiếc Áo Nhật Bình danh giá. Áo có dải cổ hình chữ nhật trước ngực, viền 5 dải màu rực rỡ tượng trưng cho Ngũ Hành (Kim, Mộc, Thủy, Hỏa, Thổ) giữ trật tự đất trời.',
      'Dưới gấu áo Nhật Bình là dải hoa văn Thủy Ba (sóng nước cuộn trào) điểm xuyết kim tuyến, biểu trưng cho sự vững bền của giang sơn non nước Đại Nam.'
    ],
    keyHighlights: [
      { term: 'Viền Cổ Nhật Bình', definition: 'Hình chữ nhật đặc trưng thêu phượng và dải ngũ sắc cân đối, kiêu sa.' },
      { term: 'Dải Ngũ Sắc Thủy Ba', definition: 'Hoa văn sóng nước cuộn trào ở chân tà áo và cổ tay, tượng trưng cho biển trời trường tồn.' },
      { term: 'Áo Tấc (Áo Thụng)', definition: 'Tay áo rộng đúng 1 tấc cổ, khi chấp tay tạo nên phong thái cung kính trang nghiêm tuyệt đối.' }
    ],
    accentColor: '#d4af37',
    bgGradient: 'from-amber-950/40 via-stone-900/30 to-black',
  },
  {
    id: 'tan_thoi_lemur',
    chapterNumber: 'CHƯƠNG IV',
    title: 'Gió Mới Đầu Thế Kỷ XX',
    subtitle: 'Cuộc Cách Tân Lemur & Áo Dài Hiện Đại',
    timePeriod: 'Thập niên 1930 - Đương đại',
    quote: '"Khi tư tưởng phương Tây gặp gỡ nét duyên phương Đông: Tà áo dài thanh thoát ra đời."',
    content: [
      'Vào thập niên 1930, nhóm Tự Lực Văn Đoàn và họa sĩ Cát Tường (Lemur) cùng Lê Phổ đã thực hiện cuộc cách tân táo bạo: thu hẹp phom dáng áo ngũ thân rộng rãi thành chiếc áo dài ôm sát eo, tôn vinh đường cong tự nhiên của phụ nữ.',
      'Từ áo dài Lemur tay phồng cổ lá sen, đến áo dài Lê Phổ kín đáo thắt đáy lưng ong, rồi áo dài Trần Lệ Xuân cổ thuyền thập niên 1960... chiếc áo dài không ngừng biến đổi để theo kịp nhịp sống thời đại.',
      'Áo dài vượt qua ranh giới y phục dân tộc để trở thành biểu tượng đại sứ văn hóa của Việt Nam trên trường quốc tế.'
    ],
    keyHighlights: [
      { term: 'Áo dài Lemur (1934)', definition: 'Cải cách mang tính bước ngoặt của họa sĩ Cát Tường đưa yếu tố thẩm mỹ hiện đại vào cổ phục.' },
      { term: 'Áo dài Lê Phổ (1939)', definition: 'Sự dung hòa giữa nét mới mẻ của Lemur và sự kín đáo đoan trang của ngũ thân truyền thống.' },
      { term: 'Di Sản Sống', definition: 'Không bị đóng băng trong quá khứ, áo dài luôn thở cùng nhịp điệu của thời đại.' }
    ],
    accentColor: '#9b1b30',
    bgGradient: 'from-rose-950/40 via-stone-900/30 to-black',
  },
  {
    id: 'genz_remix_2026',
    chapterNumber: 'CHƯƠNG V',
    title: 'Việt Phục Remix: Nhịp Thở Gen Z',
    subtitle: 'Di Sản Trong Không Gian Sáng Tạo Đương Đại',
    timePeriod: 'Kỷ nguyên 2026+',
    quote: '"Kế thừa chứ không bắt chước nguyên xi. Mang di sản bước xuống phố cùng sneaker và tai nghe lofi."',
    content: [
      'Năm 2026 đánh dấu sự bùng nổ mạnh mẽ nhất của trào lưu Cổ phục trong cộng đồng người trẻ. Gen Z không còn nhìn cổ phục như món đồ cất kỹ trong tủ kính, mà tự tin mặc áo ngũ thân đi học, mặc áo tấc dự prom, mặc áo dài cách tân đi cà phê cuối tuần.',
      'Gen Z phối áo ngũ thân với giày Sneaker Chunky để thoải mái chạy xe bus, khoác Blazer oversize ra dáng sinh viên quốc tế, đeo kiềng bạc phối mắt xích Cuban hip-hop cực ngầu, hay thậm chí phối kính râm Cyberpunk Neon bí ẩn.',
      'Nhưng điều quan trọng nhất: Gen Z remix một cách có kiến thức! Biết tôn trọng vạt Hữu Nhậm, biết giữ gìn sự trang nghiêm của áo lễ, và thấu hiểu ý nghĩa 5 cúc Ngũ Thường để vừa sành điệu vừa tự hào dân tộc.'
    ],
    keyHighlights: [
      { term: 'Everyday Heritage', definition: 'Cổ phục trở thành phong cách thời trang thường nhật, gần gũi và ứng dụng cao.' },
      { term: 'Tôn Trọng Giá Trị Cốt Lõi', definition: 'Thỏa sức sáng tạo phụ kiện nhưng giữ nguyên cấu trúc chuẩn mực và tránh xa các cấm kỵ văn hóa.' },
      { term: 'Tự Hào Bản Sắc', definition: 'Lời tuyên ngôn độc đáo của thế hệ trẻ Việt Nam trước bạn bè năm châu bốn biển.' }
    ],
    accentColor: '#ff2a85',
    bgGradient: 'from-fuchsia-950/40 via-stone-900/30 to-black',
  },
];
