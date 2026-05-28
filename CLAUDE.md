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

## Architecture

```
src/
├── app/
│   ├── layout.tsx          Root layout (fonts, Toaster)
│   ├── page.tsx            Home — word count + nav to Add/Review
│   ├── add/page.tsx        Add vocabulary (Server Component)
│   └── review/page.tsx     Review — setup form or live flashcard session
├── components/
│   ├── vocabulary-form.tsx Client form, uses useActionState + addVocabulary action
│   ├── review-session.tsx  Client state machine for the card-by-card review flow
│   ├── flashcard.tsx       Client card with CSS 3D flip, audio playback, Correct/Wrong buttons
│   └── ui/                 shadcn/ui primitives
├── actions/
│   └── vocabulary.ts       All server actions (addVocabulary, getRandomVocabulary, markReview, …)
└── lib/
    ├── db.ts               Singleton PrismaClient with @prisma/adapter-libsql
    └── dictionary.ts       Fetches IPA + audioUrl from dictionaryapi.dev
```

### Key flows

**Add word** — `VocabularyForm` submits to `addVocabulary` server action → checks duplicate → calls `fetchDictionaryData` → saves to DB → `revalidatePath("/")`.

**Review** — `/review` with no search params shows a count form (plain GET form). Submitting navigates to `/review?count=N`. The server component calls `getRandomVocabulary(N)`, then renders `<ReviewSession words={…} />` (client). Each card flip reveals meaning; Correct/Wrong fires `markReview` via `useTransition`.

### Database

Environment variables (set in `.env.local` for dev, Vercel env vars for prod):

```
TURSO_DATABASE_URL=file:./dev.db          # local dev
TURSO_AUTH_TOKEN=                         # empty for local file

# Production:
# TURSO_DATABASE_URL=libsql://your-db.turso.io
# TURSO_AUTH_TOKEN=your-token
```

Prisma CLI uses `.env` (`DATABASE_URL=file:./dev.db`) for `db push` / migrations.
Runtime uses `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` via the libSQL adapter in `src/lib/db.ts`.
