# 3D Escape Room Product Plan

## Approved Phase 0 game brief

Build a small first-person 3D escape room inside the existing React app. Keep
the current birthday-date gate and the `onComplete` handoff to the celebration.
The intended player is one friend celebrating his 30th birthday. The story is a
playful, personal journey through shared lives, presented as a slightly absurd
basement escape room. It should feel warm, funny, mysterious, and maze-like,
not frightening.

- Target a roughly 20-minute session on current desktop Chrome, Edge, Firefox,
  and Safari.
- Use WASD to move, the mouse to look, `E` to interact, and `Escape` to release
  pointer lock and open the menu.
- Give every puzzle unlimited retries. The player cannot permanently fail.
- Make hints available for the active puzzle, with at most one puzzle's hint
  visible at a time.
- A puzzle may declare mouse-only or keyboard-only input. Puzzle interfaces
  remain semantic React DOM overlays with correct focus behavior for their
  declared input method.
- Persist durable progress and completion in versioned `localStorage`. Offer
  Continue/Start Over behavior and a confirmed Clear Memory action in both the
  in-game menu and completion view.
- On mobile, when reduced motion is requested, or when WebGL is unavailable,
  explain why the 3D game is being skipped and then continue to the existing
  birthday celebration. There is no 2D puzzle fallback.
- Collecting the Pepsi Max unlocks the final exit. Using that exit shows a
  short congratulations view, records completion, and then invokes the existing
  birthday handoff. Later visits proceed to the celebration unless memory is
  cleared.

Use simple box geometry, flat colors, simple lighting, and few interactive
props. Build these configured areas:

1. **Memory Gallery:** an amber hallway with a deep-navy interface, two side
   rooms, and a locked door at the end.
2. **Oddities Workshop:** a playful purple, lime, yellow, and magenta side room
   for inside-joke interactions.
3. **Memory Archive:** a teal and coral side room for image, CAPTCHA, and
   cipher-style puzzles.
4. **Stairway:** opened only after every required Area 1 puzzle is solved; it
   leads down to Area 2.
5. **Pepsi Vault:** a cold-blue basement with red accents, further gates, the
   Pepsi Max, and the final exit.

Area 1 puzzles may have individual prerequisites. Some Area 1 rewards must be
recorded in an inventory and required by Area 2. Exact personal clues,
inventory objects, puzzle order, and decorative content remain intentionally
unresolved until the required content is supplied.

## Existing architecture to preserve

- `LiveBirthdayPage` decides between countdown, escape room, and birthday.
- `EscapeRoomGame` owns game progress and calls `onComplete`.
- `gameReducer` is the authoritative state transition layer.
- Puzzle screens own their local UI and report successful completion.
- The birthday finale and global theme remain outside the game.

The 3D work should stay under `src/features/escape-room/`. Do not move birthday
date logic or celebration components into the 3D scene.

## Recommended stack

| Concern       | Choice                                                                                | Reason                                               |
| ------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| App           | Existing React 19, TypeScript, Vite                                                   | Already working                                      |
| 3D renderer   | `three` + `@react-three/fiber` v9                                                     | React-native scene composition                       |
| Scene helpers | `@react-three/drei`                                                                   | Pointer lock, keyboard input, loaders, HTML overlays |
| Collision     | `@react-three/rapier` v2                                                              | React 19/R3F v9 support; reliable wall collision     |
| State         | Existing reducer, extended with world state                                           | Keeps progress deterministic and testable            |
| Persistence   | Versioned `localStorage` adapter                                                      | Resume after refresh without a backend               |
| Puzzle UI     | Normal React DOM overlay                                                              | Semantic inputs, buttons, and focus behavior         |
| Assets        | Procedural boxes first; optional compressed GLB later                                 | Avoids an early Blender/asset pipeline               |
| Testing       | Vitest + Testing Library for logic/UI; Playwright later for one happy-path smoke test | 3D pixels are brittle; behaviors are testable        |

Do not add Redux, a backend, multiplayer, WebXR, post-processing, or a
full entity-component system for the first version.

## Product behavior

### Supported desktop

