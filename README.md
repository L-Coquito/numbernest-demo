# NumberNest — live demo

A clickable demo of the NumberNest tutoring prototype: **grades 1–6, math and reading.**

Hints first, never the answer. After three wrong tries the answer is revealed with a numbered
worked solution. The parent report sits behind a grown-ups question.

Open `index.html`, or visit the GitHub Pages link for this repository.

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
