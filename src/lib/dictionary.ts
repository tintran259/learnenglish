interface DictionaryPhonetic {
  text?: string;
  audio?: string;
}

interface DictionaryDefinition {
  definition: string;
  example?: string;
}

interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
}

interface DictionaryEntry {
  phonetics: DictionaryPhonetic[];
  meanings: DictionaryMeaning[];
}

export interface DictionaryResult {
  ipa: string;
  audioUrl: string;
  audioUrlUk: string;
  examples: string[];
}

export async function fetchDictionaryData(word: string): Promise<DictionaryResult> {
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

    let ipa = "";
    let audioUrl = "";
    let audioUrlUk = "";

    for (const phonetic of entry.phonetics) {
      if (!ipa && phonetic.text) ipa = phonetic.text;
      const audio = phonetic.audio ?? "";
      if (!audio) continue;
      if (!audioUrl && audio.includes("-us.")) audioUrl = audio;
      if (!audioUrlUk && (audio.includes("-gb.") || audio.includes("-uk."))) audioUrlUk = audio;
    }
    // fallback: use first available audio as US
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
