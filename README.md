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

## Photos

The prototype loads real photos from `images/`. Until a file is there, that spot shows a drawn placeholder. Use only free-to-reuse photos (Unsplash, or Wikimedia Commons with a reuse licence), never the photos from the Komoot screenshots. Landscape JPGs about 1200 px wide work best.

| File | Used for | Shows | Source URL | Author | Licence |
|---|---|---|---|---|---|
| `route-rummelsburger-bay-loop.jpg` | Route card | Lake shore | | | |
| `route-treptower-park-loop.jpg` | Route card | River with park trees | | | |
| `route-spree-riverside-walk.jpg` | Route card | Reeds by the water | | | |
| `route-rummelsburger-see-plaenterwald.jpg` | Route card | Forest path | | | |
| `detail-hero.jpg` | Route detail | River | | | |
| `saved-hero.jpg` | Saved route | Lake | | | |
| `event.jpg` | Public event card (Route saved sheet) | Meadow | | | |
| `example-1.jpg` | Search example "Quiet hike along the water" | Water | | | |
| `example-2.jpg` | Search example "Short loop with a café stop" | Meadow | | | |
| `example-3.jpg` | Search example "Forest walk under 2 hours" | Forest path | | | |
| `example-4.jpg` | Search example "Easy walk with views of the city" | River | | | |

## Files

- `index.html`: the whole prototype (HTML, CSS, JS).
- `data/*.json`: the four route payloads. All route content on screen comes from these.
- `images/`: photos (see Photos above).
- `design/`: wireframes, Komoot style references and the Design Context Brief.
