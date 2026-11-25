# Press kit file

Visitors download a kit from `/press-kit` only after a real file is in place. Until then, `/press-kit` sends them back to `/media`, the public page has no download button, and the registration says the media team will email the kit.

The site serves a file in this order:

1. A PDF or zip uploaded in **Admin → Press kit**, when file storage is available.
2. `press-kit.pdf` in this folder.
3. `press-kit.zip` in this folder.

Do not put a stand-in file here for journalists to download. A file whose text says it is not the press kit is ignored.

## Add the real kit

**From the admin** (PDF or zip, up to 4MB): Admin → Press kit → Upload. On the live site this is kept only when `BLOB_READ_WRITE_TOKEN` is set (a Vercel Blob store connected to the project). Without that token the upload is refused and the admin page says so.

**From this folder** (any size the repo and host will deploy):

1. Put the real file here as exactly one of:
   - `public/press-kit/press-kit.pdf`
   - `public/press-kit/press-kit.zip`
2. Commit it and redeploy.

Zip files elsewhere in the repo are gitignored. `public/press-kit/*.zip` is allowed so the kit can be committed. A kit larger than about 4MB has to use this folder, because the host rejects bigger form uploads.

As soon as one of those files is available, the download button shows up on the media page by itself.

## Email

The download link is emailed only when a real kit exists and both of these are set on the host:

- `RESEND_API_KEY`
- `BOOKING_FROM_EMAIL` or `RESET_FROM_EMAIL`

The from address has to be a verified sender in Resend. `BOOKING_NOTIFY_TO` (default `hello@maritesallen.com`) also gets a copy of each registration when email is on.

The public page does not name these settings. It says the kit was sent only after Resend accepts the message. Registrations are always saved under Admin → Press kit.
