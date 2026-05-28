import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Learn Vocabulary — Personal Vocabulary Trainer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#111827",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial Black, Arial, sans-serif",
        }}
      >
        {/* Logo */}
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "#58cc02",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            marginBottom: 32,
            boxShadow: "0 8px 0 #46a302",
          }}
        >
          L
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "white",
            letterSpacing: "-2px",
            marginBottom: 16,
          }}
        >
          Learn Vocabulary
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 28,
            color: "#9ca3af",
            fontWeight: 400,
            marginBottom: 48,
          }}
        >
          Your personal vocabulary trainer
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 16 }}>
          {["📚 Add words", "🔊 Audio IPA", "🎯 Flashcards", "🔥 Streak"].map(
            (feat) => (
              <div
                key={feat}
                style={{
                  background: "#1f2937",
                  border: "2px solid #374151",
                  borderRadius: 999,
                  padding: "10px 20px",
                  fontSize: 22,
                  color: "#e5e7eb",
                  fontWeight: 700,
                }}
              >
                {feat}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
