# Gym Tracker

A personal gym app for your phone. No server, no build step: open `index.html`.

- **Home**: weekly workout progress, this week's volume, body weight with a trend line, streak, quick start and your routines.
- **Weight**: log your weight, see the trend (30/90 days/all), change over 7/30 days, and distance to your goal.
- **Routines**: save your trainer's plan (or start from Push / Pull / Legs / Full-body templates) and start it with one tap.
- **Workout**: set rows with *previous*, kg, reps and ✓. Weights fill in from last time. Ticking a set starts a rest timer that beeps. Finish shows new personal records and badges.
- **Timed and counted sets**: planks, wall sits and stretches are logged in seconds; ▶ starts a countdown that ticks the set when time is up. Kegel moves have ▶ too: it counts the reps and tells you when to squeeze and when to relax.
- **Kegel**: a Kegel category (Exercises → Equipment → Kegel) with Kegel, quick flicks, kegel bridge, butterfly beat, diamond leg raise, kneeling hip thrust and crab breathing.
- **Edit past workouts**: open a workout in History → Edit to fix sets or add something you forgot; **+ Past workout** logs a whole day after the fact.
- **Offline**: once opened online (GitHub Pages), the app works with no signal. Animations you've viewed or have in your routines are kept on the phone.
- **Exercises**: 1,324 exercises with animated previews. **Mine** lists everything you've trained, renamed or written notes on ("seat 4, pin 6"), and search finds your notes too. Filter by equipment and muscle, use loose search ("pull down", "seated row"), or tap the **body map** to see which equipment trains a muscle. Some exercises also have a real-person photo.
- **Daily** (off by default, turn on in Settings): water, sleep, meal plan with "eaten" checks, rest days, and the day's records and badges.
- **Language**: English or Bahasa Indonesia (Settings).
- **Body weight**: log it from Home, Daily or Progress. Progress shows the chart, 30-day change and distance to your goal (set it in Settings).
- **Progress**: body weight, calendar of your daily goals, 18 badges, personal records, and workout history.

## Run it
- **On your PC**: double-click `index.html`.
- **On your phone**: put this folder on GitHub Pages (Settings → Pages → Deploy from branch → main / root), open the link, then *Add to Home Screen*.

Data is saved in the browser you use. Use **Progress → Settings → Export backup** to move it, or set up Google Sheets.

## Online backup with Google Sheets
Every finished workout goes to a "Sets" tab, body weight to "Body weight", and a full copy of all your data to "Backup" (after each workout, weigh-in or edit, and once a day). **Settings → Restore from Google** brings it all back on a new phone.
1. Create a Google Sheet → **Extensions → Apps Script** → paste `apps-script/Code.gs`.
2. **Deploy → New deployment → Web app**. Execute as *Me*, access *Anyone*.
3. Paste the `/exec` URL in **Settings → Online backup**, then tap **Back up now**.

Already set up with an older Code.gs? Paste the new file, then **Deploy → Manage deployments → ✏️ → Version: New version → Deploy**. The URL stays the same.
The backup can be read by anyone who has your `/exec` URL, so keep it to yourself.

## Exercise media and licenses
| What | Source | License |
|---|---|---|
| Exercise list, muscles, equipment, instructions | [hasaneyldrm/exercises-dataset](https://github.com/hasaneyldrm/exercises-dataset) | MIT |
| Animated GIFs | same repo, © [Gym visual](https://gymvisual.com/) | Copyrighted: OK for personal use with attribution, not for selling or redistributing |
| Real-person photos (`data/photos/`) | [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db) | Public domain |
| Plank photos (`data/extra/plank-*.jpg`) | [yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db) | Public domain |
| Kegel drawings (`data/extra/kegel*.svg`) | made for this app | — |
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
| `sw.js` | Offline support (service worker) |
| `data/extra.js`, `data/extra/` | Extra exercises (Plank, Kegel category) and their pictures |
