# Escape Room — Puzzle Ideas

A braindump of puzzle concepts for the birthday escape room.
These are rough ideas — flesh out the ones that fit best.

---

## Theme / Story

> _Not decided yet. Define an overarching narrative that ties the rooms together._
>
> Example hooks:
>
> - You're trapped in a mysterious location and must solve clues to escape before the clock runs out
> - A detective story where each puzzle reveals the next clue
> - A space mission where each room is a system failure to repair

---

## Puzzle Ideas

### 🔤 Text / Riddle

- Classic riddle with a text answer that unlocks the next room
- A cipher (e.g. Caesar cipher) — give a hint somewhere on the page as the key
- A "find the word" where the answer is hidden in a block of text (first letters of sentences, etc.)
- A fake "error message" or "terminal output" that contains a hidden code

### 🖼️ Image

- Image with a number/word hidden in it (steganography-lite — just visually hidden)
- A map with an X that corresponds to a coordinate code
- A "spot the difference" between two images — the differences spell out an answer
- A jigsaw or scrambled image that reveals a code when solved

### 🔢 Number / Math

- A date-based puzzle: "What year did X happen?" — personal to the birthday person
- A phone keypad cipher (letters → numbers)
- A simple equation hidden as a story problem
- Coordinates that correspond to letters on a grid

### 🔊 Audio

- A morse code clip — provide a reference chart, answer is the decoded message
- A reversed audio clip with a voice message
- A melody that matches notes to letters (A=1, B=2, etc.)

### 🎬 Video

- A short video clip with a code visible for only a few seconds
- A sped-up or slowed-down clip that reveals something when played at the right speed

### 🤝 Personal / Inside Jokes

> These are the best kind — personalize them to the birthday person.

- A question only they would know the answer to (first pet, childhood nickname, etc.)
- A photo from a shared memory with a hidden clue
- A fake social media post or chat screenshot with a code in it
- A quote they always say, with certain words highlighted

---

## Room Progression Ideas

```text
Room 1 (easy warm-up)
  → Room 2 (medium)
    → Room 3 (hard / most personal)
      → Final: birthday reveal / message
```

Suggested flow:

1. **Welcome room** — sets the story, one simple puzzle to get started
2. **Clue trail** — 2–3 puzzles chained together (answer from one unlocks the next)
3. **Boss puzzle** — the most personal/creative one
4. **Escape!** — a final screen with a birthday message, maybe a gif or video

---

## Implementation Notes

- Each room is a React component driven by a config object — no logic changes to add a new puzzle
- Puzzle answer validation: case-insensitive, trim whitespace, maybe strip spaces
- "Hint" button per puzzle that reveals a clue after X seconds or attempts
- Progress saved in `localStorage` so refreshing doesn't reset progress
- Consider a visible attempt counter or timer for atmosphere

---

## Puzzle Backlog (raw ideas to sort later)

-
-
-

## Brainstorming med Magnus

Paralleller:

Mer irriterende versjoin av captcha

- Er det en vase?
- et glass
- Klikk på alle longbois

Hva er det eneste runar klarer å lage

- Lasagne
- Makaronishit

- Spist for mye

Skrem Runar med maisen

- Mais
- Flytt mais over Runar, så flytter han seg. (Gjør musepekeren om til en MaisSVG)

Hva ligger gjemt i kjelleren til Mor? PepsiMax

Videoquiz med oss/søstrene

- Hint on hva som må gjøres

Bilde av Runar som skalla, sett på riktig hårlinje.

Kartgreier

- Trykke på rett plass?

Fiks puslespillet (bilde av brita?)

- puslespill
- Skyve Tiles
- https://github.com/yuri-becker/react-jigsaw-puzzle

Typisk oppgave:

- Sett ting i riktig rekkefølge

Feedback på når man klarer noe - Ingvild som gir tommel opp!

Krypteringsoppgave:

- Svar Rompe Runar
- Hint? Cæsar kryptering
-

Matte:

- Datoer som tall
- Gange, plusse til en annen dato, eller bare tall som er en løsning
