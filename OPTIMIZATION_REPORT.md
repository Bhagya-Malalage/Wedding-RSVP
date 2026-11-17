# Original UI restoration and technical corrections

This report supersedes the earlier optimization report. Work was performed on the current project only. Nothing was deployed or pushed.

## Reference comparison

Original reference archive: `Wedding RSVP old.zip`, project root `Wedding RSVP/`.
Current source archive: `Wedding RSVP new.zip`, project root `Wedding RSVP/Wedding RSVP/`.
Working source: the current workspace containing `app/`, `lib/`, `public/` and `package.json`.

Actual comparison showed that the original reference and untouched current archive contain identical `app/page.tsx`, `app/globals.css` and `package.json` files. All seven public assets also have identical SHA-256 hashes. The unwanted visual differences were introduced by the previous optimization in this workspace, not by a different original design.

## Exact application files changed

- `app/globals.css`
- `app/page.tsx`

Documentation updated: `OPTIMIZATION_REPORT.md` and `LOCAL_TESTING.md`. Verification scripts, reference excerpts, JSON results and screenshots are under ignored `work/`. The deliverable is `Wedding-RSVP-restored.zip`.

## 1. Original UI restoration

Removed all previously added presentation overrides: card minimum heights, extra cover padding, compact save-card positioning, altered button dimensions, safe-area positioning changes, wrapping/grid changes, extra focus styling and modal sizing changes. Restored the original header gleam keyframes and original wheel navigation.

The original envelope size, aspect ratio, transforms, responsive breakpoints, introductory screen grid and stable `svh` viewport sizing are retained. The previous optimization made the invisible save-date card `position:relative` even during the sealed stage, which created another grid item and displaced the envelope toward the top. Removing that override restores the original envelope placement.

Restored the original card dimensions and discovery-cue placement. The arrow element was never deleted: it remains the exact original `<i>↓</i>` in the original discovery button. Extra minimum card heights and bottom padding had moved the cue out of its expected position. Removing those overrides restores the original placement, font sizes and `arrowDown` keyframes: 1.55 seconds, ease-in-out, repeating, with an 8px vertical movement. Clicking it still opens the Poruwa ceremony section. The original card ornaments, ballroom information, type, colours, borders, spacing and ceremony presentation remain unchanged.

No new visual design, asset, icon, transition, typography, spacing system or breakpoint was introduced. Normal-motion presentation is frozen to the reference. Reduced-motion preferences remain an accessibility exception to movement, as in the original project.

## 2. Vibration animation correction

The confirmed defect is the original reduced-motion rule: `animation-duration:.01ms!important` retained infinite iterations. This makes multi-second animations extremely short loops whenever reduced motion is enabled. The correction retains the original short reduced-motion duration but adds `animation-iteration-count:1!important`, preventing infinite rapid cycling while allowing existing finite reveal animations to reach their completed state. It does not globally disable normal-motion animation or change normal durations, direction or intensity.

The normal envelope remains a single four-second CSS animation. There is no frame-count-based JavaScript shaking loop, device detection or haptic feedback. Countdown state updates remain isolated to their existing component. The opening has a synchronous duplicate-start guard and an effect-owned timer with cleanup; reduced-motion opening skips the decorative delay. The confirmation focus animation frame is cancelled during cleanup. Existing timers, fetch abortion and observer cleanup remain intact. CSS animation timelines use elapsed time rather than a frame increment, and ordinary component rerenders do not recreate the envelope node or animation.

Background-tab behavior was reviewed at source level: there is no custom visibility listener restarting animations or allocating additional loops. Browser background scheduling can delay timers; the effect-owned opening timer and ref guard prevent duplicated starts. Actual visibility/refresh-rate traces on physical phones are still needed.

The reduced-motion defect is proven in source and browser emulation. It is not proof that the reported Samsung and iPhone had different reduced-motion settings. The exact cause on those physical devices remains unconfirmed without reproducing their settings and behavior. No speed change was applied based on a guess about the phone model.

## 3. Scrolling correction

