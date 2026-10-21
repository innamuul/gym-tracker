/**
 * Gym Tracker -> Google Sheet backup.
 * Setup: in your Google Sheet open Extensions > Apps Script, paste this file, then
 * Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 * Copy the /exec URL into the app: Progress > Settings > Google Sheet backup.
 * Every finished workout adds one row per set. Deleting a workout in the app removes its rows.
 */
const SHEET_NAME = 'Sets';
const HEADERS = ['workout_id', 'date', 'started', 'workout', 'set', 'exercise', 'nickname', 'equipment', 'kg', 'reps', 'volume_kg', 'exercise_id'];

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.action === 'weight') return saveWeight_(data.date, data.kg);
  const sh = sheet_();
  removeWorkout_(sh, data.workout.id);
  if (data.action !== 'delete' && data.rows.length) {
    const w = data.workout;
    const rows = data.rows.map(r => [w.id, w.date, new Date(w.start), w.name, r.set, r.exercise, r.nickname, r.equipment, r.kg, r.reps, r.kg * r.reps, r.exercise_id]);
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEADERS.length).setValues(rows);
  }
  return ContentService.createTextOutput('ok');
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}

/** Body weight: one row per day in the "Body weight" tab; logging the same day again replaces it. */
function saveWeight_(date, kg) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName('Body weight') || ss.insertSheet('Body weight');
  if (sh.getLastRow() === 0) { sh.appendRow(['date', 'kg']); sh.setFrozenRows(1); }
  const n = sh.getLastRow() - 1;
  const dates = n > 0 ? sh.getRange(2, 1, n, 1).getDisplayValues().flat() : [];
  const i = dates.indexOf(date);
  if (i >= 0) sh.getRange(i + 2, 2).setValue(kg);
  else { const r = sh.getLastRow() + 1; sh.getRange(r, 1).setNumberFormat('@'); sh.getRange(r, 1, 1, 2).setValues([[date, kg]]); } // '@' keeps the date as plain YYYY-MM-DD text
  return ContentService.createTextOutput('ok');
}

function removeWorkout_(sh, id) {
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const ids = sh.getRange(2, 1, n, 1).getValues().flat();
  for (let i = ids.length - 1; i >= 0; i--) if (ids[i] === id) sh.deleteRow(i + 2);
}
