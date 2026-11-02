# Design Context Brief · Komoot Route Decision Assistant

## 1. What the feature does

When the user describes the route they want in the search bar, the AI writes one short line for each route Komoot finds that answers the description, based on other people's tips and the route data, shown in a box labelled as an AI summary with how many tips it's based on. The same line appears on the route card and on route detail, and the What people say screen, opened with See the tips, shows a one-sentence summary above the tips it's based on.

## 2. The six named states

| State | One-line description |
|---|---|
| High confidence | 5 or more tips and a clear match. Plain AI box on the card, route detail with AI summary and See the tips, tips screen with 2 tips shown and More tips. |
| Low confidence | Fewer than 5 tips or a partial match. Status banner with framing line, "little data" in the label, dashed border, fewer results, Change search. |
| No result | No match. No AI box, status banner with Edit search and Dismiss, normal routes nearby. |
| Failure | Error. Status banner with Try again and Dismiss, search text kept, normal routes nearby, no AI box. |
| Cold start | First visit, no history. Pairing: the no result payload plus the onboarding affordances from Lesson 5, which are the empty search with popular hikes nearby and the search screen with four example descriptions. Tapping an example shows its results with AI boxes, like high confidence. |
| Waiting | "Checking routes for your description…" with Cancel, route cards as placeholders. After Cancel, normal routes nearby, no AI summaries. |

## 3. Output constraints

**1 · Route signal on the card:** One sentence, max 120 characters. Most important match first. Card shows max 2 lines, then cuts with "…". Always shows how many tips it's based on. Only says what the tips or route data support.

**2 · Route summary on route detail:** Same sentence as the card, max 120 characters, always shown in full. Tip count above it, See the tips button below.

**3 · Tips summary on What people say:** Same sentence as the card, max 120 characters, always shown in full, with the tips it's based on listed below it.

**Confidence handling, 1 · card:** 5+ tips and a clear match: plain box. Fewer than 5 tips or a partial match: "little data" in the label, dashed border, framing line above the list. No match or error: no AI box, normal routes.

**Confidence handling, 2 · route detail:** Strong: plain box. Weak: "little data" in the label and dashed border.

**Confidence handling, 3 · What people say:** Strong: 2 tips shown, More tips for the rest. Weak: "little data" in the label, all tips shown at once.

## 4. Data boundary rules

| Field | Type | Min–max length / item count | Allowed values |
|---|---|---|---|
| `state` | string | – | `high_confidence`, `low_confidence`, `no_result`, `error` |
| `framing` | string or null | – | "Only a few tips match your description." in `low_confidence`. `null` in every other state. |
| `message` | object or null | – | Filled in `no_result` and `error`. `null` in high and low confidence. |
| `message.title` | string | – | "No route matched your description" (`no_result`) / "Couldn't match routes to your description" (`error`) |
| `message.text` | string | – | "Here are normal routes nearby. Try describing it differently." (`no_result`) / "Your text is kept. Below are nearby routes." (`error`) |
| `routes` | array | 1 to 4 objects | Never empty: normal routes are always shown. 4 in `high_confidence`, 2 in `low_confidence`, 3 in `no_result` and `error`. |
| `routes[].title` | string | 1 to 40 characters | Fits on one line on the route card |
| `routes[].difficulty` | string or null | – | "Easy" on Rummelsburger Bay loop, the only route with a route detail screen. `null` on other routes |
| `routes[].route_type` | string or null | – | "Loop" on Rummelsburger Bay loop, the only route with a route detail screen. `null` on other routes |
| `routes[].rating` | float | 1.0 to 5.0, one decimal | Star rating, shown with a decimal comma: "★ 4,8" |
| `routes[].rating_count` | integer | 860 to 2,395 | Shown with a dot for thousands: "2.395" |
| `routes[].photo_count` | integer or null | 398 | Shown on route detail: "▢ 398". `null` on routes without a route detail screen |
| `routes[].duration_min` | integer | 80 to 125 | Shown as "1h 48m" |
| `routes[].distance_km` | float | 5.40 to 8.30, two decimals | Shown with a decimal comma: "7,09 km" |
| `routes[].elevation_gain_m` | integer | 10 to 20 | Shown as "↗ 20 m" on the card, "20 m" on route detail |
| `routes[].elevation_loss_m` | integer or null | 20 | Shown on route detail only: "20 m". `null` on routes without a route detail screen |
| `routes[].ai` | object or null | – | `null` on every route in `no_result` and `error`, and on popular hikes on the first visit. No AI box when `null`. |
| `routes[].ai.signal` | string | 12 to 120 characters | One sentence, most important match first. Only what the tips or route data support. Card: max 2 lines, then "…". Route detail and What people say: always in full. |
| `routes[].ai.tip_count` | integer | 5 to 128 in `high_confidence`, 1 to 4 in `low_confidence` | Shown as "AI summary of 24 tips", or "AI summary of 1 tip" when it's 1. Below 5 means `low_confidence`. |
| `routes[].ai.tips` | array or null | 1 to 4 objects | `high_confidence`: 2 tips, shown above More tips. `low_confidence`: all tips, so the count equals `tip_count`. `null` on routes without a What people say screen |
| `routes[].ai.tips[].author` | string | 1 to 25 characters | Invented first name only. Fits on one line together with the age |
| `routes[].ai.tips[].age` | string | 1 to 13 characters | A number plus "months ago", "year ago" or "years ago", for example "2 months ago" or "1 year ago" |
| `routes[].ai.tips[].text` | string | 1 to 120 characters | Invented text only. Fits in 3 lines on the tip card. Longer tips end with "…" |
| Anywhere | – | – | No user identifiers, home address, fitness or personal difficulty data anywhere in the payload. |

