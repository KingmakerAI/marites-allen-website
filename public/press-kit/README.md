# Press kit file

Visitors who register on `/media` download this kit from `/press-kit`. Nothing in this folder is the real press kit yet.

The site serves a file in this order:

1. A PDF or zip uploaded in **Admin → Press kit**, when file storage is available.
2. `press-kit.pdf` in this folder.
3. `press-kit.zip` in this folder.
4. `PLACEHOLDER.pdf` in this folder.

`PLACEHOLDER.pdf` only exists so the download button has something to open. It says it is not the press kit. Do not send it to a journalist.

## Add the real kit

**From the admin** (PDF or zip, up to 4MB): Admin → Press kit → Upload. On the live site this is kept only when `BLOB_READ_WRITE_TOKEN` is set (a Vercel Blob store connected to the project). Without that token the upload is refused and the page says so.

**From this folder** (any size the repo and host will deploy):

1. Put the real file here as exactly one of:
   - `public/press-kit/press-kit.pdf`
   - `public/press-kit/press-kit.zip`
2. Commit it and redeploy.

Zip files elsewhere in the repo are gitignored. `public/press-kit/*.zip` is allowed so the kit can be committed. A kit larger than about 4MB has to use this folder, because the host rejects bigger form uploads.

Once `press-kit.pdf` or `press-kit.zip` is present, or an admin upload is stored, `PLACEHOLDER.pdf` is no longer what visitors get. You can leave the placeholder in the repo.

## Email

The download link is emailed only when both of these are set on the host:

- `RESEND_API_KEY`
- `BOOKING_FROM_EMAIL` or `RESET_FROM_EMAIL`

The from address has to be a verified sender in Resend. `BOOKING_NOTIFY_TO` (default `hello@maritesallen.com`) also gets a copy of each registration when email is on.

If those are missing, the visitor still gets the download button. The page says email was not sent and names the missing settings. It does not say "Sent".
