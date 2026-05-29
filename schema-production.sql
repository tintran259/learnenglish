-- ── Migration: Vocabulary → Word + UserVocabulary ────────────────────────────
-- Run this on Turso production shell (tables User/Account/UserSettings/DailyReview already exist)

-- Drop old Vocabulary table (data will be lost — expected, production is fresh)
DROP TABLE IF EXISTS "Vocabulary";

-- Global word data shared across all users
CREATE TABLE IF NOT EXISTS "Word" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "word" TEXT NOT NULL,
    "ipa" TEXT NOT NULL DEFAULT '',
    "audioUrl" TEXT NOT NULL DEFAULT '',
    "audioUrlUk" TEXT NOT NULL DEFAULT '',
    "examples" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "Word_word_key" ON "Word"("word");

-- Per-user vocabulary entry
CREATE TABLE IF NOT EXISTS "UserVocabulary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "userExamples" TEXT NOT NULL DEFAULT '',
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "correctCount" INTEGER NOT NULL DEFAULT 0,
    "lastReviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserVocabulary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserVocabulary_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "UserVocabulary_userId_wordId_key" ON "UserVocabulary"("userId", "wordId");