- Click the scene to enter look mode.
- Move with WASD.
- Look with the mouse.
- A center reticle highlights an object in range.
- Press `E` to interact.
- `Escape` releases pointer lock and opens the paused menu.
- The menu offers Resume, Controls, and confirmed Clear Memory. Clearing memory
  resets puzzles and inventory and returns to the introduction.

### Unsupported path

- Mobile users do not enter the escape room.
- Reduced-motion users and browsers without working WebGL do not enter the
  escape room.
- Show a concise explanation, then continue to the birthday celebration through
  the existing page-level handoff.

### Puzzle UI and focus

- Show controls before entering the game.
- Never trap focus in the canvas.
- Puzzle overlays receive focus and release pointer lock.
- Pause movement while a puzzle overlay is open and restore focus safely when
  it closes.
- Keep puzzle UI in semantic React DOM. Each puzzle documents and tests its
  declared mouse-only or keyboard-only interaction mode.

## Proposed feature structure

```text
src/features/escape-room/
  world/
    EscapeRoomWorld.tsx
    Building.tsx
    PlayerController.tsx
    InteractionSystem.tsx
    WorldHud.tsx
    worldConfig.ts
    worldTypes.ts
  puzzles/
    puzzleRegistry.ts
    puzzleTypes.ts
    vase-captcha/
    ...
  overlays/
    PuzzleOverlay.tsx
    ControlsOverlay.tsx
  persistence/
    gameProgress.ts
  state/
    gameReducer.ts
    gameTypes.ts
  EscapeRoomGame.tsx
```

## Typed puzzle contract

The registry is the only place that binds puzzle metadata to its self-contained
UI. The world consumes placement and availability data without importing
puzzle components or puzzle IDs:

```ts
type PuzzleDefinition = {
  id: PuzzleId;
  placement: {
    areaId: AreaId;
    anchorId: string;
  };
  prerequisites: {
    solved?: readonly PuzzleId[];
    inventory?: readonly ItemId[];
  };
  interactionLabel: string;
  inputMode: "mouse" | "keyboard";
  overlay: React.ComponentType<PuzzleProps>;
  rewards?: {
    inventory?: readonly ItemId[];
  };
};

type PuzzleProps = {
  hintVisible: boolean;
  onRequestHint: () => void;
  onClose: () => void;
  onSolve: () => void;
};
```

Puzzle UI owns attempts and answer validation and emits only `onSolve`. The
registry defines prerequisites and rewards. Adding, removing, or reordering a
puzzle requires its self-contained UI and tests plus a registry/config entry;
it must not require changes to the world engine, player controller, interaction
system, or page-level birthday flow.

Validate the registry for unique IDs, valid placement anchors, existing
prerequisite and inventory references, and dependency cycles. Empty
prerequisites create independent puzzles; one or more solved-puzzle or inventory
requirements create ordered or prerequisite-based progression.

## State and durable progress

Keep rendering state out of React state when it changes every frame. Position,
velocity, and camera rotation belong in Three/Rapier refs. Product state belongs
in the reducer:

```ts
type GameState = {
  phase: "introduction" | "exploring" | "puzzle" | "escaped";
  activePuzzleId: PuzzleId | null;
  solvedPuzzles: PuzzleId[];
  inventoryItemIds: ItemId[];
  currentAreaId: AreaId;
  visibleHintPuzzleId: PuzzleId | null;
};
```

Suggested actions:

```ts
type GameAction =
  | { type: "START_GAME" }
  | { type: "OPEN_PUZZLE"; puzzleId: PuzzleId }
  | { type: "CLOSE_PUZZLE" }
  | { type: "SOLVE_PUZZLE"; puzzleId: PuzzleId }
  | { type: "CHANGE_AREA"; areaId: AreaId }
  | { type: "SHOW_HINT"; puzzleId: PuzzleId }
  | { type: "ESCAPE" }
  | { type: "RESET_GAME" };
```

Apply configured inventory rewards when handling `SOLVE_PUZZLE`. Derive puzzle,
door, gate, stairway, and final-exit availability from solved puzzles and
inventory rather than storing duplicate unlocked flags.

