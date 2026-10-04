# Remake of the Birthdaypage I made for Runar

Im just having fun.

The countdown now reveals the upcoming birthday experience on arrival: the
original grey page holds for a moment, a golden seam opens into a starfield,
and a mysterious invitation appears. The sequence settles after eight seconds;
the countdown keeps running throughout. Completion is remembered in localStorage,
so later visits start in the escape-room theme. The birthday finale uses that
theme too, with the combined fireworks renderer. Reduced-motion visitors see the final
design immediately. On the live page, the timer holds at zero for one second,
including when the page is first opened on the birthday. The doors then swing
open and the view moves through the arch into the escape-room welcome screen.
The passage takes 2.8 seconds; reduced motion skips the movement after the
one-second hold.

Run `pnpm dev` and open `/?preview=teaser`; its “Replay the reveal” button lets
you explicitly replay the theme transition without starting the birthday game.
Use “Run final 10 seconds” to try the passage through the door.
The existing `/?preview=birthday` still previews the
ten-second countdown, game entry, and birthday finale.

See [RELEASE.md](RELEASE.md) for release configuration, verification, deployment,
and the remaining manual playtest checklist. Preview routes are development-only.