- Removed the global `overflow-y:auto!important` that overrode the confirmation dialog's scroll lock.
- Lock and restore both document root and body overflow while confirmation is open.
- Keep vertical scrolling on the document rather than making the body and outer invitation wrapper accidental scroll containers. `overflow-x:clip` clips horizontal decoration without creating a nested vertical scrollport.
- Retain the existing native wheel-to-next interaction, discovery button, reveal observer, section transitions and return navigation. No new scroll library, scroll speed manipulation, wheel cancellation or touch interception was added.
- Return navigation respects reduced motion; normal behavior remains smooth as originally implemented.
- Decorative frame pseudo-elements cannot intercept the invitation button. This affects hit testing only, not their appearance.

## 4. Supporting technical changes

Retained the confirmation dialog's keyboard focus loop and focus restoration, timer/frame cleanup and inert state for hidden articles. These support interaction and lifecycle behavior without changing the original visual presentation.

## Validation

- Production build passed, including Next.js TypeScript compilation.
- `npm run lint` passed with zero errors and the same five pre-existing decorative-image warnings (`@next/next/no-img-element`). No warnings were suppressed.
- `npx tsc --noEmit` passed.
- Full source diff reviewed against the original/current ZIP baseline; application changes are limited to the two files above and fall into the four categories in this report.

### Responsive reference comparison

Headless Chrome, normal motion, all requested sizes:

| Viewport | Intro geometry/styles match reference | Card/arrow geometry/styles match reference | Ceremony geometry/styles match reference | Document horizontal overflow |
| --- | --- | --- | --- | --- |
| 320 x 568 | Yes | Yes | Yes | None |
| 360 x 640 | Yes | Yes | Yes | None |
| 360 x 800 | Yes | Yes | Yes | None |
| 375 x 812 | Yes | Yes | Yes | None |
| 390 x 844 | Yes | Yes | Yes | None |
| 412 x 915 | Yes | Yes | Yes | None |
| 430 x 932 | Yes | Yes | Yes | None |
| 768 x 1024 | Yes | Yes | Yes | None |
| 1024 x 768 | Yes | Yes | Yes | None |
| 1280 x 800 | Yes | Yes | Yes | None |
| 1440 x 900 | Yes | Yes | Yes | None |
| 1920 x 1080 | Yes | Yes | Yes | None |

Reference comparison uses the actual original CSS loaded into the same current application. At consistent animation times, it compares bounding boxes, font sizes, colours and opacity for the intro, envelope, prompt, card copy, three ornaments, arrow, ceremony heading, image and copy. The original arrow character and 1.55-second timing were checked at every size. This is a targeted source/geometry comparison, not a claim of exhaustive pixel-by-pixel or physical-device equivalence. Captures are `work/restored-intro-*.png` and `work/restored-card-*.png`; results are `work/restoration-results.json`.

Reduced-motion tests at all twelve sizes verify a single iteration instead of infinite looping, zero infinite animations, no document horizontal overflow, intercepted guest lookup and RSVP submission, and correct modal scroll locking and dismissal. Results are in `work/reduced-restoration-results.json`.

Chrome and Edge normal-motion functional checks exercise opening, invitation PNG download, guest token handling, mocked RSVP, keyboard focus, Escape dismissal, return to the card and viewport rotation/resizing. These are browser simulations, not physical phones.

## Preservation and remaining limits

No assets were added, removed, replaced or edited. All seven public assets are unchanged, including music and mandalas. No application dependency or configuration changed. No API route, Apps Script helper, authentication, token format, request payload, environment name/value, secret or guest record changed. No old dependency folder, build folder, Git history or environment file was copied.

The current guest lookup/submission behavior, query format, routes, download, music controls, ceremony/countdown, calendar/directions links and confirmation remain present. Browser RSVP tests use intercepted responses and never write to the live guest sheet. An actual Google Apps Script lookup/save, external map loading and audible playback remain external/manual checks. Audio autoplay still depends on browser permissions and a user gesture.

Real Android Chrome/Samsung Internet, iOS Safari/Chrome, desktop Safari, 60/90/120Hz displays, actual finger/trackpad feel, mobile address-bar changes, app backgrounding/foregrounding, rotation and software-keyboard behavior require real-device verification. No Samsung Galaxy A075F or iPhone 16 was physically tested. If fast shaking persists with reduced motion off, obtain a recording and reproduction steps before changing the original effect.

The original schedule/content was preserved, including its existing 11:30 PM photography entry. No unrelated visual cleanup was performed.