Persist only a schema version, solved puzzle IDs, inventory item IDs, current
area ID, and whether the player escaped. Do not persist active overlays, visible
hints, attempts, or frame-level physics state. Parse and validate storage through
a dedicated adapter; corrupt, impossible, or unsupported data must safely reset.

## Interaction design

Use one shared interaction system:

1. Cast a ray from the camera center.
2. Consider only registered interactive objects.
3. Select the closest enabled object within a short range.
4. Show its prompt in the HUD.
5. On interaction, dispatch a semantic action such as `OPEN_PUZZLE`.

Interactive objects should expose data, not import the reducer:

```ts
type Interaction = {
  id: string;
  label: string;
  enabled: boolean;
  puzzleId?: PuzzleId;
  action?: "open-puzzle" | "use-exit" | "open-menu";
};
```

Open puzzles as DOM overlays above the canvas. Pause player movement, release
pointer lock, focus the dialog, and restore exploration controls on close.

## Responsibility boundaries

- **Birthday pages:** retain countdown/date gating and receive only the final
  `onComplete`.
- **Eligibility layer:** chooses supported 3D play or explanation followed by
  the celebration.
- **3D world:** renders configured areas, themes, doors, anchors, and generic
  props.
- **Player controller:** owns movement, camera, and collision only.
- **Interaction system:** finds the nearest enabled registered interaction and
  emits its ID.
- **Puzzle registry:** owns definitions, placement, prerequisites, UI mapping,
  and rewards.
- **Puzzle UI:** owns local attempts and validation and never imports the
  reducer.
- **Reducer and selectors:** own authoritative progression, inventory,
  availability, and escape state.
- **Persistence adapter:** owns versioned parsing, validation, and reset.
- **Finale:** the final exit dispatches escape; the completion view records it
  and performs the established birthday handoff.

## Milestones

### Phase 0 — Product decisions

- Approved game brief, area structure, themes, target browsers, controls,
  progression contract, persistence, unsupported-user path, and finale are
  recorded above.
- Exact personal clues, assets, inventory items, and final puzzle ordering are
  intentionally deferred until the owner supplies them.

Exit criterion met: the product boundaries and Phase 1 scope are explicit
without inventing personal content.

### Phase 1 — Walking prototype

- Add the three 3D dependencies.
- Render a full-viewport canvas only inside the escape-room page.
- Build one flat-walled corridor with two side rooms and interactive sliding
  doors from boxes.
- Add WASD movement, mouse look, wall collision, an `E` interaction placeholder,
  and a visible prompt.
- Add an `Escape` menu with Resume, Controls, and confirmed Clear Memory.
- Drive area colors and interface styling from typed configuration.
- Detect unsupported mobile, reduced-motion, and WebGL cases; explain the skip
  and continue to the celebration.

Exit criterion: a supported desktop player can traverse the corridor and both
side rooms without passing through walls, open both doors, change configured
area themes, use the interaction placeholder, and safely pause/resume.
Unsupported paths reach the existing celebration only after an explanation.

Phase 1 acceptance:

- The countdown → escape room → birthday callback contract is unchanged.
- The 3D chunk is lazy-loaded only for an eligible escape-room user.
- Chrome, Edge, Firefox, and Safari pass a manual matrix for pointer lock,
  movement, collision, interaction, pause/resume, resize, and lost focus.
- Automated tests cover eligibility, typed configuration, theme selection, menu
  DOM behavior, and existing reducer/page-flow regressions. Real WebGL, pointer
  lock, and collision are documented manual checks because jsdom cannot prove
  them.
