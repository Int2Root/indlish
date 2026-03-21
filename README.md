# indlish

**India-native creator platform** — A Medium + Notion + Pinterest hybrid. Write articles, organize notes, curate visual boards, and earn through UPI tips.

Built by [Int2Root](mailto:hello@int2root.com).

## Features

- **Write** — Rich text editor (Tiptap), draft/publish workflow, SEO-friendly URLs, tags, reading time
- **Organize** — Private notebooks, block-based notes, folder organization
- **Curate** — Visual boards (public/private), pin images/links/articles, discover boards
- **Feed & Discovery** — Home feed, trending content, full-text search, follow creators
- **UPI Tipping** — Razorpay integration, tip jar on profiles, earnings dashboard
- **Dashboard** — Writer stats, notebook overview, board management

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Database:** PostgreSQL (Neon serverless) via Prisma ORM
- **Auth:** NextAuth v4 (Google OAuth + email/password)
- **Editor:** Tiptap (rich text)
- **Payments:** Razorpay (UPI)
- **Styling:** Tailwind CSS (dark mode default)
- **Testing:** Vitest + Testing Library
- **CI/CD:** GitHub Actions → PM2 on VPS

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (or Neon account)
- Google OAuth credentials
- Razorpay account (for tipping)

### Installation

```bash
git clone https://github.com/Int2Root/indlish.git
cd indlish
npm install
cp .env.example .env
# Edit .env with your credentials
npx prisma db push
npm run dev
```

App runs at [http://localhost:3002](http://localhost:3002).

### Environment Variables

See `.env.example` for all required variables. Refer to [docs/environment.md](docs/environment.md) for details.## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3002) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |
| `npm run test` | Run Vitest tests |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:studio` | Open Prisma Studio |

## Pricing

| Feature | Free | Pro (₹99/mo) | Pro+ (₹199/mo) |
|---------|------|--------------|-----------------|
| Articles | 5/month | Unlimited | Unlimited |
| Notebooks | 3 | Unlimited | Unlimited |
| Boards | 2 | Unlimited | Unlimited |
| UPI Tipping | — | ✓ | ✓ |
| AI Assist | — | — | ✓ |
| Analytics | — | — | ✓ |
| Custom Domain | — | — | ✓ |

## Deployment

See [docs/deployment.md](docs/deployment.md) for VPS deployment with PM2.

## Contact

- **General:** hello@int2root.com
- **Support:** support@indlish.com
- **GitHub:** [Int2Root/indlish](https://github.com/Int2Root/indlish)

## License

Proprietary — © Int2Root. All rights reserved.