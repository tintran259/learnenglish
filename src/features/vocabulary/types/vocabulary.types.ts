export interface VocabularyWord {
  id: string;
  wordId: string;
  word: string;
  meaning: string;
  ipa: string;
  audioUrl: string;
  audioUrlUk: string;
  examples: string;
  userExamples: string;
  reviewCount: number;
  correctCount: number;
  lastReviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VocabularyFormState {
  success: boolean;
  message: string;
}

export interface VocabularyPageResult {
  words: VocabularyWord[];
  total: number;
  totalPages: number;
}

export interface VocabularyStats {
  total: number;
  reviewed: number;
  accuracy: number;
  totalReviews: number;
}