- `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, and
  `pnpm build` pass.
- Real puzzles, inventory content, the full Area 1 layout, stairway, basement,
  Pepsi finale, audio, detailed assets, backend, multiplayer, WebXR,
  post-processing, and a general-purpose engine are non-goals.

### Phase 2 — Interaction slice

- Add one interactive pedestal/door.
- Implement distance-limited targeting and the HUD prompt.
- Open the existing vase CAPTCHA as an accessible DOM dialog.
- Pause movement during the puzzle.
- Dispatch `SOLVE_PUZZLE`, visually change the object, and unlock one door.

Exit criterion: start game → walk to object → solve existing puzzle → door
opens, with reducer tests passing.

### Phase 3 — Complete game

- Build the approved two-area layout, side rooms, stairway, and Pepsi Vault.
- Add remaining personalized puzzles and clue placement.
- Add configured hints, feedback, inventory rewards, and the final objective.
- Collecting the Pepsi Max unlocks the final exit. Trigger `onComplete` only
  after the player uses that exit and sees the completion view.
- Add versioned persistence and reset controls.

Exit criterion: the full experience survives refresh, remembers completion,
and reaches the existing birthday finale exactly once.

### Phase 4 — Polish and hardening

- Optimize textures/assets and lazy-load the 3D chunk.
- Clamp device pixel ratio and minimize dynamic shadows.
- Verify PWA caching includes any `.glb`, `.webp`, audio, and WASM assets.
- Test pointer lock loss, tab switching, resize, refresh, reduced motion, WebGL
  failure, mouse-only puzzles, and keyboard-only puzzles.
- Add a Playwright happy-path smoke test if the interaction layer is stable.

Exit criterion: acceptable performance in all four target desktop browsers, no
progress loss, and a correct explained skip on unsupported paths.

## Performance budget

- Procedural geometry for the first release.
- One main light plus ambient/hemisphere light.
- Prefer no real-time shadows; if needed, one small shadow map.
- Cap device pixel ratio conservatively on supported desktop hardware.
- Lazy-load the world so the countdown and celebration do not download 3D code.
- Compress later GLB models and textures; keep texture dimensions modest.
- Avoid post-processing until profiling proves there is budget.
- Keep draw calls low by merging or instancing repeated wall/floor pieces.

## Risks to resolve early

- Pointer lock is a desktop interaction, not a mobile control scheme.
- Physics and pointer-lock behavior are poorly represented by jsdom tests.
- Pointer-lock behavior differs across the four target browsers and requires
  real-browser checks.
- Canvas content is not inherently accessible; puzzles remain DOM UI, but the
  approved mouse-only or keyboard-only input modes will exclude players who
  cannot use that puzzle's required device.
- A dependency cycle, invalid placement, or missing inventory reward could make
  the game impossible to complete; registry validation must reject these.
- Corrupt or obsolete persisted data must fail closed to a safe reset.
- Client-side answers are inspectable. This is fine for a personal game, but not
  secure against deliberate cheating.
- PWA precaching must include 3D/audio/WASM file types or offline behavior may
  fail unexpectedly.
- A beautiful 3D room can consume more time than the actual puzzle design.
- The 20-minute target cannot be verified until final personal content exists.

## Required personal content and assets

- Sixteen final CAPTCHA images, neutral descriptions, and the correct tile IDs.
- Corn artwork, the chase target, interaction rules, and success condition.
- Caesar-cipher message, key, clue, answer, and hint text.
- The exact Area 1 inventory objects and their Area 2 uses.
- Personal memories, captions, clue copy, and final decorative choices.
- The Pepsi Max representation and final-exit presentation.
- Final puzzle count, ordering, prerequisites, and difficulty allocation.

## GPT-5.6 Sol prompt strategy

These prompts follow the GPT-5.6 guidance: state each instruction once, keep
the toolset and context lean, define autonomy and approval boundaries, specify
success criteria, and request evidence rather than vague “think harder”
language.

Use `gpt-5.6-sol` with medium reasoning for normal implementation phases.
Increase reasoning only for a difficult diagnosis or architectural review.
Give each phase to a fresh task so the context stays focused.

### Prompt 0 — Product discovery and extensible game design

```text
Act as the product architect for Phase 0 of the birthday escape-room game.
This phase is discovery and planning only. Do not implement code, install
dependencies, or change application behavior.

Source of truth:
- Read ESCAPE_ROOM_3D_PLAN.md.
- Inspect the existing escape-room feature, reducer, puzzle backlog, birthday
  handoff, package.json, and relevant tests.
