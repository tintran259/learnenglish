interface DictionaryPhonetic { text?: string; audio?: string }
interface DictionaryDefinition { definition: string; example?: string }
interface DictionaryMeaning { partOfSpeech: string; definitions: DictionaryDefinition[] }
interface DictionaryEntry { phonetics: DictionaryPhonetic[]; meanings: DictionaryMeaning[] }

interface DictionaryResult {
  ipa: string;
  audioUrl: string;
  audioUrlUk: string;
  examples: string[];
}

async function fetchDictionaryData(word: string): Promise<DictionaryResult> {
  const empty: DictionaryResult = { ipa: "", audioUrl: "", audioUrlUk: "", examples: [] };
  try {
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim())}`,
      { cache: "no-store" }
    );
    if (!res.ok) return empty;
    const data: DictionaryEntry[] = await res.json();
    const entry = data[0];
    if (!entry) return empty;

    let ipa = "", audioUrl = "", audioUrlUk = "";
    for (const phonetic of entry.phonetics) {
      if (!ipa && phonetic.text) ipa = phonetic.text;
      const audio = phonetic.audio ?? "";
      if (!audio) continue;
      if (!audioUrl && audio.includes("-us.")) audioUrl = audio;
      if (!audioUrlUk && (audio.includes("-gb.") || audio.includes("-uk."))) audioUrlUk = audio;
    }
    if (!audioUrl) {
      for (const phonetic of entry.phonetics) {
        if (phonetic.audio) { audioUrl = phonetic.audio; break; }
      }
    }

    const examples: string[] = [];
    for (const meaning of entry.meanings ?? []) {
      for (const def of meaning.definitions) {
        if (def.example && !examples.includes(def.example)) {
          examples.push(def.example);
          if (examples.length >= 3) break;
        }
      }
      if (examples.length >= 3) break;
    }

    return { ipa, audioUrl, audioUrlUk, examples };
  } catch {
    return empty;
  }
}

export async function fetchDict(word: string): Promise<DictionaryResult> {
  const data = await fetchDictionaryData(word);
  if (data.ipa || data.audioUrl) return data;

  if (word.includes(" ")) {
    const parts = word.trim().split(/\s+/);
    const results = await Promise.all(parts.map((w) => fetchDictionaryData(w)));
    const combinedIpa = results.map((r) => r.ipa).filter(Boolean).join(" ");
    const firstWithAudio = results.find((r) => r.audioUrl);
    return {
      ipa: combinedIpa,
      audioUrl: firstWithAudio?.audioUrl ?? "",
      audioUrlUk: firstWithAudio?.audioUrlUk ?? "",
      examples: [],
    };
  }

  return data;
}
