# Run the updated Wedding RSVP locally

1. Install Node.js 22.13 or newer if it is not already installed.
2. Extract `Wedding-RSVP-restored.zip` to a normal folder.
3. Open PowerShell in the extracted `Wedding-RSVP-restored` folder (the folder containing `package.json`).
4. Run:

```powershell
npm ci
npm run dev
```

5. Open http://localhost:3000 in your browser. If Next.js chooses another port, use the URL printed in the terminal.
6. Stop the local server with Ctrl+C.

## Personal invitations and RSVP

The ZIP includes all application source and original public assets. Private `.env.local` settings are intentionally excluded. Copy your existing project's `.env.local` into the extracted folder, alongside `package.json`, before starting the server. Alternatively, copy `.env.example` to `.env.local` and fill in your existing Apps Script settings privately. Restart the server after changing environment settings.

Use `http://localhost:3000/?guest=YOUR_EXISTING_GUEST_TOKEN` to test a personal invitation. Keep the original token, changing only the website origin to localhost. Without a guest token, the RSVP section correctly asks for a personal invitation link.

If you configure the production Apps Script service, submitting an RSVP locally writes to that same live guest sheet. Use a designated test invitation when checking submission.

## Production-mode local test

Stop the development server, then run:

```powershell
npm run build
npm run start
```

Open http://localhost:3000 again. Additional checks:

```powershell
npm run lint
npx tsc --noEmit
```

## Testing on a phone on the same Wi-Fi

Start with `npm run dev -- --hostname 0.0.0.0`, then open `http://YOUR_PC_LAN_IP:3000` on the phone. You can find your PC's IPv4 address with `ipconfig`. Windows may ask you to allow Node.js on your private network. Keep `?guest=YOUR_EXISTING_GUEST_TOKEN` on the phone URL to test the personal invitation.

Check scrolling, rotation, opening/closing the RSVP confirmation, music after tapping the invitation, and animations with the phone's reduced-motion setting both enabled and disabled.

## Package contents

Source, original assets, dependency lockfile, example configuration and optimization report are included. Generated build output, installed dependencies, Git history, private environment settings and temporary browser-test files are excluded. `npm ci` recreates dependencies from the included lockfile.