- Treat my answers as authoritative when they differ from the current plan.

Use my configured agents:
1. Spawn cheap_explorer to map the current escape-room architecture, extension
   points, constraints, and reusable pieces.
2. Spawn cheap_test_reviewer to identify testability and regression risks in a
   configurable multi-puzzle design.
Run them in parallel, keep them read-only, and wait for both. Ask them for short
findings with exact file references. Synthesize their evidence; do not paste
their raw output.

Rules:
- Ask; do not assume. If a missing answer could change the story, room layout,
  puzzle model, controls, accessibility, persistence, or scope, ask me before
  deciding it.
- Ask a short, prioritized batch of no more than three questions at a time.
- Do not ask questions that the repository or plan can answer.
- Clearly label any low-risk provisional recommendation and wait for approval
  before making it a product decision.
- Verify claims against the repository. Do not invent personal details, puzzle
  content, assets, requirements, or completed behavior.
- Design for adding, removing, and reordering puzzles without editing the world
  engine, player controller, or page-level birthday flow.
- Prefer typed configuration and a small puzzle contract over conditionals,
  puzzle-specific imports throughout the world, or premature abstractions.
- Keep puzzle UI as accessible React DOM unless I explicitly choose otherwise.
- Preserve the existing countdown → escape room → birthday contract.
- Keep questions, progress updates, and the final plan short.
- Clean up after yourself: do not leave temporary files, debug output, generated
  artifacts, or unrelated edits. Preserve all pre-existing user changes.

Required design outcome:
- A concise game brief covering audience, story, tone, target devices, controls,
  room structure, difficulty, session length, hints, failure behavior,
  persistence, accessibility, and final escape condition.
- A typed, extensible puzzle contract describing identity, placement,
  prerequisites, interaction label, render/overlay behavior, solve event, and
  durable progress.
- A data-driven progression model that supports independent, ordered, and
  prerequisite-based puzzles without hard-coding each puzzle into the world.
- Clear boundaries between the 3D world, interaction system, puzzle registry,
  puzzle UI, reducer, persistence, and birthday finale.
- A proposed first vertical slice and explicit non-goals.
- A list of unresolved decisions, risks, and required personal content/assets.
- Acceptance criteria for Phase 1.

Process:
1. Inspect the repository and collect both agent reports.
2. Tell me what is already known in at most five bullets.
3. Ask the highest-impact unanswered questions, up to three at a time.
4. Continue in short rounds until the decisions needed for Phase 1 are explicit.
5. Present the proposed Phase 0 plan for my approval.
6. Only after approval, update ESCAPE_ROOM_3D_PLAN.md with the agreed decisions.
   Make no other file changes.
7. Review the diff for unsupported assumptions, contradictions, unnecessary
   complexity, and accidental edits. Correct any issue found.

Definition of done:
- I explicitly approve the product decisions.
- The plan makes a new puzzle addable through a registry/config entry plus its
  self-contained UI and tests, without modifying core movement or interaction
  code.
- Every important choice is supported by repository evidence or my answer.
- The plan contains no invented personal details or unresolved hidden
  assumptions.
- Only the approved planning document is changed, and its diff is clean.

When blocked by missing information, stop and ask. Do not guess.
```

### Prompt 1 — Architecture and walking prototype

```text
You are implementing Phase 1 of a small first-person 3D escape room in this
repository.

Goal:
Add a walking prototype inside the existing escape-room feature. Preserve the
countdown/date gate and the existing onComplete handoff to the birthday finale.

First inspect package.json, LiveBirthdayPage, BirthdayPageView, EscapeRoomGame,
the escape-room reducer/types/tests, the reduced-motion hook, and Vite/PWA
configuration. Then implement the smallest coherent vertical slice.

Technical choices:
- React 19 + TypeScript + Vite
- three, @react-three/fiber v9, @react-three/drei
- @react-three/rapier v2 for collision
- Procedural box geometry only
- Keep all new code under src/features/escape-room unless an existing shared
  utility is clearly the right owner

Required behavior:
- The introduction remains DOM UI.
- Starting the game opens a lazy-loaded full-viewport 3D canvas.
- Create one flat-walled corridor with two side rooms and interactive sliding
  doors.
