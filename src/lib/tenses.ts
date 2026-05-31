export type TenseGroup = "present" | "past" | "future";

export interface Tense {
  id: string;
  name: string;
  nameEn: string;
  group: TenseGroup;
  color: string;
  structure: string;
  negative: string;
  question: string;
  usage: string[];
  signals: string[];
  examples: { en: string; vi: string }[];
}

export const tenses: Tense[] = [
  // ── PRESENT ────────────────────────────────────────────────────────────────
  {
    id: "simple-present",
    name: "Hiện tại đơn",
    nameEn: "Simple Present",
    group: "present",
    color: "#58cc02",
    structure: "S + V(s/es) + O",
    negative: "S + do/does + not + V + O",
    question: "Do/Does + S + V + O?",
    usage: [
      "Sự thật hiển nhiên, quy luật tự nhiên",
      "Thói quen, hành động lặp đi lặp lại",
      "Lịch trình, thời gian biểu cố định",
    ],
    signals: ["always", "usually", "often", "sometimes", "never", "every day/week/month"],
    examples: [
      { en: "She drinks coffee every morning.", vi: "Cô ấy uống cà phê mỗi sáng." },
      { en: "The sun rises in the east.", vi: "Mặt trời mọc ở phía đông." },
      { en: "He doesn't like spicy food.", vi: "Anh ấy không thích đồ ăn cay." },
    ],
  },
  {
    id: "present-continuous",
    name: "Hiện tại tiếp diễn",
    nameEn: "Present Continuous",
    group: "present",
    color: "#1cb0f6",
    structure: "S + am/is/are + V-ing + O",
    negative: "S + am/is/are + not + V-ing + O",
    question: "Am/Is/Are + S + V-ing + O?",
    usage: [
      "Hành động đang xảy ra tại thời điểm nói",
      "Kế hoạch đã sắp xếp trong tương lai gần",
      "Xu hướng hoặc sự thay đổi đang diễn ra",
    ],
    signals: ["now", "right now", "at the moment", "at present", "currently", "Look!", "Listen!"],
    examples: [
      { en: "I am studying English right now.", vi: "Tôi đang học tiếng Anh ngay lúc này." },
      { en: "They are playing football in the park.", vi: "Họ đang chơi bóng đá trong công viên." },
      { en: "She is meeting her boss tomorrow.", vi: "Cô ấy sẽ gặp sếp vào ngày mai (đã lên kế hoạch)." },
    ],
  },
  {
    id: "present-perfect",
    name: "Hiện tại hoàn thành",
    nameEn: "Present Perfect",
    group: "present",
    color: "#ffc800",
    structure: "S + have/has + V3/ed + O",
    negative: "S + have/has + not + V3/ed + O",
    question: "Have/Has + S + V3/ed + O?",
    usage: [
      "Hành động xảy ra trong quá khứ nhưng ảnh hưởng đến hiện tại",
      "Trải nghiệm trong cuộc đời (không rõ thời điểm)",
      "Hành động vừa mới xảy ra xong",
    ],
    signals: ["already", "yet", "just", "ever", "never", "recently", "lately", "since", "for", "so far"],
    examples: [
      { en: "I have just finished my homework.", vi: "Tôi vừa mới làm xong bài tập." },
      { en: "She has lived in Hanoi for 5 years.", vi: "Cô ấy đã sống ở Hà Nội được 5 năm." },
      { en: "Have you ever been to Japan?", vi: "Bạn đã từng đến Nhật Bản chưa?" },
    ],
  },
  {
    id: "present-perfect-continuous",
    name: "Hiện tại hoàn thành tiếp diễn",
    nameEn: "Present Perfect Continuous",
    group: "present",
    color: "#ff9600",
    structure: "S + have/has + been + V-ing + O",
    negative: "S + have/has + not + been + V-ing + O",
    question: "Have/Has + S + been + V-ing + O?",
    usage: [
      "Hành động bắt đầu trong quá khứ và vẫn đang tiếp tục",
      "Nhấn mạnh tính liên tục, chưa hoàn thành",
      "Giải thích nguyên nhân của trạng thái hiện tại",
    ],
    signals: ["for", "since", "all day/morning/week", "lately", "recently"],
    examples: [
      { en: "I have been working here for 3 years.", vi: "Tôi đã làm việc ở đây được 3 năm (và vẫn đang làm)." },
      { en: "She has been crying — her eyes are red.", vi: "Cô ấy đã khóc — mắt cô ấy đỏ hoe." },
      { en: "They have been waiting for 2 hours.", vi: "Họ đã chờ được 2 tiếng rồi." },
    ],
  },

  // ── PAST ───────────────────────────────────────────────────────────────────
  {
    id: "simple-past",
    name: "Quá khứ đơn",
    nameEn: "Simple Past",
    group: "past",
    color: "#ff4b4b",
    structure: "S + V2/ed + O",
    negative: "S + did + not + V + O",
    question: "Did + S + V + O?",
    usage: [
      "Hành động đã xảy ra và kết thúc trong quá khứ",
      "Chuỗi hành động xảy ra liên tiếp trong quá khứ",
      "Thói quen trong quá khứ (không còn nữa)",
    ],
    signals: ["yesterday", "ago", "last (week/month/year)", "in + năm quá khứ", "when", "at that time"],
    examples: [
      { en: "She visited Paris last summer.", vi: "Cô ấy đã thăm Paris hè năm ngoái." },
      { en: "I woke up, had breakfast, and went to work.", vi: "Tôi thức dậy, ăn sáng rồi đi làm." },
      { en: "Did you call me yesterday?", vi: "Hôm qua bạn có gọi cho tôi không?" },
    ],
  },
  {
    id: "past-continuous",
    name: "Quá khứ tiếp diễn",
    nameEn: "Past Continuous",
    group: "past",
    color: "#ce82ff",
    structure: "S + was/were + V-ing + O",
    negative: "S + was/were + not + V-ing + O",
    question: "Was/Were + S + V-ing + O?",
    usage: [
      "Hành động đang xảy ra tại một thời điểm xác định trong quá khứ",
      "Hành động đang diễn ra thì bị hành động khác chen vào (with Simple Past)",
      "Hai hành động song song trong quá khứ",
    ],
    signals: ["at + giờ + yesterday", "at that time", "when", "while", "as"],
    examples: [
      { en: "I was watching TV at 8 pm yesterday.", vi: "Tôi đang xem TV lúc 8 giờ tối hôm qua." },
      { en: "She was cooking when I arrived.", vi: "Cô ấy đang nấu ăn khi tôi đến." },
      { en: "While he was sleeping, the phone rang.", vi: "Trong khi anh ấy đang ngủ, điện thoại reo." },
    ],
  },
  {
    id: "past-perfect",
    name: "Quá khứ hoàn thành",
    nameEn: "Past Perfect",
    group: "past",
    color: "#58cc02",
    structure: "S + had + V3/ed + O",
    negative: "S + had + not + V3/ed + O",
    question: "Had + S + V3/ed + O?",
    usage: [
      "Hành động xảy ra trước một hành động khác trong quá khứ",
      "Điều kiện loại 3 (If clause type 3)",
      "Diễn đạt ước muốn về quá khứ",
    ],
    signals: ["before", "after", "by the time", "when", "already", "never", "by + thời điểm quá khứ"],
    examples: [
      { en: "She had left before he arrived.", vi: "Cô ấy đã đi trước khi anh ấy đến." },
      { en: "I had never seen snow before I went to Canada.", vi: "Tôi chưa bao giờ thấy tuyết trước khi đến Canada." },
      { en: "By 9 pm, they had finished dinner.", vi: "Trước 9 giờ tối, họ đã ăn tối xong." },
    ],
  },
  {
    id: "past-perfect-continuous",
    name: "Quá khứ hoàn thành tiếp diễn",
    nameEn: "Past Perfect Continuous",
    group: "past",
    color: "#1cb0f6",
    structure: "S + had + been + V-ing + O",
    negative: "S + had + not + been + V-ing + O",
    question: "Had + S + been + V-ing + O?",
    usage: [
      "Hành động kéo dài liên tục cho đến một thời điểm trong quá khứ",
      "Nhấn mạnh tính liên tục trước một sự kiện quá khứ",
      "Giải thích nguyên nhân của một sự kiện quá khứ",
    ],
    signals: ["for", "since", "before", "when", "all day/morning/week (at a past point)"],
    examples: [
      { en: "She had been working for 10 hours when she fainted.", vi: "Cô ấy đã làm việc 10 tiếng khi cô ấy ngất." },
      { en: "They had been arguing for an hour before she left.", vi: "Họ đã cãi nhau một tiếng trước khi cô ấy bỏ đi." },
      { en: "He was tired because he had been running.", vi: "Anh ấy mệt vì đã chạy liên tục." },
    ],
  },

  // ── FUTURE ─────────────────────────────────────────────────────────────────
  {
    id: "simple-future",
    name: "Tương lai đơn",
    nameEn: "Simple Future",
    group: "future",
    color: "#ff9600",
    structure: "S + will + V + O",
    negative: "S + will + not + V + O",
    question: "Will + S + V + O?",
    usage: [
      "Quyết định được đưa ra ngay tại thời điểm nói",
      "Dự đoán về tương lai (không có bằng chứng rõ ràng)",
      "Lời hứa, đề nghị, đe dọa",
    ],
    signals: ["tomorrow", "next (week/month/year)", "in the future", "soon", "I think/believe/hope"],
    examples: [
      { en: "I will call you tomorrow.", vi: "Tôi sẽ gọi cho bạn vào ngày mai." },
      { en: "It will rain this afternoon, I think.", vi: "Tôi nghĩ chiều nay trời sẽ mưa." },
      { en: "Will you help me with this?", vi: "Bạn có giúp tôi chuyện này không?" },
    ],
  },
  {
    id: "be-going-to",
    name: "Tương lai gần (be going to)",
    nameEn: "Be Going To",
    group: "future",
    color: "#ff4b4b",
    structure: "S + am/is/are + going to + V + O",
    negative: "S + am/is/are + not + going to + V + O",
    question: "Am/Is/Are + S + going to + V + O?",
    usage: [
      "Kế hoạch, ý định đã được quyết định từ trước",
      "Dự đoán dựa trên bằng chứng hiện tại",
    ],
    signals: ["tomorrow", "next...", "soon", "tonight", "(bằng chứng hiện tại rõ ràng)"],
    examples: [
      { en: "I am going to visit my parents this weekend.", vi: "Tôi dự định thăm bố mẹ cuối tuần này." },
      { en: "Look at those clouds — it's going to rain!", vi: "Nhìn những đám mây kia — trời sắp mưa rồi!" },
      { en: "She is going to have a baby.", vi: "Cô ấy sắp sinh em bé." },
    ],
  },
  {
    id: "future-continuous",
    name: "Tương lai tiếp diễn",
    nameEn: "Future Continuous",
    group: "future",
    color: "#ce82ff",
    structure: "S + will + be + V-ing + O",
    negative: "S + will + not + be + V-ing + O",
    question: "Will + S + be + V-ing + O?",
    usage: [
      "Hành động đang xảy ra tại một thời điểm xác định trong tương lai",
      "Hành động chắc chắn sẽ xảy ra theo kế hoạch",
    ],
    signals: ["at + giờ + tomorrow/next...", "this time tomorrow", "in + thời gian"],
    examples: [
      { en: "I will be sleeping at midnight.", vi: "Lúc nửa đêm tôi sẽ đang ngủ." },
      { en: "This time tomorrow, she will be flying to London.", vi: "Giờ này ngày mai, cô ấy sẽ đang bay đến London." },
      { en: "Will you be using the car tonight?", vi: "Tối nay bạn có dùng xe không?" },
    ],
  },
  {
    id: "future-perfect",
    name: "Tương lai hoàn thành",
    nameEn: "Future Perfect",
    group: "future",
    color: "#ffc800",
    structure: "S + will + have + V3/ed + O",
    negative: "S + will + not + have + V3/ed + O",
    question: "Will + S + have + V3/ed + O?",
    usage: [
      "Hành động sẽ hoàn thành trước một thời điểm hoặc hành động khác trong tương lai",
    ],
    signals: ["by + thời điểm tương lai", "before", "by the time"],
    examples: [
      { en: "By 2030, he will have graduated.", vi: "Trước năm 2030, anh ấy sẽ đã tốt nghiệp." },
      { en: "I will have finished the report by Monday.", vi: "Tôi sẽ hoàn thành báo cáo trước thứ Hai." },
      { en: "Will you have left by the time I arrive?", vi: "Bạn sẽ đi trước khi tôi đến chứ?" },
    ],
  },
];

export const groups: { key: TenseGroup; label: string; emoji: string }[] = [
  { key: "present", label: "Hiện tại", emoji: "🟢" },
  { key: "past", label: "Quá khứ", emoji: "🔴" },
  { key: "future", label: "Tương lai", emoji: "🟡" },
];
