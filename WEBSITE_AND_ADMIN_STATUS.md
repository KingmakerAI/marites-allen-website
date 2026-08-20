# Marites Allen website — current state

**From:** CTO  
**Date:** 21 August 2026  
**For:** sharing internally (product, content, operations)  
**Status:** the public site and a working admin editor are built and running locally. This is a content-managed site, not a finished booking platform.

---

## Snapshot

We now have two products sitting on one codebase:

1. **The public website** — Marites Allen’s brand site (Feng Shui Queen): homepage, story pages, services, events, press, forecast, and a book-consultation waitlist.
2. **The admin** — a password-protected editor at `/admin` so Marites’s team can change the live words, photos, services, menus, and incoming messages without a developer.

If you remember older reports in this folder (April–May 2026), treat this note as the current source of truth. The site has been rebuilt as a Next.js app with a real CMS behind it.

**What this is good for today:** showing the brand, publishing copy, capturing enquiries, and letting a non-developer keep the site current.  
**What this is not yet:** live paid checkout, a staff calendar, email-campaign automation, or a production database. Booking is still “coming soon” plus a waitlist form.

---

## 1. The public website

### Who it is for

Visitors who need to understand who Marites is, what she offers, Destara and Frigga, the yearly forecast, press, and how to register interest in a consultation.

### Pages that exist

| URL | What the visitor sees | Who edits it |
|---|---|---|
| `/` | Homepage: hero, numbers, services, press/speaking, Destara, Frigga, FAQs, reviews, closing | **Homepage** + **Story pages → Homepage extras** + **Services** |
| `/about` | Biography, photo, facts, awards, books, booking box | **Story pages → About** |
| `/destara` | Destara app story and “open the app” button | **Story pages → Destara** |
| `/frigga` | Frigga shop story, stores, collections | **Story pages → Frigga** |
| `/forecast` | Chinese New Year forecast by year, zodiac, flying stars | **Story pages → Forecast** |
| `/projects` | Brands and collaborations | **Story pages → Projects** |
| `/events` | Speaking and events list + page intro | **Events** (list) and words at the bottom of that screen |
| `/media` | Press / news stories + press kit | **News & press** |
| `/articles/[slug]` | One press story | **News & press** (each article) |
| `/book` | Consultation waitlist, featured services and prices | **Services** (cards/prices) and book-page words at the bottom of Services |
| `/[slug]` | Any extra page the team publishes | **Extra pages**, with “Show it” turned on |

Header, footer, logo, contact details, and the booking button label come from **Menus** and **Settings**.

### Brand

- Official wordmark: forest green (`#143d31`) on a transparent background. **Never white.**
- Site icon / favicon: the **M** monogram.
- On dark footer backgrounds the green logo sits on a cream plate so it stays readable.

### What visitors can actually do

- Read the site and share pages (SEO titles, descriptions, and social images are wired).
- Open Destara / Frigga via their own URLs.
- Submit interest: booking waitlist, speaking, press kit, destiny chart, newsletter.
- Those submissions land in **Messages**. They do **not** take a payment or book a calendar slot.

### What visitors cannot do yet

- Pay for a consultation on this site.
- Self-serve a confirmed appointment.
- Log into a client portal.

That is a product choice for this phase, not a missing page.

---

## 2. The admin

**URL:** `/admin` (after sign-in).  
**Audience:** Marites and a small team. Copy is written in plain English on purpose.

### How editing works (tell everyone this)

1. Sign in.
2. Open the section that matches the live page.
3. Change the boxes.
4. Press **Save**. Nothing is live until Save.
5. Use **See this page** / **See the website** to check.

The left menu is a narrow icon rail. Hover it and it opens beside the page (it does not cover the form). On a phone, use the top menu button.

**Roles**

- **Owner** — full access, including Team.
- **Editor** — can run the site, cannot add/remove logins.

### What’s in the admin

#### Home (dashboard)

People numbers from the live site, not inventory counts:

- People today / this week / so far
- Times the site was opened today
- New and total booking messages
- Speaking, press kit, and destiny-chart sign-ups

Plus recent messages and unfinished news drafts.

Visitor counts start from the day this tracking was switched on. They are not historical Google Analytics.

#### Writing & photos

| Screen | Use it for |
|---|---|
| **Extra pages** | New pages that are not About / Destara / etc. Publish with “Show it” and they go live at `yoursite.com/that-name`. |
| **News & press** | Press stories. Published ones appear on `/media` and as their own article URLs. The Media page intro also sits here. |
| **Folders** | Labels for grouping news. |
| **Photos** | Upload pictures, add a description for accessibility, then pick them on other screens. |