## 5. Interface elements per state

### Every routes list screen
Map in the background.
Search bar: the user's text with a clear icon (⊗), or the placeholder "Search or describe the route" when empty.
Filter chips: Hike ▾, within 30 km, Filters.
Bottom sheet with a count line and route cards.
Route card: photo, rating (★ 4,8 · 2.395), title, stats (1h 48m · 7,09 km · ↗ 20 m), and the AI box when there is one: sparkle icon, "AI summary of 24 tips", signal line.
Bottom nav: Home, Routes, Record, Profile, Offline.

### High confidence
**Routes list:** count line "4 hikes", route cards with the AI box.
**Route detail:** map with back, share and more buttons, photo count (▢ 398), image dots and mini map. "Easy" label, rating, title, "Loop · Hiking". AI box with sparkle icon, "AI summary of 24 tips", signal line and See the tips button. Stats: duration, distance, elevation gain, elevation loss. Save, Navigate and Edit. Bottom nav.
**What people say:** back, title "What people say", route name, sparkle icon with "AI summary of 24 tips", signal line. 2 tips, each with avatar, name, age, tip text and ›. More tips. "Was this summary helpful?" with thumbs up and down. Bottom nav.
**Report (after thumbs down):** back, title "What's wrong with this summary?", route name, 4 reasons with a radio button and a description each, Submit. Bottom nav.
**Report received:** illustration, title, text, Back to route. No bottom nav.
**Route saved (after Save):** sheet over the route with "Route saved!" and close (✕). Line "Rename, share or turn it into a group event!", name field with the route name, Save offline toggle (off), public event card with an image, title, text and Get started, and Done. No bottom nav.
**Saved route:** like route detail, with the AI box and See the tips, but without rating and "Loop · Hiking". Avatar with "You planned a hike" and "Just now · Berlin, Germany" at the top of the sheet. Navigate as the main button. Bottom nav.
**Navigation started:** dark bar with an up arrow and "Follow the map", current and average speed, map with a position dot, Controls and End navigation buttons. No bottom nav.

### Low confidence
Same screens as high confidence, with these differences.
**Routes list:** a box above the cards with "Only a few tips match your description." and a Change search link. This is not the status banner. Count line "2 hikes", 2 route cards.
**AI box:** "little data" in the label and a dashed border, on the card and on route detail.
**What people say:** all 3 tips shown at once, no More tips.

### No result
Search bar with the user's text and clear icon.
Status banner: title, text, Edit search and Dismiss.
Count line "3 hikes nearby, no AI summaries".
3 route cards without AI box.

### Failure
Search bar with the user's text kept and clear icon.
Status banner: title, text, Try again and Dismiss.
Count line "3 hikes nearby, no AI summaries".
3 route cards without AI box.

### Cold start
**First visit:** empty search bar with the placeholder "Search or describe the route". Count line "Popular hikes nearby". 2 route cards without AI box.
**Search screen** (opens when the search bar is tapped): back arrow, search field with placeholder and clear icon. Quick options with icons: Start from home ("Add your home address" and an edit icon), From current location, Hikes within 10 km. Heading "Describe the route you want" with "Tap an example or type your own." 4 example descriptions, each in its own row. No bottom nav.
**Results for the example:** search bar with "Quiet hike along the water", count line "4 hikes", route cards with the AI box.

### Waiting
**While checking:** search bar with the user's text and clear icon. Line "Checking routes for your description…" with Cancel. No count line. 2 route cards in waiting state: grey photo placeholder and placeholder lines, with the sparkle icon where the AI summary will load.
**After Cancel:** line "You stopped the route check. Here are 3 hikes nearby, no AI summaries". 3 route cards without AI box.

## 6. Copy

