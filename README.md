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

All photos are from [Unsplash](https://unsplash.com), used under the [Unsplash License](https://unsplash.com/license) (free to use, no permission needed), and stored in `images/`. None come from the Komoot screenshots. Full list: `images/CREDITS.md`.

| File | Used for | Author | Source | Licence |
|---|---|---|---|---|
| `lake-reeds.jpg` | Rummelsburger Bay loop: card, route detail and saved route (first photo) | Tanel A. Lind | https://unsplash.com/photos/Pfuxmz9xSxE | Unsplash License |
| `lake-reeds-sunset.jpg` | Rummelsburger Bay loop: detail carousel, photo 2 | Andrew Hall | https://unsplash.com/photos/SncUabt_G18 | Unsplash License |
| `pond-reeds.jpg` | Rummelsburger Bay loop: detail carousel, photo 3 | Lukáš Kadava | https://unsplash.com/photos/xzlZn6F92to | Unsplash License |
| `lake-trees-reflection.jpg` | Treptower Park loop: card | Elimende Inagella | https://unsplash.com/photos/RhXk4pjhEv8 | Unsplash License |
| `river-trees-reflection.jpg` | Spree riverside walk: card | Roland Clee | https://unsplash.com/photos/JB5urJHZ7yY | Unsplash License |
| `forest-path-green.jpg` | Rummelsburger See and Plänterwald trails: card | Myles Bloomfield | https://unsplash.com/photos/xeTAoNgmVEE | Unsplash License |
| `meadow-path.jpg` | Public event card; search example "Short loop with a café stop" | Lara John | https://unsplash.com/photos/9afIUl2J2zA | Unsplash License |
| `lake-calm-forest.jpg` | Search example "Quiet hike along the water" | Anna Tsareva | https://unsplash.com/photos/EeOgxp9_Rfk | Unsplash License |
| `forest-path-pine.jpg` | Search example "Forest walk under 2 hours" | Maksim Shutov | https://unsplash.com/photos/H8vhhepiiaU | Unsplash License |
| `lake-forest-view.jpg` | Search example "Easy walk with views of the city" | Eugene | https://unsplash.com/photos/sVIZQSoAyEw | Unsplash License |

`forest-light.jpg` and `forest-path-autumn.jpg` are in the folder but not used yet.

## Files

- `index.html`: the whole prototype (HTML, CSS, JS).
- `data/*.json`: the four route payloads. All route content on screen comes from these.
- `images/`: photos (see Photos above).
- `design/`: wireframes, Komoot style references and the Design Context Brief.
