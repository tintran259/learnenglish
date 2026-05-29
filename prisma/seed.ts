import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaLibSql({
  url: process.env.TURSO_DATABASE_URL ?? "file:./dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN || undefined,
});
const db = new PrismaClient({ adapter });

const words = [
  { word: "abundant", meaning: "có rất nhiều, dồi dào" },
  { word: "accurate", meaning: "chính xác, đúng đắn" },
  { word: "achieve", meaning: "đạt được, hoàn thành" },
  { word: "adapt", meaning: "thích nghi, điều chỉnh" },
  { word: "adequate", meaning: "đủ, thỏa đáng" },
  { word: "admit", meaning: "thừa nhận, nhận vào" },
  { word: "adopt", meaning: "chấp nhận, nhận nuôi" },
  { word: "advantage", meaning: "lợi thế, ưu điểm" },
  { word: "affect", meaning: "ảnh hưởng đến" },
  { word: "afford", meaning: "có đủ tiền để mua, có thể làm được" },
  { word: "aggressive", meaning: "hung hăng, tích cực (theo hướng mạnh mẽ)" },
  { word: "ambitious", meaning: "đầy tham vọng, có hoài bão" },
  { word: "analyze", meaning: "phân tích" },
  { word: "annoying", meaning: "gây khó chịu, phiền phức" },
  { word: "anxiety", meaning: "lo lắng, lo âu" },
  { word: "apparent", meaning: "rõ ràng, hiển nhiên" },
  { word: "appreciate", meaning: "đánh giá cao, biết ơn" },
  { word: "approach", meaning: "tiếp cận, phương pháp" },
  { word: "appropriate", meaning: "phù hợp, thích hợp" },
  { word: "argue", meaning: "tranh luận, lập luận" },
  { word: "assume", meaning: "giả định, cho là" },
  { word: "attempt", meaning: "cố gắng, nỗ lực" },
  { word: "attitude", meaning: "thái độ, quan điểm" },
  { word: "aware", meaning: "nhận thức được, ý thức được" },
  { word: "balance", meaning: "cân bằng, sự cân đối" },
  { word: "benefit", meaning: "lợi ích, được lợi" },
  { word: "blame", meaning: "đổ lỗi, trách móc" },
  { word: "brave", meaning: "dũng cảm, gan dạ" },
  { word: "brief", meaning: "ngắn gọn, súc tích" },
  { word: "burden", meaning: "gánh nặng, gánh vác" },
  { word: "capable", meaning: "có khả năng, có năng lực" },
  { word: "capture", meaning: "bắt giữ, nắm bắt" },
  { word: "challenge", meaning: "thách thức, thử thách" },
  { word: "clarify", meaning: "làm rõ, giải thích" },
  { word: "collapse", meaning: "sụp đổ, ngã xuống" },
  { word: "combine", meaning: "kết hợp, phối hợp" },
  { word: "commit", meaning: "cam kết, thực hiện" },
  { word: "competent", meaning: "có năng lực, thành thạo" },
  { word: "complex", meaning: "phức tạp, phức hợp" },
  { word: "concern", meaning: "lo ngại, quan tâm" },
  { word: "confident", meaning: "tự tin, chắc chắn" },
  { word: "conflict", meaning: "xung đột, mâu thuẫn" },
  { word: "conscious", meaning: "có ý thức, nhận thức được" },
  { word: "consistent", meaning: "nhất quán, kiên định" },
  { word: "contribute", meaning: "đóng góp, góp phần" },
  { word: "convenient", meaning: "tiện lợi, thuận tiện" },
  { word: "convince", meaning: "thuyết phục, làm cho tin" },
  { word: "courage", meaning: "can đảm, lòng dũng cảm" },
  { word: "creative", meaning: "sáng tạo, có óc sáng tạo" },
  { word: "crucial", meaning: "quan trọng, then chốt" },
  { word: "curious", meaning: "tò mò, hiếu kỳ" },
  { word: "decline", meaning: "từ chối, suy giảm" },
  { word: "dedicate", meaning: "cống hiến, dành tặng" },
  { word: "delay", meaning: "trì hoãn, chậm trễ" },
  { word: "demand", meaning: "yêu cầu, đòi hỏi" },
  { word: "deny", meaning: "phủ nhận, từ chối" },
  { word: "describe", meaning: "mô tả, miêu tả" },
  { word: "deserve", meaning: "xứng đáng, đáng được" },
  { word: "determine", meaning: "xác định, quyết tâm" },
  { word: "discipline", meaning: "kỷ luật, ngành học" },
  { word: "diverse", meaning: "đa dạng, phong phú" },
  { word: "effective", meaning: "hiệu quả, có tác dụng" },
  { word: "efficient", meaning: "hiệu quả (về mặt năng suất)" },
  { word: "emerge", meaning: "xuất hiện, nổi lên" },
  { word: "emphasize", meaning: "nhấn mạnh, đề cao" },
  { word: "enable", meaning: "cho phép, tạo điều kiện" },
  { word: "encourage", meaning: "khuyến khích, động viên" },
  { word: "enhance", meaning: "nâng cao, cải thiện" },
  { word: "enormous", meaning: "khổng lồ, rất lớn" },
  { word: "essential", meaning: "thiết yếu, cần thiết" },
  { word: "evaluate", meaning: "đánh giá, xem xét" },
  { word: "evidence", meaning: "bằng chứng, chứng cứ" },
  { word: "examine", meaning: "kiểm tra, xem xét kỹ" },
  { word: "expand", meaning: "mở rộng, phát triển" },
  { word: "expect", meaning: "mong đợi, kỳ vọng" },
  { word: "experience", meaning: "kinh nghiệm, trải nghiệm" },
  { word: "explicit", meaning: "rõ ràng, tường minh" },
  { word: "expose", meaning: "phơi bày, tiếp xúc" },
  { word: "express", meaning: "diễn đạt, bày tỏ" },
  { word: "flexible", meaning: "linh hoạt, dẻo dai" },
  { word: "focus", meaning: "tập trung, trọng tâm" },
  { word: "generate", meaning: "tạo ra, sinh ra" },
  { word: "genuine", meaning: "thật sự, chân thành" },
  { word: "gradual", meaning: "dần dần, từng bước" },
  { word: "identify", meaning: "nhận dạng, xác định" },
  { word: "impact", meaning: "tác động, ảnh hưởng" },
  { word: "implement", meaning: "thực hiện, triển khai" },
  { word: "imply", meaning: "ngụ ý, ám chỉ" },
  { word: "improve", meaning: "cải thiện, tiến bộ" },
  { word: "indicate", meaning: "chỉ ra, cho thấy" },
  { word: "influence", meaning: "ảnh hưởng, tác động" },
  { word: "involve", meaning: "liên quan, bao gồm" },
  { word: "maintain", meaning: "duy trì, bảo trì" },
  { word: "massive", meaning: "khổng lồ, đồ sộ" },
  { word: "mention", meaning: "đề cập, nhắc đến" },
  { word: "motivate", meaning: "thúc đẩy, tạo động lực" },
  { word: "obvious", meaning: "rõ ràng, hiển nhiên" },
  { word: "overcome", meaning: "vượt qua, khắc phục" },
  { word: "potential", meaning: "tiềm năng, tiềm lực" },
  { word: "persist", meaning: "kiên trì, tiếp tục duy trì" },
];

async function main() {
  // Usage: SEED_USER_ID=<userId> npx tsx prisma/seed.ts
  const userId = process.env.SEED_USER_ID;
  if (!userId) {
    console.error("Error: set SEED_USER_ID env var to your user ID (find it in Prisma Studio).");
    process.exit(1);
  }

  console.log(`Seeding 100 words for user ${userId}…`);
  let created = 0;
  let skipped = 0;

  for (const { word, meaning } of words) {
    try {
      // Upsert global Word, then create per-user entry
      const wordRecord = await db.word.upsert({
        where: { word },
        create: { word },
        update: {},
      });
      await db.userVocabulary.create({
        data: { userId, wordId: wordRecord.id, meaning },
      });
      created++;
    } catch {
      skipped++;
    }
  }

  console.log(`Done — ${created} created, ${skipped} skipped (duplicates).`);
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
