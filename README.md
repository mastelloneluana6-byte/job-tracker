<div align="center">

# Scope — Job application tracker

### A full-stack tool I built to stay organized while job searching — and to show how I ship real software end-to-end.

[![Next.js](https://img.shields.io/badge/Next.js-141414?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

**[Source code](https://github.com/mastelloneluana6-byte/job-tracker)** · **[Report an issue](https://github.com/mastelloneluana6-byte/job-tracker/issues)**

### Live demo

**→ Replace this line with your Vercel URL after deploy, then push again.**  
Example: `**[Open the live app](https://your-app.vercel.app)**`

</div>

---

## At a glance (for recruiters)

| | |
| :--- | :--- |
| **What** | A web app to log applications, track status through the hiring funnel, store listing URLs and notes, and see pipeline stats at a glance. |
| **Why** | Job searching generates a lot of moving parts. I wanted one place for truth — and a **portfolio piece** that reflects how I work: clear UX, typed data layer, and a stack I’d use on a real team. |
| **Proof of skill** | Next.js App Router, **Server Actions** for mutations, **Prisma + PostgreSQL** for persistence, **Tailwind** for a polished responsive UI, **hosted DB** (Neon) + **Vercel**-ready deployment. |

---

## Why I built it

Spreadsheets and scattered browser tabs don’t scale when you’re juggling many roles, companies, and stages. I built **Scope** to:

1. **Reduce cognitive load** — one dashboard: what I applied to, what stage it’s in, when I last updated it.  
2. **Practice full-stack delivery** — not a tutorial clone: real CRUD, real database, real constraints (validation, optimistic flows, production env vars).  
3. **Demonstrate ownership** — product decisions (status model, color-coded pipeline, edit overlay), implementation, and documentation you’re reading now.

This is the kind of problem I like: **messy real-world workflow** → **simple data model** → **interface people can actually use**.

---

## What the app does

- **Capture applications** — company, role, optional job URL, applied date, free-form notes, initial status.  
- **Track the funnel** — statuses from *Wishlist* through *Applied*, *Interviewing*, *Offer*, *Rejected*, and *Withdrawn*, with **color-coded** stats and cards so the pipeline is scannable in seconds.  
- **Update quickly** — change status from the card; **edit** opens a focused overlay for full details; **remove** with confirmation.  
- **Stay oriented** — sidebar shows counts per stage plus how many are still “active” in the search.

If you open the deployed app, you’re seeing the same patterns I’d bring to a product team: **structured data**, **predictable UI states**, and **server-first** mutations so the UI stays in sync with the database.

---

## Technical highlights

- **Next.js 16 (App Router)** — server-rendered dashboard; dynamic routes and search params for the edit experience.  
- **Server Actions** — create / update / delete / set status without a separate REST layer; `revalidatePath` keeps lists fresh.  
- **Prisma 7 + PostgreSQL** — schema-first `JobApplication` model with enums; **Neon** in production; Prisma Client generated to `src/generated/prisma`.  
- **Driver adapter (`pg` + `@prisma/adapter-pg`)** — matches Prisma 7’s PostgreSQL client expectations in serverless/long-lived Node contexts.  
- **Tailwind CSS v4** — dark, high-contrast UI with consistent spacing, accessible forms, and status-driven accent colors.  
- **TypeScript throughout** — shared types from Prisma; fewer “stringly typed” bugs across UI and data access.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js 16 — App Router, React 19 |
| API surface | Server Actions (no hand-rolled REST for core CRUD) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Data | Prisma 7 · PostgreSQL · `pg` |
| Hosting (typical) | Vercel (app) · Neon (database) |

---

## Project layout

```
src/app/              # Pages, layout, server actions
src/components/       # Tracker UI (forms, cards, stats, status controls)
src/lib/              # Prisma singleton for server usage
prisma/               # Schema & migrations
```

---

## Run it locally

**Requirements:** Node.js 20+ and a PostgreSQL `DATABASE_URL` (local or [Neon](https://neon.tech/)).

```bash
git clone https://github.com/mastelloneluana6-byte/job-tracker.git
cd job-tracker
npm install
cp .env.example .env   # then set DATABASE_URL
npm run db:push        # or npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Useful scripts:** `npm run build` · `npm run db:studio` · `npm run db:generate`

---

## Deploy (e.g. Vercel)

1. Import this repo into [Vercel](https://vercel.com/).  
2. Set **`DATABASE_URL`** in **Project → Settings → Environment Variables**. Use the same Neon URL as in your local `.env`.  
   - Enable it for **Production**, **Preview**, and **Development** (Vercel runs `next build` with these vars; missing `DATABASE_URL` is the most common deploy failure).  
3. Redeploy (**Deployments → … → Redeploy** or push a new commit).

Put your public **`*.vercel.app`** URL in the **Live demo** section at the top of this README (the long `vercel.com/.../deployments/...` link in the dashboard is not the app URL visitors use).

**Note:** There is **no login** yet — the demo is intentionally simple. Data is as public as the URL you share. Next iteration would be auth (e.g. NextAuth or Clerk) and row-level ownership.

---

## What I’d build next

- **Authentication** and per-user data  
- **Search / filters** (company, date range, status)  
- **Reminders** or follow-up dates  
- **CSV export** for backups

---

## Screenshot

Add `docs/screenshot.png` and uncomment in your fork if you want a visual above the fold on GitHub:

```markdown
![Scope — job application tracker](./docs/screenshot.png)
```

---

## Contact

If you’re hiring and this project resonates, reach out via the contact options on **[my GitHub profile](https://github.com/mastelloneluana6-byte)** — I’m happy to walk through architecture, trade-offs, or how I’d extend this on a team.

---

*Built as a portfolio project — Scope is the product name in the UI; the repository is `job-tracker`.*
