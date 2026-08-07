# Marites Allen Premium Website

A luxury editorial website concept for Marites Allen, built with Next.js, TypeScript, TailwindCSS, Framer Motion, shadcn-style UI primitives, and Lucide icons.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
npm run start
```

## Key Routes

- `/` - Premium public website experience
- `/admin` - Admin dashboard prototype

## Deployment

Recommended hosting: Vercel.

1. Push this project to a GitHub repository.
2. Import the repository in Vercel.
3. Use the default Next.js build settings.

## Integration Notes

The booking wizard and admin dashboard are currently frontend prototypes. The next production step is connecting:

- availability/calendar storage
- Stripe and PayPal checkout
- booking confirmation email
- admin notification email
- content management for books, events, testimonials, blog, and gallery
