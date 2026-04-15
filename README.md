# Funnel Builder

Visual page/funnel builder with drag-and-drop editing, JSON-first architecture, and Supabase auth.

## Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Editor:** [Puck](https://github.com/measuredco/puck) v0.20.2
- **Auth:** Supabase (auth only, no database)
- **Storage:** Supabase Storage (image uploads)
- **Data:** localStorage (JSON export for production)

## Setup

```bash
npm install
cp .env.example .env
# Fill in your Supabase credentials in .env
npm run dev
```

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and publishable key to `.env`
3. In Authentication > Settings, disable "Confirm email" for dev
4. Create a public Storage bucket called `funnel-assets` for image uploads

## Architecture

The builder outputs JSON. Production deployment is a separate step:

1. **Build** — Design pages in the drag-and-drop editor
2. **Export** — Copy the JSON from the Production page
3. **Convert** — Claude Code transforms JSON into static HTML/CSS
4. **Deploy** — Push static files to your host

No auto-publish. No backend database. The builder is a design tool — production sites are plain HTML.

## Components

19 components across 4 categories:

- **Layout:** Section, Columns, Spacer, Divider
- **Content:** Heading, TextBlock, BulletList, ImageBlock, VideoEmbed
- **Interactive:** ButtonBlock, FormBlock, HTMLEmbed
- **Marketing:** Testimonial, FeatureList, FAQAccordion, PricingTable, CountdownTimer, ProgressBar, TrustBadges

See `docs/COMPONENT-SCHEMA.md` for the full JSON schema used in production conversion.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## Deployment

Works on Vercel out of the box — connect the repo and it auto-deploys.

Add your domain in Vercel project settings > Domains.