- Desktop movement supports WASD, mouse look, `E` interaction, pointer-lock
  release, and a visible reticle/prompt.
- The player cannot pass through walls.
- Show concise control instructions before pointer lock.
- `Escape` opens a paused menu with Resume, Controls, and confirmed Clear
  Memory.
- Change environment colors and interface styling from typed area
  configuration when the player enters either side room.
- On mobile, when WebGL is unavailable, or when reduced motion is preferred,
  explain why the game is skipped and then use the existing handoff to continue
  to the celebration.
- Do not implement real puzzles, inventory content, the full Area 1 layout,
  basement, finale, art assets, a backend, multiplayer, WebXR, or
  post-processing in this phase.

Engineering constraints:
- Do not put per-frame position or camera updates in React state.
- Keep scene, input, and collision responsibilities in separate components.
- Preserve unrelated user changes.
- Local code edits and non-destructive validation are authorized. Ask before
  destructive actions, external writes, or material scope expansion.

Success criteria:
- pnpm test, pnpm typecheck, pnpm lint, pnpm format:check, and pnpm build pass.
- The original countdown and birthday finale still compile and behave through
  the same page-level contract.
- Add automated coverage for eligibility, area-theme configuration, and menu
  DOM behavior.
- Document manual checks in current desktop Chrome, Edge, Firefox, and Safari
  for pointer lock, collision, interaction, pause/resume, resize, and lost
  focus, plus the mobile, reduced-motion, and WebGL explanation paths.

Lead your final response with the outcome. List changed files, validation
results, manual checks still needed, and any concrete risk or follow-up.
```

### Prompt 2 — Interaction and first puzzle slice

```text
Implement Phase 2 of the 3D escape room in this repository.

Goal:
Turn the walking prototype into one complete interaction loop using the
existing vase CAPTCHA: explore → target object → open puzzle → solve → unlock
door.

Inspect the current world components, EscapeRoomGame, reducer/types/tests,
VaseCaptchaPuzzle, and puzzle configuration before editing.

Required behavior:
- Add one pedestal or framed object that registers with a shared interaction
  system.
- Raycast from the camera center and select only the closest enabled
  interaction within a short configured range.
- Show a reticle state and `E to interact` HUD prompt.
- Pressing `E` opens the existing vase CAPTCHA in a semantic DOM dialog over
  the canvas.
- Opening a puzzle pauses movement, releases pointer lock, moves focus into the
  dialog, and prevents canvas input.
- Closing an unsolved puzzle returns to exploration without changing progress.
- Solving dispatches a semantic reducer action, changes the world object's
  solved state, and unlocks/opens one door.
- Do not duplicate puzzle truth in component-local and reducer state.
- Do not rewrite the vase puzzle unless integration requires a small,
  behavior-preserving API change.

Testing:
- Add reducer tests for opening, closing, solving, duplicate solve attempts,
  and door availability.
- Add DOM-level tests for puzzle overlay focus/close/solve behavior.
- Do not assert rendered pixels or Three.js implementation details in jsdom.

Scope:
Do not add other puzzles, persistence, final art, audio, or post-processing.
Local edits and non-destructive validation are authorized. Ask before
destructive actions, external writes, or material scope expansion.

Run pnpm test, pnpm typecheck, pnpm lint, pnpm format:check, and pnpm build.
Report the outcome, changed files, evidence from tests, manual 3D checks, and
remaining risks.
```

### Prompt 3 — Full game progression and persistence

```text
Implement Phase 3 of the birthday escape room, building on the existing 3D
walking and interaction slice.

Before editing, inspect the reducer, world configuration, interaction system,
puzzle registry, current tests, LiveBirthdayPage, and the existing
onComplete-to-finale handoff. Summarize the current progression in a few
sentences, then implement.

Goal:
Create the approved Memory Gallery, side rooms, stairway, and Pepsi Vault with
configurable puzzle/object placement, durable progress, inventory, and a final
exit.

Requirements:
- Represent rooms, doors, spawn points, puzzle stations, and clue props in
  typed configuration where practical.
