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
  examples: { en: string; note: string }[];
}

export const tenses: Tense[] = [
  // ── PRESENT ────────────────────────────────────────────────────────────────
  {
    id: "simple-present",
    name: "Simple Present",
    nameEn: "Present Simple",
    group: "present",
    color: "#58cc02",
    structure: "S + V(s/es) + O",
    negative: "S + do/does + not + V + O",
    question: "Do/Does + S + V + O?",
    usage: [
      "Facts, general truths, and natural laws",
      "Habits and repeated actions",
      "Fixed schedules and timetables",
    ],
    signals: ["always", "usually", "often", "sometimes", "never", "every day/week/month", "on Mondays"],
    examples: [
      { en: "She drinks coffee every morning.", note: "Daily habit" },
      { en: "The sun rises in the east.", note: "Natural fact" },
      { en: "He doesn't like spicy food.", note: "General preference" },
    ],
  },
  {
    id: "present-continuous",
    name: "Present Continuous",
    nameEn: "Present Progressive",
    group: "present",
    color: "#1cb0f6",
    structure: "S + am/is/are + V-ing + O",
    negative: "S + am/is/are + not + V-ing + O",
    question: "Am/Is/Are + S + V-ing + O?",
    usage: [
      "Actions happening right now, at this moment",
      "Planned future arrangements (near future)",
      "Ongoing trends or changing situations",
    ],
    signals: ["now", "right now", "at the moment", "at present", "currently", "Look!", "Listen!"],
    examples: [
      { en: "I am studying English right now.", note: "Action in progress" },
      { en: "They are playing football in the park.", note: "Happening now" },
      { en: "She is meeting her boss tomorrow.", note: "Pre-arranged plan" },
    ],
  },
  {
    id: "present-perfect",
    name: "Present Perfect",
    nameEn: "Present Perfect Simple",
    group: "present",
    color: "#ffc800",
    structure: "S + have/has + V3/ed + O",
    negative: "S + have/has + not + V3/ed + O",
    question: "Have/Has + S + V3/ed + O?",
    usage: [
      "Past actions with a result that affects the present",
      "Life experiences (no specific time mentioned)",
      "Actions that have just been completed",
    ],
    signals: ["already", "yet", "just", "ever", "never", "recently", "lately", "since", "for", "so far"],
    examples: [
      { en: "I have just finished my homework.", note: "Recently completed" },
      { en: "She has lived in Hanoi for 5 years.", note: "Duration up to now" },
      { en: "Have you ever been to Japan?", note: "Life experience" },
    ],
  },
  {
    id: "present-perfect-continuous",
    name: "Present Perfect Continuous",
    nameEn: "Present Perfect Progressive",
    group: "present",
    color: "#ff9600",
    structure: "S + have/has + been + V-ing + O",
    negative: "S + have/has + not + been + V-ing + O",
    question: "Have/Has + S + been + V-ing + O?",
    usage: [
      "Actions that started in the past and are still continuing",
      "Emphasises duration and continuity (not yet finished)",
      "Explains the cause of a present visible result",
    ],
    signals: ["for", "since", "all day/morning/week", "lately", "recently"],
    examples: [
      { en: "I have been working here for 3 years.", note: "Ongoing up to now" },
      { en: "She has been crying — her eyes are red.", note: "Visible result" },
      { en: "They have been waiting for 2 hours.", note: "Still waiting" },
    ],
  },

  // ── PAST ───────────────────────────────────────────────────────────────────
  {
    id: "simple-past",
    name: "Simple Past",
    nameEn: "Past Simple",
    group: "past",
    color: "#ff4b4b",
    structure: "S + V2/ed + O",
    negative: "S + did + not + V + O",
    question: "Did + S + V + O?",
    usage: [
      "Completed actions at a specific time in the past",
      "A sequence of events that happened in the past",
      "Past habits or states (no longer true)",
    ],
    signals: ["yesterday", "ago", "last (week/month/year)", "in + past year", "when", "at that time"],
    examples: [
      { en: "She visited Paris last summer.", note: "Specific past time" },
      { en: "I woke up, had breakfast, and went to work.", note: "Sequence of events" },
      { en: "Did you call me yesterday?", note: "Question about past" },
    ],
  },
  {
    id: "past-continuous",
    name: "Past Continuous",
    nameEn: "Past Progressive",
    group: "past",
    color: "#ce82ff",
    structure: "S + was/were + V-ing + O",
    negative: "S + was/were + not + V-ing + O",
    question: "Was/Were + S + V-ing + O?",
    usage: [
      "Action in progress at a specific moment in the past",
      "Background action interrupted by a Simple Past action",
      "Two parallel actions happening simultaneously in the past",
    ],
    signals: ["at + time + yesterday", "at that time", "when", "while", "as"],
    examples: [
      { en: "I was watching TV at 8 pm yesterday.", note: "Specific past moment" },
      { en: "She was cooking when I arrived.", note: "Background + interruption" },
      { en: "While he was sleeping, the phone rang.", note: "Two simultaneous actions" },
    ],
  },
  {
    id: "past-perfect",
    name: "Past Perfect",
    nameEn: "Past Perfect Simple",
    group: "past",
    color: "#58cc02",
    structure: "S + had + V3/ed + O",
    negative: "S + had + not + V3/ed + O",
    question: "Had + S + V3/ed + O?",
    usage: [
      "Action completed before another past action",
      "Third conditional (If clause type 3)",
      "Expressing regret or wishes about the past",
    ],
    signals: ["before", "after", "by the time", "when", "already", "never", "by + past time"],
    examples: [
      { en: "She had left before he arrived.", note: "Earlier of two past events" },
      { en: "I had never seen snow before I went to Canada.", note: "First-time experience" },
      { en: "By 9 pm, they had finished dinner.", note: "Completed by a past time" },
    ],
  },
  {
    id: "past-perfect-continuous",
    name: "Past Perfect Continuous",
    nameEn: "Past Perfect Progressive",
    group: "past",
    color: "#1cb0f6",
    structure: "S + had + been + V-ing + O",
    negative: "S + had + not + been + V-ing + O",
    question: "Had + S + been + V-ing + O?",
    usage: [
      "Continuous action up to a specific past point",
      "Emphasises duration before a past event",
      "Explains the cause of a past event or state",
    ],
    signals: ["for", "since", "before", "when", "all day/morning/week (at a past point)"],
    examples: [
      { en: "She had been working for 10 hours when she fainted.", note: "Duration before past event" },
      { en: "They had been arguing for an hour before she left.", note: "Ongoing activity before cutoff" },
      { en: "He was tired because he had been running.", note: "Cause of a past state" },
    ],
  },

  // ── FUTURE ─────────────────────────────────────────────────────────────────
  {
    id: "simple-future",
    name: "Simple Future",
    nameEn: "Future Simple (will)",
    group: "future",
    color: "#ff9600",
    structure: "S + will + V + O",
    negative: "S + will + not + V + O",
    question: "Will + S + V + O?",
    usage: [
      "Spontaneous decisions made at the moment of speaking",
      "Predictions about the future (no clear evidence)",
      "Promises, offers, and threats",
    ],
    signals: ["tomorrow", "next (week/month/year)", "in the future", "soon", "I think/believe/hope"],
    examples: [
      { en: "I will call you tomorrow.", note: "Promise" },
      { en: "It will rain this afternoon, I think.", note: "Prediction without evidence" },
      { en: "Will you help me with this?", note: "Request / offer" },
    ],
  },
  {
    id: "be-going-to",
    name: "Be Going To",
    nameEn: "Near Future (be going to)",
    group: "future",
    color: "#ff4b4b",
    structure: "S + am/is/are + going to + V + O",
    negative: "S + am/is/are + not + going to + V + O",
    question: "Am/Is/Are + S + going to + V + O?",
    usage: [
      "Pre-planned intentions and decisions",
      "Predictions based on present evidence or signs",
    ],
    signals: ["tomorrow", "next...", "soon", "tonight", "(present evidence visible)"],
    examples: [
      { en: "I am going to visit my parents this weekend.", note: "Pre-made plan" },
      { en: "Look at those clouds — it's going to rain!", note: "Evidence-based prediction" },
      { en: "She is going to have a baby.", note: "Certain future event" },
    ],
  },
  {
    id: "future-continuous",
    name: "Future Continuous",
    nameEn: "Future Progressive",
    group: "future",
    color: "#ce82ff",
    structure: "S + will + be + V-ing + O",
    negative: "S + will + not + be + V-ing + O",
    question: "Will + S + be + V-ing + O?",
    usage: [
      "Action that will be in progress at a specific future moment",
      "Planned or expected action in the future",
    ],
    signals: ["at + time + tomorrow/next...", "this time tomorrow", "in + time period"],
    examples: [
      { en: "I will be sleeping at midnight.", note: "In progress at a future moment" },
      { en: "This time tomorrow, she will be flying to London.", note: "Future background action" },
      { en: "Will you be using the car tonight?", note: "Polite future enquiry" },
    ],
  },
  {
    id: "future-perfect",
    name: "Future Perfect",
    nameEn: "Future Perfect Simple",
    group: "future",
    color: "#ffc800",
    structure: "S + will + have + V3/ed + O",
    negative: "S + will + not + have + V3/ed + O",
    question: "Will + S + have + V3/ed + O?",
    usage: [
      "Action that will be completed before a specific future time or event",
    ],
    signals: ["by + future time", "before", "by the time"],
    examples: [
      { en: "By 2030, he will have graduated.", note: "Completed before a future date" },
      { en: "I will have finished the report by Monday.", note: "Deadline in the future" },
      { en: "Will you have left by the time I arrive?", note: "Question about completion" },
    ],
  },
];

export const groups: { key: TenseGroup; label: string; emoji: string }[] = [
  { key: "present", label: "Present", emoji: "🟢" },
  { key: "past",    label: "Past",    emoji: "🔴" },
  { key: "future",  label: "Future",  emoji: "🟡" },
];
