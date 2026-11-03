# komoot-route-prototype

Clickable iPhone 16 (393 × 852) prototype of **AI route summaries in route search** for usability testing. Hard-coded data only: no model calls, no backend.

## How to run

`index.html` loads the payloads in `data/` with `fetch()`, so open it through a web server, not as a file:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. GitHub Pages works too. The map needs an internet connection (MapLibre GL JS from unpkg and OpenFreeMap tiles). Without it, the map area falls back to a plain land colour and everything else still works.

## Using it in a test

- The **Test state** panel next to the phone shows the routes list in a state (Cold start, High confidence, Low confidence, No result, Error, Waiting) and sets what the next search returns. Default: High confidence. Picking Cold start makes the next search return High confidence. Picking Waiting keeps a search in waiting until Cancel.
- A search waits 0.8 s, shows the waiting state, then the picked state after 4 s.
- Only the Rummelsburger Bay loop card opens route detail.

## Files

- `index.html`: the whole prototype (HTML, CSS, JS).
- `data/*.json`: the four route payloads. All route content on screen comes from these.
- `design/`: wireframes, Komoot style references and the Design Context Brief.
