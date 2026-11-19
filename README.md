# NumberNest — live demo

A clickable demo of the NumberNest tutoring prototype: **grades 1–6, math, reading and science.**

Hints first, never the answer. After three wrong tries the answer is revealed with a numbered
worked solution. The parent report sits behind a grown-ups question.

Open `index.html`, or visit the GitHub Pages link for this repository.

## Questions and passages

`bank.js` holds the question bank. Math questions are generated with new numbers every time:
five kinds of problems in grades 1–3 and ten to twelve in grades 4–6 (for example grade 4 has
multi-digit multiplication, equivalent fractions, adding and comparing fractions, division with
remainders, tenths and hundredths, comparing decimals and a 10 × 10 grid or coin picture).
Decimals and percents follow the Illinois Learning Standards: tenths and hundredths in grade 4,
decimal place value, rounding and operations in grade 5, and percents and dividing decimals in grade 6.
Grades 4–6 also have **spot the mistake** questions (find the first wrong step in someone's work) and
**which explanation is right?** questions, and every round includes some of the new kinds. Reading has eight
new original passages per grade with two questions each, plus the original passages, and rotates
so the passages read longest ago come back last.

Science has 16 hand-written questions per grade, four for each of four skills (for example grade 3
has weather and climate, life cycles, forces and magnets, and traits and fossils). Each round picks
10, starting with ones this device hasn't seen yet, and never asks the same skill twice in a row.

Each session has up to 10 questions, mixes different skills (never the same kind twice in a row),
shuffles the answer choices, and avoids passages this device
has already seen (kept in the browser only). **New questions** at the end starts a fresh set.

## Results screen

After the last question, **See my results** opens a completed screen for the child: stars, the
score, and how many were right on the first try, right after a hint, or needed the full solution.
**Show a grown-up** asks a quick grown-ups question, then opens a report with results by skill,
every question with the answer and what was tried first, what to practice next, and earlier rounds.
The completed screen also cheers effort ("Mistakes help your brain grow!"), and for math the report
shows how the round went for each of the six components of numeracy (understanding the ideas,
accurate steps, solving problems, checking and reasoning, explaining math thinking, and sticking
with it) with two or three family math ideas for the part that needed the most help. This part is
inspired by the Illinois Comprehensive Numeracy Plan (ISBE, 2026); NumberNest is not affiliated with
or endorsed by ISBE.
Results are kept in the browser on that device only and are never sent anywhere.

Everything in the demo is invented placeholder content — no real student data, no network calls,
no storage. Source lives in a separate private repository.

## Agent Village

`village/index.html` is a small, self-contained simulation of a village where Claude and its agents
(Explore, Plan, General, Guide, Reviewer, Fork and Statusline) live and work. They claim cards from
the Town Square board, work through each stage in the right building, eat at the Token Café and go
home at night. Post your own task, ring the town-meeting bell, or change the speed of the day.

## Install it as an app

NumberNest can be installed on a phone, tablet or computer and works offline after the first visit.

- **iPhone or iPad (Safari):** tap Share, then **Add to Home Screen**.
- **Android (Chrome):** tap the menu, then **Install app** or **Add to Home screen**.
- **Computer (Chrome or Edge):** click the install icon in the address bar.

`manifest.webmanifest`, `sw.js` and `icons/` make this work. When you update `index.html`, bump `CACHE` in `sw.js` so installed copies refresh.
