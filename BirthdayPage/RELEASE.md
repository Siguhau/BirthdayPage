# Birthday escape room release

## Configuration

- Birthday: **December 17**, evaluated in **Europe/Oslo**.
- Runtime: Node.js 24; package manager: pnpm 11.14.0.
- The live page holds its countdown at zero for one second, then plays the
  2.8-second door passage. This also happens on birthday-day reloads.
- Collecting the Pepsi triggers the 2.4-second transition into the celebration.
- Preview query parameters are ignored in production.

## Included changes

- Birthday countdown reveal, door passage, and fireworks finale.
- Token rewards for the vase, WiiMonday, and Brita puzzles, exchanged for
  camera equipment at the vending machine.
- Local WebP puzzle and Longboi photos, repeatable photo attempts, and a
  countdown that pauses with the game menu.
- Blacklight/cipher progression, trapdoor lock, mirror puzzle, and Pepsi reward.
- Interaction blocking through solid walls, floors, ceilings, and closed doors.
- Pointer-lock compatibility with both Promise-returning and older void-returning
  implementations, covered by regression tests.

## Verification

From `BirthdayPage/`:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

From the repository root, build the same image definition used by CI:

```sh
docker build --platform linux/arm64 -t birthdaypage:release-candidate .
docker run --platform linux/arm64 --pull never --rm -p 127.0.0.1:1337:1337 birthdaypage:release-candidate
```

Open `http://127.0.0.1:1337/` to inspect the production countdown. Requests with
`?preview=birthday`, `?preview=teaser`, or `?preview=escape-room` must also show
the normal live page. Use the development server for the puzzle-route playtest.

### Verified locally on October 4, 2026

- 164 tests across 34 files passed, along with type checking, lint, formatting,
  and the production build.
- The ARM64 Docker image built successfully with a frozen lockfile and reached
  `healthy`. Nginx configuration and HTTP response checks passed.
- The production page displayed the December 17 countdown even with
  `?preview=escape-room`, with no captured browser console errors.
- All 24 local asset references checked exist in both source assets and build
  output. The service worker precaches 48 entries, totaling 8,646.44 KiB.
- The largest JavaScript chunk is the 3D world: 3,235.75 kB, or 1,107.58 kB
  gzipped. The main entry is 233.65 kB, or 74.67 kB gzipped. The largest image
  is the secret-passage PNG at 2,930.15 kB.

These checks apply to the local release candidate; GitHub CI and publication
have not been triggered. Full cross-browser gameplay remains a manual check.

## Manual playtest before publishing

1. In the development server, use `/?preview=birthday` to watch the final ten
   seconds and the door passage. Use `/?preview=escape-room` for direct entry.
2. Check pointer lock, mouse look, WASD, jump, Escape/resume, tab switching,
   and collisions in desktop Chrome, Edge, Firefox, and Safari.
3. Solve vase CAPTCHA, WiiMonday, and Brita; spend the three tokens on camera,
   battery, and tripod. Assemble them, pause/resume a photo countdown, take a
   successful photo, and hang it. Check the hidden switch and blacklight clue.
4. Solve Maisjakten, unlock the trapdoor, descend the ladder, place and rotate
   all three mirrors, then collect the Pepsi. Verify one birthday-finale handoff.
5. Check mobile, reduced-motion, and unavailable-WebGL fallback screens and
   their continuation to the celebration.

The automated world tests mock WebGL/physics and do not replace this playtest.

## Known limitations

- Game progress is held in memory. Reloading starts over; only the visual theme
  reveal is remembered. The menu's reset action starts a fresh game.
- Seven vase images still use external image hosts and require connectivity.
- The 3D world is lazy-loaded, but the service worker precaches its bundle and
  local photos. The production build emits a large-chunk warning.
- The original phase plan describes saved progress and a separate final exit;
  those are not part of this release.

## Publishing and rollback

The GitHub workflow `.github/workflows/` runs formatting, lint, type checking,
tests, and a production build for pull requests to `main`. A push to `main`
publishes a **linux/arm64** image to `ghcr.io/siguhau/birthdaypage`, tagged `latest`
and with the commit SHA. Manual workflow dispatch also publishes an image.

Publishing the image does not itself update the running homelab service. Update
that service through its normal deployment configuration after checking CI.
Keep the previous image SHA/digest available so the service can be rolled back
to that exact image if needed.