| Element | Copy |
|---|---|
| Tips screen title | What people say |
| AI summary label, high | AI summary of 24 tips |
| AI summary label, low | AI summary of 3 tips · little data |
| AI summary label, one tip | AI summary of 1 tip · little data |
| Summary example, high | River the whole way, quiet on weekdays |
| Summary example, low | River for 2 km, then forest paths |
| Route detail action | See the tips › |
| Route detail main button | Save |
| Expand tips | More tips ⌄ |
| Feedback question | Was this summary helpful? |
| Report title | What's wrong with this summary? |
| Report reason 1 | Doesn't match what I asked for. The route isn't what I described in the search, for example it's not along the river or not quiet. |
| Report reason 2 | Wrong about this route. The summary says something the tips or the route data don't show, or gets a fact about the route wrong. |
| Report reason 3 | Not helpful. The summary is too vague or general to help me decide whether to take this route. |
| Report reason 4 | Personal information. The summary shows details about a person, like a name, address or phone number. |
| Report button | Submit |
| Report received | Report received. Thanks for telling us. Your report helps keep route summaries accurate for everyone. Button: Back to route |
| Route saved sheet | Route saved! / Rename, share or turn it into a group event! / Rename your adventure (the field shows the route name) / Save offline / Turn it into a public event · Choose a date and meeting spot. Everyone can join! · Button: Get started / Button: Done |
| Saved route | You planned a hike / Just now · Berlin, Germany / Button: Navigate |
| Navigation started | Follow the map / 0,0 km/h · Current speed / – km/h · Average speed / Buttons: Controls / End navigation |
| Search field placeholder | Search or describe the route |
| Examples header | Describe the route you want. Tap an example or type your own. |
| Example descriptions | Quiet hike along the water / Short loop with a café stop / Forest walk under 2 hours / Easy walk with views of the city |
| Low confidence framing line | Only a few tips match your description. Link: Change search |
| No result banner | Title: No route matched your description / Text: Here are normal routes nearby. Try describing it differently. / Buttons: Edit search / Dismiss |
| Error banner | Title: Couldn't match routes to your description / Text: Your text is kept. Below are nearby routes. / Buttons: Try again / Dismiss |
| Waiting line and Cancel | Checking routes for your description… Button: Cancel / After Cancel: You stopped the route check. Here are 3 hikes nearby, no AI summaries |
| Routes count line | 4 hikes (high confidence) / 2 hikes (low confidence) / 3 hikes nearby, no AI summaries (no result, failure) / Popular hikes nearby (cold start) |
| Quick options | Start from home (Add your home address) / From current location / Hikes within 10 km |

## 7. Scope and out of scope

**In scope**
- Routes list in all six states, with a state switcher.
- Rummelsburger Bay loop: route card → route detail → See the tips → What people say.
- Feedback: thumbs down → report with 4 reasons → Submit → Report received → Back to route.
- Save → Route saved → Done or ✕ → saved route → Navigate → navigation started (end of task).
- Navigate on route detail → navigation started (end of task).
- End navigation → saved route. See the tips on the saved route → What people say.
- Try again → waiting. Cancel → "You stopped the route check". Dismiss closes the banner.
- Search: tap the search bar on any routes list → search screen. Type a description and press search → waiting → the state picked in the state switcher. On the first visit, tap "Quiet hike along the water" → results.
- Back buttons on every screen that has one.
- Change search and Edit search → search screen with the user's text in the field.
- Thumbs up → the button shows as selected. Nothing opens.

**Out of scope**
- Shown, but does nothing: filter chips, bottom nav, share and more, Edit (✎), mini map and photos, the › on each tip, More tips, the quick options on the search screen, the other 3 example descriptions, route cards other than Rummelsburger Bay loop, the name field, Save offline and Get started on the Route saved sheet, Controls on the navigation screen.
- Not built: real turn-by-turn navigation; home address setup; creating or ranking routes; any live model call.

## 8. Must never appear

**Claims**
- No personal difficulty judgement, for example "this route is too hard for you".
- No signal that claims more than the tips or route data support.
- No local context or other people's comments presented as certain when there is little data behind them.
- No weak result shown like a strong one: low confidence always has "little data", the dashed border and the framing line.
- No "best route", ranking or recommended badge.
- No "closest match" AI summary when nothing matches. Show No result instead.

**Data**
- No confidence number, percentage or score. Confidence shows only as the tip count and "little data".
- No fitness or personal difficulty data.
- No personal information about a person (name, address, phone number) inside a summary or tip.
- No home address or exact location. The saved route shows the city only.
- No real people's names or real tips. Every name and tip is invented.

**Patterns ruled out**
- No AI box in the no result or error states, or on popular hikes on the first visit.
- No AI summary without the sparkle icon, the "AI summary" label and the tip count.
- No hiding route data, like duration, distance or elevation.
- No automatic retry after an error. The user taps Try again.
- No clearing the user's search text after an error or a cancel.

## 9. State JSON payloads

The four payloads (high_confidence, low_confidence, no_result, error) are pasted at the end of the build prompt. Cold start and waiting need no payload.
