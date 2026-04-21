<div align="center">

# Scope — Job application tracker

**Full-stack pipeline for roles you care about** — add companies, track status from wishlist to offer, and keep notes in one place.

[![Next.js](https://img.shields.io/badge/Next.js-141414?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Repository](https://github.com/mastelloneluana6-byte/job-tracker) · [Issues](https://github.com/mastelloneluana6-byte/job-tracker/issues)

_Add your **live demo** link here after deploying (e.g. Vercel), then push again._

</div>

---

## Preview

| Pipeline & stats | Applications |
| :---: | :---: |
| Color-coded statuses (wishlist → withdrawn) | Cards with edit overlay, listing links, notes |

<!-- Optional: add a screenshot to the repo and uncomment:
![Scope tracker screenshot](./docs/screenshot.png)
-->

---

## Features

- **Dashboard** — counts per status, “active” pipeline summary  
- **CRUD** — create applications, edit in a modal-style overlay, delete with confirm  
- **Status workflow** — wishlist, applied, interviewing, offer, rejected, withdrawn  
- **Dark UI** — premium-style layout with Tailwind CSS and status-based accents  
- **PostgreSQL** — data persisted via [Prisma](https://www.prisma.io/) (e.g. [Neon](https://neon.tech/) in production)

---

## Tech stack

| Layer | Choice |
|--------|--------|
| Framework | Next.js 16 (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| ORM | Prisma 7 |
| Database | PostgreSQL (`pg` + driver adapter) |

---

## Getting started

### Prerequisites

- Node.js 20+ recommended  
- A PostgreSQL database (local or hosted)

### Setup

```bash
git clone https://github.com/mastelloneluana6-byte/job-tracker.git
cd job-tracker
npm install
```

Copy environment file and set your connection string:

```bash
cp .env.example .env
# Edit .env — set DATABASE_URL (see Neon or local Postgres)
```

Push schema to the database:

```bash
npm run db:push
# or: npm run db:migrate
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (`prisma generate` + `next build`) |
| `npm run db:generate` | Regenerate Prisma Client |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema (prototyping) |
| `npm run db:studio` | Prisma Studio GUI |

---

## Deploy (share a public link)

1. Push this repo to GitHub (already done for this project).  
2. Import the repo on [Vercel](https://vercel.com/) (or similar).  
3. Add **`DATABASE_URL`** in the host’s environment variables (same value as local `.env`).  
4. Deploy — use the generated URL as your **live demo** in this README and on your portfolio.

> The app has **no authentication** — treat production data as public unless you add auth later.

---

## Project structure (high level)

```
src/
  app/           # Routes, server actions, layout
  components/    # UI (tracker forms, cards, stats)
  lib/           # Prisma client singleton
prisma/          # Schema & migrations
```

---

## License

Private / portfolio use — add a `LICENSE` file when you pick one.
