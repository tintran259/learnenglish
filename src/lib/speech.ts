"use client";

export function speakWord(
  word: string,
  locale: "en-US" | "en-GB" = "en-US",
  rate = 0.85
) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = locale;
  utterance.rate = rate;
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();

  if (locale === "en-GB") {
    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith("en-GB") &&
          (v.name.includes("Google") ||
            v.name.includes("Microsoft") ||
            v.name.includes("Daniel") ||
            v.name.includes("Kate") ||
            v.name.includes("Serena"))
      ) ?? voices.find((v) => v.lang.startsWith("en-GB"));
    if (preferred) utterance.voice = preferred;
  } else {
    const preferred =
      voices.find(
        (v) =>
          v.lang.startsWith("en-US") &&
          (v.name.includes("Google") ||
            v.name.includes("Microsoft") ||
            v.name.includes("Samantha") ||
            v.name.includes("Karen") ||
            v.name.includes("Zira"))
      ) ??
      voices.find((v) => v.lang.startsWith("en-US")) ??
      voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utterance.voice = preferred;
  }

  window.speechSynthesis.speak(utterance);
}
