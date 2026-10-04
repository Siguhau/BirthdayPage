# Escape room

The birthday page owns the countdown and celebration. `EscapeRoomGame` owns the
escape room and calls `onComplete` after the Pepsi is collected. The 3D world
is loaded only after a supported desktop player starts the game.

## Current structure

```text
escape-room/
  puzzles/       Puzzle data and small progression helpers
  screens/       Introduction, puzzle, unsupported-device, and completion UI
  overlays/      DOM puzzle dialog
  state/         Reducer and game state types
  support/       Mobile, reduced-motion, and WebGL checks
  world/         3D scene, controls, interactions, and in-world dialogs
  persistence/   Clear-memory helper only
```

`state/gameReducer.ts` owns solved puzzles, inventory, installed items, mirror
orientations, laser power, and completion. `puzzles/puzzleRegistry.ts` maps
puzzle IDs to DOM overlays. Some interactions and temporary room state still
live in `world/EscapeRoomWorld.tsx`.

Progress is currently **not saved**. The clear-memory action removes a storage
key, but no code writes or restores it. Reloading the live page on the birthday
replays the zero-countdown entry and starts a new game.
The completion view advances automatically to the birthday celebration after
2.4 seconds, or immediately with reduced motion; there is no separate final
exit interaction.

## Puzzle route

Vase CAPTCHA, WiiMonday, and Brita each award one token, once per game.
The vending machine in Memory Gallery exchanges tokens for a camera, battery,
and tripod in any order. Each component costs one token and can be redeemed
only once; installing a component does not refund its token. These components
are no longer free pickups elsewhere in the rooms.

Assemble the equipment at the studio marker, take one successful Longboi photo,
and hang it on the gallery hook. The hidden-room switch and hung photo together
activate the blacklight clue. The displayed key and trapdoor password both
come from `puzzles/trapdoorCipher.ts` (birthday shift 30); the lock does not
reveal the key. Maisjakten supplies the separate laser code, and the three
mirror placements/orientations open the Pepsi chest.

Solid room walls, floors, ceilings, and closed doors block interactions. The
walk-through painting remains an intentional hidden passage. While the camera
counts down, other interactions wait; opening the menu pauses the countdown.

## Adding a puzzle

Add its ID to `state/gameTypes.ts`, its overlay to `puzzles/puzzleRegistry.ts`
if it uses one, and its world interaction in `world/worldConfig.ts`. Keep answer
validation in the puzzle UI or a pure helper. Add tests for the player's
success and failure paths, and for any reducer transition or world prerequisite.
Puzzle screens call `onSolve` and do not navigate to the birthday page.

The vase CAPTCHA has 16 images configured in `puzzles/vaseCaptchaConfig.ts`.
The original seven bottles, measuring jugs, and carafe remain correct answers
and retain their remote image URLs. The nine incorrect images are the user's
photos of pots and a glass jar, optimized as local WebP files in
`public/images/puzzles/vases/`. Keep the source HEIC files outside the repository.
The 4×4 layout and original answer key are unchanged.

The twelve Longboi result photos are optimized WebP files in
`public/images/longboi/`. `puzzles/longboiPhotos.ts` assigns nine to successful
results and three to failed results. The first successful shot completes the photo puzzle and grants one collectible
photo for the gallery hook. Further shots remain available for fun without
adding more inventory rewards. Pausing preserves the exact countdown time. Each result type has its own shuffled deck; every photo appears once
before that deck reshuffles. Keep the source HEIC files outside the repository;
the WebP copies are sized for display and contain no original photo
metadata. These files are served publicly with the game, so add only photos
that are intended to be visible to its players. A backend is unnecessary for
this fixed set of game images.

## Preview and verification

Brita's 3×3 sliding-tile puzzle hangs on the north wall of Memory Archive.
Interact with the frame to open it. Click adjacent tiles, use Tab/Enter, or
use arrow keys to move the empty space. Restarting restores the opening shuffle. Shuffles use
legal moves so they are always solvable. Completing the image and choosing
"Tilbake til rommet" records the solve and restores the wall photo. This is an
token-awarding puzzle: completing it earns one token for the camera vending
machine, just like the vase CAPTCHA and WiiMonday.
Its supplied photo is served locally from `public/images/puzzles/brita.webp`.
Like the other puzzle overlays, unfinished attempts reset when closed.

Run `pnpm dev` from the `BirthdayPage/` package directory and open
`http://127.0.0.1:5173/?preview=birthday`. Select the escape-room entry in the
preview controls.

Before committing, run `pnpm test`, `pnpm typecheck`, `pnpm lint`,
`pnpm format:check`, and `pnpm build`. Real WebGL, pointer lock, collisions,
mouse movement, and the full puzzle route also require browser playtesting.
The phase acceptance criteria are in `ESCAPE_ROOM_3D_PLAN.md`.
