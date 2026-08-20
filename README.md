# Marites Allen Website

Premium Next.js site for Marites Allen (The Feng Shui Queen), now with a provider-agnostic `/admin` CMS.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

First CMS sign-in (local):

- Owners: `maritesallen@gmail.com` and `cap10kirck@gmail.com`
- Change or reset a password from the login page (`Change password` / `Forgot password`)
- An owner can also set a new password for anyone under Team

Copy `.env.example` to `.env.local` for optional mail sending on password resets (`RESEND_API_KEY` + `RESET_FROM_EMAIL`). After the owner accounts exist, `ADMIN_EMAIL` / `ADMIN_PASSWORD` are not used for login.

## Build

```bash
npm run build
npm start
npm test
npm run lint
```

## Routes

| Route | Page |
|-------|------|
| `/` | Home |
| `/about` | About |
| `/destara` | Destara AI |
| `/frigga` | Frigga Charmed Life |
| `/forecast` | Annual Forecast (`?year=2026`) |
| `/projects` | Brands & collaborations |
| `/events` | Speaking & events |
| `/media` | Press & media kit |
| `/articles/[slug]` | CMS article detail |
| `/book` | Book consultation (Coming Soon) |
| `/admin` | CMS (session required) |

## CMS

Content lives in `data/cms.json` (gitignored) with local uploads in `public/uploads`. Admin mutations are server actions with session + role + zod validation. Persistence is behind `lib/cms` adapters so a database provider can be plugged in later without rewriting the admin UI.

Public email sign-ups (booking waitlist, newsletter, destiny chart, press kit, speaking enquiries) are saved into the CMS and listed at `/admin/signups`.