- Use the existing personalized puzzle backlog to implement only the selected
  final puzzles; if their content/assets are not specified, create typed
  placeholders and clearly list the missing product inputs instead of inventing
  personal facts.
- Derive locks from solved puzzle requirements.
- Persist only durable reducer state in localStorage using a schema version,
  runtime validation, and a safe reset path.
- Never persist camera frame data or Rapier objects.
- When saved data is invalid or from an unknown schema, start safely without
  crashing.
- Every required Area 1 puzzle opens the stairway. Configured Area 1 inventory
  may be required by Area 2 gates.
- Collecting the Pepsi Max unlocks the final exit.
- The existing birthday finale appears only after the player explicitly uses
  that exit and sees the completion view.
- Prevent duplicate onComplete calls.
- Keep puzzle interfaces as semantic DOM overlays and test each declared
  mouse-only or keyboard-only mode.

Do not add a backend, authentication, analytics, multiplayer, WebXR, or final
high-poly assets.

Add focused tests for dependency order, invalid actions, hydration, corrupt
storage, schema mismatch, reset, and exactly-once completion. Run pnpm test,
pnpm typecheck, pnpm lint, pnpm format:check, and pnpm build.

Local edits and non-destructive validation are authorized. Ask before
destructive actions, external writes, or material scope expansion.

In the final response, lead with what is playable now. Then list validation,
missing puzzle content/assets, manual checks, and the next highest-value polish
task.
```

### Prompt 4 — Performance, accessibility, and release review

```text
Review and harden the completed 3D birthday escape room for release. Diagnose
first, then implement only evidence-backed, in-scope fixes.

Inspect the full escape-room feature, dependency versions, build output,
Vite/PWA asset rules, tests, reduced-motion behavior, and current git diff.

Evaluate:
- Bundle size and whether the 3D world is lazy-loaded away from countdown and
  birthday routes
- Draw calls, geometry reuse, texture sizes, lights, shadows, device pixel
  ratio, and per-frame allocations
- Desktop pointer lock, WASD, mouse look, puzzle-specific mouse or keyboard
  input, resize, tab switching, and pointer-lock loss
- Dialog focus, escape/close behavior, readable HUD, reduced motion, WebGL 2
  failure, mobile detection, and the explained skip to celebration
- Progress hydration, corrupt storage, reset, and exactly-once finale handoff
- PWA inclusion of GLB, WebP, audio, and Rapier WASM assets actually used

Constraints:
- Keep visual changes consistent with the existing escape-room theme.
- Do not add speculative abstractions or dependencies.
- Do not replace working procedural art with generated assets.
- Avoid brittle pixel tests. Prefer state, interaction, and one end-to-end happy
  path where the environment supports it.
- Preserve unrelated user changes.
- Local edits and non-destructive validation are authorized. Ask before
  destructive actions, external writes, or material scope expansion.

Success criteria:
- All existing validation commands pass.
- Production build output and largest relevant chunks/assets are reported.
- No known blocker remains in current desktop Chrome, Edge, Firefox, or Safari.
- Anything that cannot be automated is captured as a short manual test script.

Lead the final response with release readiness: ready, ready with caveats, or
not ready. Support it with concrete evidence and list only material remaining
risks.
```

## Manual acceptance script

1. Before the birthday, verify only the countdown loads and no 3D chunk is
   requested.
2. On the birthday, enter the escape room and read controls without being
   forced into pointer lock.
3. Walk into every wall and door from multiple angles.
4. Target an object just inside and just outside interaction range.
5. Open a puzzle, tab through it, close it, and resume movement.
6. Solve it, refresh, and verify durable progress returns.
7. Corrupt the saved progress value and verify the game safely resets.
8. Complete all puzzles, use the final exit, and verify one transition to the
   existing birthday finale.
9. On mobile, verify the explanation appears and then reaches the celebration
   without loading the 3D world.
10. Repeat the explained-skip check with reduced motion and WebGL unavailable.
11. Verify both a mouse-only and a keyboard-only puzzle according to its
    declared input mode.
