# Escape-room puzzles

The escape room is a self-contained feature. The application only decides
whether to show the countdown, the escape room, or the birthday finale.
`EscapeRoomGame` owns all progression inside the game and calls `onComplete`
when the final puzzle has been solved.

## Structure

```text
escape-room/
  components/       Shared game and puzzle layouts
  screens/          Introduction, puzzles, and completion screens
  state/            Stage types, puzzle order, reducer, and reducer tests
  EscapeRoomGame.tsx
  EscapeRoomGame.css
```

The ordered `puzzleIds` tuple in `state/gameTypes.ts` is the source of truth
for puzzle order. `gameReducer` advances to the next ID in that tuple. When
there is no next ID, it advances to `"complete"`.

Progress is currently kept in memory and resets after a reload. Persistence
can be added later without changing individual puzzle screens.

## Add a puzzle

The following example adds a second puzzle after `first-puzzle`.

### 1. Register its ID and position

Add the ID to `puzzleIds` in `state/gameTypes.ts`:

```ts
export const puzzleIds = ["first-puzzle", "second-puzzle"] as const;
```

Order matters. Solving `first-puzzle` will now advance to `second-puzzle`
instead of completing the game. `PuzzleId`, `GameStage`, actions, and solved
progress derive their TypeScript types from this tuple.

Use stable, descriptive kebab-case IDs. Do not rename a puzzle ID after adding
progress persistence unless you also provide a migration.

### 2. Create its screen

Add `screens/SecondPuzzle.tsx`:

```tsx
import { useState } from "react";
import PuzzleLayout from "../components/PuzzleLayout";

type SecondPuzzleProps = {
  onSolve: () => void;
};

const SecondPuzzle = ({ onSolve }: SecondPuzzleProps) => {
  const [answer, setAnswer] = useState("");

  const submitAnswer = () => {
    const normalizedAnswer = answer.trim().toLocaleLowerCase("nb-NO");

    if (normalizedAnswer === "riktig svar") {
      onSolve();
    }
  };

  return (
    <PuzzleLayout
      description="Ledetråden eller oppgaven vises her."
      puzzleNumber={2}
      title="Den andre låsen"
    >
      <label>
        Svar
        <input
          onChange={(event) => {
            setAnswer(event.target.value);
          }}
          value={answer}
        />
      </label>
      <button onClick={submitAnswer} type="button">
        Prøv svaret
      </button>
    </PuzzleLayout>
  );
};

export default SecondPuzzle;
```

Keep answer input, hints, attempts, and other puzzle-specific state inside the
puzzle screen. The screen should report only successful completion through
`onSolve`. It should not import or dispatch to the game reducer directly.

Remember that answers shipped in client-side code can be discovered through
the browser developer tools. That is normally acceptable for this personal
game, but client-side validation is not secure against deliberate inspection.

### 3. Map the stage to the screen

Import and render the screen in `EscapeRoomGame.tsx`:

```tsx
import SecondPuzzle from "./screens/SecondPuzzle";

// Inside GameShell:
{
  gameState.stage === "second-puzzle" && (
    <SecondPuzzle
      onSolve={() => {
        dispatch({ type: "SOLVE_PUZZLE", puzzleId: "second-puzzle" });
      }}
    />
  );
}
```

The screen's stage check and dispatched `puzzleId` must match its registered
ID exactly. The reducer rejects solving a puzzle that is not the current
stage, which prevents accidental skipping and duplicate completion.

### 4. Update progression tests

Extend `state/gameReducer.test.ts` to verify the new order:

```ts
const firstPuzzleSolved = gameReducer(startedState, {
  type: "SOLVE_PUZZLE",
  puzzleId: "first-puzzle",
});

expect(firstPuzzleSolved.stage).toBe("second-puzzle");

const secondPuzzleSolved = gameReducer(firstPuzzleSolved, {
  type: "SOLVE_PUZZLE",
  puzzleId: "second-puzzle",
});

expect(secondPuzzleSolved.stage).toBe("complete");
```

Add component tests for puzzle validation when a puzzle has answer handling,
attempt limits, hints, timers, or other behavior. Test what the player sees and
does, and verify that `onSolve` is called only for a valid solution.

## Game completion

After the last puzzle, the reducer selects the `complete` stage.
`GameComplete` is shown briefly, then `EscapeRoomGame` calls `onComplete`.
The page-level experience handles that callback and switches to the birthday
finale and birthday theme.

Puzzle screens must not import `BirthdayPage`, manipulate the global theme, or
navigate to the finale themselves.

## Preview the flow

Run the development server and open:

```text
http://127.0.0.1:5173/?preview=birthday
```

Use the preview controls to show the escape-room entry, then select
`Begynn oppdraget`. The current placeholder puzzle includes a development-only
`Test fullføring` button for verifying the completion-to-finale handoff. Remove
that button when the first real puzzle implements its own solution.

Before committing a puzzle, run:

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm format:check
pnpm build
```

Also test the puzzle at 320×568, verify keyboard focus order and readable
contrast, and ensure animations have a reduced-motion fallback.

## Puzzle checklist

- Register a unique ID in the correct `puzzleIds` position.
- Create a screen using `PuzzleLayout` where appropriate.
- Keep puzzle-specific state and answer validation inside the screen.
- Call `onSolve` only after a valid solution.
- Map the stage and matching solve action in `EscapeRoomGame`.
- Test progression and the puzzle's user interactions.
- Verify desktop, mobile, keyboard, and reduced-motion behavior.
