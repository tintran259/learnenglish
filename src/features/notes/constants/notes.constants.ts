export const CATEGORIES = [
  { id: "grammar",    label: "Grammar",    color: "#ce82ff" },
  { id: "vocabulary", label: "Vocabulary", color: "#84cc16" },
  { id: "phrase",     label: "Phrase",     color: "#1cb0f6" },
  { id: "idiom",      label: "Idiom",      color: "#ff9600" },
  { id: "general",    label: "General",    color: "#ffc800" },
] as const;

export type CategoryId = typeof CATEGORIES[number]["id"];

export function getCategoryMeta(id: string) {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
