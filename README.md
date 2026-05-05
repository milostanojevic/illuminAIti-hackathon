# illuminAIti Hackathon — Onboarding POC

Multi-brand onboarding wizard for BetKing (Nigeria) and SuperSportBET (South Africa). Users pick leagues, teams, casino games, providers, and betting style to personalise their home screen. Built with Next.js 14, Tailwind, Supabase.

## Quick Start

```bash
git clone https://github.com/YOUR_ORG/illuminAIti-hackathon.git
cd illuminAIti-hackathon
npm install
cp .env.example .env.local   # fill in Supabase credentials
supabase db push              # optional — runs migrations
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_ORG/illuminAIti-hackathon)

See [docs/deployment.md](docs/deployment.md) for full instructions.

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | Folder structure, context shape, request lifecycle |
| [Onboarding Flow](docs/onboarding-flow.md) | Wizard screens, routing, step guards |
| [Database](docs/database.md) | Supabase schema, migrations, save/read flows |
| [Design System](docs/design-system.md) | Brand tokens, Tailwind config, crest authoring |
| [Development](docs/development.md) | Local setup, scripts, code conventions |
| [Deployment](docs/deployment.md) | Vercel + Supabase production deployment |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + React 18 |
| Styling | Tailwind CSS |
| State | React Context + useReducer |
| Database | Supabase PostgreSQL |
| API | Next.js API Routes |
| Validation | zod |
| Deployment | Vercel |

## License

Internal hackathon project — not licensed for external use.
