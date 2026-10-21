/* Gym Tracker v2
   Exercise data: github.com/hasaneyldrm/exercises-dataset (MIT). Animations (c) Gym visual - https://gymvisual.com/
   Real-person photos: github.com/yuhonas/free-exercise-db (public domain). See CLAUDE.md for structure. */
(function () {
  'use strict';

  /* =========================================================== basics */
  const EX = window.GYM_EXERCISES || [];
  const byId = Object.fromEntries(EX.map(e => [e.id, e]));
  const byName = Object.fromEntries(EX.map(e => [e.n.toLowerCase(), e]));
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const clone = o => JSON.parse(JSON.stringify(o));

  const I = (d, extra = '') => `<svg class="i" viewBox="0 0 24 24" ${extra}>${d}</svg>`;
  const IC = {
    run: '<circle cx="14" cy="4" r="2"/><path d="M7 21l3-6 3 2v5M6 12l3-4 4 1 3 4 3 1M10 8l-1 5"/>',
    dumbbell: '<rect x="4" y="7.5" width="3.5" height="9" rx="1.2"/><rect x="16.5" y="7.5" width="3.5" height="9" rx="1.2"/><path d="M7.5 12h9M2 10.5v3M22 10.5v3"/>',
    scale: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M8 10a5.7 5.7 0 0 1 8 0l-2.6 2.6h-2.8z"/>',
    note: '<path d="M6 3.5h8.5L19 8v12.5H6z"/><path d="M14 3.5V8h5M9 12.5h7M9 16h4.5"/>',
    pin: '<path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    body: '<circle cx="12" cy="4.5" r="2"/><path d="M5 9l7 1.5L19 9M12 10.5v5l-3 5.5m3-5.5l3 5.5"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    chart: '<path d="M4 19V9m6 10V5m6 14v-7m4 7H3"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    down: '<path d="M6 9l6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    medal: '<circle cx="12" cy="14" r="5"/><path d="M8.5 9.5L6 3h4l2 4 2-4h4l-2.5 6.5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7z"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
    food: '<path d="M4 3v8a3 3 0 0 0 3 3v7M7 3v6M10 3v8a3 3 0 0 1-3 3M17 21V3c-2 1-3 4-3 8h3"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    up: '<path d="M6 15l6-6 6 6"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    star: '<path d="M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.4 6.5 20.3l1-6.2L3 9.7l6.2-.9z"/>',
    target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".5"/>',
    calendar: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'
  };

  /* equipment groups (keys come from tools/build_data.py) */
  const EQ = { machine: 'Machine', cable: 'Cable', dumbbell: 'Dumbbell', barbell: 'Barbell', smith: 'Smith machine', ez: 'EZ bar', body: 'Bodyweight', assisted: 'Assisted machine', kettlebell: 'Kettlebell', band: 'Band', weighted: 'Weighted', ball: 'Ball', roller: 'Roller', cardio: 'Cardio machine', other: 'Other' };
  const EQ_ICON = {
    barbell: '<path d="M2 12h20M6 7v10M3.5 9v6M18 7v10M20.5 9v6"/>', ez: '<path d="M2 12h4l2-2 2 4 2-4 2 4 2-4 2 2h4M5 8v8M19 8v8"/>',
    dumbbell: IC.dumbbell, cable: '<path d="M5 3v18M19 3v18M5 4h14M12 4v9"/><path d="M9 16h6l-3-3z"/>',
    machine: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 10.5h8M8 14h8M12 14v4"/>', smith: '<path d="M5 3v18M19 3v18M3 10h18M7 8v4M17 8v4"/>',
    assisted: '<path d="M6 3v18M18 3v18M6 6h12M9 14h6"/>', body: IC.body, kettlebell: '<path d="M8.5 9.5a3.5 3.5 0 0 1 7 0"/><circle cx="12" cy="15" r="6"/>',
    band: '<path d="M3 12c4-7 14 7 18 0M3 12c4 7 14-7 18 0"/>', weighted: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2"/>',
    ball: '<circle cx="12" cy="11" r="8"/><path d="M8 21h8"/>', roller: '<rect x="3" y="8" width="18" height="8" rx="4"/><path d="M8 8v8M13 8v8"/>',
    cardio: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="M6 17l4-8h5l3 8M10 9l-1-3H7"/>', other: '<circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>'
  };
  const MUSCLES = ['chest', 'shoulders', 'biceps', 'triceps', 'forearms', 'abdominals', 'lats', 'middle back', 'lower back', 'traps', 'glutes', 'quadriceps', 'hamstrings', 'adductors', 'abductors', 'calves', 'neck'];
  const ML = { abdominals: 'Abs', quadriceps: 'Quads', hamstrings: 'Hamstrings', adductors: 'Inner thigh', abductors: 'Outer hip', lats: 'Lats', traps: 'Traps', 'middle back': 'Upper back', 'lower back': 'Lower back' };
  const ml = m => ML[m] || (m ? m[0].toUpperCase() + m.slice(1) : '');
  const cap = s => s ? s[0].toUpperCase() + s.slice(1) : '';

  /* =========================================================== media */
  const MEDIA = ['media/videos/', 'https://cdn.jsdelivr.net/gh/hasaneyldrm/exercises-dataset@main/videos/', 'https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/videos/'];
  let mediaBase = location.protocol === 'file:' ? 0 : 1;
  try { const v = localStorage.getItem('gymtracker.media'); if (v !== null) mediaBase = +v; } catch (e) { }
  const gif = (id, cls = '') => {
    const e = byId[id]; if (!e) return `<span class="gif miss ${cls}"></span>`;
    return `<span class="gif ${cls}"><img alt="${esc(e.n)}" loading="lazy" decoding="async" data-g="${e.g}" data-b="${mediaBase}" src="${MEDIA[mediaBase] + e.g}"></span>`;
  };
  document.addEventListener('error', ev => {
    const t = ev.target; if (t.tagName !== 'IMG' || !t.dataset.g) return;
    const b = +t.dataset.b + 1;
    if (b < MEDIA.length) { t.dataset.b = b; t.src = MEDIA[b] + t.dataset.g; } else if (t.parentElement) t.parentElement.classList.add('miss');
  }, true);
  document.addEventListener('load', ev => {
    const t = ev.target; if (t.tagName !== 'IMG' || !t.dataset.g) return;
    const b = +t.dataset.b; if (b !== mediaBase) { mediaBase = b; try { localStorage.setItem('gymtracker.media', b); } catch (e) { } }
  }, true);
  const photoLoads = {};
  const loadPhotos = eq => photoLoads[eq] || (photoLoads[eq] = new Promise(res => { const s = document.createElement('script'); s.src = 'data/photos/' + eq + '.js'; s.onload = s.onerror = res; document.head.appendChild(s); }));

  /* =========================================================== state */
  const KEY = 'gymtracker.v2';
  const DEF = {
    v: 2, workouts: [], routines: [], active: null, nick: {}, notes: {}, body: [], badges: {}, daily: {},
    settings: { name: 'Innamul', sets: 3, reps: 12, step: 2.5, rest: 90, weeklyGoal: 3, waterGoal: 8, sleepGoal: 8, goalWeight: 0, wellness: false, sheetUrl: '',
      meals: { breakfast: '', lunch: '', dinner: '', snack: '' } }
  };
  let S;
  try { S = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { S = null; }
  S = Object.assign(clone(DEF), S || {});
  S.settings = Object.assign(clone(DEF.settings), S.settings);
  S.settings.meals = Object.assign(clone(DEF.settings.meals), S.settings.meals);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };

  /* language: screens are rendered in English, then translate() swaps text, placeholders and labels using data/i18n-id.js */
  const ID = window.GYM_ID || { text: {}, attr: {}, rules: [] };
  function tr(s, attr) {
    if (!isID() || !s) return s;
    const k = s.trim(); if (!k) return s;
    let o = (attr && ID.attr[k]) || ID.text[k];
    if (o == null) for (const [re, rep] of ID.rules) if (re.test(k)) { o = k.replace(re, typeof rep === 'function' ? (...a) => rep(tr, ...a) : rep); break; }
    if (o == null && k.includes(' · ')) { const ps = k.split(' · '), tp = ps.map(x => tr(x)); if (tp.some((x, i) => x !== ps[i])) o = tp.join(' · '); }
    return o == null ? s : s.replace(k, o);
  }
  function translate(root) {
    if (!isID() || !root) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) { if (n.parentElement && n.parentElement.closest('textarea,.nt')) continue; const v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
    root.querySelectorAll('[placeholder],[aria-label],[title]').forEach(el => ['placeholder', 'aria-label', 'title'].forEach(a => { const v = el.getAttribute(a); if (v) { const t = tr(v, 1); if (t !== v) el.setAttribute(a, t); } }));
  }

  /* =========================================================== dates */
  const dkey = d => { d = new Date(d); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  const today = () => dkey(Date.now());
  const parseD = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (k, n) => { const d = parseD(k); d.setDate(d.getDate() + n); return dkey(d); };
  const weekStart = k => { const d = parseD(k); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return dkey(d); };
  const isID = () => !!(S && S.settings && S.settings.lang === 'id');
  const LOC = () => isID() ? 'id-ID' : 'en-GB';
  const dec = t => isID() ? String(t).replace('.', ',') : String(t);
  const fmtDay = (k, o) => parseD(k).toLocaleDateString(LOC(), o || { weekday: 'short', day: 'numeric', month: 'short' });
  const fmtDur = ms => { const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), ss = s % 60; return h ? `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}` : `${m}:${String(ss).padStart(2, '0')}`; };
  const fmtMin = ms => { const m = Math.round(ms / 60000); return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m} min`; };
  const fmtW = w => w === '' || w == null || isNaN(w) ? '–' : dec(Math.round(w * 100) / 100);
  const fmtKg = v => v >= 10000 ? dec((v / 1000).toFixed(1).replace(/\.0$/, '')) + 't' : Math.round(v).toLocaleString(isID() ? 'id-ID' : 'en-US');

  /* =========================================================== metrics */
  const finished = () => S.workouts.filter(w => w.end).sort((a, b) => a.start - b.start);
  const doneSets = w => w.ex.flatMap(e => e.sets.filter(s => s.done).map(s => ({ ex: e.id, w: +s.w || 0, r: +s.r || 0 })));
  const volume = w => doneSets(w).reduce((a, s) => a + s.w * s.r, 0);
  const workoutsOn = k => finished().filter(w => dkey(w.start) === k);
  const exSessions = id => finished().map(w => { const e = w.ex.find(x => x.id === id); if (!e) return null; const s = e.sets.filter(x => x.done); return s.length ? { w, sets: s, best: Math.max(...s.map(x => +x.w || 0)) } : null; }).filter(Boolean);
  const prevSets = id => { const s = exSessions(id); return s.length ? s[s.length - 1].sets : []; };
  const bestWeight = (id, before) => { let b = 0; finished().forEach(w => { if (before && w.start >= before) return; const e = w.ex.find(x => x.id === id); if (e) e.sets.forEach(s => { if (s.done && +s.w > b) b = +s.w; }); }); return b; };
  const est1rm = (w, r) => w * (1 + r / 30);
  const nameOf = id => S.nick[id] || (byId[id] ? byId[id].n : 'Unknown exercise');
  const plate = w => w >= 25 ? 'var(--p25)' : w >= 20 ? 'var(--p20)' : w >= 15 ? 'var(--p15)' : w >= 10 ? 'var(--p10)' : 'var(--p5)';
  const bwchip = kg => `<span class="wchip">${fmtW(kg)}<small>kg</small></span>`;
  const wchip = (w, extra) => `<span class="wchip"><i style="background:${plate(w)}"></i>${fmtW(w)}<small>kg${extra ? ' ' + extra : ''}</small></span>`;

  function weekCount(k) { const ws = weekStart(k), we = addDays(ws, 7); return new Set(finished().filter(w => { const d = dkey(w.start); return d >= ws && d < we; }).map(w => dkey(w.start))).size; }
  function weekStreak() {
    let n = 0, k = weekStart(today());
    if (weekCount(k) >= S.settings.weeklyGoal) n++;
    k = addDays(k, -7);
    while (weekCount(k) >= S.settings.weeklyGoal) { n++; k = addDays(k, -7); }
    return n;
  }
  function bestWeekStreak() {
    const fw = finished(); if (!fw.length) return 0;
    let k = weekStart(dkey(fw[0].start)), best = 0, cur = 0; const end = weekStart(today());
    while (k <= end) { if (weekCount(k) >= S.settings.weeklyGoal) { cur++; best = Math.max(best, cur); } else if (k !== end) cur = 0; k = addDays(k, 7); }
    return best;
  }
  const allPRs = () => finished().flatMap(w => (w.prs || []).map(p => Object.assign({ date: dkey(w.start), wid: w.id }, p)));

  /* daily */
  const day = k => S.daily[k] || { water: 0, sleep: 0, meals: {}, rest: false };
  const setDay = (k, patch) => { S.daily[k] = Object.assign(day(k), patch); save(); };
  function dayScore(k) {
    const d = day(k), st = S.settings;
    const parts = [
      { k: 'workout', label: d.rest ? 'Rest day' : 'Workout', ok: d.rest || workoutsOn(k).length > 0 },
      { k: 'water', label: 'Water', ok: d.water >= st.waterGoal },
      { k: 'sleep', label: 'Sleep', ok: d.sleep >= st.sleepGoal },
      { k: 'meals', label: 'Meals', ok: Object.values(d.meals || {}).filter(Boolean).length >= 3 }
    ];
    return { parts, n: parts.filter(p => p.ok).length, of: parts.length };
  }

  /* body weight: S.body = [{d:'YYYY-MM-DD', kg}] */
  const bodyLog = () => S.body.slice().sort((a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : 0);
  const lastBody = () => bodyLog().pop() || null;
  function bodyDelta(days) {
    const b = bodyLog(); if (b.length < 2) return null;
    const last = b[b.length - 1], cut = addDays(last.d, -days), ref = b.filter(x => x.d <= cut).pop() || b[0];
    return ref === last ? null : Math.round((last.kg - ref.kg) * 10) / 10;
  }
  const deltaTxt = v => v == null ? '' : (v > 0 ? '▲ ' : v < 0 ? '▼ ' : '') + dec(Math.abs(v).toFixed(1)) + ' kg';
  function spark(pts, w = 120, h = 34) {
    if (pts.length < 2) return '';
    let lo = Math.min(...pts), hi = Math.max(...pts); if (hi - lo < 1) { hi += .5; lo -= .5; }
    const xy = pts.map((v, i) => [i * w / (pts.length - 1), 3 + (1 - (v - lo) / (hi - lo)) * (h - 6)]);
    const d = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('');
    const [ex, ey] = xy[xy.length - 1];
    return `<svg class="spark" viewBox="-4 0 ${w + 8} ${h}"><path pathLength="100" d="${d}"/><circle cx="${ex}" cy="${ey}" r="3.2"/></svg>`;
  }

  /* badges */
  const BADGES = [
    { id: 'first', name: 'First rep', desc: 'Finish a workout', icon: 'bolt', p: () => [finished().length, 1] },
    { id: 'w10', name: 'Regular', desc: '10 workouts', icon: 'dumbbell', p: () => [finished().length, 10] },
    { id: 'w25', name: 'Committed', desc: '25 workouts', icon: 'dumbbell', p: () => [finished().length, 25] },
    { id: 'w50', name: 'Gym rat', desc: '50 workouts', icon: 'dumbbell', p: () => [finished().length, 50] },
    { id: 'w100', name: 'Centurion', desc: '100 workouts', icon: 'trophy', p: () => [finished().length, 100] },
    { id: 'goal', name: 'On target', desc: 'Hit your weekly goal', icon: 'target', p: () => [Math.min(weekCount(today()), S.settings.weeklyGoal), S.settings.weeklyGoal] },
    { id: 'streak4', name: 'Month strong', desc: '4-week streak', icon: 'flame', p: () => [bestWeekStreak(), 4] },
    { id: 'streak12', name: 'Unstoppable', desc: '12-week streak', icon: 'flame', p: () => [bestWeekStreak(), 12] },
    { id: 'pr1', name: 'New best', desc: 'Set a personal record', icon: 'star', p: () => [allPRs().length, 1] },
    { id: 'pr10', name: 'Record breaker', desc: '10 personal records', icon: 'star', p: () => [allPRs().length, 10] },
    { id: 'vol1', name: 'One tonne', desc: '1,000 kg in one workout', icon: 'trophy', p: () => [Math.max(0, ...finished().map(volume)), 1000] },
    { id: 'vol100', name: 'Heavy lifter', desc: '100 t lifted in total', icon: 'trophy', p: () => [finished().reduce((a, w) => a + volume(w), 0), 100000] },
    { id: 'explorer', name: 'Explorer', desc: '25 different exercises', icon: 'search', p: () => [new Set(finished().flatMap(w => w.ex.map(e => e.id))).size, 25] },
    { id: 'early', name: 'Early bird', desc: 'Train before 7 am', icon: 'sun', p: () => [finished().some(w => new Date(w.start).getHours() < 7) ? 1 : 0, 1] },
    { id: 'perfect', well: 1, name: 'Perfect day', desc: 'Hit all 4 daily goals', icon: 'check', p: () => [Math.max(0, ...Object.keys(S.daily).concat([today()]).map(k => dayScore(k).n)), 4] },
    { id: 'hydrated', well: 1, name: 'Hydrated', desc: 'Water goal 7 days', icon: 'drop', p: () => [Object.keys(S.daily).filter(k => day(k).water >= S.settings.waterGoal).length, 7] },
    { id: 'weigh7', name: 'On the scale', desc: 'Log your weight 7 times', icon: 'scale', p: () => [S.body.length, 7] },
    { id: 'notes5', name: 'Coach’s notes', desc: 'Notes on 5 exercises', icon: 'note', p: () => [Object.keys(S.notes).length, 5] }
  ];
  /* water / sleep / food ("wellness") is switched off by default; its data and code stay for later (Settings) */
  const wellOn = () => !!S.settings.wellness;
  const shownBadges = () => BADGES.filter(b => wellOn() || !b.well);
  const navTabs = () => ['home', 'exercises', wellOn() ? 'daily' : 'weight', 'progress'];
  function weekVol(k) { const ws = weekStart(k), we = addDays(ws, 7); return finished().filter(w => { const d = dkey(w.start); return d >= ws && d < we; }).reduce((a, w) => a + volume(w), 0); }
  function checkBadges() {
    const got = [];
    BADGES.forEach(b => { if (!S.badges[b.id]) { const [c, t] = b.p(); if (c >= t) { S.badges[b.id] = today(); got.push(b); } } });
    if (got.length) save();
    return got;
  }

  /* sheets sync */
  function sync(action, w) {
    const url = S.settings.sheetUrl; if (!url) return;
    const rows = action === 'delete' ? [] : w.ex.flatMap(e => e.sets.filter(s => s.done).map((s, i) => ({ set: i + 1, kg: +s.w || 0, reps: +s.r || 0, exercise: (byId[e.id] || {}).n || e.id, nickname: S.nick[e.id] || '', exercise_id: e.id, equipment: EQ[(byId[e.id] || {}).eq] || '' })));
    try { fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action, workout: { id: w.id, name: w.name, date: dkey(w.start), start: w.start, end: w.end }, rows }) }).catch(() => { }); } catch (e) { }
  }
  function syncWeight(d, kg) {
    const url = S.settings.sheetUrl; if (!url) return;
    try { fetch(url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ action: 'weight', date: d, kg }) }).catch(() => { }); } catch (e) { }
  }

  /* =========================================================== search */
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9°]+/g, ' ').trim();
  const SYN = { machine: 'lever', sitting: 'seated', sit: 'seated', pec: 'chest', pecs: 'chest', abs: 'abdominals', lat: 'lats', bicep: 'biceps', tricep: 'triceps', quad: 'quadriceps', quads: 'quadriceps', butt: 'glutes', bum: 'glutes', delts: 'shoulders', delt: 'shoulders', shoulder: 'shoulders', db: 'dumbbell', bb: 'barbell', kb: 'kettlebell', pulldown: 'pull', pushdown: 'push', flyes: 'fly', flies: 'fly', legs: 'leg' };
  const hayC = {};
  const hay = e => hayC[e.id] || (hayC[e.id] = { n: norm(e.n), h: norm([e.n, EQ[e.eq], e.er, e.t, e.bp, e.p.join(' '), e.s.join(' ')].join(' ')) });
  function score(e, toks) {
    const H = hay(e), nk = norm(S.nick[e.id]), nt = norm(S.notes[e.id]); let sc = 0;
    for (const t of toks) {
      const a = SYN[t];
      const inN = H.n.includes(t) || (a && H.n.includes(a)) || nk.includes(t);
      if (!inN && !nt.includes(t) && !H.h.includes(t) && !(a && H.h.includes(a)) && !H.h.replace(/ /g, '').includes(t)) return 0;
      sc += inN ? 3 : 1;
    }
    return sc + (H.n.startsWith(toks[0]) ? 2 : 0) + (S.nick[e.id] || S.notes[e.id] ? 2 : 0);
  }
  const used = () => { const m = {}; finished().forEach(w => w.ex.forEach(e => m[e.id] = (m[e.id] || 0) + 1)); return m; };
  const rank = (e, u) => -(u[e.id] || 0) * 10 + (/v\. ?\d|\(female\)|\(male\)|pov/i.test(e.n) ? 3 : 0) + (['machine', 'cable', 'dumbbell', 'barbell'].includes(e.eq) ? 0 : 1);

  /* =========================================================== body map */
  /* body map: shapes from data/bodymap.js (react-native-body-highlighter, MIT). Each slug stands for one or more of the
     app's muscles; a shape lights up by its hardest-trained muscle this week, and tapping it selects the first one. */
  const BODY_MAP = { chest: ['chest'], abs: ['abdominals'], obliques: ['abdominals'], biceps: ['biceps'], triceps: ['triceps'], forearm: ['forearms'],
    deltoids: ['shoulders'], trapezius: ['traps'], neck: ['neck'], quadriceps: ['quadriceps'], adductors: ['adductors'], calves: ['calves'],
    'upper-back': ['lats', 'middle back'], 'lower-back': ['lower back'], gluteal: ['glutes', 'abductors'], hamstring: ['hamstrings'] };
  function weekMuscleSets() {
    const ws = weekStart(today()), m = {};
    finished().filter(w => dkey(w.start) >= ws).forEach(w => w.ex.forEach(e => {
      const x = byId[e.id]; if (!x) return; const n = e.sets.filter(s => s.done).length;
      x.p.forEach(p => m[p] = (m[p] || 0) + n); x.s.forEach(p => m[p] = (m[p] || 0) + n / 2);
    }));
    return m;
  }
  function bodySvg(side, sel, heat) {
    const B = window.GYM_BODY && window.GYM_BODY[side]; if (!B) return '';
    const shapes = B.parts.map(([slug, ds]) => {
      const ms = BODY_MAP[slug];
      if (!ms) return ds.map(d => `<path class="bp" d="${d}"/>`).join('');
      const h = Math.max(...ms.map(m => heat[m] || 0)), cls = 'm' + (ms.includes(sel) ? ' on' : h >= 10 ? ' h3' : h >= 4 ? ' h2' : h > 0 ? ' h1' : '');
      return ds.map(d => `<path class="${cls}" data-muscle="${ms[0]}" d="${d}"><title>${ml(ms[0])}</title></path>`).join('');
    }).join('');
    return `<svg viewBox="${B.vb}" role="img" aria-label="${side} of body"><path class="base" d="${B.outline}"/>${shapes}</svg>`;
  }


  /* =========================================================== templates */
  const TEMPLATES = [
    { name: 'Push day', ex: ['lever chest press', 'lever seated fly', 'dumbbell seated shoulder press', 'dumbbell lateral raise', 'cable pushdown'] },
    { name: 'Pull day', ex: ['cable pulldown', 'cable seated row', 'lever seated reverse fly', 'dumbbell hammer curl', 'dumbbell alternate biceps curl'] },
    { name: 'Leg day', ex: ['sled 45° leg press (side pov)', 'lever leg extension', 'lever seated leg curl', 'dumbbell goblet squat', 'lever seated calf raise'] },
    { name: 'Full body (machines)', ex: ['lever chest press', 'cable pulldown', 'sled 45° leg press (side pov)', 'dumbbell seated shoulder press', 'cable seated crunch'] }
  ].map(t => ({ name: t.name, ex: t.ex.map(n => byName[n]).filter(Boolean).map(e => e.id) }));

  /* =========================================================== UI state */
  let tab = 'home', restFresh = false, wRange = 90;
  const L = { q: '', mq: '', eq: '', m: '', limit: 40, mode: 'browse', bodySel: '' };
  let dailyKey = today();
  let calMonth = today().slice(0, 7);
  const layers = []; // {type, ...}

  /* =========================================================== motion
     Rings, bars and .cnt numbers glide from their old value to the new one on every re-render
     (from 0 when a screen first appears). The tapped control gets .fx for a little pop. */
  const RM = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  const calm = () => RM.matches;
  const ANIM = '.ring, .thin b, .pbar b, .cnt, .spark';
  const animV = el => el.classList.contains('ring') ? parseFloat(el.style.getPropertyValue('--p')) || 0 : el.classList.contains('cnt') ? +el.dataset.v : el.classList.contains('spark') ? 100 : parseFloat(el.style.width) || 0;
  const snapV = root => root ? [...root.querySelectorAll(ANIM)].map(animV) : null;
  const cnt = (v, f = 'int') => `<span class="cnt" data-v="${+v || 0}" data-f="${f}">${fmtCnt(+v || 0, f)}</span>`;
  const fmtCnt = (v, f) => f === 'kg' ? fmtKg(v) : f === 'w' ? fmtW(Math.round(v * 10) / 10) : f === '1' ? dec((Math.round(v * 10) / 10).toFixed(1)) : String(Math.round(v));
  function morph(root, old, intro) {
    if (calm()) return;
    root.querySelectorAll(ANIM).forEach((el, i) => {
      const to = animV(el), from = old && i < old.length ? old[i] : intro ? 0 : to;
      if (Math.abs(from - to) < 1e-6) return;
      if (el.classList.contains('cnt')) {
        const fin = el.textContent, f = el.dataset.f, t0 = performance.now(), D = 750;
        const step = now => { const p = Math.min(1, (now - t0) / D); el.textContent = p < 1 ? fmtCnt(from + (to - from) * (1 - Math.pow(1 - p, 3)), f) : fin; if (p < 1) requestAnimationFrame(step); };
        el.textContent = fmtCnt(from, f); requestAnimationFrame(step); return;
      }
      if (el.classList.contains('spark')) { el.classList.add('draw'); return; }
      const prop = el.classList.contains('ring') ? '--p' : 'width', val = v => prop === '--p' ? String(v) : v + '%';
      el.style.transition = 'none'; el.style.setProperty(prop, val(from)); void el.offsetWidth; el.style.transition = '';
      requestAnimationFrame(() => el.style.setProperty(prop, val(to)));
    });
  }
  function stagger(wrap) {
    if (calm()) return;
    wrap.classList.add('enter');
    [...wrap.children].forEach((c, i) => {
      c.style.setProperty('--i', Math.min(i, 9));
      if (c.matches('.bento,.quick,.stats3,.badges,.wk-stats,.pr3')) [...c.children].forEach((g, j) => g.style.setProperty('--j', j));
    });
  }
  let fxSel = null;
  const fx = root => { if (!fxSel || calm()) return; root.querySelectorAll(fxSel).forEach(el => { el.classList.remove('fx'); void el.offsetWidth; el.classList.add('fx'); }); };
  const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } };
  function confetti() {
    if (calm()) return;
    const c = document.createElement('div'), cols = ['var(--lime)', '#ffffff', 'var(--lime-2)', 'var(--gold)'];
    c.className = 'confetti';
    for (let i = 0; i < 70; i++) {
      const s = document.createElement('i');
      s.style.cssText = `left:${50 + (Math.random() - .5) * 24}%;background:${cols[i % 4]};--dx:${((Math.random() - .5) * 380).toFixed(0)}px;--dy:${(-180 - Math.random() * 280).toFixed(0)}px;--r:${(Math.random() * 900 - 450).toFixed(0)}deg;animation-delay:${(Math.random() * 140).toFixed(0)}ms;${i % 3 ? '' : 'border-radius:50%;width:8px;height:8px;'}`;
      c.appendChild(s);
    }
    document.body.appendChild(c); setTimeout(() => c.remove(), 2400);
  }

  /* =========================================================== render: tabs */
  function go(t) {
    const nb = document.querySelector(`.nav [data-tab="${t}"]`);
    if (t !== tab && nb && !calm()) { nb.classList.remove('ia'); void nb.offsetWidth; nb.classList.add('ia'); }
    tab = t; renderTab(true); window.scrollTo(0, 0);
    try { sessionStorage.setItem('gymtab', t); } catch (e) { }
  }
  function renderTab(intro) {
    const tabs = navTabs();
    document.querySelectorAll('.nav button').forEach(b => b.setAttribute('aria-current', b.dataset.tab === tab ? 'page' : 'false'));
    const bar = $('.nav .bar4'); if (bar) bar.style.setProperty('--x', tabs.indexOf(tab));
    const v = $('#view'), old = intro ? null : snapV(v);
    v.innerHTML = `<div class="wrap">${({ home: vHome, exercises: vExercises, daily: vDaily, weight: vWeight, progress: vProgress })[tab]()}</div>`;
    if (tab === 'exercises' && L.mode === 'browse') bindSearch(v);
    if (tab === 'exercises' && L.mode === 'mine') bindMine(v);
    if (intro) stagger(v.firstElementChild);
    translate(v); morph(v, old, intro); fx(v);
    renderResume();
  }
  function renderResume() {
    const r = $('#resume');
    if (S.active && !layers.some(l => l.type === 'workout')) {
      r.hidden = false;
      r.innerHTML = `<button data-act="resume"><span class="pulse"></span><span style="flex:1">${esc(S.active.name)}</span><span class="num" data-clock>${fmtDur(Date.now() - S.active.start)}</span>${I(IC.up)}</button>`; translate(r);
    } else r.hidden = true;
  }

  const ring = (p, inner, size = 64, th = 7, extra = '') => {
    const r = (size - th) / 2, c = size / 2;
    return `<span class="ring" style="--p:${Math.round(Math.max(0, Math.min(100, p || 0)) * 10) / 10};--size:${size}px;${extra}"><svg viewBox="0 0 ${size} ${size}" aria-hidden="true"><circle class="tr" cx="${c}" cy="${c}" r="${r}" stroke-width="${th}"/><circle class="fg" cx="${c}" cy="${c}" r="${r}" stroke-width="${th}" pathLength="100"/></svg><span>${inner}</span></span>`;
  };

  function vHome() {
    const st = S.settings, k = today(), ds = dayScore(k), d = day(k);
    const wc = weekCount(k), streak = weekStreak();
    const todayW = workoutsOn(k), vol = todayW.reduce((a, w) => a + volume(w), 0);
    let pc;
    if (S.active) {
      const tot = S.active.ex.reduce((a, e) => a + e.sets.length, 0), dn = S.active.ex.reduce((a, e) => a + e.sets.filter(s => s.done).length, 0);
      const left = S.active.ex.filter(e => e.sets.some(s => !s.done)).length;
      pc = { act: 'resume', t: 'Workout in progress!', s: `${left} exercise${left === 1 ? '' : 's'} left`, p: tot ? dn / tot * 100 : 0 };
    } else pc = { act: 'start-menu', t: 'Workout progress!', s: wc >= st.weeklyGoal ? 'Weekly goal done. Nice work.' : `${st.weeklyGoal - wc} workout${st.weeklyGoal - wc === 1 ? '' : 's'} left this week`, p: wc / st.weeklyGoal * 100 };
    const next = S.active ? (S.active.ex.find(e => e.sets.some(s => !s.done)) || S.active.ex[0]) : null;
    const featId = next ? next.id : (S.routines[0] && S.routines[0].ex[0] ? S.routines[0].ex[0].id : (TEMPLATES[0].ex[0]));
    const nb = Object.keys(S.badges).length;
    const used5 = S.routines;
    const lb = lastBody(), bd = bodyDelta(30), bl = bodyLog().slice(-12).map(x => x.kg);
    const hr = new Date().getHours(), greet = hr < 11 ? 'Good morning' : hr < 16 ? 'Good afternoon' : 'Good evening';
    return `
    <header class="top"><div class="hello"><span class="avatar">${esc((st.name || 'Me')[0].toUpperCase())}</span><div><div class="w">${greet}</div><div class="n">${esc(st.name || 'Athlete')}</div></div></div>
      <div class="top-icons"><button class="ic" data-go="progress" aria-label="Achievements">${I(IC.medal)}${nb ? `<span class="dot">${nb}</span>` : ''}</button><button class="ic" data-layer="settings" aria-label="Settings">${I(IC.gear)}</button></div></header>
    <button class="card progress-card" data-act="${pc.act}"><span class="body"><h2>${pc.t}</h2><span class="small muted">${pc.s}</span></span>${ring(pc.p, `<span class="small">${cnt(pc.p)}%</span>`, 60, 6)}</button>
    <div class="bento" style="grid-template-areas:'a b' 'a m' 's m';grid-template-rows:auto auto auto">
      ${wellOn() ? `<button class="tile card lime" style="grid-area:a" data-go="daily"><span class="tl">Today ${I(IC.flame)}</span>
        <span class="center">${ring(ds.n / ds.of * 100, `<span><span class="lg" style="font-size:34px">${cnt(ds.n)}/${ds.of}</span><br><span class="small">goals</span></span>`, 128, 12)}</span></button>`
        : (() => { const tv = weekVol(k), lv = weekVol(addDays(k, -7)); return `<button class="tile card lime" style="grid-area:a" data-go="progress"><span class="tl">This week ${I(IC.dumbbell)}</span>
        <span class="center">${ring(lv ? tv / lv * 100 : tv ? 100 : 0, `<span><span class="lg" style="font-size:30px">${cnt(tv, 'kg')}</span><br><span class="small">kg lifted</span></span>`, 128, 12)}</span>
        <span class="small" style="text-align:center;margin-top:-4px">${lv ? `${Math.round(tv / lv * 100)}% of last week` : tv ? 'First week logged' : 'No lifts yet this week'}</span></button>`; })()}
      <button class="tile card" style="grid-area:b" ${wellOn() ? 'data-act="log-weight"' : 'data-go="weight"'}><span class="tl">Weight ${I(IC.scale, 'style="color:var(--lime)"')}</span>
        ${lb ? `<span><span class="xl">${cnt(lb.kg, 'w')}</span><span class="unit">kg</span></span><span class="small ${bd == null ? 'muted' : 'delta'}">${bd == null ? fmtDay(lb.d, { day: 'numeric', month: 'short' }) : deltaTxt(bd) + ' · 30 days'}</span>${spark(bl, 120, 26)}`
          : `<span class="xl" style="color:var(--faint)">–</span><span class="small muted">Tap to log your weight</span>`}</button>
      <button class="tile card media" style="grid-area:m;min-height:190px" data-open="${featId}">${gif(featId).replace('class="gif ', 'class="gif " style="position:absolute;inset:0;border-radius:0"')}<span class="pill">${S.active ? 'Up next' : 'Try this'}</span></button>
      <button class="tile card" style="grid-area:s" data-go="progress"><span class="tl">Streak ${I(IC.flame, 'style="color:var(--lime)"')}</span><span class="split"><span><span class="xl">${cnt(streak)}</span><span class="unit">week${streak === 1 ? '' : 's'}</span></span>${ring(wc / st.weeklyGoal * 100, `<span class="small">${wc}/${st.weeklyGoal}</span>`, 50, 6)}</span></button>
    </div>
    <section class="sec"><div class="sec-head"><h2>Your routines</h2><button class="link" data-act="start-empty">${S.active ? 'Resume workout' : '+ Empty workout'}</button></div>
      <div class="list">
        ${used5.length ? used5.map(r => routineRow(r)).join('') : TEMPLATES.slice(0, 3).map(t => `<button class="row inset" data-tpl="${esc(t.name)}">${gif(t.ex[0], 'thumb')}<span class="vr"></span><span class="body"><span class="t">${esc(t.name)}</span><span class="s">Template · ${t.ex.length} exercises · tap to add</span></span>${I(IC.plus, 'style="color:var(--lime)"')}</button>`).join('')}
        <button class="row" data-act="new-routine"><span class="eq-ic">${I(IC.plus)}</span><span class="body"><span class="t">Create your own routine</span><span class="s">Add your trainer's plan</span></span></button>
      </div>
    </section>
    ${todayW.length ? `<section class="sec"><div class="sec-head"><h2>Today's training</h2><span class="muted small">${fmtKg(vol)} kg lifted</span></div><div class="list">${todayW.map(workoutRow).join('')}</div></section>` : ''}`;
  }
  function routineRow(r) {
    const ws = weekStart(today()), times = finished().filter(w => w.routineId === r.id && dkey(w.start) >= ws).length;
    return `<button class="row inset" data-routine="${r.id}">${gif(r.ex[0] && r.ex[0].id, 'thumb')}<span class="vr"></span><span class="body"><span class="t">${esc(r.name)}</span><span class="s">${r.ex.length} exercises${times ? ` · done ${times}× this week` : ''}</span></span>${ring(times ? 100 : 0, times ? I(IC.check, 'style="width:16px;height:16px;color:var(--lime)"') : '', 40, 4)}</button>`;
  }
  function workoutRow(w) {
    const n = doneSets(w).length;
    return `<button class="row" data-workout="${w.id}"><span class="eq-ic">${I(IC.dumbbell)}</span><span class="body"><span class="t">${esc(w.name)}</span><span class="s">${fmtDay(dkey(w.start))} · ${fmtMin(w.end - w.start)} · ${n} sets${w.prs && w.prs.length ? ` · ${w.prs.length} PR` : ''}</span></span><span class="muted small num">${fmtKg(volume(w))} kg</span></button>`;
  }

  /* ---------- exercises tab */
  function vExercises() {
    return `<header class="top"><h1>Exercises</h1><span class="muted small">${EX.length} moves</span></header>
      <div class="seg" role="group"><button data-mode="browse" aria-pressed="${L.mode === 'browse'}">Browse</button><button data-mode="mine" aria-pressed="${L.mode === 'mine'}">Mine</button><button data-mode="body" aria-pressed="${L.mode === 'body'}">Body map</button></div>
      <div style="margin-top:14px">${L.mode === 'browse' ? libraryHTML('tab') : L.mode === 'mine' ? mineHTML() : bodyHTML()}</div>`;
  }
  /* "Mine": everything you've trained, renamed or written notes on, newest first */
  function mineList() {
    const last = {}; finished().forEach(w => w.ex.forEach(e => { if (e.sets.some(s => s.done)) last[e.id] = w.start; }));
    const ids = new Set([...Object.keys(last), ...Object.keys(S.nick), ...Object.keys(S.notes)].filter(id => byId[id]));
    const toks = norm(L.mq).split(' ').filter(Boolean);
    let list = [...ids].map(id => byId[id]);
    if (toks.length) list = list.filter(e => score(e, toks) > 0);
    return list.sort((a, b) => (last[b.id] || 0) - (last[a.id] || 0) || nameOf(a.id).localeCompare(nameOf(b.id))).map(e => ({ e, last: last[e.id] }));
  }
  function mineHTML() {
    return `<div class="stack"><label class="search">${I(IC.search)}<input class="mq" type="search" placeholder="Search your names, notes, machines…" value="${esc(L.mq)}" autocomplete="off" enterkeyhint="search"></label>
      <div class="mine-list"></div></div>`;
  }
  function renderMine(root) {
    const box = root.querySelector('.mine-list'); if (!box) return;
    const list = mineList();
    if (!list.length) { box.innerHTML = L.mq ? `<div class="empty"><p class="muted">Nothing matches “${esc(L.mq)}”.</p></div>` : `<div class="empty">${I(IC.note, 'style="width:34px;height:34px;color:var(--lime)"')}<h3>Your gym notebook</h3><p class="muted">Exercises you train, rename or write notes on land here, so you can find what your trainer showed you. Open any exercise and add a note like “seat 4, pin 6, slow down”.</p><button class="btn primary sm" data-mode="browse">Browse exercises</button></div>`; translate(box); return; }
    box.innerHTML = `<div class="list mine">${list.map(({ e, last }) => {
      const s = exSessions(e.id).pop(), top = s ? s.sets.reduce((a, x) => +x.w >= +a.w ? x : a, s.sets[0]) : null, note = S.notes[e.id];
      return `<button class="row" data-open="${e.id}">${gif(e.id, 'thumb')}<span class="body">${S.nick[e.id] ? `<span class="t">${esc(S.nick[e.id])}</span><span class="s">${esc(e.n)}</span>` : `<span class="t">${esc(e.n)}</span><span class="s">${esc(EQ[e.eq])}</span>`}
        ${note ? `<span class="note-line">${I(IC.note)}<span>${esc(note)}</span></span>` : ''}</span>
        <span class="mine-r">${top ? wchip(top.w) + `<small>${ago(last)}</small>` : '<small>not trained</small>'}</span></button>`;
    }).join('')}</div>`;
    translate(box);
  }
  function bindMine(root) {
    const q = root.querySelector('.mq'); if (!q) return;
    let t; q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { L.mq = q.value; root.querySelector('.mine-list').classList.add('anim'); renderMine(root); }, 120); });
    renderMine(root);
  }
  const ago = ts => { if (!ts) return ''; const n = Math.round((parseD(today()) - parseD(dkey(ts))) / 864e5); return n <= 0 ? 'today' : n === 1 ? 'yesterday' : n < 7 ? n + ' days ago' : n < 60 ? Math.round(n / 7) + ' wk ago' : fmtDay(dkey(ts), { day: 'numeric', month: 'short' }); };
  function libraryHTML(ctx) {
    const counts = {}; EX.forEach(e => { if (!L.m || e.p.includes(L.m)) counts[e.eq] = (counts[e.eq] || 0) + 1; });
    return `<div class="stack">
      <label class="search">${I(IC.search)}<input class="q" type="search" placeholder="Try “pull down”, “seated row”, “rope”…" value="${esc(L.q)}" autocomplete="off" enterkeyhint="search"></label>
      <div><div class="flabel">Equipment</div><div class="chips"><button class="chip" data-eq="" aria-pressed="${!L.eq}">All</button>${Object.keys(EQ).filter(k => counts[k]).map(k => `<button class="chip" data-eq="${k}" aria-pressed="${L.eq === k}">${EQ[k]}<span class="n">${counts[k]}</span></button>`).join('')}</div></div>
      <div><div class="flabel">Muscle</div><div class="chips"><button class="chip" data-m="" aria-pressed="${!L.m}">Any</button>${MUSCLES.map(m => `<button class="chip" data-m="${m}" aria-pressed="${L.m === m}">${ml(m)}</button>`).join('')}</div></div>
      <div class="results" data-ctx="${ctx}"></div></div>`;
  }
  function results() {
    const toks = norm(L.q).split(' ').filter(Boolean), u = used();
    let list = EX.filter(e => (!L.eq || e.eq === L.eq) && (!L.m || e.p.includes(L.m)));
    if (toks.length) list = list.map(e => [e, score(e, toks)]).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1] || rank(a[0], u) - rank(b[0], u)).map(x => x[0]);
    else list.sort((a, b) => rank(a, u) - rank(b, u) || a.n.localeCompare(b.n));
    return list;
  }
  function renderResults(root) {
    root.querySelectorAll('.results').forEach(r => {
      const pick = r.dataset.ctx === 'pick' ? topLayer() : null;
      const list = results();
      r.innerHTML = `<p class="muted small" style="margin:0 2px 10px">${list.length} match${list.length === 1 ? '' : 'es'}</p>
        ${list.length ? `<div class="grid">${list.slice(0, L.limit).map(e => exCard(e, pick)).join('')}</div>` : `<div class="empty"><p class="muted">No matches. Try fewer words or clear the filters.</p><button class="btn sm" data-act="clear-filters">Clear filters</button></div>`}
        ${list.length > L.limit ? `<button class="btn block" style="margin-top:14px" data-act="more">Show more (${list.length - L.limit} left)</button>` : ''}
        <p class="credit">Animations © <a href="https://gymvisual.com/" target="_blank" rel="noopener">Gym visual</a></p>`;
      translate(r);
    });
  }
  function exCard(e, pick) {
    const sel = pick && pick.sel.includes(e.id), last = exSessions(e.id).pop();
    return `<button class="excard${sel ? ' sel' : ''}" ${pick ? `data-pick="${e.id}"` : `data-open="${e.id}"`}>${gif(e.id)}
      ${sel ? `<span class="tick">${I(IC.check)}</span>` : ''}
      <span class="meta">${S.nick[e.id] ? `<span class="nick">${esc(S.nick[e.id])}</span>` : ''}<span class="name">${esc(e.n)}</span>
      <span class="sub">${last ? `Last: ${fmtW(last.best)} kg` : esc(EQ[e.eq] + ' · ' + ml(e.p[0] || e.t))}</span></span></button>`;
  }
  function bindSearch(root) {
    const q = root.querySelector('.q'); if (!q) return;
    let t; q.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { L.q = q.value; L.limit = 40; root.querySelectorAll('.results').forEach(r => r.classList.add('anim')); renderResults(root); }, 120); });
    renderResults(root);
  }
  function bodyHTML() {
    const heat = weekMuscleSets(), sel = L.bodySel, all = sel === 'full';
    let panel = `<p class="muted" style="text-align:center;margin-top:14px">Tap a muscle, or <b>Full body</b>, to see what equipment trains it.</p>`;
    if (sel) {
      const pool = all ? EX.filter(e => e.eq !== 'cardio') : EX.filter(e => e.p.includes(sel));
      const by = {}; pool.forEach(e => (by[e.eq] = by[e.eq] || []).push(e));
      const rows = Object.entries(by).sort((a, b) => b[1].length - a[1].length), u = used();
      panel = `<section class="sec"><div class="sec-head"><h2>${all ? 'Full body' : esc(ml(sel))}</h2>${!all ? `<span class="muted small">${fmtW(heat[sel] || 0)} sets this week</span>` : ''}</div>
        <p class="muted small">${all ? 'All the equipment in the gym, most exercises first.' : `${pool.length} exercises work this muscle. Here is the equipment you need.`} Tap one to see the moves.</p>
        <div class="list">${rows.map(([eq, list]) => {
          const ex = list.sort((a, b) => rank(a, u) - rank(b, u)).slice(0, 2).map(e => e.n).join(', ');
          return `<button class="row" data-eqgo="${eq}"><span class="eq-ic"><svg class="i" viewBox="0 0 24 24">${EQ_ICON[eq] || EQ_ICON.other}</svg></span><span class="body"><span class="t">${EQ[eq]}</span><span class="s">e.g. ${esc(ex)}</span><span class="thin" style="margin-top:6px"><b style="width:${Math.max(6, list.length / rows[0][1].length * 100)}%"></b></span></span><span class="count">${list.length}</span>${I(IC.back, 'style="transform:rotate(180deg);color:var(--faint)"')}</button>`;
        }).join('')}</div></section>`;
    }
    return `<div class="bodywrap"><div style="display:flex;justify-content:space-between;width:100%;padding:0 8px;align-items:center"><span class="small muted">Trained this week</span><button class="chip" data-muscle="full" aria-pressed="${all}">Full body</button></div>
      <div class="bodies${all ? ' all' : ''}"><figure>${bodySvg('front', sel, heat)}<figcaption>Front</figcaption></figure><figure>${bodySvg('back', sel, heat)}<figcaption>Back</figcaption></figure></div>
      <div class="legend"><span><i style="background:var(--muscle)"></i>Not yet</span><span><i style="background:var(--heat1)"></i>1–3 sets</span><span><i style="background:var(--heat2)"></i>4–9</span><span><i style="background:var(--heat3)"></i>10+</span></div></div>
      <div class="chips" style="margin-top:12px">${MUSCLES.map(m => `<button class="chip" data-muscle="${m}" aria-pressed="${sel === m}">${ml(m)}</button>`).join('')}</div>${panel}`;
  }

  /* ---------- daily tab */
  function vDaily() {
    const st = S.settings, k = dailyKey, d = day(k), ds = dayScore(k), ws = workoutsOn(k), t = today();
    const start = addDays(t, -6) > k ? addDays(k, -3) : addDays(t, -6);
    const days = [...Array(7)].map((_, i) => addDays(start, i));
    const meals = Object.values(d.meals || {}).filter(Boolean).length;
    const vol = ws.reduce((a, w) => a + volume(w), 0), sets = ws.reduce((a, w) => a + doneSets(w).length, 0);
    const M = [['breakfast', 'Breakfast'], ['lunch', 'Lunch'], ['dinner', 'Dinner'], ['snack', 'Snack']];
    const prs = allPRs().filter(p => p.date === k), newB = BADGES.filter(b => S.badges[b.id] === k);
    return `<header class="top"><h1>${k === t ? 'Today' : esc(fmtDay(k, { weekday: 'long', day: 'numeric', month: 'short' }))}</h1>
      <div class="top-icons"><button class="ic" data-go="progress" aria-label="Calendar">${I(IC.calendar)}</button></div></header>
    <div class="dates">${days.map(x => { const dd = parseD(x); return `<button data-day="${x}" class="${x === k ? 'on' : ''}${x > t ? ' dim' : ''}${dayScore(x).n ? ' has' : ''}" ${x > t ? 'disabled' : ''}><b>${dd.getDate()}</b><small>${dd.toLocaleDateString(LOC(), { month: 'short' })}</small></button>`; }).join('')}</div>
    <div class="card" style="margin-top:16px">
      <div class="summary"><div class="kv"><b class="num">${cnt(vol, 'kg')} kg</b><span>Lifted</span></div>${ring(ds.n / ds.of * 100, `<span><span class="lg">${cnt(ds.n)}/${ds.of}</span><br><span class="small muted">goals</span></span>`, 112, 11)}<div class="kv r"><b class="num">${cnt(sets)} sets</b><span>${ws.length ? fmtMin(ws.reduce((a, w) => a + w.end - w.start, 0)) : (d.rest ? 'Rest day' : 'No workout yet')}</span></div></div>
      <div class="bars3"><div><div class="l">Water ${d.water}/${st.waterGoal}</div><div class="thin"><b style="width:${Math.min(100, d.water / st.waterGoal * 100)}%"></b></div></div><div><div class="l">Sleep ${fmtW(d.sleep)}/${st.sleepGoal}h</div><div class="thin"><b style="width:${Math.min(100, d.sleep / st.sleepGoal * 100)}%"></b></div></div><div><div class="l">Meals ${meals}/3</div><div class="thin"><b style="width:${Math.min(100, meals / 3 * 100)}%"></b></div></div></div>
    </div>
    <div class="bento" style="grid-template-columns:1fr 1fr">
      <div class="tile card"><span class="tl">Sleep ${ring(d.sleep / st.sleepGoal * 100, '', 40, 6)}</span><span><span class="xl">${cnt(d.sleep, 'w')}</span><span class="unit">/ ${st.sleepGoal} hours</span></span>
        <span class="stepper-sm"><button data-daily="sleep" data-d="-0.5" aria-label="Less sleep">−</button><button data-daily="sleep" data-d="0.5" aria-label="More sleep">+</button></span></div>
      <div class="tile card lime2"><span class="tl">Water ${ring(d.water / st.waterGoal * 100, '', 40, 6)}</span><span><span class="xl">${cnt(d.water)}</span><span class="unit">/ ${st.waterGoal} glasses</span></span>
        <span class="stepper-sm"><button data-daily="water" data-d="-1" aria-label="Less water">−</button><button data-daily="water" data-d="1" aria-label="More water">+</button></span></div>
    </div>
    ${(() => { const bw = S.body.find(x => x.d === k); return `<button class="row card weigh-row" data-act="log-weight"><span class="eq-ic">${I(IC.scale)}</span><span class="body"><span class="t">Body weight</span><span class="s">${bw ? 'Logged for this day · tap to change' : 'Not logged for this day'}</span></span>${bw ? bwchip(bw.kg) : `<span class="btn primary sm">Log</span>`}</button>`; })()}
    <section class="sec"><div class="sec-head"><h2>Training</h2><button class="link" data-daily="rest">${d.rest ? 'Undo rest day' : 'Mark rest day'}</button></div>
      ${ws.length ? `<div class="list">${ws.map(workoutRow).join('')}</div>` : `<div class="empty"><p class="muted">${d.rest ? 'Rest day. Recovery counts as a goal.' : 'No workout logged for this day.'}</p>${k === t && !d.rest ? `<button class="btn primary" data-act="start-menu">Start a workout</button>` : ''}</div>`}
    </section>
    <section class="sec"><div class="sec-head"><h2>Daily food</h2><span class="muted small">Plan is the same every day</span></div>
      ${M.map(([mk, label], i) => `<div class="meal card${i === 0 ? ' lime' : ''}"><div class="mh"><h3>${label}</h3>${I(IC.food)}</div>
        <div class="plan"><textarea id="meal-${mk}" data-meal="${mk}" rows="2" placeholder="What should you eat? e.g. oats, 3 eggs, banana">${esc(st.meals[mk])}</textarea></div>
        <div class="mf"><span class="small">${d.meals && d.meals[mk] ? 'Eaten' : 'Not eaten yet'}</span><button class="check${d.meals && d.meals[mk] ? ' on' : ''}" data-eat="${mk}" aria-label="Mark ${label} eaten">${I(IC.check)}</button></div></div>`).join('')}
    </section>
    ${prs.length || newB.length ? `<section class="sec"><h2>Achievements</h2><div class="list">
      ${prs.map(p => `<button class="row" data-open="${p.ex}"><span class="eq-ic" style="color:var(--gold)">${I(IC.star)}</span><span class="body"><span class="t">${esc(nameOf(p.ex))}</span><span class="s">New personal record</span></span>${wchip(p.w)}</button>`).join('')}
      ${newB.map(b => `<div class="row"><span class="eq-ic">${I(IC[b.icon])}</span><span class="body"><span class="t">${b.name}</span><span class="s">Badge unlocked · ${b.desc}</span></span></div>`).join('')}</div></section>` : ''}`;
  }

  /* ---------- weight tab (takes Daily's place while wellness is off) */
  function vWeight() {
    const bl = bodyLog(), lb = bl[bl.length - 1], gw = +S.settings.goalWeight || 0, t = today();
    const head = `<header class="top"><h1>Weight</h1><button class="btn primary sm" data-act="log-weight">${I(IC.plus)} Log</button></header>`;
    if (!lb) return head + `<div class="empty" style="padding:34px 20px">${I(IC.scale, 'style="width:44px;height:44px;color:var(--lime)"')}<h2>Track your body weight</h2>
      <p class="muted">Weigh yourself in the morning, after the toilet and before breakfast. Same time, same scale, so the trend is honest.</p><button class="btn primary block" data-act="log-weight">Log today’s weight</button></div>`;
    const first = bl[0], dv = n => bodyDelta(n), all = Math.round((lb.kg - first.kg) * 10) / 10;
    const goalP = gw && first.kg !== gw ? Math.max(0, Math.min(100, (first.kg - lb.kg) / (first.kg - gw) * 100)) : 0;
    const pts = bl.filter(x => !wRange || x.d >= addDays(t, -wRange)), kgs = bl.map(x => x.kg);
    const stat = (v, l) => `<div class="stat"><b class="delta">${v == null ? '–' : deltaTxt(v)}</b><span>${l}</span></div>`;
    return head + `
    <div class="card lime bw-hero"><div><span class="small">${lb.d === t ? 'Today' : fmtDay(lb.d, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
        <div><span class="xl" style="font-size:52px">${cnt(lb.kg, 'w')}</span><span class="unit"> kg</span></div>
        <span class="small">${gw ? (lb.kg === gw ? 'Goal reached!' : `${fmtW(Math.abs(Math.round((lb.kg - gw) * 10) / 10))} kg ${lb.kg > gw ? 'to lose' : 'to gain'} · goal ${fmtW(gw)}`) : '<span data-layer="settings" style="text-decoration:underline">Set a goal weight</span>'}</span></div>
      ${gw ? ring(goalP, `<span><b class="lg" style="font-size:22px">${cnt(goalP)}%</b><br><span class="small">to goal</span></span>`, 104, 10) : ''}</div>
    <div class="stats3">${stat(dv(7), '7 days')}${stat(dv(30), '30 days')}${stat(bl.length > 1 ? all : null, 'Since ' + fmtDay(first.d, { day: 'numeric', month: 'short' }))}</div>
    <section class="sec"><div class="sec-head"><h2>Trend</h2><div class="seg mini-seg">${[[30, '30D'], [90, '90D'], [0, 'All']].map(([v, l]) => `<button data-wr="${v}" aria-pressed="${wRange === v}">${l}</button>`).join('')}</div></div>
      <div class="card pad">${chart(pts.map(x => ({ k: x.d, v: x.kg })), gw)}
        ${bl.length > 1 ? `<div class="bw-mm"><span>Lowest <b>${fmtW(Math.min(...kgs))} kg</b></span><span>Highest <b>${fmtW(Math.max(...kgs))} kg</b></span><span>Entries <b>${bl.length}</b></span></div>` : ''}</div></section>
    <section class="sec"><h2>History</h2><div class="list">${bl.slice().reverse().map((x, i) => { const prev = bl[bl.length - 2 - i], d = prev ? Math.round((x.kg - prev.kg) * 10) / 10 : null;
      return `<button class="row" data-weight="${x.d}"><span class="body"><span class="t">${fmtDay(x.d, { weekday: 'long', day: 'numeric', month: 'short' })}</span><span class="s ${d ? 'delta' : ''}">${d ? deltaTxt(d) + ' since last' : d === 0 ? 'No change' : 'First entry'}</span></span>${bwchip(x.kg)}</button>`; }).join('')}</div>
      <p class="muted small" style="text-align:center">Tap an entry to change or delete it. Day-to-day jumps of ±1 kg are normal (water, food), so watch the trend.</p></section>`;
  }

  /* ---------- progress tab */
  function vProgress() {
    const fw = finished(), prs = allPRs(), [y, m] = calMonth.split('-').map(Number);
    const first = new Date(y, m - 1, 1), lead = (first.getDay() + 6) % 7, dim = new Date(y, m, 0).getDate(), t = today();
    const prDays = new Set(prs.map(p => p.date));
    const cells = [...Array(lead)].map(() => '<span class="blank"></span>').concat([...Array(dim)].map((_, i) => {
      const k = `${y}-${String(m).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`; const sc = k > t ? 0 : wellOn() ? dayScore(k).n : workoutsOn(k).length ? 4 : 0;
      return `<button data-day="${k}" style="--c:${i + lead}" class="${sc >= 4 ? 's3' : sc >= 2 ? 's2' : sc >= 1 ? 's1' : ''}${k === t ? ' today' : ''}${prDays.has(k) ? ' pr' : ''}" ${k > t ? 'disabled' : ''}>${i + 1}</button>`;
    }));
    const best = {}; fw.forEach(w => w.ex.forEach(e => e.sets.forEach(s => { if (s.done && +s.w >= (best[e.id] ? best[e.id].w : 0)) best[e.id] = { w: +s.w, d: dkey(w.start) }; })));
    const bestList = Object.entries(best).sort((a, b) => b[1].w - a[1].w).slice(0, 8);
    const bl = bodyLog(), lb = bl[bl.length - 1], gw = +S.settings.goalWeight || 0, d30 = bodyDelta(30);
    return `<header class="top"><h1>Progress</h1><div class="top-icons"><button class="ic" data-layer="settings" aria-label="Settings">${I(IC.gear)}</button></div></header>
    <div class="stats3"><div class="stat lime"><b>${cnt(fw.length)}</b><span>Workouts</span></div><div class="stat"><b>${cnt(weekStreak())}</b><span>Week streak</span></div><div class="stat"><b>${cnt(prs.length)}</b><span>Records</span></div></div>
    ${!wellOn() ? '' : `<section class="sec"><div class="sec-head"><h2>Body weight</h2><button class="link" data-act="log-weight">+ Log</button></div>
      ${lb ? `<div class="card pad"><div class="bw-top"><div><span class="xl">${cnt(lb.kg, 'w')}</span><span class="unit muted"> kg</span><div class="small muted">${fmtDay(lb.d, { weekday: 'short', day: 'numeric', month: 'short' })}</div></div>
          <div class="bw-kv">${d30 != null ? `<span><b class="delta">${deltaTxt(d30)}</b><small>30 days</small></span>` : ''}${gw ? `<span><b>${fmtW(Math.abs(Math.round((lb.kg - gw) * 10) / 10))} kg</b><small>${lb.kg > gw ? 'to lose' : lb.kg < gw ? 'to gain' : 'goal hit!'} · goal ${fmtW(gw)}</small></span>` : ''}</div></div>
          ${chart(bl.slice(-30).map(x => ({ k: x.d, v: x.kg })), gw)}</div>
        <div class="list">${bl.slice(-5).reverse().map((x, i, a) => { const prev = bl[bl.length - 2 - i]; const dv = prev ? Math.round((x.kg - prev.kg) * 10) / 10 : null; return `<button class="row" data-weight="${x.d}"><span class="body"><span class="t">${fmtDay(x.d, { weekday: 'long', day: 'numeric', month: 'short' })}</span>${dv ? `<span class="s delta">${deltaTxt(dv)}</span>` : ''}</span>${bwchip(x.kg)}</button>`; }).join('')}</div>`
        : `<div class="empty">${I(IC.scale, 'style="width:34px;height:34px;color:var(--lime)"')}<p class="muted">Weigh yourself in the morning, before breakfast, and log it here to see the trend.</p><button class="btn primary" data-act="log-weight">Log weight</button></div>`}
    </section>`}
    <section class="sec"><div class="sec-head"><h2>${first.toLocaleDateString(LOC(), { month: 'long', year: 'numeric' })}</h2>
      <span style="display:flex;gap:6px"><button class="icon-btn" data-cal="-1" aria-label="Previous month">${I(IC.back)}</button><button class="icon-btn" data-cal="1" aria-label="Next month">${I(IC.back, 'style="transform:rotate(180deg)"')}</button></span></div>
      <div class="card pad"><div class="cal">${(isID() ? ['S', 'S', 'R', 'K', 'J', 'S', 'M'] : ['M', 'T', 'W', 'T', 'F', 'S', 'S']).map(x => `<span class="dn">${x}</span>`).join('')}${cells.join('')}</div>
      <div class="legend" style="margin-top:12px">${wellOn() ? `<span><i style="background:var(--heat1)"></i>1 goal</span><span><i style="background:var(--heat2)"></i>2–3</span><span><i style="background:var(--lime)"></i>All 4</span>` : `<span><i style="background:var(--lime)"></i>Workout</span>`}<span><i style="background:var(--gold);border-radius:50%"></i>Record</span></div></div></section>
    <section class="sec"><div class="sec-head"><h2>Badges</h2><span class="muted small">${shownBadges().filter(b => S.badges[b.id]).length}/${shownBadges().length}</span></div>
      <div class="badges">${shownBadges().map(b => { const got = S.badges[b.id], [c, tt] = b.p(); return `<div class="badge${got ? ' got' : ''}"><span class="medal">${I(IC[b.icon])}</span><span class="bn">${b.name}</span><span class="bd">${b.desc}</span>${got ? `<span class="bd">${fmtDay(got, { day: 'numeric', month: 'short' })}</span>` : `<span class="pbar"><b style="width:${Math.min(100, c / tt * 100)}%"></b></span>`}</div>`; }).join('')}</div></section>
    <section class="sec"><h2>Personal records</h2>${bestList.length ? `<div class="list">${bestList.map(([id, b]) => `<button class="row" data-open="${id}">${gif(id, 'thumb')}<span class="body"><span class="t">${esc(nameOf(id))}</span><span class="s">${fmtDay(b.d)}</span></span>${wchip(b.w)}</button>`).join('')}</div>` : `<div class="empty"><p class="muted">Finish a workout to see your heaviest lifts here.</p></div>`}</section>
    <section class="sec"><h2>History</h2>${fw.length ? `<div class="list">${fw.slice().reverse().slice(0, 30).map(workoutRow).join('')}</div>` : `<div class="empty"><p class="muted">Your finished workouts will show up here.</p><button class="btn primary" data-act="start-menu">Start a workout</button></div>`}</section>`;
  }

  /* =========================================================== layers */
  const topLayer = () => layers[layers.length - 1];
  const SHEETS = ['picker', 'workout', 'summary'];
  function pushLayer(l) { layers.push(l); renderLayers(); }
  function popLayer(swiped) {
    const host = $('#layers'), el = host.children[layers.length - 1];
    const l = layers.pop(); if (l && l.onClose) l.onClose();
    if (el && !calm() && !swiped) { el.classList.add('out'); document.body.appendChild(el); setTimeout(() => el.remove(), 300); }
    renderLayers(); renderTab();
  }
  function renderLayers() {
    const host = $('#layers');
    while (host.children.length > layers.length) host.lastElementChild.remove();
    layers.forEach((l, i) => {
      let el = host.children[i], fresh = false;
      if (!el || el.dataset.lid !== l.lid) { if (el) el.remove(); el = document.createElement('div'); el.className = 'layer' + (SHEETS.includes(l.type) ? ' sheet' : ''); el.style.zIndex = 30 + i; el.dataset.lid = l.lid = l.lid || uid(); host.appendChild(el); l.dirty = true; fresh = true; }
      if (l.dirty || i === layers.length - 1) {
        const sc = el.scrollTop, old = fresh ? null : snapV(el);
        el.innerHTML = `<div class="wrap layer-inner">${LAYER[l.type](l)}</div>`; el.scrollTop = sc; l.dirty = false;
        if (LAYER_BIND[l.type]) LAYER_BIND[l.type](el, l);
        if (fresh) stagger(el.firstElementChild);
        translate(el); morph(el, old, fresh); fx(el);
      }
    });
    document.body.style.overflow = layers.length ? 'hidden' : '';
    renderResume();
  }
  const rerenderTop = () => { const l = topLayer(); if (l) { l.dirty = true; renderLayers(); } };
  const lbar = (title, right = '<span style="width:42px"></span>', icon = IC.back) => `<div class="lbar"><button class="icon-btn" data-act="close" aria-label="Back">${I(icon)}</button><span class="ttl">${title}</span>${right}</div>`;

  const LAYER = {}, LAYER_BIND = {};

  /* ---------- exercise detail */
  LAYER.detail = l => {
    const e = byId[l.id]; if (!e) return lbar('Not found');
    const ses = exSessions(e.id), hist = ses.slice(-20);
    const best = Math.max(0, ...ses.map(s => s.best)), b1 = Math.max(0, ...ses.flatMap(s => s.sets.map(x => est1rm(+x.w || 0, +x.r || 0)))), bv = Math.max(0, ...ses.map(s => s.sets.reduce((a, x) => a + (+x.w || 0) * (+x.r || 0), 0)));
    const ph = l.view === 'photo' && window.GYM_PHOTOS && window.GYM_PHOTOS[e.id];
    return `${lbar('Exercise')}
      ${ph ? `<span class="gif hero"><span class="ph">${window.GYM_PHOTOS[e.id].map(s => `<img alt="" src="${s}">`).join('')}</span></span>` : gif(e.id, 'hero')}
      ${e.ph ? `<div class="seg"><button data-view="anim" aria-pressed="${l.view !== 'photo'}">Animation</button><button data-view="photo" aria-pressed="${l.view === 'photo'}">Real person</button></div>` : ''}
      <div class="stack" style="gap:10px">${S.nick[e.id] ? `<span class="nick-k">${esc(S.nick[e.id])}</span>` : ''}<h1>${esc(e.n)}</h1>
        <div class="tags">${e.p.map(m => `<span class="tag on">${esc(ml(m))}</span>`).join('')}${e.s.map(m => `<span class="tag">${esc(ml(m))}</span>`).join('')}<span class="tag">${esc(EQ[e.eq])}</span></div></div>
      <div class="card notebook"><div class="nb-hd">${I(IC.note)}<h3>My notes</h3><span class="small muted nb-saved" id="nb-saved"></span></div>
        <label class="field">What you call it<input id="nick" placeholder="e.g. “Coach’s rope one”" value="${esc(S.nick[e.id] || '')}"></label>
        <label class="field">Trainer notes &amp; machine settings<textarea id="note" rows="3" placeholder="e.g. Seat 4 · pin 6 · elbows in · 2 sec down">${esc(S.notes[e.id] || '')}</textarea></label></div>
      <div class="seg"><button data-tabd="how" aria-pressed="${l.tab !== 'hist'}">How to</button><button data-tabd="hist" aria-pressed="${l.tab === 'hist'}">History${ses.length ? ` (${ses.length})` : ''}</button></div>
      ${l.tab === 'hist' ? (ses.length ? `
        <div class="pr3"><div class="card"><b>${fmtW(best)}<small class="muted"> kg</small></b><span>Heaviest</span></div><div class="card"><b>${fmtW(Math.round(b1 * 10) / 10)}</b><span>Est. 1-rep max</span></div><div class="card"><b>${fmtKg(bv)}</b><span>Best volume</span></div></div>
        <div class="card pad"><div class="sec-head"><h3>Heaviest set per workout</h3></div>${chart(hist.map(s => ({ k: dkey(s.w.start), v: s.best })))}</div>
        <div class="list">${ses.slice().reverse().map(s => `<div class="row"><span class="body"><span class="t">${fmtDay(dkey(s.w.start))}</span><span class="s">${s.sets.map(x => `${fmtW(x.w)}×${x.r}`).join(' · ')}</span></span>${(s.w.prs || []).some(p => p.ex === e.id) ? '<span class="prbadge">PR</span>' : ''}</div>`).join('')}</div>`
        : `<div class="empty"><p class="muted">No history yet. Add it to a workout and tick your sets.</p></div>`) : `
        <div class="card pad"><ol class="steps">${e.i.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
        <p class="credit">Animation © <a href="https://gymvisual.com/" target="_blank" rel="noopener">Gym visual</a>${e.ph ? ' · Photos: free-exercise-db' : ''}</p>`}
      <div class="foot"><div>${S.active && S.active.ex.some(x => x.id === e.id) ? `<button class="btn primary block" data-act="resume">${I(IC.dumbbell)} Back to workout</button>` : S.active ? `<button class="btn primary block" data-act="add-to-workout">${I(IC.plus)} Add to workout</button>` : `<button class="btn primary block" data-act="start-with">${I(IC.run)} Start workout with this</button>`}</div></div>`;
  };
  LAYER_BIND.detail = (el, l) => {
    const saved = () => { const s = el.querySelector('#nb-saved'); if (!s) return; s.textContent = tr('Saved ✓'); s.classList.remove('fx'); void s.offsetWidth; s.classList.add('fx'); };
    const n = el.querySelector('#nick'); if (n) n.addEventListener('change', () => { const v = n.value.trim(); if (v) S.nick[l.id] = v; else delete S.nick[l.id]; save(); saved(); });
    const nt = el.querySelector('#note'); if (nt) {
      const fit = () => { nt.style.height = 'auto'; nt.style.height = nt.scrollHeight + 2 + 'px'; }; fit();
      nt.addEventListener('input', fit);
      nt.addEventListener('change', () => { const v = nt.value.trim(); if (v) S.notes[l.id] = v; else delete S.notes[l.id]; save(); saved(); const nb = checkBadges(); if (nb.length) toast('Badge unlocked: ' + nb[0].name); });
    }
    const e = byId[l.id]; if (e && e.ph && !(window.GYM_PHOTOS && window.GYM_PHOTOS[e.id])) loadPhotos(e.eq);
  };
  function chart(pts, goal) {
    if (pts.length < 2) return `<p class="muted small" style="margin-top:8px">${goal === undefined ? 'Log this exercise twice to see a trend.' : 'Log your weight on another day to see the trend.'}</p>`;
    const W = 320, H = 150, L0 = 30, R = 12, T = 14, B = 24, vs = pts.map(p => p.v).concat(goal ? [goal] : []);
    let lo = Math.min(...vs), hi = Math.max(...vs); if (hi - lo < 2) { hi += 1; lo = Math.max(0, lo - 1); }
    const x = i => L0 + i * (W - L0 - R) / (pts.length - 1), y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
    const d = pts.map((p, i) => (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.v).toFixed(1)).join('');
    const ticks = [lo, (lo + hi) / 2, hi];
    return `<svg class="chart" viewBox="0 0 ${W} ${H}">${ticks.map(t => `<line class="gd" x1="${L0}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}"/><text x="${L0 - 6}" y="${y(t) + 4}" text-anchor="end">${fmtW(Math.round(t * 2) / 2)}</text>`).join('')}
      ${goal ? `<line class="goal" x1="${L0}" x2="${W - R}" y1="${y(goal)}" y2="${y(goal)}"/><text class="gt" x="${L0 + 4}" y="${y(goal) - 5}">goal</text>` : ''}
      <path class="ar" d="${d}L${x(pts.length - 1)} ${H - B}L${L0} ${H - B}Z"/><path class="ln" pathLength="100" d="${d}"/>${pts.map((p, i) => `<circle class="dt" style="--d:${i}" cx="${x(i)}" cy="${y(p.v)}" r="${i === pts.length - 1 ? 4.5 : 2.5}"/>`).join('')}
      <text x="${L0}" y="${H - 6}">${fmtDay(pts[0].k, { day: 'numeric', month: 'short' })}</text><text x="${W - R}" y="${H - 6}" text-anchor="end">${fmtDay(pts[pts.length - 1].k, { day: 'numeric', month: 'short' })}</text></svg>`;
  }

  /* ---------- picker */
  LAYER.picker = l => `${lbar(l.title || 'Add exercises', '<span style="width:42px"></span>', IC.x)}${libraryHTML('pick')}
    <div class="foot"><div><button class="btn primary block" data-act="pick-done" ${l.sel.length ? '' : 'disabled style="opacity:.5"'}>${l.sel.length ? `Add ${l.sel.length} exercise${l.sel.length === 1 ? '' : 's'}` : 'Tap exercises to select'}</button></div></div>`;
  LAYER_BIND.picker = el => bindSearch(el);

  /* ---------- workout */
  function newSetsFor(id, count, reps) {
    const prev = prevSets(id), n = count || Math.max(prev.length, S.settings.sets);
    return [...Array(n)].map((_, i) => { const p = prev[i] || prev[prev.length - 1]; return { w: p ? p.w : '', r: reps || (p ? p.r : S.settings.reps), done: false }; });
  }
  function startWorkout(opts = {}) {
    if (S.active) { openWorkout(); return; }
    const h = new Date().getHours();
    S.active = { id: uid(), start: Date.now(), name: opts.name || tr(h < 11 ? 'Morning workout' : h < 16 ? 'Afternoon workout' : 'Evening workout'), routineId: opts.routineId || null,
      ex: (opts.ex || []).map(x => ({ id: x.id, sets: newSetsFor(x.id, x.sets, x.reps) })) };
    save(); openWorkout();
  }
  function openWorkout() { while (layers.length) layers.pop(); pushLayer({ type: 'workout' }); }
  LAYER.workout = () => {
    const a = S.active; if (!a) return lbar('No workout');
    const ds = a.ex.reduce((n, e) => n + e.sets.filter(s => s.done).length, 0), tot = a.ex.reduce((n, e) => n + e.sets.length, 0), vol = volume(a);
    const rest = a.restEnd && a.restEnd > Date.now();
    return `<div class="lbar"><button class="icon-btn" data-act="close" aria-label="Minimise">${I(IC.down)}</button><span class="ttl num" data-clock>${fmtDur(Date.now() - a.start)}</span><button class="btn primary sm" data-act="finish">Finish</button></div>
      <input class="wk-name" id="wk-name" value="${esc(a.name)}" aria-label="Workout name">
      <div class="wk-stats"><div class="card"><b class="num" data-clock>${fmtDur(Date.now() - a.start)}</b><span>Duration</span></div><div class="card"><b class="num" id="wk-vol">${fmtKg(vol)}</b><span>Volume kg</span></div><div class="card"><b class="num" id="wk-sets">${cnt(ds)}<small class="muted">/${tot}</small></b><span>Sets done</span></div></div>
      ${tot ? `<div class="thin wk-prog"><b style="width:${Math.round(ds / tot * 1000) / 10}%"></b></div>` : ''}
      ${a.ex.length ? a.ex.map((x, ei) => wexHTML(x, ei)).join('') : `<div class="empty"><p class="muted">Add the exercises you're doing. Pick the machine you're on if you don't know the name.</p></div>`}
      <button class="btn block" data-act="add-ex">${I(IC.plus)} Add exercises</button>
      <button class="btn danger block" data-act="discard">Discard workout</button>
      ${rest ? `<div class="rest${restFresh ? ' fresh' : ''}"><div><span class="fill" id="rest-fill" style="width:${(a.restEnd - Date.now()) / (a.restTotal * 1000) * 100}%"></span><span class="tm"><small>Rest</small><span id="rest-tm">${fmtDur(a.restEnd - Date.now())}</span></span><button class="btn sm" data-rest="-15">−15</button><button class="btn sm" data-rest="15">+15</button><button class="btn sm primary" data-rest="skip">Skip</button></div></div>` : ''}
      <div class="foot"><div><button class="btn primary block" data-act="finish">${I(IC.check)} Finish workout</button></div></div>`;
  };
  function wexHTML(x, ei) {
    const e = byId[x.id] || { n: 'Unknown', eq: 'other' }, prev = prevSets(x.id), best = bestWeight(x.id, S.active.start), all = x.sets.length && x.sets.every(s => s.done);
    return `<div class="wex${all ? ' done' : ''}"><div class="wex-hd"><button data-open="${x.id}" style="display:contents">${gif(x.id)}</button><span class="body"><button class="t" data-open="${x.id}" style="text-align:left">${esc(nameOf(x.id))}</button><span class="s">${esc(EQ[e.eq] || '')}${best ? ` · best ${fmtW(best)} kg` : ''}</span></span>${all ? `<span class="done-badge">${I(IC.check)}</span>` : ''}<button class="icon-btn" data-rmex="${ei}" aria-label="Remove exercise">${I(IC.trash)}</button></div>
      ${S.notes[x.id] ? `<button class="note-line wk-note" data-open="${x.id}">${I(IC.note)}<span>${esc(S.notes[x.id])}</span></button>` : ''}
      <table class="sets"><thead><tr><th>Set</th><th>Previous</th><th>kg</th><th>Reps</th><th></th></tr></thead><tbody>
      ${x.sets.map((s, si) => `<tr class="${s.done ? 'ok' : ''}"><td>${si + 1}</td><td class="prev">${prev[si] ? `${fmtW(prev[si].w)}×${prev[si].r}` : '–'}</td>
        <td><input inputmode="decimal" data-ei="${ei}" data-si="${si}" data-k="w" value="${esc(s.w)}" placeholder="kg" aria-label="Set ${si + 1} weight"></td>
        <td><input inputmode="numeric" data-ei="${ei}" data-si="${si}" data-k="r" value="${esc(s.r)}" placeholder="reps" aria-label="Set ${si + 1} reps"></td>
        <td><button class="chk" data-chk="${ei}:${si}" aria-label="Set ${si + 1} done">${I(IC.check)}</button></td></tr>`).join('')}
      </tbody></table>
      <div class="wex-ft"><button class="btn ghost sm" data-addset="${ei}">${I(IC.plus)} Add set</button>${x.sets.length > 1 ? `<button class="btn ghost sm" style="color:var(--muted)" data-rmset="${ei}">Remove set</button>` : ''}</div></div>`;
  }
  LAYER_BIND.workout = el => {
    el.querySelectorAll('.sets input').forEach(inp => inp.addEventListener('input', () => {
      const s = S.active.ex[+inp.dataset.ei].sets[+inp.dataset.si]; s[inp.dataset.k] = inp.value.replace(',', '.'); save();
      const v = $('#wk-vol'); if (v) v.textContent = fmtKg(volume(S.active));
    }));
    const n = el.querySelector('#wk-name'); if (n) n.addEventListener('input', () => { S.active.name = n.value; save(); });
  };
  function finishWorkout() {
    const a = S.active, n = a.ex.reduce((c, e) => c + e.sets.filter(s => s.done).length, 0);
    if (!n) { ask('No sets ticked', 'Tick ✓ next to each set you did. Discard this workout instead?', 'Discard', true).then(ok => { if (ok) { S.active = null; save(); popLayer(); toast('Workout discarded'); } }); return; }
    const w = clone(a); delete w.restEnd; delete w.restTotal; w.end = Date.now();
    w.ex = w.ex.map(e => ({ id: e.id, sets: e.sets.filter(s => s.done).map(s => ({ w: +s.w || 0, r: +s.r || 0, done: true })) })).filter(e => e.sets.length);
    w.prs = w.ex.map(e => { const top = Math.max(...e.sets.map(s => s.w)), prev = bestWeight(e.id); return prev > 0 && top > prev ? { ex: e.id, w: top, prev } : null; }).filter(Boolean);
    S.workouts.push(w); S.active = null; save();
    const nb = checkBadges(); sync('save', w);
    while (layers.length) layers.pop();
    pushLayer({ type: 'summary', wid: w.id, badges: nb.map(b => b.id) });
  }
  LAYER.summary = l => {
    const w = S.workouts.find(x => x.id === l.wid); if (!w) return lbar('Done');
    const r = w.routineId ? S.routines.find(x => x.id === w.routineId) : null;
    return `${lbar('', '<span style="width:42px"></span>', IC.x)}
      <div class="celebrate"><span class="medal">${I(IC.trophy)}</span><h1>Workout complete!</h1><p class="muted">${esc(w.name)} · ${fmtDay(dkey(w.start), { weekday: 'long', day: 'numeric', month: 'long' })}</p></div>
      <div class="wk-stats"><div class="card"><b>${fmtMin(w.end - w.start)}</b><span>Duration</span></div><div class="card"><b>${cnt(volume(w), 'kg')}</b><span>Volume kg</span></div><div class="card"><b>${cnt(doneSets(w).length)}</b><span>Sets</span></div></div>
      ${w.prs.length ? `<section class="stack"><h2>New records</h2><div class="list">${w.prs.map(p => `<div class="row">${gif(p.ex, 'thumb')}<span class="body"><span class="t">${esc(nameOf(p.ex))}</span><span class="s">Was ${fmtW(p.prev)} kg</span></span><span class="prbadge">PR</span>${wchip(p.w)}</div>`).join('')}</div></section>` : ''}
      ${l.badges.length ? `<section class="stack"><h2>Badges unlocked</h2><div class="badges">${l.badges.map(id => { const b = BADGES.find(x => x.id === id); return `<div class="badge got"><span class="medal">${I(IC[b.icon])}</span><span class="bn">${b.name}</span><span class="bd">${b.desc}</span></div>`; }).join('')}</div></section>` : ''}
      <section class="stack"><h2>Exercises</h2><div class="list">${w.ex.map(e => `<div class="row">${gif(e.id, 'thumb')}<span class="body"><span class="t">${esc(nameOf(e.id))}</span><span class="s">${e.sets.map(s => `${fmtW(s.w)}×${s.r}`).join(' · ')}</span></span></div>`).join('')}</div></section>
      <div class="foot"><div>${r ? '' : `<button class="btn" data-act="save-as-routine">Save as routine</button>`}<button class="btn primary" data-act="close">Done</button></div></div>`;
  };

  LAYER_BIND.summary = (el, l) => { if (!l.fx) { l.fx = 1; setTimeout(confetti, 250); buzz([30, 60, 30]); } };

  /* ---------- workout view (history) */
  LAYER.workoutView = l => {
    const w = S.workouts.find(x => x.id === l.wid); if (!w) return lbar('Deleted');
    return `${lbar(esc(fmtDay(dkey(w.start))))}<h1>${esc(w.name)}</h1>
      <div class="wk-stats"><div class="card"><b>${fmtMin(w.end - w.start)}</b><span>Duration</span></div><div class="card"><b>${fmtKg(volume(w))}</b><span>Volume kg</span></div><div class="card"><b>${doneSets(w).length}</b><span>Sets</span></div></div>
      <div class="list">${w.ex.map(e => `<button class="row" data-open="${e.id}">${gif(e.id, 'thumb')}<span class="body"><span class="t">${esc(nameOf(e.id))}</span><span class="s">${e.sets.map(s => `${fmtW(s.w)}×${s.r}`).join(' · ')}</span></span>${(w.prs || []).some(p => p.ex === e.id) ? '<span class="prbadge">PR</span>' : ''}</button>`).join('')}</div>
      <div class="foot"><div><button class="btn" data-act="repeat">${I(IC.run)} Do again</button><button class="btn danger" data-act="del-workout">${I(IC.trash)} Delete</button></div></div>`;
  };

  /* ---------- routines */
  LAYER.routines = () => `${lbar('Routines')}
    <p class="muted">Save your trainer's plan once, then start it with one tap. Sets and weights fill in from last time.</p>
    ${S.routines.length ? `<div class="list">${S.routines.map(routineRow).join('')}</div>` : ''}
    <button class="btn primary block" data-act="new-routine">${I(IC.plus)} New routine</button>
    <section class="sec"><h2>Templates</h2><div class="list">${TEMPLATES.map(t => `<button class="row" data-tpl="${esc(t.name)}"><span class="thumbs">${t.ex.slice(0, 3).map(id => gif(id)).join('')}</span><span class="body"><span class="t">${esc(t.name)}</span><span class="s">${t.ex.map(id => byId[id].n).join(', ')}</span></span>${I(IC.plus, 'style="color:var(--lime)"')}</button>`).join('')}</div></section>`;
  LAYER.routine = l => {
    const r = l.draft;
    return `${lbar(l.isNew ? 'New routine' : 'Routine', l.isNew ? '<span style="width:42px"></span>' : `<button class="icon-btn" data-act="del-routine" aria-label="Delete routine">${I(IC.trash)}</button>`)}
      <input class="wk-name" id="r-name" value="${esc(r.name)}" placeholder="Routine name, e.g. Day A – Push" aria-label="Routine name">
      ${r.ex.length ? `<div class="list">${r.ex.map((x, i) => `<div class="row">${gif(x.id, 'thumb')}<span class="body"><span class="t">${esc(nameOf(x.id))}</span>
        <span class="s" style="display:flex;gap:8px;align-items:center;margin-top:6px;overflow:visible"><input class="mini" type="number" min="1" inputmode="numeric" data-rset="${i}" data-k="sets" value="${x.sets}" aria-label="Sets"> sets ×<input class="mini" type="number" min="1" inputmode="numeric" data-rset="${i}" data-k="reps" value="${x.reps}" aria-label="Reps"> reps</span></span>
        <span style="display:flex;flex-direction:column;gap:4px"><button class="icon-btn" style="width:34px;height:34px" data-rmove="${i}:-1" aria-label="Move up" ${i ? '' : 'disabled style="width:34px;height:34px;opacity:.3"'}>${I(IC.up)}</button><button class="icon-btn" style="width:34px;height:34px" data-rdel="${i}" aria-label="Remove">${I(IC.x)}</button></span></div>`).join('')}</div>`
        : `<div class="empty"><p class="muted">No exercises yet.</p></div>`}
      <button class="btn block" data-act="routine-add">${I(IC.plus)} Add exercises</button>
      <div class="foot"><div>${l.isNew ? '' : `<button class="btn" data-act="routine-start">${I(IC.run)} Start</button>`}<button class="btn primary" data-act="routine-save">Save routine</button></div></div>`;
  };
  LAYER_BIND.routine = (el, l) => {
    const n = el.querySelector('#r-name'); n.addEventListener('input', () => l.draft.name = n.value);
    el.querySelectorAll('[data-rset]').forEach(inp => inp.addEventListener('input', () => { l.draft.ex[+inp.dataset.rset][inp.dataset.k] = Math.max(1, parseInt(inp.value) || 1); }));
  };
  const openRoutine = (r, isNew) => pushLayer({ type: 'routine', draft: clone(r), isNew });

  /* ---------- settings */
  LAYER.settings = () => {
    const st = S.settings;
    return `${lbar('Settings')}
      <div class="card pad stack"><h3>You</h3><label class="field">Name<input id="set-name" data-set="name" value="${esc(st.name)}"></label>
        <div class="field">Language<div class="seg nt">${[['en', 'English'], ['id', 'Bahasa Indonesia']].map(([v, l]) => `<button data-lang="${v}" aria-pressed="${(st.lang || 'en') === v}">${l}</button>`).join('')}</div></div></div>
      <div class="card pad stack"><h3>Workout defaults</h3><div class="fields3">
        <label class="field">Sets<input type="number" inputmode="numeric" data-set="sets" value="${st.sets}"></label>
        <label class="field">Reps<input type="number" inputmode="numeric" data-set="reps" value="${st.reps}"></label>
        <label class="field">Rest (sec)<input type="number" inputmode="numeric" data-set="rest" value="${st.rest}"></label></div></div>
      <div class="card pad stack"><h3>Goals</h3><div class="fields3" ${wellOn() ? '' : 'style="grid-template-columns:1fr 1fr"'}>
        <label class="field">Workouts / week<input type="number" inputmode="numeric" data-set="weeklyGoal" value="${st.weeklyGoal}"></label>
        ${wellOn() ? `<label class="field">Water (glasses)<input type="number" inputmode="numeric" data-set="waterGoal" value="${st.waterGoal}"></label>
        <label class="field">Sleep (hours)<input type="number" inputmode="decimal" data-set="sleepGoal" value="${st.sleepGoal}"></label>` : ''}
        <label class="field">Goal weight (kg)<input type="number" inputmode="decimal" step="0.1" data-set="goalWeight" value="${st.goalWeight || ''}" placeholder="none"></label></div></div>
      <div class="card pad"><button class="switch-row" data-act="toggle-well" role="switch" aria-checked="${wellOn()}"><span class="body"><span class="t">Water, sleep &amp; food</span><span class="s">${wellOn() ? 'On: the Daily tab tracks water, sleep and meals.' : 'Off for now. Turn on to bring back the Daily tab. Nothing you logged is lost.'}</span></span><span class="switch${wellOn() ? ' on' : ''}"><i></i></span></button></div>
      <div class="card pad stack"><h3>Google Sheet backup</h3><p class="muted small">Paste your Apps Script web-app URL and every finished workout is added to your sheet. Steps are in README.md.</p>
        <label class="field">Web app URL<input type="url" data-set="sheetUrl" placeholder="https://script.google.com/macros/s/…/exec" value="${esc(st.sheetUrl)}"></label></div>
      <div class="card pad stack"><h3>Backup file</h3><p class="muted small">Your data lives in this browser. Export it to move to another phone or keep a copy.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn" data-act="export">Export backup</button><label class="btn" for="import">Import backup</label><input id="import" type="file" accept=".json,application/json" hidden></div></div>
      <p class="credit">Exercise data: hasaneyldrm/exercises-dataset (MIT). Animations © <a href="https://gymvisual.com/" target="_blank" rel="noopener">Gym visual</a>. Photos: yuhonas/free-exercise-db (public domain).</p>`;
  };

  /* =========================================================== modal + toast */
  function ask(title, msg, ok = 'OK', danger = false) {
    return new Promise(res => {
      const m = document.createElement('div'); m.className = 'modal';
      m.innerHTML = `<div role="dialog" aria-modal="true"><h2>${esc(title)}</h2><p class="muted">${esc(msg)}</p><div class="acts"><button class="btn" data-a="0">Cancel</button><button class="btn ${danger ? '' : 'primary'}" style="${danger ? 'background:var(--hot);color:#fff' : ''}" data-a="1">${esc(ok)}</button></div></div>`;
      m.addEventListener('click', ev => { const b = ev.target.closest('[data-a]'); if (b || ev.target === m) { m.remove(); res(b && b.dataset.a === '1'); } });
      translate(m); document.body.appendChild(m); m.querySelector('[data-a="1"]').focus();
    });
  }
  /* weigh-in sheet: resolves {d, kg}, {d, del:true} or null */
  function askWeight(d0) {
    return new Promise(res => {
      const cur = S.body.find(x => x.d === d0), lb = lastBody();
      let kg = cur ? cur.kg : lb ? lb.kg : 70;
      const m = document.createElement('div'); m.className = 'modal';
      m.innerHTML = `<div role="dialog" aria-modal="true" class="weigh"><div class="nb-hd">${I(IC.scale)}<h2>${cur ? 'Edit weight' : 'Log weight'}</h2></div>
        <div class="wstep"><button class="wbtn" data-s="-0.1" aria-label="Minus 0.1 kg">−</button><label class="wval"><input id="w-kg" inputmode="decimal" value="${fmtW(kg)}" aria-label="Weight in kg"><small>kg</small></label><button class="wbtn" data-s="0.1" aria-label="Plus 0.1 kg">+</button></div>
        ${lb && !cur ? `<p class="small muted" style="text-align:center">Last time: ${fmtW(lb.kg)} kg · ${fmtDay(lb.d, { day: 'numeric', month: 'short' })}</p>` : ''}
        <label class="field">Date<input id="w-d" type="date" value="${d0}" max="${today()}"></label>
        <div class="acts">${cur ? `<button class="btn danger" data-a="del">${I(IC.trash)}</button>` : ''}<button class="btn" data-a="0">Cancel</button><button class="btn primary" data-a="1">Save</button></div></div>`;
      const inp = m.querySelector('#w-kg'), close = v => { m.classList.add('out'); setTimeout(() => m.remove(), calm() ? 0 : 220); res(v); };
      m.addEventListener('click', ev => {
        const s = ev.target.closest('[data-s]');
        if (s) { kg = Math.max(20, Math.round(((parseFloat(inp.value.replace(',', '.')) || kg) + +s.dataset.s) * 10) / 10); inp.value = fmtW(kg); inp.classList.remove('fx'); void inp.offsetWidth; inp.classList.add('fx'); return; }
        const b = ev.target.closest('[data-a]');
        if (!b && ev.target !== m) return;
        const d = m.querySelector('#w-d').value || d0, v = parseFloat(inp.value.replace(',', '.'));
        if (b && b.dataset.a === 'del') return close({ d: d0, del: true });
        if (b && b.dataset.a === '1') { if (!(v > 20 && v < 400)) { inp.focus(); return; } return close({ d, kg: Math.round(v * 10) / 10 }); }
        close(null);
      });
      translate(m); document.body.appendChild(m); inp.focus(); inp.select();
    });
  }
  async function logWeight(d0) {
    d0 = d0 || today();
    const r = await askWeight(d0); if (!r) return;
    S.body = S.body.filter(x => x.d !== r.d && x.d !== d0); // an edit can move the entry to another date
    if (!r.del) S.body.push({ d: r.d, kg: r.kg });
    save(); if (!r.del) syncWeight(r.d, r.kg);
    const nb = checkBadges();
    renderTab(); if (layers.length) rerenderTop();
    toast(r.del ? 'Weight removed' : nb.length ? 'Badge unlocked: ' + nb[0].name : `${fmtW(r.kg)} kg saved`);
    if (nb.length) confetti();
  }
  function toast(msg) {
    const t = $('#toast'); t.textContent = tr(msg); t.hidden = false; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
    clearTimeout(toast.t); toast.t = setTimeout(() => { t.classList.remove('show'); toast.t = setTimeout(() => t.hidden = true, 300); }, 2000);
  }
  let actx;
  function beep() {
    try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); [0, .25, .5].forEach(t => { const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = 880; o.connect(g); g.connect(actx.destination); g.gain.setValueAtTime(.2, actx.currentTime + t); g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + t + .18); o.start(actx.currentTime + t); o.stop(actx.currentTime + t + .2); }); } catch (e) { }
    try { navigator.vibrate && navigator.vibrate([200, 100, 200]); } catch (e) { }
  }

  /* =========================================================== events */
  document.addEventListener('click', async ev => {
    const el = ev.target.closest('button,[data-muscle]'); if (!el || el.disabled) return;
    const d = el.dataset, top = topLayer();
    if (actx && actx.state === 'suspended') actx.resume();
    const dk = el.closest('.bodies') ? [] : Object.keys(d).filter(k => !['open', 'go', 'tab', 'layer', 'workout', 'routine'].includes(k));
    fxSel = dk.length ? dk.map(k => `[data-${k.replace(/[A-Z]/g, c => '-' + c.toLowerCase())}="${CSS.escape(d[k])}"]`).join('') : null;
    setTimeout(() => { fxSel = null; restFresh = false; });
    if (d.weight) return logWeight(d.weight);

    if (d.tab) { while (layers.length) layers.pop(); renderLayers(); return go(d.tab); }
    if (d.go) { while (layers.length) layers.pop(); renderLayers(); return go(d.go); }
    if (d.layer) return pushLayer({ type: d.layer });
    if (d.open) return pushLayer({ type: 'detail', id: d.open, view: 'anim', tab: 'how' });
    if (d.view && top) { top.view = d.view; if (d.view === 'photo') { await loadPhotos(byId[top.id].eq); } return rerenderTop(); }
    if (d.tabd && top) { top.tab = d.tabd; return rerenderTop(); }
    if (d.workout) return pushLayer({ type: 'workoutView', wid: d.workout });
    if (d.routine) { const r = S.routines.find(x => x.id === d.routine); return r && openRoutine(r, false); }
    if (d.tpl) { const t = TEMPLATES.find(x => x.name === d.tpl); const r = { id: uid(), name: t.name, ex: t.ex.map(id => ({ id, sets: S.settings.sets, reps: S.settings.reps })) }; return openRoutine(r, true); }
    if (d.wr) { wRange = +d.wr; return renderTab(); }
    if (d.lang) { S.settings.lang = d.lang; save(); renderNav(); renderTab(); layers.forEach(l => l.dirty = true); renderLayers(); return toast(d.lang === 'id' ? 'Bahasa diganti ke Indonesia' : 'Language set to English'); }
    if (d.day && !wellOn()) { const ws = workoutsOn(d.day); return ws.length ? pushLayer({ type: 'workoutView', wid: ws[ws.length - 1].id }) : toast('No workout on ' + fmtDay(d.day, { day: 'numeric', month: 'short' })); }
    if (d.day) { dailyKey = d.day; if (tab !== 'daily') { while (layers.length) layers.pop(); renderLayers(); return go('daily'); } return renderTab(); }
    if (d.cal) { const [y, m] = calMonth.split('-').map(Number), nd = new Date(y, m - 1 + +d.cal, 1); calMonth = dkey(nd).slice(0, 7); return renderTab(); }
    if (d.mode) { L.mode = d.mode; return renderTab(true); }
    if ('eq' in d) { L.eq = d.eq; L.limit = 40; return top && top.type === 'picker' ? rerenderTop() : renderTab(); }
    if ('m' in d) { L.m = d.m; L.limit = 40; return top && top.type === 'picker' ? rerenderTop() : renderTab(); }
    if (d.muscle) { L.bodySel = L.bodySel === d.muscle ? '' : d.muscle; return renderTab(); }
    if (d.eqgo) { L.eq = d.eqgo; L.m = L.bodySel === 'full' ? '' : L.bodySel; L.q = ''; L.mode = 'browse'; return renderTab(); }
    if (d.pick && top) { const i = top.sel.indexOf(d.pick); if (i >= 0) top.sel.splice(i, 1); else top.sel.push(d.pick); return rerenderTop(); }
    if (d.daily) {
      const k = dailyKey, dy = day(k);
      if (d.daily === 'rest') setDay(k, { rest: !dy.rest });
      else if (d.daily === 'water') setDay(k, { water: Math.max(0, dy.water + +d.d) });
      else if (d.daily === 'sleep') setDay(k, { sleep: Math.max(0, Math.min(14, dy.sleep + +d.d)) });
      const nb = checkBadges(); if (nb.length) toast('Badge unlocked: ' + nb[0].name);
      return renderTab();
    }
    if (d.eat) { const k = dailyKey, m = Object.assign({}, day(k).meals); m[d.eat] = !m[d.eat]; setDay(k, { meals: m }); const nb = checkBadges(); if (nb.length) toast('Badge unlocked: ' + nb[0].name); return renderTab(); }
    if (d.chk && S.active) {
      const [ei, si] = d.chk.split(':').map(Number), s = S.active.ex[ei].sets[si];
      if (!s.done && s.w === '') { const p = prevSets(S.active.ex[ei].id)[si]; if (p) s.w = p.w; }
      s.done = !s.done; buzz(s.done ? 18 : 8);
      if (s.done && S.settings.rest > 0) { S.active.restTotal = S.settings.rest; S.active.restEnd = Date.now() + S.settings.rest * 1000; restFresh = true; }
      save(); return rerenderTop();
    }
    if (d.addset && S.active) { const sets = S.active.ex[+d.addset].sets, l = sets[sets.length - 1]; sets.push({ w: l ? l.w : '', r: l ? l.r : S.settings.reps, done: false }); save(); return rerenderTop(); }
    if (d.rmset && S.active) { S.active.ex[+d.rmset].sets.pop(); save(); return rerenderTop(); }
    if (d.rmex && S.active) { if (await ask('Remove exercise?', nameOf(S.active.ex[+d.rmex].id) + ' and its sets will be removed from this workout.', 'Remove', true)) { S.active.ex.splice(+d.rmex, 1); save(); rerenderTop(); } return; }
    if (d.rest && S.active) { if (d.rest === 'skip') S.active.restEnd = 0; else { S.active.restEnd += +d.rest * 1000; S.active.restTotal = Math.max(S.active.restTotal, (S.active.restEnd - Date.now()) / 1000); } save(); return rerenderTop(); }
    if (d.rmove && top) { const [i, dir] = d.rmove.split(':').map(Number), a = top.draft.ex; [a[i], a[i + dir]] = [a[i + dir], a[i]]; return rerenderTop(); }
    if (d.rdel && top) { top.draft.ex.splice(+d.rdel, 1); return rerenderTop(); }

    switch (d.act) {
      case 'close': return popLayer();
      case 'resume': return openWorkout();
      case 'start-empty': return S.active ? openWorkout() : startWorkout();
      case 'start-menu': return S.active ? openWorkout() : (S.routines.length ? pushLayer({ type: 'routines' }) : startWorkout());
      case 'muscles': L.mode = 'body'; return go('exercises');
      case 'mine': L.mode = 'mine'; return go('exercises');
      case 'log-weight': return logWeight(tab === 'daily' && !layers.length ? dailyKey : today());
      case 'toggle-well': {
        S.settings.wellness = !wellOn(); save(); renderNav();
        if (!navTabs().includes(tab)) tab = wellOn() ? 'daily' : 'weight';
        rerenderTop(); renderTab(); return toast(wellOn() ? 'Water, sleep & food turned on' : 'Water, sleep & food hidden');
      }
      case 'more': L.limit += 40; return top && top.type === 'picker' ? rerenderTop() : renderResults($('#view'));
      case 'clear-filters': L.q = ''; L.eq = ''; L.m = ''; return top && top.type === 'picker' ? rerenderTop() : renderTab();
      case 'add-ex': L.q = ''; return pushLayer({ type: 'picker', sel: [], target: 'workout' });
      case 'routine-add': L.q = ''; return pushLayer({ type: 'picker', sel: [], target: 'routine' });
      case 'pick-done': {
        const p = layers.pop(); const under = topLayer();
        if (p.target === 'workout' && S.active) { p.sel.forEach(id => S.active.ex.push({ id, sets: newSetsFor(id) })); save(); }
        if (p.target === 'routine' && under) p.sel.forEach(id => under.draft.ex.push({ id, sets: S.settings.sets, reps: S.settings.reps }));
        if (under) under.dirty = true; renderLayers(); return toast(`Added ${p.sel.length} exercise${p.sel.length === 1 ? '' : 's'}`);
      }
      case 'add-to-workout': { const id = top.id; S.active.ex.push({ id, sets: newSetsFor(id) }); save(); openWorkout(); return toast('Added to workout'); }
      case 'start-with': return startWorkout({ ex: [{ id: top.id }] });
      case 'finish': return finishWorkout();
      case 'discard': if (await ask('Discard workout?', 'Everything you logged in this workout will be lost.', 'Discard', true)) { S.active = null; save(); popLayer(); toast('Workout discarded'); } return;
      case 'new-routine': return openRoutine({ id: uid(), name: '', ex: [] }, true);
      case 'routine-save': {
        const r = top.draft; if (!r.name.trim()) r.name = 'My routine';
        const i = S.routines.findIndex(x => x.id === r.id); if (i >= 0) S.routines[i] = r; else S.routines.push(r);
        save(); popLayer(); return toast('Routine saved');
      }
      case 'routine-start': { const r = top.draft; return startWorkout({ name: r.name, routineId: r.id, ex: r.ex }); }
      case 'del-routine': if (await ask('Delete routine?', `“${top.draft.name}” will be deleted. Past workouts stay.`, 'Delete', true)) { S.routines = S.routines.filter(x => x.id !== top.draft.id); save(); popLayer(); toast('Routine deleted'); } return;
      case 'save-as-routine': { const w = S.workouts.find(x => x.id === top.wid); const r = { id: uid(), name: w.name, ex: w.ex.map(e => ({ id: e.id, sets: e.sets.length, reps: e.sets[0] ? e.sets[0].r : S.settings.reps })) }; S.routines.push(r); w.routineId = r.id; save(); top.dirty = true; renderLayers(); return toast('Saved as routine'); }
      case 'repeat': { const w = S.workouts.find(x => x.id === top.wid); return startWorkout({ name: w.name, routineId: w.routineId, ex: w.ex.map(e => ({ id: e.id, sets: e.sets.length })) }); }
      case 'del-workout': { const w = S.workouts.find(x => x.id === top.wid); if (await ask('Delete workout?', 'This removes it from your history and records.', 'Delete', true)) { S.workouts = S.workouts.filter(x => x !== w); save(); sync('delete', w); popLayer(); toast('Workout deleted'); } return; }
      case 'export': { const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'gym-tracker-backup-' + today() + '.json'; document.body.appendChild(a); a.click(); a.remove(); return; }
    }
  });
  document.addEventListener('change', ev => {
    const t = ev.target;
    if (t.dataset.set) { const k = t.dataset.set; S.settings[k] = ['name', 'sheetUrl'].includes(k) ? t.value.trim() : (parseFloat(t.value) || DEF.settings[k]); save(); toast('Saved'); return; }
    if (t.dataset.meal) { S.settings.meals[t.dataset.meal] = t.value.trim(); save(); toast('Meal plan saved'); return; }
    if (t.id === 'import' && t.files[0]) {
      t.files[0].text().then(txt => {
        try { const d = JSON.parse(txt); if (!Array.isArray(d.workouts)) throw 0; S = Object.assign(clone(DEF), d); S.settings = Object.assign(clone(DEF.settings), d.settings); save(); while (layers.length) layers.pop(); renderLayers(); renderTab(); toast('Backup imported'); }
        catch (e) { toast('That file is not a Gym Tracker backup'); }
      });
    }
  });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && layers.length) popLayer(); });

  /* swipe like iOS: drag any screen to the right to go back, or pull a bottom sheet down (when scrolled to the top) to close it */
  let sw = null;
  document.addEventListener('touchstart', ev => {
    sw = null;
    const el = $('#layers').lastElementChild, t = ev.touches[0];
    if (!el || ev.touches.length !== 1 || !el.contains(ev.target) || ev.target.closest('input,textarea,select,.chips') || document.querySelector('.modal')) return;
    sw = { el, x: t.clientX, y: t.clientY, t: Date.now(), ax: '', v: 0, sheet: el.classList.contains('sheet'), top: el.scrollTop <= 0 };
  }, { passive: true });
  document.addEventListener('touchmove', ev => {
    if (!sw) return;
    const t = ev.touches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
    if (!sw.ax) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      sw.ax = dx > 0 && Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : sw.sheet && sw.top && dy > 0 && dy > Math.abs(dx) ? 'y' : '';
      if (!sw.ax) { sw = null; return; }
      sw.el.classList.add('drag');
    }
    ev.preventDefault();
    sw.v = Math.max(0, sw.ax === 'x' ? dx : dy);
    sw.el.style.transform = `translate${sw.ax.toUpperCase()}(${sw.v}px)`;
    sw.el.style.setProperty('--sw', Math.min(1, sw.v / (sw.ax === 'x' ? innerWidth : innerHeight)));
  }, { passive: false });
  const swipeEnd = () => {
    const s = sw; sw = null; if (!s || !s.ax) return;
    const size = s.ax === 'x' ? innerWidth : innerHeight, fast = s.v > 40 && s.v / Math.max(1, Date.now() - s.t) > .45;
    s.el.classList.remove('drag');
    if (s.v > size * .33 || fast) {
      s.el.style.transform = `translate${s.ax.toUpperCase()}(100%)`; buzz(8);
      setTimeout(() => { if ($('#layers').lastElementChild === s.el) popLayer(true); }, 230);
    } else { s.el.style.transform = ''; s.el.style.removeProperty('--sw'); }
  };
  document.addEventListener('touchend', swipeEnd);
  document.addEventListener('touchcancel', swipeEnd);

  /* pull down on a tab (scrolled to the top, no screen open) to reload the app; a Home Screen app has no browser reload */
  let pt = null;
  const ptr = document.createElement('div'); ptr.id = 'ptr'; ptr.setAttribute('aria-hidden', 'true');
  ptr.innerHTML = I('<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5"/>'); document.body.appendChild(ptr);
  document.addEventListener('touchstart', ev => {
    pt = null;
    if (layers.length || ev.touches.length !== 1 || window.scrollY > 0 || document.querySelector('.modal') || ev.target.closest('input,textarea,.chips,.bodies')) return;
    pt = { x: ev.touches[0].clientX, y: ev.touches[0].clientY, d: 0, on: false };
  }, { passive: true });
  document.addEventListener('touchmove', ev => {
    if (!pt) return;
    const t = ev.touches[0], dx = t.clientX - pt.x, dy = t.clientY - pt.y;
    if (!pt.on) {
      if (dy < -8 || Math.abs(dx) > 12) { pt = null; return; }
      if (dy < 10 || Math.abs(dx) > dy) return;
      pt.on = true; ptr.classList.add('show');
    }
    ev.preventDefault();
    pt.d = Math.min(130, Math.max(0, dy * .5));
    ptr.style.transform = `translate(-50%, ${pt.d}px) rotate(${pt.d * 3}deg)`;
    if (ptr.classList.toggle('ready', pt.d >= 70) && !pt.buzzed) { pt.buzzed = 1; buzz(8); }
  }, { passive: false });
  const pullEnd = () => {
    const p = pt; pt = null; if (!p || !p.on) return;
    if (p.d >= 70) { ptr.classList.add('spin'); ptr.style.transform = 'translate(-50%, 70px)'; setTimeout(() => location.reload(), 380); }
    else { ptr.classList.remove('show', 'ready'); ptr.style.transform = ''; }
  };
  document.addEventListener('touchend', pullEnd);
  document.addEventListener('touchcancel', pullEnd);

  /* ticking clocks + rest timer */
  setInterval(() => {
    if (!S.active) return;
    document.querySelectorAll('[data-clock]').forEach(c => c.textContent = fmtDur(Date.now() - S.active.start));
    if (S.active.restEnd) {
      const left = S.active.restEnd - Date.now();
      if (left <= 0) { S.active.restEnd = 0; save(); beep(); toast('Rest over. Next set!'); if (topLayer() && topLayer().type === 'workout') rerenderTop(); return; }
      const tm = $('#rest-tm'), f = $('#rest-fill'); if (tm) tm.textContent = fmtDur(left); if (f) f.style.width = (left / (S.active.restTotal * 1000) * 100) + '%';
    }
  }, 1000);

  /* boot */
  document.addEventListener('touchstart', () => { }, { passive: true }); // lets iOS show :active press states
  function renderNav() {
    const NB = { home: [IC.run, 'Home'], exercises: [IC.dumbbell, 'Exercises'], daily: [IC.food, 'Daily'], weight: [IC.scale, 'Weight'], progress: [IC.chart, 'Progress'] };
    document.getElementById('nav').innerHTML = `<div class="bar4"><span class="nav-ind" aria-hidden="true"></span>${navTabs().map(t => `<button data-tab="${t}" aria-label="${NB[t][1]}">${I(NB[t][0])}<span>${NB[t][1]}</span></button>`).join('')}</div>`;
    translate(document.getElementById('nav')); document.documentElement.lang = isID() ? 'id' : 'en';
  }
  renderNav();
  let start = 'home'; try { start = sessionStorage.getItem('gymtab') || 'home'; } catch (e) { }
  go(navTabs().includes(start) ? start : 'home');
  if (S.active) renderResume();
})();
