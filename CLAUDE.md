# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal vocabulary flashcard app — fast word input, auto-fetched IPA/audio from dictionaryapi.dev, and flashcard review.

## Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type-check without building
npx tsc --noEmit

# Prisma: push schema changes to local SQLite (dev only)
npx prisma db push

# Prisma: regenerate client after schema changes
npx prisma generate

# Prisma: open Prisma Studio
npx prisma studio
```

## Tech Stack

- **Next.js 15** App Router, TypeScript, Tailwind CSS v4
- **shadcn/ui** — component library in `src/components/ui/`
- **Prisma 7** — ORM with generated client in `src/generated/prisma/` (gitignored, run `prisma generate` after clone)
- **Turso (libSQL)** — SQLite in production; local `dev.db` for development
- **Vercel** — deployment target

---

## Architecture — Domain-Driven Feature Structure

### Data Flow (strictly enforced)

```
app/page.tsx (Server Component)
    ↓
features/<domain>/actions/*.actions.ts   ("use server")
    ↓
features/<domain>/services/*.service.ts
    ↓
features/<domain>/repositories/*.repository.ts
    ↓
lib/db.ts → Prisma → Database
```

**Rules:**
- Pages and components NEVER call Prisma directly
- Repositories are the only layer that imports `db`
- Services contain all business logic — actions only validate input, call services, and call `revalidatePath`
- Types are defined in `features/<domain>/types/` and imported everywhere

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx               Root layout — imports from components/shared/
│   ├── page.tsx                 Home dashboard
│   ├── vocabulary/page.tsx      Word list with server-side pagination (?page=N&q=search)
│   ├── review/page.tsx          Flashcard review setup + session
│   ├── notes/page.tsx           Grammar notes
│   ├── grammar/page.tsx         Tense reference (static)
│   ├── stats/page.tsx           Progress & streak stats
│   └── login/page.tsx           OAuth login
│
├── features/
│   ├── vocabulary/
│   │   ├── actions/             vocabulary.actions.ts, review.actions.ts
│   │   ├── components/          vocabulary-list, word-dialog, delete-word-button,
│   │   │                        add-word-card, flashcard, review-session
│   │   ├── repositories/        vocabulary.repository.ts  ← all UserVocabulary + Word queries
│   │   ├── services/            vocabulary.service.ts, review.service.ts, dictionary.service.ts
│   │   ├── types/               vocabulary.types.ts
│   │   └── constants/           vocabulary.constants.ts  (VOCABULARY_PAGE_SIZE = 20)
│   │
│   ├── notes/
│   │   ├── actions/             notes.actions.ts
│   │   ├── components/          note-dialog, note-list, add-note-card
│   │   ├── repositories/        notes.repository.ts
│   │   ├── services/            notes.service.ts
│   │   ├── types/               notes.types.ts
│   │   └── constants/           notes.constants.ts  (CATEGORIES)
│   │
│   ├── stats/
│   │   ├── actions/             stats.actions.ts
│   │   ├── components/          weekly-chart, streak-leaderboard, target-form
│   │   ├── repositories/        stats.repository.ts
│   │   ├── services/            stats.service.ts
│   │   └── types/               stats.types.ts
│   │
│   ├── grammar/
│   │   ├── components/          tense-tabs.tsx
│   │   └── constants/           tenses.constants.ts
│   │
│   └── auth/
│       └── actions/             auth.actions.ts
│
├── components/
│   ├── ui/                      shadcn/ui primitives — never modify
│   └── shared/                  nav.tsx, color-picker.tsx, theme-provider.tsx
│
└── lib/
    ├── db.ts                    Singleton PrismaClient (Turso/libSQL adapter)
    ├── utils.ts                 cn() Tailwind class merger
    ├── speech.ts                Browser speech synthesis ("use client")
    └── color-themes.ts          Theme color definitions + FOUC-prevention script

# Root level — NextAuth requires these locations, do not move
auth.ts, auth.config.ts, middleware.ts
```

### Key Flows

**Add word** — `WordDialog` → `addVocabulary` action → `addVocabularyService` → `resolveWord` (dictionary API) → `createUserVocabulary` (repository) → `revalidatePath`.

**Vocabulary list** — URL-based server pagination: `?page=N&q=search`. `VocabularyList` (client) debounces search input 300ms → updates URL → server re-renders with DB-filtered page of 20 words.

**Review** — `/review?count=N` → `getRandomVocabulary` action → `getRandomVocabularyService` (Fisher-Yates shuffle) → `ReviewSession` (client state machine) → `markReview` action updates review counts and streak.

### Database

Environment variables (set in `.env.local` for dev, Vercel env vars for prod):

```
TURSO_DATABASE_URL=file:./dev.db     # local dev
TURSO_AUTH_TOKEN=                    # empty for local file

# Production:
# TURSO_DATABASE_URL=libsql://your-db.turso.io
# TURSO_AUTH_TOKEN=your-token
```

Prisma CLI uses `.env` (`DATABASE_URL=file:./dev.db`) for `db push` / migrations.
Runtime uses `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` via the libSQL adapter in `src/lib/db.ts`.

---

## Development Rules

### Adding a New Feature

1. Create `src/features/<name>/` with subdirectories: `actions/`, `components/`, `repositories/`, `services/`, `types/`, `constants/`
2. Write types first → repository → service → action → component
3. Add the page in `src/app/<name>/page.tsx`
4. Never skip layers — if a component needs data, it goes action → service → repository

### Bug Fix Rules

- Identify root cause before changing anything
- Make the smallest safe change — do not refactor unrelated code
- Do not add Prisma calls outside repositories to fix a bug faster

### Refactoring Rules

Before any structural change, provide:
- What is wrong with the current implementation
- What risks exist
- What alternatives were considered

Then wait for approval.

---

## Responsive Design Rules

Every UI change MUST work on all screen sizes. Before marking any UI task complete, verify:

| Breakpoint | Tailwind | Requirement |
|---|---|---|
| Mobile small | default (< `sm`) | Single column, full-width buttons, readable text |
| Mobile large | `sm:` (≥ 640px) | May show additional info (IPA, mastery %) |
| Tablet portrait | `md:` (≥ 768px) | Two-column grids acceptable |
| Desktop | `lg:` / `xl:` | Full layout, all optional elements visible |

**Required checks for every UI task:**
- No horizontal overflow on mobile — test at 375px width
- Buttons remain tappable (min 44×44px touch target)
- Text does not truncate unexpectedly — use `truncate` with `min-w-0` on flex children
- Forms remain usable — inputs full-width, labels readable
- Navigation drawer works on mobile (hamburger menu)
- Images scale correctly with `next/image` responsive sizes

**Mobile-first patterns used in this project:**
- `hidden sm:inline` / `hidden sm:flex` — hide secondary info on small screens
- `sm:hidden` — show compact label on mobile, hide on desktop
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — responsive grid
- `px-4` container padding on all breakpoints
- `max-w-3xl` / `max-w-5xl` centered content with `mx-auto`

**Never implement desktop-only solutions.** If a UI element is not mobile-safe, do not ship it.
