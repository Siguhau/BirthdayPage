# Escape room

The birthday page owns the countdown and celebration. `EscapeRoomGame` owns the
escape room and calls `onComplete` after the Pepsi chest is opened. The 3D world
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
key, but no code writes or restores it. Reloading starts at the introduction.
The completion view advances automatically to the birthday celebration after
1.2 seconds; there is not yet a separate final exit interaction.

## Adding a puzzle

Add its ID to `state/gameTypes.ts`, its overlay to `puzzles/puzzleRegistry.ts`
if it uses one, and its world interaction in `world/worldConfig.ts`. Keep answer
validation in the puzzle UI or a pure helper. Add tests for the player's
success and failure paths, and for any reducer transition or world prerequisite.
Puzzle screens call `onSolve` and do not navigate to the birthday page.

The vase CAPTCHA still needs 16 real images and the correct tile IDs in
`puzzles/vaseCaptchaConfig.ts`. Its confirmation button is disabled until then.
A development-only completion shortcut is present for testing the handoff.
Remove the shortcut when the production puzzle is configured.

## Preview and verification

Run `pnpm dev` from the `BirthdayPage/` package directory and open
`http://127.0.0.1:5173/?preview=birthday`. Select the escape-room entry in the
preview controls.

Before committing, run `pnpm test`, `pnpm typecheck`, `pnpm lint`,
`pnpm format:check`, and `pnpm build`. Real WebGL, pointer lock, collisions,
mouse movement, and the full puzzle route also require browser playtesting.
The phase acceptance criteria are in `ESCAPE_ROOM_3D_PLAN.md`.
