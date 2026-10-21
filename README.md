# Gym Tracker

A personal gym app for your phone. No server, no build step: open `index.html`.

- **Home**: weekly workout progress, this week's volume, body weight with a trend line, streak, quick start and your routines.
- **Weight**: log your weight, see the trend (30/90 days/all), change over 7/30 days, and distance to your goal.
- **Routines**: save your trainer's plan (or start from Push / Pull / Legs / Full-body templates) and start it with one tap.
- **Workout**: set rows with *previous*, kg, reps and ✓. Weights fill in from last time. Ticking a set starts a rest timer that beeps. Finish shows new personal records and badges.
- **Exercises**: 1,324 exercises with animated previews. **Mine** lists everything you've trained, renamed or written notes on ("seat 4, pin 6"), and search finds your notes too. Filter by equipment and muscle, use loose search ("pull down", "seated row"), or tap the **body map** to see which equipment trains a muscle. Some exercises also have a real-person photo.
- **Daily** (off by default, turn on in Settings): water, sleep, meal plan with "eaten" checks, rest days, and the day's records and badges.
- **Language**: English or Bahasa Indonesia (Settings).
- **Body weight**: log it from Home, Daily or Progress. Progress shows the chart, 30-day change and distance to your goal (set it in Settings).
- **Progress**: body weight, calendar of your daily goals, 18 badges, personal records, and workout history.

## Run it
- **On your PC**: double-click `index.html`.
- **On your phone**: put this folder on GitHub Pages (Settings → Pages → Deploy from branch → main / root), open the link, then *Add to Home Screen*.

Data is saved in the browser you use. Use **Progress → Settings → Export backup** to move it, or set up Google Sheets.

## Google Sheets backup (optional)
1. Create a Google Sheet → **Extensions → Apps Script** → paste `apps-script/Code.gs`.
2. **Deploy → New deployment → Web app**. Execute as *Me*, access *Anyone*.
3. Paste the `/exec` URL in **Progress → Settings → Google Sheet backup**.

## Exercise media and licenses
| What | Source | License |
|---|---|---|
| Exercise list, muscles, equipment, instructions | [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) | MIT |
| Animated GIFs | same repo, © [Gym visual](https://gymvisual.com/) | Copyrighted: OK for personal use with attribution, not for selling or redistributing |
| Real-person photos (`data/photos/`) | [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db) | Public domain |
| Body map drawing (`data/bodymap.js`) | [HichamELBSI/react-native-body-highlighter](https://github.com/HichamELBSI/react-native-body-highlighter) | MIT |

The GIFs are **not** stored in this project. The app loads them from that repo through the jsDelivr CDN (with raw.githubusercontent as a fallback). For offline use, copy the dataset's `videos/` folder to `media/videos/`. It is git-ignored so it never gets published.

## Files
| Path | What it is |
|---|---|
| `index.html` | Page shell |
| `app.css` | All styling (design tokens at the top) |
| `app.js` | All app logic |
| `data/exercises.js` | Exercise list (generated) |
| `data/photos/*.js` | Real-person photo frames, loaded on demand (generated) |
| `tools/build_data.py` | Regenerates `data/` from the two source repos |
| `apps-script/Code.gs` | Google Sheets backup endpoint |