#### Clients

| Screen | Use it for |
|---|---|
| **Services** | Consultation names, prices, promo prices, what shows on the homepage and `/book`. Book-page sentences are at the bottom of this screen. |
| **Messages** | Every signup: booking, speaking, press kit, destiny chart, newsletter. Search, status, export. |
| **Events** | Speaking dates and event pages. Events intro / video lines are at the bottom. |

#### The website

| Screen | Use it for |
|---|---|
| **Homepage** | Top banner, numbers, which service strip shows, closing band, FAQs, reviews. Save each box you change. |
| **Story pages** | Words on About, Destara, Frigga, Forecast, Projects, and leftover homepage strips (press names, Destara/Frigga teasers, about photo). Pick a page on the left, edit, Save, then “See this page”. |
| **Menus** | Header and footer links, including the booking button. |

#### Account

| Screen | Use it for |
|---|---|
| **Settings** | Site name, tagline, logo, email, phone, WhatsApp, default Google title/description, booking URL, booking-button words. |
| **Team** | Logins (owner only). |

### What the admin does *not* change

These stay in the code on purpose (small chrome, legal, diagrams):

- Footer legal lines
- Some JSON-LD constants
- Flying-star diagram labels
- Destiny-chart modal chrome

If those need to be editable, that is a later change, not a bug.

---

## 3. How the two sides connect

```
Visitor opens maritesallen.com
        ↓
Public pages read from the CMS
        ↓
Admin Save writes the CMS
        ↓
Next visit shows the new words
```

Practically:

- Change **Services** → homepage service cards and `/book` update together.
- Change **Story pages → About** → `/about` updates.
- Change **Homepage** → the first screen of `/` updates.
- Change **Story pages → Homepage extras** → the extra strips lower on `/` update (Destara/Frigga teasers, press names, and similar).
- Turn on **Show it** for an extra page → `/{slug}` goes live. Reserved names (about, book, admin, …) cannot be reused.

---

## 4. Build (for technical readers)

| Piece | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Public UI | React pages under `app/`, shared header/footer, existing design system (cream / forest green / gold) |
| Admin | `/admin`, session cookie, server actions, Zod validation |
| Content store | JSON file `data/cms.json` (not committed). Uploads in `public/uploads`. |
| Analytics | Separate `data/analytics.json`. Cookie `ma_vid` for unique visitors. Admin paths and bots skipped. Manila calendar days. |
| SEO | Per-page titles/descriptions from CMS; sitemap; JSON-LD; brand icons in `app/` and `public/images/brand/` |
| Tests | `npm test` (Vitest) covering CMS save/merge, visitors, signups |

Persistence is behind `lib/cms` so a database can replace the JSON file later without rebuilding the admin screens. That swap has not been done yet.

Local run: `npm install` then `npm run dev` → [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin).  
First-login bootstrap is in `.env.example` / README. **Change it before any public deploy.**

---

## 5. Honest gaps (so nobody over-promises)

1. **Booking is a waitlist**, not a live diary or payment flow.
2. **Content lives in a JSON file on the server.** Fine for this stage. For production with several editors, we should move to a real database and backups.
3. **Visitor stats are from this tracking start**, not years of history.
4. **Email:** messages are stored in admin. They are not automatically pushed to Mailchimp or a helpdesk unless we add that.
5. **Destara and Frigga shops** are presented on this site; checkout for those products still lives on their own sites.
6. Older markdown reports in the repo describe earlier builds. Do not mix them into this status.

---

## 6. Suggested next decisions

These are product calls, not coding chores:

1. **Go-live host** — where this Next.js app runs, with HTTPS, backups of `cms.json` / uploads, and a real owner password.
2. **Booking** — stay on waitlist, or specify the real booking tool (Calendly, in-house, Frigga sales) so the header button can point at it.
3. **Who edits** — one owner vs several editors; train on Save → See this page.
4. **Database** — only needed when we want concurrent editors, hosting without a writable disk, or stronger audit/restore.

---

## 7. One-line summary you can forward

> The Marites Allen site is a finished-looking public website plus a working admin. The team can change pages, photos, services, menus, and read enquiries. Consultations are still waitlist-only. We should not describe this as a live booking system until that product is specified and built.

If you want a walkthrough, the useful demo path is: open the live homepage → `/admin` → change one About sentence → Save → See this page.
