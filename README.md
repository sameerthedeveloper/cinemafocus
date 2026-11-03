# Cinema Focus

Website and admin tooling for Cinema Focus, a Hi-Fi and home cinema retailer in Chennai.

- **Public site**: products, brands, gallery, press, location and contact pages.
- **Admin** (`/admin`): manage products, categories, new launches, gallery, press, site settings and messages.
- **Portal** (`/portal`): read-only/limited view for brand partners, with messages and stats.
- **Backend**: AWS (API Gateway + Lambda + DynamoDB + S3 + Cognito), defined in `infra/`.

> This project uses a recent Next.js with breaking changes. Read the matching guide in
> `node_modules/next/dist/docs/` before using a Next.js API. See [AGENTS.md](AGENTS.md).

## Stack

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4, GSAP, lucide-react.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run seo:validate` | Validate JSON-LD structured data |
| `npm run seo:audit` | Run the SEO audit script |

## Project structure

```
app/                  Next.js routes (App Router)
  (public)/           Public site: home, products, brand, gallery, press, about, contact, faq, location
  admin/              Admin panel (login + protected pages), styled by admin.css
  portal/             Brand-partner portal
  api/                Route handlers (portal messages, unread counts, etc.)
  actions/            Server actions
  launch/, soon/      Countdown / pre-launch pages
  globals.css         Tailwind theme tokens (design system)
components/           Shared React components
  admin/              Admin-only widgets (image zoom, image crop)
  panel/              Shared admin + portal shell and views
context/              React context (site settings)
hooks/                Custom hooks
lib/                  App logic: data access (aws/, supabase/), SEO/AEO, metadata, schema, import helpers
assets/               Images imported by components (bundled)
public/               Static files served as-is (images, catalogs, llms.txt)
infra/                AWS backend
  handlers/           Lambda handlers (one per resource)
  lib/                Auth, DynamoDB and validation helpers
  serverless.yml      Deployment config
  legacy/             Old Supabase schema (kept for reference)
scripts/              One-off and maintenance scripts (imports, SEO, AWS backup/restore)
docs/                 Documentation (see docs/README.md)
proxy.js              Request proxy: admin/portal route protection, SEO route gate, maintenance page
next.config.mjs       Next.js config (images, redirects, headers)
```

## Documentation

All documentation lives in [docs/](docs/README.md): design system, SEO notes,
content strategy, audit reports and copy-paste component examples.

## Design system in one paragraph

Monochrome with a single `signal` orange accent for "New" and unread markers, `danger` red for
destructive actions, Inter, sentence case, pill buttons. Radii: 12px controls, 16px media, 24px
cards. No blur and no resting shadows. Full rules and code: [docs/design](docs/design/DESIGN_SYSTEM.md).

## Backup and restore

```bash
scripts/backup-aws.sh [output_dir]   # DynamoDB + S3 + Cognito + config snapshot (output is git-ignored)
scripts/restore-aws.sh <backup_dir> [bucket_name]  # restore into the active AWS account
```

Both use your active AWS CLI credentials. Run them from the repository root. Deploy the stack
first (`cd infra && npx serverless deploy`); restore fills the empty tables and bucket.

## Deployment

The site deploys to Vercel (`vercel.json`). The backend deploys from `infra/` with the
Serverless Framework (`infra/serverless.yml`). Admin writes need a Cognito session.

## Conventions

- Keep UI consistent with the design system; reuse tokens from `app/globals.css`.
- Secrets live only in `.env.local` (git-ignored). Never commit credentials or service-account files.
- Scratch folders (`aune-import/`, `restore/`) are local working data and are not committed.
