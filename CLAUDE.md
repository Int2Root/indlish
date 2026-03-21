# CLAUDE.md — AI Context for indlish

## Project Overview
indlish is an India-native creator platform (Medium + Notion + Pinterest hybrid) built by Int2Root.

## Tech Stack
- Next.js 14 (App Router), TypeScript 5, Prisma ORM, PostgreSQL (Neon)
- NextAuth v4 (Google OAuth + credentials), Tailwind CSS, Tiptap editor
- Razorpay for UPI tipping, Vitest for testing

## Architecture
- `src/app/` — Next.js App Router pages and API routes
- `src/components/` — React components (ui, layout, editor, articles, boards, notebooks, dashboard, feed)
- `src/lib/` — Server utilities (prisma, auth, utils, validations, api-helpers)
- `src/hooks/` — Client hooks (use-debounce, use-session)
- `src/types/` — TypeScript type definitions
- `prisma/` — Database schema
- `tests/` — Vitest test files

## Key Patterns
- API routes use `successResponse()` / `errorResponse()` helpers
- Auth: `requireAuth()` for protected routes, `getAuthSession()` for optional auth
- Validation: Zod schemas in `src/lib/validations.ts`
- Plan limits enforced in API routes via `PLAN_LIMITS` from `src/lib/utils.ts`
- Dark mode is default, brand color is orange (#dd6b20)

## Database
- PostgreSQL via Prisma. Models: User, Article, Tag, Notebook, Note, Board, Pin, Tip, Follow
- Neon serverless for production

## Commands
- `npm run dev` — Dev server on port 3002
- `npm run test` — Run Vitest
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npx prisma db push` — Sync schema
- `npx prisma studio` — DB GUI

## Important Notes
- No personal names in codebase — use "Int2Root" everywhere
- Hinglish-friendly UI copy
- Dark mode default, mobile-first
- Contact: hello@int2root.com, support@indlish.com