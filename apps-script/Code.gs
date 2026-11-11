/**
 * Gym Tracker -> Google Sheet backup.
 * Setup: in your Google Sheet open Extensions > Apps Script, paste this file, then
 * Deploy > New deployment > Web app. Execute as: Me. Who has access: Anyone.
 * Copy the /exec URL into the app: Progress > Settings > Google Sheet backup.
 * Every finished workout adds one row per set. Deleting a workout in the app removes its rows.
 * The app also saves a full copy of its data in the "Backup" tab, so Settings > Restore from Google can bring it back.
 * Updating from an older version: paste this file, then Deploy > Manage deployments > edit (pencil) >
 * Version: New version > Deploy. The /exec URL stays the same.
 */
const SHEET_NAME = 'Sets';
/* Leave empty when this script was opened from the sheet (Extensions > Apps Script).
   For a separate script project, paste the sheet's ID here (the long part of its URL between /d/ and /edit). */
const SHEET_ID = '';
function book_() { return SpreadsheetApp.getActiveSpreadsheet() || SpreadsheetApp.openById(SHEET_ID); }

/** Run once from the editor (pick setup, press Run): creates the tabs and logs which sheet this script writes to. */
function setup() {
  const ss = book_();
  sheet_();
  if (!ss.getSheetByName('Body weight')) ss.insertSheet('Body weight').appendRow(['date', 'kg']);
  if (!ss.getSheetByName('Backup')) ss.insertSheet('Backup');
  Logger.log('Gym Tracker will write to: ' + ss.getName() + ' (' + ss.getUrl() + ')');
}
const HEADERS = ['workout_id', 'date', 'started', 'workout', 'set', 'exercise', 'nickname', 'equipment', 'kg', 'reps', 'volume_kg', 'exercise_id'];

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.action === 'weight') return saveWeight_(data.date, data.kg);
  if (data.action === 'backup') return saveBackup_(data.json, data.at);
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
  const ss = book_();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) { sh.appendRow(HEADERS); sh.setFrozenRows(1); }
  return sh;
}

/** Body weight: one row per day in the "Body weight" tab; logging the same day again replaces it. */
function saveWeight_(date, kg) {
  const ss = book_();
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

/** Full app backup: B1 = time it was made, A2 down = the JSON in 40,000-character pieces (a cell holds 50,000). */
function saveBackup_(json, at) {
  const ss = book_();
  const sh = ss.getSheetByName('Backup') || ss.insertSheet('Backup');
  sh.clear();
  const parts = [];
  for (let i = 0; i < json.length; i += 40000) parts.push(["'" + json.slice(i, i + 40000)]); // leading ' = plain text, so a piece starting with = or + is never read as a formula
  sh.getRange(1, 1, 1, 2).setValues([['saved_at', String(at)]]);
  if (parts.length) { sh.getRange(2, 1, parts.length, 1).setNumberFormat('@'); sh.getRange(2, 1, parts.length, 1).setValues(parts); }
  return ContentService.createTextOutput('ok');
}

/** GET ?action=info -> {at}; GET ?action=restore -> {at, data}. With &callback=fn it answers as JSONP for the app. */
function doGet(e) {
  const p = (e && e.parameter) || {};
  const sh = book_().getSheetByName('Backup');
  const at = sh && sh.getLastRow() > 0 ? Number(sh.getRange(1, 2).getValue()) || 0 : 0;
  let out = { ok: true, at: at };
  if (p.action === 'restore' && at && sh.getLastRow() > 1) out.data = JSON.parse(sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues().map(r => r[0]).join(''));
  const body = JSON.stringify(out), cb = /^[\w$.]{1,64}$/.test(p.callback || '') ? p.callback : '';
  return cb ? ContentService.createTextOutput(cb + '(' + body + ');').setMimeType(ContentService.MimeType.JAVASCRIPT)
    : ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
}
