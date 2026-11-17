# Sri Lankan Wedding Invitation & RSVP

A responsive digital wedding invitation built with Next.js, TypeScript, and Google Sheets RSVP storage.

## Run locally

Requirements: Node.js 22.13 or newer and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Personalized RSVPs use a private Google Apps Script endpoint. Copy `.env.example` to `.env.local`, then add the deployed Apps Script `/exec` URL and the matching private RSVP secret. Never commit `.env.local`.

For Vercel, configure `GOOGLE_APPS_SCRIPT_URL`, `GOOGLE_APPS_SCRIPT_SECRET`, and `NEXT_PUBLIC_SITE_URL` in Project Settings → Environment Variables, then redeploy.

Test an individual invitation locally with `http://localhost:3000/?guest=GUEST_TOKEN`, using a token generated in the `Guests` Google Sheet.

## Production build

```bash
npm run build
npm start
```

## Customize the invitation

- Couple, date, story, venue, schedule, dress code, and RSVP text: `app/page.tsx`
- Colors, typography, spacing, and responsive design: `app/globals.css`
- Browser and social-sharing metadata: `app/layout.tsx`
- RSVP API: `app/api/rsvp/route.ts`
- Google Sheets RSVP integration: `lib/google-rsvp.ts`

Replace the sample names, dates, email address, and Google Maps link before sharing the finished invitation.

## Useful commands

```bash
npm run dev          # Start the local development server
npm run build        # Create a production build
npm run lint         # Check the source code
```
