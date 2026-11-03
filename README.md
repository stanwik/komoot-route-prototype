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

Each route has 3 photos, shown in the same order on its card, route detail and saved route.

| File | Used for | Author | Source | Licence |
|---|---|---|---|---|
| `lake-reeds.jpg` | Rummelsburger Bay loop, photo 1 | Tanel A. Lind | https://unsplash.com/photos/Pfuxmz9xSxE | Unsplash License |
| `lake-reeds-sunset.jpg` | Rummelsburger Bay loop, photo 2 | Andrew Hall | https://unsplash.com/photos/SncUabt_G18 | Unsplash License |
| `pond-reeds.jpg` | Rummelsburger Bay loop, photo 3 | Lukáš Kadava | https://unsplash.com/photos/xzlZn6F92to | Unsplash License |
| `lake-trees-reflection.jpg` | Treptower Park loop, photo 1 | Elimende Inagella | https://unsplash.com/photos/RhXk4pjhEv8 | Unsplash License |
| `meadow-path.jpg` | Treptower Park loop, photo 2; public event card; search example "Short loop with a café stop" | Lara John | https://unsplash.com/photos/9afIUl2J2zA | Unsplash License |
| `forest-path-autumn.jpg` | Treptower Park loop, photo 3 | Lucas | https://unsplash.com/photos/Jlba19sPjdM | Unsplash License |
| `river-trees-reflection.jpg` | Spree riverside walk, photo 1 | Roland Clee | https://unsplash.com/photos/JB5urJHZ7yY | Unsplash License |
| `lake-calm-forest.jpg` | Spree riverside walk, photo 2; search example "Quiet hike along the water" | Anna Tsareva | https://unsplash.com/photos/EeOgxp9_Rfk | Unsplash License |
| `lake-forest-view.jpg` | Spree riverside walk, photo 3; search example "Easy walk with views of the city" | Eugene | https://unsplash.com/photos/sVIZQSoAyEw | Unsplash License |
| `forest-path-green.jpg` | Rummelsburger See and Plänterwald trails, photo 1 | Myles Bloomfield | https://unsplash.com/photos/xeTAoNgmVEE | Unsplash License |
| `forest-path-pine.jpg` | Rummelsburger See and Plänterwald trails, photo 2; search example "Forest walk under 2 hours" | Maksim Shutov | https://unsplash.com/photos/H8vhhepiiaU | Unsplash License |
| `forest-light.jpg` | Rummelsburger See and Plänterwald trails, photo 3 | Irina Iriser | https://unsplash.com/photos/2Y4dE8sdhlc | Unsplash License |

## Files

- `index.html`: the whole prototype (HTML, CSS, JS).
- `data/*.json`: the four route payloads. All route content on screen comes from these.
- `images/`: photos (see Photos above).
- `design/`: wireframes, Komoot style references and the Design Context Brief.
