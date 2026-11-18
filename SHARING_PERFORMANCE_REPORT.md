# Social sharing correction and performance verification

The original sharing PNG contained Aarav & Nethmi, 14 February 2027 and Colombo Sri Lanka. The metadata fallback also used a different hostname. The corrected thumbnail contains exactly:

- Chathuranga & Vinuri - Our Wedding
- 11 December 2026
- Grand Monarch Thalawathugoda

The production PNG is 1200 × 630, image/png, with the existing ivory and gold botanical theme. The public homepage fallback is https://wedding-rsvp-omega-taupe.vercel.app/. Existing NEXT_PUBLIC_SITE_URL overrides remain supported; ensure any deployment override matches this hostname.

## Application files changed

- app/layout.tsx: consistent OG/Twitter title, description, absolute versioned image URL, image dimensions/type/alt, locale en_US and website URL.
- public/og.png: corrected thumbnail, 993,509 bytes (previously 1,951,069; 49.1% smaller).
- app/page.tsx: connects the map gate and loads invitation export code on Download.
- app/components/VenueMap.tsx (new): reserves the existing iframe space and initializes Google Maps when the celebration is active and the map is within 600px of the viewport. Keeps the same iframe when navigating back; keyboard focus also initializes it.
- lib/download-invitation.ts (new): the original canvas export function, unchanged, moved into a module loaded on demand.

LOCAL_TESTING.md and this report document the deliverable. No CSS, backend/API, Apps Script, environment setting or unrelated public asset was changed. Next.js and eslint-config-next were upgraded together from 16.2.6 to 16.4.6; React and React DOM remain unchanged. The production dependency audit reports zero vulnerabilities. Development tooling still has 14 high-severity audit findings associated with the picomatch advisory GHSA-fc5q-39xc-vjpf; no breaking downgrade or unverified override was applied. Source comparisons confirmed the stylesheet, export function body and remaining page code are identical to the baseline. Fonts use the existing system font stack; audio retains its existing deferred loading. Existing animation/reduced-motion behavior is preserved. Trial lossless compression of other PNGs offered modest savings and was not applied.

## Measured local results

Three fresh Chromium mobile sessions at 393 × 852, production build, without artificial throttling:

| Metric | Before | After |
| --- | --- | --- |
| Median LCP | 376 ms | 316 ms |
| Initial and interaction-flow CLS | 0 | 0 |
| Median maximum observed event duration | 96 ms | 96 ms |
| Initial encoded JavaScript | 152,379 bytes | 151,648 bytes |
| Map requests before approach | 1 | 0 |
| Map requests after approach / revisit | 1 / 1 | 1 / 1 |

Initial JavaScript is 731 bytes smaller; export code loads as one additional chunk on the first Download. These are small local lab samples with normal variability, not field performance guarantees. Event duration is an interaction timing proxy, not field INP. Google map requests were aborted only in the deterministic performance measurement. A separate real-network test loaded the actual Google map and verified zoom changed the scale from 100 m to 50 m per 42 pixels.

## Verification

- Production build and TypeScript passed. ESLint: zero errors, five pre-existing no-img-element warnings.
- All nine viewport checks passed: 320×568, 360×800, 393×852, 412×915, 768×1024, 1024×768, 1366×768, 1920×1080 and 844×390. No document horizontal overflow.
- Chrome and Edge: envelope opening, PNG download, navigation, query preservation, confirmation focus trap and Escape passed.
- Mocked guest lookup and RSVP submission preserved the encoded guest token and draft message. No live guest-sheet writes were made during testing.
- Map loaded once on approach and retained its iframe on revisit. Real Google map zoom verified.
- Music: zero initial audio requests, successful playback after interaction, loop enabled, no audio error, mute/resume passed. This checks browser playback state, not physical speaker output.
- Facebook, Twitter and WhatsApp user-agent HTTP requests to the local production server returned the correct raw HTML metadata. Local image route returned HTTP 200, image/png, actual 1200×630 PNG. Physical phones and platform-generated previews were not tested.

## Publishing and preview caches

No Git commands or deployment were performed. These changes are in the local project and ZIP; the updated image is not published yet.

After an approved deployment, check the public homepage source and this image:
https://wedding-rsvp-omega-taupe.vercel.app/og.png?v=20261211-cv-20261118

Then open https://developers.facebook.com/tools/debug/, enter the public homepage and choose Scrape Again. The new image query version gives caches a new image URL. WhatsApp and X maintain independent caches; old messages may retain old previews and no refresh timing is guaranteed. Keep personal guest tokens private; the shared canonical homepage metadata excludes them without changing invitation query handling.

References: [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Meta sharing documentation](https://developers.facebook.com/documentation/sharing/webmasters), [iframe loading](https://web.dev/articles/iframe-lazy-loading).
