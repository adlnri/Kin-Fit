(() => {
  'use strict';

  const {
    $, $$, esc, SPORTS, OBJECTIFS, MATERIEL, PDJ, EVITER, DAYS, DAYS_FULL, E, FOOD, GOAL_FOOD, DRINK,
    lvLabel, lvIdx, sportName, sportData, sportList, variant, loadText, setsReps, restrictionNote,
    buildPlan, sessionMeta, activity, dailyKcal, breakfast, DUREES, durOf,
  } = window.NA;
  const M = window.NA_MEALS;
  const CLOUD = window.NA_CLOUD;
  const ALLERG = M.ALLERGENES;

  /* ---------- Icons: one 24px grid, 2px round stroke ---------- */

  const P = {
    dumbbell: 'M6 7v10M18 7v10M3 10v4M21 10v4M6 12h12',
    heart: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z',
    bowl: 'M3 11h18a9 9 0 0 1-18 0zM9 11c0-2.5 1.5-4.5 3.5-5.5M15 7.5c.8.9 1.3 2.1 1.3 3.5',
    drop: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
    flame: 'M12 21c-3.9 0-7-2.7-7-6.5 0-3.5 3-5.5 4-9 2 1.5 3 3.5 3 5.5 1-1 1.5-2 1.5-3.5 2.5 2 5.5 4.5 5.5 7 0 3.8-3.1 6.5-7 6.5z',
    trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8M9 17h6',
    send: 'M21 3L10 14M21 3l-7 18-4-7-7-4z',
    share: 'M4 13v7h16v-7M12 3v12M7 8l5-5 5 5',
    link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L12 6.3M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
    check: 'M5 12.5l4.5 4.5L19 7',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    x: 'M6 6l12 12M18 6L6 18',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
    ball: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7.5l3.8 2.8-1.4 4.4H9.6l-1.4-4.4z',
    glove: 'M7 10V7a3 3 0 0 1 3-3h4a4 4 0 0 1 4 4v5a5 5 0 0 1-5 5h-2a4 4 0 0 1-4-4v-1H6a2 2 0 0 1 0-4zM8 21h8',
    racket: 'M15 3a6 6 0 1 0 0 12a6 6 0 1 0 0-12zM10.8 13.2L4 20M6 16l2 2',
    wave: 'M3 9c2 0 2-2 4.5-2S10 9 12 9s2.5-2 4.5-2S19 9 21 9M3 15c2 0 2-2 4.5-2s2.5 2 4.5 2 2.5-2 4.5-2 2.5 2 4.5 2',
    belt: 'M3 10h18v4H3zM10 10h4v4h-4zM10.5 14l-2.5 7M13.5 14l2.5 7',
    bolt: 'M13 3L5 13h6l-1 8 8-10h-6z',
    leaf: 'M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l7-7',
    stretch: 'M15 3a2 2 0 1 0 0 4a2 2 0 1 0 0-4zM14 9l-2.5 5 4.5 5.5M11.5 14L6 17l-1 3.5M13.5 10.5l5.5 2M13.5 10.5L8 9.5M3 21h18',
    calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
    chat: 'M4 5h16v11H9l-5 4z',
    album: 'M5 3h11a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3zM9 8h6M9 12h6',
    home: 'M4 11l8-7 8 7M6 9.5V20h12V9.5',
    plan: 'M7 4h10v17H7zM10 8h4M10 12h4M10 16h2',
    user: 'M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM4 21a8 8 0 0 1 16 0',
    inbox: 'M4 13l2-8h12l2 8v6H4zM4 13h5l1 2h4l1-2h5',
  };
  const icon = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${P[n] || P.star}"/></svg>`;
  const SPORT_ICON = { Football: 'ball', Handball: 'ball', Boxe: 'glove', Paddle: 'racket', Natation: 'wave', JJB: 'belt', Judo: 'belt' };

  /* ---------- Game content (authored, illustrative) ---------- */

  const SPORT_DEFI = {
    Football: { t: 'Sprints navette', unit: 'sprints', base: 30, steps: [1, 5], impact: true, why: 'Répéter les sprints, c’est gagner les duels en fin de match.' },
    Boxe: { t: 'Rounds de corde à sauter', unit: 'rounds', base: 10, steps: [1], impact: true, why: 'La corde construit le jeu de jambes et le souffle des derniers rounds.' },
    Paddle: { t: 'Allers-retours en pas chassés', unit: 'allers-retours', base: 60, steps: [5, 10], impact: true, why: 'Les déplacements latéraux font les points longs.' },
    Natation: { t: 'Longueurs de bassin', unit: 'longueurs', base: 40, steps: [2, 10], impact: false, why: 'Le volume régulier installe l’allure.' },
    JJB: { t: 'Relevés techniques', unit: 'relevés', base: 50, steps: [5, 10], impact: false, why: 'Se relever proprement, c’est reprendre le contrôle du combat.' },
    Judo: { t: 'Uchi-komi', unit: 'uchi-komi', base: 150, steps: [10, 25], impact: false, why: 'La répétition rend l’entrée de projection automatique.' },
    Handball: { t: 'Changements de direction', unit: 'appuis', base: 60, steps: [5, 10], impact: true, why: 'Des appuis vifs déséquilibrent ton défenseur.' },
    Autre: { t: 'Minutes de gainage', unit: 'min', base: 8, steps: [1], impact: false, why: 'Un tronc solide sert toutes les disciplines.' },
  };

  const SOCIAL = [
    { cid: 'squats', title: '100 squats dans la semaine', unit: 'squats', target: 100, cat: 'sport', icon: 'dumbbell', steps: [5, 10] },
    { cid: 'pompes', title: '50 pompes dans la semaine', unit: 'pompes', target: 50, cat: 'sport', icon: 'bolt', steps: [5, 10] },
    { cid: 'gainage', title: '5 minutes de gainage cumulées', unit: 'min', target: 5, cat: 'sport', icon: 'star', steps: [1] },
    { cid: 'corde', title: '20 minutes de corde à sauter', unit: 'min', target: 20, cat: 'cardio', icon: 'heart', steps: [1, 5] },
    { cid: 'marche', title: '20 km de marche dans la semaine', unit: 'km', target: 20, cat: 'cardio', icon: 'calendar', steps: [1, 5] },
    { cid: 'eau', title: '2 litres d’eau, 5 jours', unit: 'jours', target: 5, cat: 'eau', icon: 'drop', steps: [1] },
    { cid: 'pdj', title: '5 petits-déjeuners équilibrés', unit: 'matins', target: 5, cat: 'nutrition', icon: 'bowl', steps: [1] },
    { cid: 'soda', title: 'Zéro soda pendant 7 jours', unit: 'jours', target: 7, cat: 'nutrition', icon: 'leaf', steps: [1] },
    { cid: 'legumes', title: 'Des légumes à chaque repas, 3 jours', unit: 'jours', target: 3, cat: 'nutrition', icon: 'leaf', steps: [1] },
  ];

  const RANGS = [
    { id: 'bronze', n: 'Bronze', min: 0 },
    { id: 'argent', n: 'Argent', min: 200 },
    { id: 'or', n: 'Or', min: 500 },
    { id: 'platine', n: 'Platine', min: 1000 },
  ];
  const rangOf = (pts) => { let r = RANGS[0]; RANGS.forEach((x) => { if (pts >= x.min) r = x; }); return r; };
  const nextRang = (pts) => RANGS.find((x) => x.min > pts) || null;

  const STICKERS = [
    { id: 's1', cat: 'sport', icon: 'dumbbell', n: 'Premier pas', hint: 'Termine ta première séance.', cond: (s) => s.seances >= 1 },
    { id: 's2', cat: 'sport', icon: 'dumbbell', n: 'Tiercé', hint: 'Termine 3 séances.', cond: (s) => s.seances >= 3 },
    { id: 's3', rare: true, cat: 'sport', icon: 'trophy', n: 'Dix sur dix', hint: 'Termine 10 séances.', cond: (s) => s.seances >= 10 },
    { id: 's4', cat: 'cardio', icon: 'heart', n: 'Cœur lancé', hint: 'Boucle ton premier cardio.', cond: (s) => s.cardio >= 1 },
    { id: 's5', cat: 'cardio', icon: 'heart', n: 'Cœur solide', hint: 'Boucle 5 cardios.', cond: (s) => s.cardio >= 5 },
    { id: 's6', cat: 'sport', icon: 'calendar', n: 'Semaine pleine', hint: 'Fais toutes les séances d’une semaine.', cond: (s) => s.weeks >= 1 },
    { id: 's7', cat: 'sport', icon: 'bolt', n: 'Mon sport', hint: 'Réussis le défi de ton sport.', cond: (s) => s.sport >= 1 },
    { id: 's8', cat: 'sport', icon: 'leaf', n: 'Souple', hint: 'Fais 10 minutes de mobilité un jour de repos.', cond: (s) => s.mob >= 1 },
    { id: 'n1', cat: 'nutrition', icon: 'bowl', n: 'Bien parti', hint: 'Prends ton premier petit-déjeuner du plan.', cond: (s) => s.pdj >= 1 },
    { id: 'n2', cat: 'nutrition', icon: 'bowl', n: 'Cinq matins', hint: 'Prends 5 petits-déjeuners du plan.', cond: (s) => s.pdj >= 5 },
    { id: 'n3', cat: 'eau', icon: 'drop', n: 'Hydraté', hint: 'Bois tes 8 verres en une journée.', cond: (s) => s.eau >= 1 },
    { id: 'n4', rare: true, cat: 'eau', icon: 'drop', n: 'Source vive', hint: 'Atteins ton objectif d’eau 7 jours.', cond: (s) => s.eau >= 7 },
    { id: 'n5', cat: 'nutrition', icon: 'star', n: 'Semaine gourmande', hint: 'Réussis le défi « Cinq matins bien partis ».', cond: (s) => s.wpdj >= 1 },
    { id: 'n6', cat: 'eau', icon: 'star', n: 'Semaine fraîche', hint: 'Réussis le défi « Quatre jours hydratés ».', cond: (s) => s.weau >= 1 },
    { id: 'r1', cat: 'serie', icon: 'flame', n: 'Série de 3', hint: '3 séances prévues d’affilée sans en manquer.', cond: (s) => s.streakMax >= 3 },
    { id: 'r2', cat: 'serie', icon: 'flame', n: 'Série de 7', hint: '7 séances prévues d’affilée.', cond: (s) => s.streakMax >= 7 },
    { id: 'r3', rare: true, cat: 'serie', icon: 'flame', n: 'Série de 14', hint: '14 séances prévues d’affilée.', cond: (s) => s.streakMax >= 14 },
    { id: 'a1', cat: 'amis', icon: 'send', n: 'Provocateur', hint: 'Lance ton premier défi à quelqu’un.', cond: (s) => s.sent >= 1 },
    { id: 'a2', cat: 'amis', icon: 'check', n: 'Défi relevé', hint: 'Réussis un défi reçu ou lancé.', cond: (s) => s.social >= 1 },
    { id: 'a3', rare: true, cat: 'amis', icon: 'trophy', n: 'Trois relevés', hint: 'Réussis 3 défis entre amis.', cond: (s) => s.social >= 3 },
    { id: 'a4', cat: 'amis', icon: 'share', n: 'Ambassadeur', hint: 'Lance 5 défis.', cond: (s) => s.sent >= 5 },
    { id: 'b1', cat: 'rang', rang: 'bronze', icon: 'trophy', n: 'Bronze', hint: 'Crée tes trophées.', cond: () => true },
    { id: 'b2', cat: 'rang', rang: 'argent', icon: 'trophy', n: 'Argent', hint: '200 points.', cond: (s) => s.points >= 200 },
    { id: 'b3', cat: 'rang', rang: 'or', icon: 'trophy', n: 'Or', hint: '500 points.', cond: (s) => s.points >= 500 },
    { id: 'b4', cat: 'rang', rang: 'platine', icon: 'trophy', n: 'Platine', hint: '1 000 points.', cond: (s) => s.points >= 1000 },
  ];
  const ALBUM = [
    ['Sport', ['sport', 'cardio']],
    ['Nutrition', ['nutrition', 'eau']],
    ['Séries', ['serie']],
    ['Entre amis', ['amis']],
  ];

  /* ---------- State ---------- */

  const KEY = 'nutriapp.v2';
  let state = { current: null, sessions: [], pendingShare: null };
  try {
    const raw = localStorage.getItem(KEY) || localStorage.getItem('relance.v1');
    if (raw) state = JSON.parse(raw);
  } catch (e) { /* storage unavailable: run in memory */ }
  if (!state || !Array.isArray(state.sessions)) state = { current: null, sessions: [], pendingShare: null };

  const iso = (d) => { const x = new Date(d); x.setMinutes(x.getMinutes() - x.getTimezoneOffset()); return x.toISOString().slice(0, 10); };
  const TODAY = new Date(); TODAY.setHours(12, 0, 0, 0);
  const todayIdx = (TODAY.getDay() + 6) % 7;
  const dayDate = (i) => { const d = new Date(TODAY); d.setDate(d.getDate() + (i - todayIdx)); return d; };
  const weekId = iso(dayDate(0));

  const migrate = (s) => {
    s.log = s.log || {}; s.done = s.done || {}; s.points = s.points || 0; s.stickers = s.stickers || [];
    s.inbox = s.inbox || []; s.sent = s.sent || []; s.chat = s.chat || []; s.seed = s.seed || 0;
    s.sportCount = s.sportCount || {}; s.dupes = s.dupes || {}; s.shop = s.shop || {}; s.streakMax = s.streakMax || 0; s.created = s.created || iso(TODAY);
    if (s.profile) { s.profile.regime = s.profile.regime || 'omni'; s.profile.pratiques = s.profile.pratiques || []; if (s.profile.cheat == null) s.profile.cheat = 1; s.profile.budget = s.profile.budget || 'moyen'; s.profile.duree = durOf(s.profile); }
    delete s.checkins;
    return s;
  };
  state.sessions.forEach(migrate);
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* in-memory only */ } cloudPush(); };
  const cur = () => state.sessions.find((s) => s.id === state.current) || null;
  const lg = (sess, d) => { sess.log[d] = sess.log[d] || { ex: [], pdj: false, eau: 0, mob: false, status: '' }; return sess.log[d]; };

  const ui = { view: 'today', day: todayIdx, ob: null, defisTab: 'jour', planTab: 'programme', confirmDelete: false, printing: false, aiBusy: null, circuit: 'corps', circuitDur: null };
  const blank = () => ({ prenom: '', sexe: '', age: '', taille: '', poids: '', objectif: '', niveau: 50, seances: 3, duree: 60, materiel: [], restrictions: '', sports: [], autre: '', petitdej: '', eviter: [], regime: 'omni', pratiques: [], cheat: 1, budget: 'moyen' });

  /* ---------- Challenges ---------- */

  const doneKey = (it, d) => `j:${it.kind === 'muscu' ? 'seance' : 'cardio'}:${d}`;

  function sportDefi(p) {
    let s = SPORT_DEFI[p.sports[0]] || SPORT_DEFI.Autre;
    if (s.impact && /genou/i.test(p.restrictions || '')) s = SPORT_DEFI.Autre;
    return { ...s, target: Math.max(1, Math.round(s.base * [0.6, 1, 1.4][lvIdx(p.niveau)])) };
  }

  function dailyList(sess, dayI) {
    const p = sess.profile; const d = iso(dayDate(dayI)); const L0 = lg(sess, d); const it = buildPlan(sess).byDay(dayI);
    const out = [];
    if (it && it.kind === 'muscu') out.push({ key: doneKey(it, d), cat: 'sport', icon: 'dumbbell', pts: 30, title: 'Termine ta séance', desc: it.short, progress: Math.min(L0.ex.length, it.ex.length), target: it.ex.length, unit: 'exercices', mode: 'auto', hint: 'Coche chaque exercice dans Aujourd’hui.' });
    else if (it) out.push({ key: doneKey(it, d), cat: 'cardio', icon: 'heart', pts: 30, title: 'Boucle ton cardio', desc: it.type, progress: L0.status === 'faite' ? 1 : 0, target: 1, unit: '', mode: 'tap', act: 'cardio', label: 'Cardio terminé' });
    else out.push({ key: `j:mob:${d}`, cat: 'sport', icon: 'stretch', pts: 15, title: '10 minutes de mobilité', desc: 'Jour de repos actif', progress: L0.mob ? 1 : 0, target: 1, unit: '', mode: 'tap', act: 'mob', label: 'Mobilité faite' });
    out.push({ key: `j:pdj:${d}`, cat: 'nutrition', icon: 'bowl', pts: 10, title: `Petit-déjeuner ${PDJ[p.petitdej]}`, desc: 'Celui de ton plan, ou son alternative rapide', progress: L0.pdj ? 1 : 0, target: 1, unit: '', mode: 'tap', act: 'pdj', label: 'Je l’ai pris' });
    out.push({ key: `j:eau:${d}`, cat: 'eau', icon: 'drop', pts: 15, title: 'Bois 2 litres d’eau', desc: '8 verres de 25 cl dans la journée', progress: L0.eau, target: 8, unit: 'verres', mode: 'water' });
    return out;
  }

  function weekList(sess) {
    const p = sess.profile; const plan = buildPlan(sess);
    const days = [0, 1, 2, 3, 4, 5, 6].map((i) => iso(dayDate(i)));
    const n = plan.items.length;
    const seances = plan.items.filter((it) => sess.done[doneKey(it, days[it.day])]).length;
    const pdj = days.filter((d) => sess.done[`j:pdj:${d}`]).length;
    const eau = days.filter((d) => sess.done[`j:eau:${d}`]).length;
    const sd = sportDefi(p);
    return {
      semaine: [
        { key: `s:seances:${weekId}`, cat: 'sport', icon: 'calendar', pts: 80, title: `${n} séances sur ${n}`, desc: 'Toutes les séances prévues cette semaine', progress: seances, target: n, unit: 'séances', mode: 'auto', hint: 'Se remplit quand tu termines tes séances.' },
        { key: `s:pdj:${weekId}`, cat: 'nutrition', icon: 'bowl', pts: 40, title: 'Cinq matins bien partis', desc: 'Ton petit-déjeuner du plan 5 jours cette semaine', progress: pdj, target: 5, unit: 'matins', mode: 'auto', hint: 'Valide ton petit-déjeuner chaque matin.' },
        { key: `s:eau:${weekId}`, cat: 'eau', icon: 'drop', pts: 40, title: 'Quatre jours hydratés', desc: 'Objectif 2 litres atteint 4 jours', progress: eau, target: 4, unit: 'jours', mode: 'auto', hint: 'Remplis tes 8 verres dans Aujourd’hui.' },
      ],
      sport: [
        { key: `s:sport:${weekId}`, cat: 'sport', icon: SPORT_ICON[p.sports[0]] || 'bolt', pts: 60, title: `${sd.target} ${sd.unit}`, desc: `${sd.t} sur la semaine. ${sd.why}`, progress: sess.sportCount[weekId] || 0, target: sd.target, unit: sd.unit, mode: 'step', act: 'sport', steps: sd.steps },
      ],
    };
  }

  const socialCard = (x) => ({ key: `x:${x.id}`, cat: x.cat, icon: x.icon, pts: 50, title: x.title, desc: x.self ? 'Défi que tu as lancé' : `Défi de ${x.from}`, progress: x.progress || 0, target: x.target, unit: x.unit, mode: 'social', id: x.id, steps: x.steps, msg: x.msg, from: x.from, self: x.self });

  function streakOf(sess) {
    const plan = buildPlan(sess); let n = 0; const d = new Date(TODAY);
    for (let i = 0; i < 180; i++) {
      const key = iso(d); if (key < sess.created) break;
      const it = plan.byDay((d.getDay() + 6) % 7);
      if (it) { if (sess.done[doneKey(it, key)]) n++; else if (i > 0) break; }
      d.setDate(d.getDate() - 1);
    }
    return n;
  }

  function stats(sess) {
    const keys = Object.keys(sess.done); const c = (pre) => keys.filter((k) => k.startsWith(pre)).length;
    return {
      seances: c('j:seance:') + c('j:cardio:'), cardio: c('j:cardio:'), mob: c('j:mob:'), pdj: c('j:pdj:'), eau: c('j:eau:'),
      weeks: c('s:seances:'), wpdj: c('s:pdj:'), weau: c('s:eau:'), sport: c('s:sport:'), social: c('x:'),
      sent: sess.sent.length, streakMax: sess.streakMax, points: sess.points,
    };
  }

  function settle(sess, quiet) {
    const gained = { pts: 0, defis: [], stickers: [], dupes: [] }; const won = [];
    const w = weekList(sess);
    const list = [...dailyList(sess, todayIdx), ...w.semaine, ...w.sport, ...sess.inbox.filter((x) => x.status === 'accepted').map(socialCard)];
    if (ui.day < todayIdx) list.push(...dailyList(sess, ui.day));
    list.forEach((c) => {
      if (c.progress >= c.target && !sess.done[c.key]) { sess.done[c.key] = iso(TODAY); sess.points += c.pts; gained.pts += c.pts; gained.defis.push(c.title); won.push(c); }
    });
    sess.streakMax = Math.max(sess.streakMax, streakOf(sess));
    const before = [...sess.stickers];
    const st = stats(sess);
    STICKERS.forEach((s) => { if (!sess.stickers.includes(s.id) && s.cond(st)) { sess.stickers.push(s.id); gained.stickers.push(s); } });
    if (!gained.stickers.length) {
      const c = won.find((x) => { const k = stakeFor(x.key, sess); return k && before.includes(k.id); });
      if (c) { const k = stakeFor(c.key, sess); sess.dupes[k.id] = (sess.dupes[k.id] || 0) + 1; gained.dupes.push(k); }
    }
    save();
    if (!quiet && (gained.pts || gained.stickers.length || gained.dupes.length)) celebrate(gained, !(gained.stickers.length || won.some((c) => /^(x|s):/.test(c.key))));
  }

  /* ---------- Sharing ---------- */

  const b64e = (o) => btoa(unescape(encodeURIComponent(JSON.stringify(o)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const b64d = (s) => JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g, '+').replace(/_/g, '/')))));

  function readShare() {
    const m = location.hash.match(/^#defi=([A-Za-z0-9_-]+)$/);
    if (!m) return;
    try {
      const o = b64d(m[1]); const c = SOCIAL.find((x) => x.cid === o.cid);
      if (c) state.pendingShare = { id: String(o.id || Date.now()).replace(/[^\w-]/g, '').slice(0, 40), cid: c.cid, from: String(o.from || 'Un ami').slice(0, 40), msg: String(o.msg || '').slice(0, 120) };
    } catch (e) { /* malformed link: ignore it */ }
    history.replaceState(null, '', location.pathname + location.search);
    save();
  }

  const shareLink = (item, sess) => `${location.href.split('#')[0]}#defi=${b64e({ v: 1, id: item.id, cid: item.cid, from: sess.profile.prenom, msg: item.msg || '' })}`;

  function addToInbox(sess, entry) {
    if (sess.inbox.some((x) => x.id === entry.id)) return false;
    sess.inbox.unshift(entry); return true;
  }

  /* ---------- Celebration ---------- */

  const ART = () => window.NA_ART || {};
  const pad = (n) => String(n).padStart(2, '0');
  function stickerArt(s, num, owned, big, dupes) {
    if (s.cat === 'rang') return patchArt(s.rang, s.n, owned);
    return `<figure class="stk stk--${s.cat}${owned ? ' is-owned' : ''}${owned && s.rare ? ' is-rare' : ''}${big ? ' stk--big' : ''}">
      ${owned ? `<span class="stk-num">${pad(num)}</span>` : ''}
      ${owned ? `<span class="stk-art">${ART()[s.id] || icon(s.icon)}</span>` : `<span class="stk-art stk-art--empty" aria-hidden="true"><b>${pad(num)}</b></span>`}
      <figcaption>${esc(s.n)}${owned ? '' : `<small>${esc(s.hint)}</small>`}</figcaption>
      ${dupes ? `<span class="stk-dupe" title="Exemplaires">×${dupes + 1}</span>` : ''}
    </figure>`;
  }
  const patchArt = (rang, name, owned) => `<figure class="patch patch--${rang}${owned ? ' is-owned' : ''}">${window.NA_BADGE ? window.NA_BADGE(rang, owned) : ''}<figcaption>${esc(name)}</figcaption></figure>`;

  const STAKE = [['j:seance:', ['s1', 's2', 's3']], ['j:cardio:', ['s4', 's5', 's1']], ['j:mob:', ['s8']], ['j:pdj:', ['n1', 'n2']], ['j:eau:', ['n3', 'n4']], ['s:seances:', ['s6']], ['s:pdj:', ['n5']], ['s:eau:', ['n6']], ['s:sport:', ['s7']], ['x:', ['a2', 'a3']]];
  function stakeFor(key, sess) {
    const row = STAKE.find(([p]) => key.startsWith(p)); if (!row) return null;
    const id = row[1].find((x) => !sess.stickers.includes(x)) || row[1][row[1].length - 1];
    return STICKERS.find((x) => x.id === id) || null;
  }

  function celebrate(g, light) {
    if (light) return stickToast(g);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const old = $('.cele'); if (old) old.remove();
    const tt = $('.toast'); if (tt) tt.remove();
    const s = g.stickers[0]; const d = !s && g.dupes[0];
    const shown = s || d;
    const el = document.createElement('div');
    el.className = 'cele'; el.setAttribute('role', 'status');
    const title = s ? `Nouvelle médaille : ${s.n}` : d ? `Doublon : ${d.n}` : (g.defis.length > 1 ? `${g.defis.length} défis réussis` : `Défi réussi : ${g.defis[0]}`);
    const nb = (x) => String(x).replace(/ ([:;!?])/g, ' $1');
    el.innerHTML = `<div class="cele-card">
      ${shown ? stickerArt(shown, STICKERS.indexOf(shown) + 1, true, true) : `<div class="cele-medal">${icon('trophy')}</div>`}
      <p class="cele-title">${esc(nb(title))}</p>
      ${d ? '<p class="cele-more">Garde-la pour l’offrir : tu peux la donner à un ami depuis tes trophées.</p>' : ''}
      ${g.pts ? `<p class="cele-pts">+${g.pts} points</p>` : ''}
      ${g.stickers.length > 1 ? `<p class="cele-more">et ${g.stickers.length - 1} autre${g.stickers.length > 2 ? 's' : ''} dans tes trophées</p>` : ''}
      <button type="button" class="btn btn--light" data-act="cele-close">Continuer</button>
    </div>`;
    document.body.appendChild(el);
    el.querySelector('button').focus({ preventScroll: true });
    if (!reduce) { const r = el.querySelector('.cele-card').getBoundingClientRect(); const cy = r.top + 110; sparks(innerWidth / 2, cy, 150, 1); setTimeout(() => { sparks(r.left + 20, cy, 60, 0.75); sparks(r.right - 20, cy, 60, 0.75); }, 220); }
    clearTimeout(celebrate.t);
    celebrate.t = setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 300); }, 4800);
  }

  function stickToast(g) {
    const old = $('.stick-toast'); if (old) old.remove();
    const d = g.dupes[0];
    const el = document.createElement('div'); el.className = 'stick-toast'; el.setAttribute('role', 'status');
    el.innerHTML = `${d ? stickerArt(d, STICKERS.indexOf(d) + 1, true) : `<span class="stick-medal">${icon('check')}</span>`}<p><b>${esc(d ? `Doublon : ${d.n}` : g.defis[0] || 'Défi réussi')}</b>${g.pts ? `<span>+${g.pts} points</span>` : ''}${d ? '<span>À offrir depuis tes trophées</span>' : ''}</p>`;
    document.body.appendChild(el);
    const r = el.getBoundingClientRect(); sparks(r.left + 44, r.top + 36, 60, 0.6);
    setTimeout(() => { el.classList.add('is-out'); setTimeout(() => el.remove(), 300); }, 2800);
  }

  /* Gold sparks: white-hot heads cooling to gold then ember, with trails, flicker, gravity and branching */
  function sparks(x, y, n, force) {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cv = document.createElement('canvas'); cv.className = 'sparks'; cv.setAttribute('aria-hidden', 'true');
    const dpr = Math.min(2, window.devicePixelRatio || 1); const W = innerWidth; const H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; document.body.appendChild(cv);
    const ctx = cv.getContext('2d'); ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const P = [];
    const add = (px, py, vx, vy, size, gen) => P.push({ x: px, y: py, vx, vy, size, gen, life: 1, decay: (gen ? 0.03 : 0.011) + Math.random() * 0.018, trail: [], ph: Math.random() * 6.28 });
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.7;
      const v = (2.5 + Math.random() * 10) * force;
      add(x + (Math.random() - 0.5) * 10, y + (Math.random() - 0.5) * 10, Math.cos(a) * v, Math.sin(a) * v, 0.8 + Math.random() * 1.8, 0);
    }
    const heat = (l) => (l > 0.82 ? '255,250,236' : l > 0.55 ? '255,221,140' : l > 0.3 ? '222,170,58' : '196,92,28');
    let t = 0;
    const step = () => {
      t++;
      ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H); ctx.globalCompositeOperation = 'lighter';
      for (let i = P.length - 1; i >= 0; i--) {
        const p = P[i];
        p.trail.push(p.x, p.y); if (p.trail.length > 14) p.trail.splice(0, 2);
        p.vx *= 0.978; p.vy = p.vy * 0.978 + 0.2; p.x += p.vx; p.y += p.vy; p.life -= p.decay;
        if (!p.gen && p.life < 0.62 && p.life > 0.6 - p.decay && Math.random() < 0.35) {
          for (let k = 0; k < 3; k++) add(p.x, p.y, p.vx * 0.45 + (Math.random() - 0.5) * 5, p.vy * 0.45 + (Math.random() - 0.5) * 5, p.size * 0.5, 1);
        }
        if (p.life <= 0) { P.splice(i, 1); continue; }
        const fl = 0.7 + 0.3 * Math.sin(t * 0.9 + p.ph); const col = heat(p.life);
        ctx.beginPath(); ctx.moveTo(p.trail[0], p.trail[1]);
        for (let k = 2; k < p.trail.length; k += 2) ctx.lineTo(p.trail[k], p.trail[k + 1]);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(${col},${0.12 * p.life * fl})`; ctx.lineWidth = p.size * 6; ctx.stroke();
        ctx.strokeStyle = `rgba(${col},${0.9 * p.life * fl})`; ctx.lineWidth = p.size; ctx.stroke();
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.9, 0, 6.283);
        ctx.fillStyle = `rgba(255,250,236,${p.life * fl})`; ctx.fill();
      }
      if (P.length) requestAnimationFrame(step); else cv.remove();
    };
    requestAnimationFrame(step);
  }

  function toast(msg) {
    if ($('.cele')) return;
    const old = $('.toast'); if (old) old.remove();
    const el = document.createElement('p'); el.className = 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  /* ---------- Shared pieces ---------- */

  const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

  function meter(c) {
    const v = Math.min(c.progress, c.target); const pct = Math.round((v / c.target) * 100);
    return `<div class="meter" role="progressbar" aria-label="Progression : ${esc(c.title)}" aria-valuemin="0" aria-valuemax="${c.target}" aria-valuenow="${v}"><i style="--p:${pct / 100}"></i></div>`;
  }

  function defiActions(c, done, readOnly) {
    if (readOnly) return '';
    if (c.mode === 'tap') return `<button type="button" class="btn btn--${done ? 'done' : 'cat'}" data-tap="${c.act}" aria-pressed="${done}">${done ? icon('check') + 'Validé' : esc(c.label)}</button>`;
    if (c.mode === 'water') return glasses(c.progress);
    if ((c.mode === 'step' || c.mode === 'social') && done) return '';
    if (c.mode === 'step' || c.mode === 'social') {
      const attr = c.mode === 'social' ? `data-sstep="${c.id}` : `data-step="${c.act}`;
      return `<div class="stepper"><button type="button" class="round" ${attr}|-${c.steps[0]}" aria-label="Retirer ${c.steps[0]}">${icon('minus')}</button>${c.steps.map((n) => `<button type="button" class="btn btn--cat" ${attr}|${n}">${icon('plus')}${n}</button>`).join('')}</div>`;
    }
    return c.hint ? `<p class="hint">${esc(c.hint)}</p>` : '';
  }

  function stakeRow(c, sess, done) {
    if (done) return '';
    const k = stakeFor(c.key, sess); if (!k) return '';
    const dup = sess.stickers.includes(k.id);
    return `<p class="stake"><span class="stake-thumb stk--${k.cat}">${ART()[k.id] || ''}</span><span>${dup ? 'Doublon à gagner' : 'Compte pour la médaille'} <b>${esc(k.n)}</b></span></p>`;
  }

  function defiCard(c, sess, opts = {}) {
    const done = !!sess.done[c.key];
    const v = Math.min(c.progress, c.target);
    return `<article class="defi defi--${c.cat}${done ? ' is-done' : ''}${opts.big ? ' defi--big' : ''}">
      <div class="defi-badge">${icon(done ? 'check' : c.icon)}</div>
      <div class="defi-body">
        <div class="defi-top"><h3>${esc(c.title)}</h3><span class="pts">${done ? 'Réussi' : `+${c.pts} pts`}</span></div>
        <p class="defi-desc">${esc(c.desc)}</p>
        ${c.msg ? `<p class="defi-msg">« ${esc(c.msg)} »</p>` : ''}
        ${meter(c)}
        <p class="defi-count"><b>${v}</b> / ${c.target}${c.unit ? ` ${esc(c.unit)}` : ''}</p>
        ${opts.extra || ''}
        ${stakeRow(c, sess, done)}
        ${defiActions(c, done, opts.readOnly)}
      </div>
    </article>`;
  }

  function glasses(n) {
    return `<div class="glasses" role="group" aria-label="Verres d’eau bus">${Array.from({ length: 8 }, (_, i) => `<button type="button" class="glass${i < n ? ' is-full' : ''}" data-eau="${i + 1}" aria-pressed="${i < n}" aria-label="${i + 1} verre${i ? 's' : ''}"><svg viewBox="0 0 24 32" aria-hidden="true"><path d="M3 3h18l-2.5 26h-13z"/><path class="fill" d="M4.6 12h14.8l-1.7 17H6.3z"/></svg></button>`).join('')}</div>`;
  }

  function durControl(p) {
    return `<div class="level level--dur"><span class="label" id="dur-l">Durée</span><div class="seg" role="group" aria-labelledby="dur-l">${DUREES.map((n) => `<button type="button" data-dur="${n}" aria-pressed="${durOf(p) === n}">${n} min</button>`).join('')}</div></div>`;
  }

  function levelControl(p) {
    return `<div class="level">
      <label class="label" for="level">Niveau</label>
      <input type="range" id="level" data-level min="0" max="100" step="1" value="${p.niveau}">
      <output id="level-out" for="level">${lvLabel(p.niveau)}</output>
    </div>`;
  }

  function exDetails(id, v, ex, sd, key) {
    return `<details><summary>Pourquoi, technique, vidéo</summary><div class="more">
      <p><b>Pourquoi cet exercice.</b> ${esc(sd[ex.key] || sd[key])}</p>
      <p><b>Explication.</b> ${esc(ex.tech)}</p>
      <p><b>Erreur à éviter.</b> ${esc(ex.err)}</p>
      <p><a href="${yt(v.n + ' technique')}" target="_blank" rel="noopener">${icon('link')}Chercher « ${esc(v.n)} technique » sur YouTube</a></p>
    </div></details>`;
  }

  function exRow(id, i, sess, item, opts) {
    const p = sess.profile; const ex = E[id]; const v = variant(ex, p); const sd = sportData(p);
    const checked = opts.log && opts.log.ex.includes(id);
    return `<li class="ex${checked ? ' is-checked' : ''}">
      ${opts.check ? `<label class="tick"><input type="checkbox" data-ex="${id}"${checked ? ' checked' : ''}${opts.readOnly ? ' disabled' : ''}><span>${icon('check')}</span><b class="sr-only">${esc(v.n)} fait</b></label>` : `<span class="ex-num">${i + 1}</span>`}
      <div class="ex-main">
        <h4>${esc(v.n)}</h4>
        <p class="ex-meta"><span data-sr="${id}" data-i="${i}">${setsReps(ex, p, sess.seed, i).txt}</span> · repos ${ex.rest} s · <span data-w="${id}">${esc(loadText(v, p))}</span></p>
        <p class="ex-muscle">${esc(ex.m)}</p>
        ${exDetails(id, v, ex, sd, item.tpl.key)}
      </div>
    </li>`;
  }

  function sessionCard(item, sess, opts = {}) {
    const p = sess.profile; const meta = sessionMeta(item, p, sess.seed);
    const note = restrictionNote(p, item.tpl.key);
    const L0 = opts.log;
    const n = L0 ? Math.min(L0.ex.length, item.ex.length) : 0;
    return `<article class="card card--sport">
      <header class="card-head"><span class="chip-ico">${icon('dumbbell')}</span><div><h2 class="h2">${esc(item.title)}</h2><p class="muted">${esc(item.tpl.obj)} · ${meta.duree} min · intensité ${meta.rpe}/10</p></div>
        ${opts.check ? `<span class="count-pill">${n}/${item.ex.length}</span>` : `<span class="day-pill">${DAYS[item.day]}</span>`}</header>
      ${note ? `<p class="note">${esc(note)}</p>` : ''}
      <ol class="exs">${item.ex.map((id, i) => exRow(id, i, sess, item, opts)).join('')}</ol>
      ${opts.check && !opts.readOnly ? `<div class="card-foot"><button type="button" class="link-btn" data-tap="miss" aria-pressed="${L0.status === 'manquee'}">${L0.status === 'manquee' ? 'Séance marquée manquée, annuler' : 'J’ai manqué cette séance'}</button></div>` : ''}
    </article>`;
  }

  function cardioCard(item, sess, opts = {}) {
    const note = /genou/i.test(sess.profile.restrictions || '') ? 'Genou signalé : remplace les sauts et les sprints par du vélo ou du rameur, même durée.' : '';
    const L0 = opts.log; const done = L0 && L0.status === 'faite';
    return `<article class="card card--cardio">
      <header class="card-head"><span class="chip-ico">${icon('heart')}</span><div><h2 class="h2">${esc(item.type)}</h2><p class="muted">Cardio · ${item.duree} min</p></div>${opts.check ? '' : `<span class="day-pill">${DAYS[item.day]}</span>`}</header>
      ${note ? `<p class="note">${esc(note)}</p>` : ''}
      <dl class="facts"><div><dt>Format</dt><dd>${esc(item.format)}</dd></div><div><dt>Objectif</dt><dd>${esc(item.obj)}</dd></div></dl>
      <p><b>Conseils techniques :</b> ${esc(item.conseils)}</p>
      <p><a href="${yt(item.q)}" target="_blank" rel="noopener">${icon('link')}Chercher « ${esc(item.q)} » sur YouTube</a></p>
      ${opts.check && !opts.readOnly ? `<div class="card-foot"><button type="button" class="btn btn--${done ? 'done' : 'cat'}" data-tap="cardio" aria-pressed="${done}">${done ? icon('check') + 'Cardio terminé' : 'J’ai terminé mon cardio'}</button></div>` : ''}
    </article>`;
  }

  function recoCard(sess, title, opts = {}) {
    const p = sess.profile; const eau = (p.poids * 0.035).toFixed(1).replace('.', ',');
    const L0 = opts.log;
    return `<article class="card card--rest">
      <header class="card-head"><span class="chip-ico">${icon('stretch')}</span><div><h2 class="h2">${title}</h2><p class="muted">Repos actif</p></div></header>
      <p><b>Étirements recommandés :</b> fléchisseurs de hanche, ischio-jambiers, pectoraux, dorsaux, mollets. 30 secondes par zone, deux passages.</p>
      <p><b>Récupération :</b> environ ${eau} litres d’eau par jour, 7 à 9 heures de sommeil, 10 minutes de mobilité les jours sans séance, un jour de repos complet par semaine.</p>
      <p><b>Astuce pro :</b> ${esc(sportData(p).tip)}</p>
      ${L0 && !opts.readOnly ? `<div class="card-foot"><button type="button" class="btn btn--${L0.mob ? 'done' : 'cat'}" data-tap="mob" aria-pressed="${L0.mob}">${L0.mob ? icon('check') + 'Mobilité faite' : 'J’ai fait mes 10 minutes'}</button></div>` : ''}
    </article>`;
  }

  /* ---------- AI versions (written by /api/ai, see ai.js) ---------- */

  const AI = window.NA_AI;
  // AI text is already in the user's language: keep the live translator off it.
  const ai = (v) => `<span data-no-i18n>${esc(v)}</span>`;

  function aiNote(x, what) {
    const d = new Date(x.at).toLocaleDateString(window.NA_I18N.locale, { day: 'numeric', month: 'long' });
    return `<p class="ai-note">${icon('star')}<span><b>${what}</b> · ${d}</span></p>`;
  }

  function aiBusyCard(msg) {
    return `<article class="card ai-busy" role="status"><span class="ai-dots" aria-hidden="true"><i></i><i></i><i></i></span><p>${msg}</p></article>`;
  }

  function aiSessionCard(s) {
    const d = s.data;
    return `<article class="card card--sport">
      <header class="card-head"><span class="chip-ico">${icon('dumbbell')}</span><div><h2 class="h2"><span>Séance ${s.num}</span> · ${ai(d.titre)}</h2><p class="muted">${ai(d.objectif)} · ${d.duree_min} min · ${ai(d.intensite)}</p></div><span class="day-pill">${DAYS[s.day]}</span></header>
      <p>${ai(d.pourquoi)}</p>
      <ol class="exs">${d.exercices.map((x, i) => `<li class="ex"><span class="ex-num">${i + 1}</span>
        <div class="ex-main">
          <h4>${ai(x.nom)}</h4>
          <p class="ex-meta">${x.series} × ${ai(x.repetitions)} · <span>repos ${x.repos_sec} s</span> · ${ai(x.poids)}</p>
          <p class="ex-muscle">${ai(x.muscle)}</p>
          <details><summary>Pourquoi, technique, vidéo</summary><div class="more">
            <p><b>Pourquoi cet exercice.</b> ${ai(x.pourquoi)}</p>
            <p><b>Explication.</b> ${ai(x.explication)}</p>
            <p><b>Erreur à éviter.</b> ${ai(x.erreur)}</p>
            <p><a href="${yt(x.video_recherche)}" target="_blank" rel="noopener">${icon('link')}<span>YouTube</span> · ${ai(x.video_recherche)}</a></p>
          </div></details>
        </div></li>`).join('')}</ol>
    </article>`;
  }

  function aiCardioCard(c) {
    const d = c.data;
    return `<article class="card card--cardio">
      <header class="card-head"><span class="chip-ico">${icon('heart')}</span><div><h2 class="h2">${ai(d.type)}</h2><p class="muted">Cardio · ${d.duree_min} min</p></div>${c.day != null ? `<span class="day-pill">${DAYS[c.day]}</span>` : ''}</header>
      <dl class="facts"><div><dt>Format</dt><dd>${ai(d.format)}</dd></div><div><dt>Objectif</dt><dd>${ai(d.objectif)}</dd></div></dl>
      <p><b>Conseils techniques :</b> ${ai(d.conseils)}</p>
      <p><b>Pourquoi :</b> ${ai(d.pourquoi)}</p>
      <p><a href="${yt(d.video_recherche)}" target="_blank" rel="noopener">${icon('link')}<span>YouTube</span> · ${ai(d.video_recherche)}</a></p>
    </article>`;
  }

  function aiRecoCard(r) {
    return `<article class="card card--rest">
      <header class="card-head"><span class="chip-ico">${icon('stretch')}</span><div><h2 class="h2">Récupération et conseils</h2><p class="muted">Repos actif</p></div></header>
      <p><b>Étirements recommandés :</b> ${ai(r.etirements.join(', '))}</p>
      <ul class="ai-list">${r.conseils.map((x) => `<li>${ai(x)}</li>`).join('')}</ul>
      <p><b>Astuce pro :</b> ${ai(r.astuce)}</p>
    </article>`;
  }

  function aiNutritionCards(x, sess) {
    const d = x.data; const b = d.petit_dejeuner;
    const kc = { p: b.proteines * 4, g: b.glucides * 4, l: b.lipides * 9 }; const sum = kc.p + kc.g + kc.l || 1;
    const pc = (v) => Math.round((v / sum) * 100);
    const dish = (m) => ({ n: m.nom, k: m.kcal, p: m.proteines, g: m.glucides, l: m.lipides, cost: m.cout, ing: m.ingredients.map((i) => ({ n: i.nom, q: i.quantite })), alts: [], why: m.pourquoi, ai: true });
    return `<article class="card card--nutrition">
      <header class="card-head"><span class="chip-ico">${icon('bowl')}</span><div><h2 class="h2"><span>Petit-déjeuner</span> ${ai(b.type)}</h2><p class="muted">${DAYS_FULL[x.day]} · ${x.training ? 'jour d’entraînement' : 'jour de repos'} · valeurs estimées</p></div></header>
      ${aiNote(x, 'Écrit par le coach IA')}
      <dl class="macros">
        <div class="m-k"><dt>Calories</dt><dd>${b.kcal}<small> kcal</small></dd></div>
        <div class="m-p"><dt>Protéines</dt><dd>${b.proteines}<small> g</small></dd></div>
        <div class="m-g"><dt>Glucides</dt><dd>${b.glucides}<small> g</small></dd></div>
        <div class="m-l"><dt>Lipides</dt><dd>${b.lipides}<small> g</small></dd></div>
      </dl>
      <div class="macro-bar" role="img" aria-label="Répartition des calories : protéines ${pc(kc.p)} %, glucides ${pc(kc.g)} %, lipides ${pc(kc.l)} %"><i class="p" style="width:${pc(kc.p)}%"></i><i class="g" style="width:${pc(kc.g)}%"></i><i class="l" style="width:${pc(kc.l)}%"></i></div>
      <ul class="ingr">${b.ingredients.map((i) => `<li>${ai(i.nom)}<b>${i.grammes} g</b></li>`).join('')}</ul>
      <p><b>Explication :</b> ${ai(b.explication)}</p>
      <p><b>Boisson :</b> ${ai(b.boisson)}</p>
      <p><b>Alternative rapide :</b> ${ai(b.alternative_rapide)}</p>
    </article>
    <article class="card card--nutrition">
      <header class="card-head"><span class="chip-ico">${icon('bowl')}</span><div><h2 class="h2">Déjeuner et dîner</h2><p class="muted">${esc(M.summary(sess.profile))}</p></div></header>
      ${dishBlock('Déjeuner', dish(d.dejeuner))}
      ${dishBlock('Dîner', dish(d.diner))}
      <p class="meal-snack"><span class="label">Collation</span> ${ai(d.collation.nom)} · ${d.collation.kcal} kcal</p>
    </article>`;
  }

  const gramsLabel = (it) => { const f = FOOD[it.id]; if (f.unit) { const n = it.g / f.unit; return `${n} ${f.un}${n > 1 ? 's' : ''} · ${it.g} g`; } return `${it.g} g`; };

  function breakfastCard(sess, dayItem, L0, opts = {}) {
    const p = sess.profile;
    const training = dayItem && (!L0 || L0.status !== 'manquee');
    const b = breakfast(p, training ? 1.08 : 0.95);
    const kc = { p: b.tot.p * 4, g: b.tot.g * 4, l: b.tot.l * 9 }; const sum = kc.p + kc.g + kc.l || 1;
    const pc = (v) => Math.round((v / sum) * 100);
    const quick = b.swaps ? `${b.tpl.alt} Remplace les aliments à éviter par ceux de la liste.` : b.tpl.alt;
    const drink = p.eviter.includes('lactose') && p.objectif === 'masse' ? 'Smoothie protéiné : 250 ml de boisson au soja, une poignée de fruits rouges' : DRINK[p.objectif];
    return `<article class="card card--nutrition">
      <header class="card-head"><span class="chip-ico">${icon('bowl')}</span><div><h2 class="h2">Petit-déjeuner ${PDJ[p.petitdej]}</h2><p class="muted">${training ? 'Version jour d’entraînement' : 'Version jour de repos'} · valeurs estimées</p></div></header>
      ${opts.full ? `<div class="seg" role="group" aria-label="Type de petit-déjeuner">${Object.entries(PDJ).map(([k, l]) => `<button type="button" data-bf="${k}" aria-pressed="${p.petitdej === k}">${l[0].toUpperCase() + l.slice(1)}</button>`).join('')}</div>` : ''}
      <dl class="macros">
        <div class="m-k"><dt>Calories</dt><dd>${b.tot.k}<small> kcal</small></dd></div>
        <div class="m-p"><dt>Protéines</dt><dd>${b.tot.p}<small> g</small></dd></div>
        <div class="m-g"><dt>Glucides</dt><dd>${b.tot.g}<small> g</small></dd></div>
        <div class="m-l"><dt>Lipides</dt><dd>${b.tot.l}<small> g</small></dd></div>
      </dl>
      <div class="macro-bar" role="img" aria-label="Répartition des calories : protéines ${pc(kc.p)} %, glucides ${pc(kc.g)} %, lipides ${pc(kc.l)} %"><i class="p" style="width:${pc(kc.p)}%"></i><i class="g" style="width:${pc(kc.g)}%"></i><i class="l" style="width:${pc(kc.l)}%"></i></div>
      <ul class="ingr">${b.items.map((it) => `<li><span>${esc(FOOD[it.id].n + (it.id === 'dinde' ? b.meat : ''))}</span><b>${gramsLabel(it)}</b></li>`).join('')}</ul>
      ${opts.full ? `<p><b>Explication :</b> ${esc(b.tpl.why)} ${esc(sportData(p).food)} ${esc(GOAL_FOOD[p.objectif])}</p>` : ''}
      <p><b>Boisson :</b> ${esc(drink)}.</p>
      <p><b>Alternative rapide :</b> ${esc(quick)}</p>
      ${opts.full || !L0 ? '' : ''}${altList(M.breakfastAlts(p, b.items))}
      ${L0 && !opts.readOnly ? `<div class="card-foot"><button type="button" class="btn btn--${L0.pdj ? 'done' : 'cat'}" data-tap="pdj" aria-pressed="${L0.pdj}">${L0.pdj ? icon('check') + 'Petit-déjeuner pris' : 'Je l’ai pris'}</button></div>` : ''}
    </article>`;
  }

  function altList(alts) {
    if (!alts || !alts.length) return '';
    return `<div class="alts"><p class="label">Alternatives</p><ul>${alts.map((a) => `<li><span>${esc(a.from)}</span><span class="alt-arrow" aria-hidden="true">→</span><span>${esc(a.to)}</span><small>${esc(a.kind)}</small></li>`).join('')}</ul></div>`;
  }

  function dishBlock(label, d) {
    if (!d) return `<section class="meal"><p class="label">${label}</p><p class="muted">Aucun plat ne correspond à toutes tes restrictions pour ce repas. Modifie ton profil ou demande au coach.</p></section>`;
    return `<section class="meal${d.cheat ? ' meal--cheat' : ''}">
      <p class="label">${label}${d.cheat ? ' · <span class="gold">Repas plaisir</span>' : ''}</p>
      <h3 class="meal-name">${d.ai ? ai(d.n) : esc(d.n)}</h3>
      <p class="meal-macros"><b>${d.k} kcal</b> · Protéines ${d.p} g · Glucides ${d.g} g · Lipides ${d.l} g</p>
      <p class="meal-cost"><span>Coût :</span> <b>${d.cost}</b></p>
      <details><summary>Ingrédients et conseils</summary><div class="more">
        <ul class="ingr">${d.ing.map((i) => (d.ai ? `<li>${ai(i.n)}<b data-no-i18n>${esc(i.q)}</b></li>` : `<li><span>${esc(i.n)}</span><b>${esc(i.q)}</b></li>`)).join('')}</ul>
        ${altList(d.alts)}
        <p>${d.ai ? ai(d.why) : esc(d.why)}</p>${d.cheat ? `<p class="gold">${esc(M.CHEAT_TIP)}</p>` : ''}
      </div></details>
    </section>`;
  }

  function weekNo() { const d = dayDate(0); const y = new Date(d.getFullYear(), 0, 1); return Math.floor((d - y) / 6048e5); }
  function mealsFor(sess, dayI) {
    const item = buildPlan(sess).byDay(dayI);
    return M.dayMeals(sess.profile, sess.seed, dayI, weekNo(), !!item);
  }

  function mealsCard(sess, dayI) {
    const m = mealsFor(sess, dayI);
    return `<article class="card card--nutrition">
      <header class="card-head"><span class="chip-ico">${icon('bowl')}</span><div><h2 class="h2">Déjeuner et dîner</h2><p class="muted">${esc(M.summary(sess.profile))}</p></div></header>
      ${dishBlock('Déjeuner', m.dej)}
      ${dishBlock('Dîner', m.diner)}
      ${m.snack ? `<p class="meal-snack"><span class="label">Collation</span> ${esc(m.snack.n)}</p>` : ''}
    </article>`;
  }

  function coachNote(sess, dayItem, L0) {
    const p = sess.profile; const prot = Math.round(p.poids * 0.3);
    if (!dayItem) return 'Jour de repos : petit-déjeuner allégé en glucides, priorité au sommeil et à dix minutes de mobilité. Ça compte pour ta médaille « Souple ».';
    if (L0.status === 'manquee') return 'Séance manquée : pas de rattrapage en double. Elle glisse sur ton prochain jour libre et ton petit-déjeuner repasse en version repos. Ta série reprend à la prochaine séance.';
    if (L0.status === 'faite' || L0.ex.length >= (dayItem.ex || []).length) return `Bien joué. Vise environ ${prot} g de protéines dans les deux heures. Si tes dernières répétitions étaient propres, on montera les charges la prochaine fois.`;
    if (L0.ex.length) return `Déjà ${L0.ex.length} exercice${L0.ex.length > 1 ? 's' : ''} sur ${dayItem.ex.length}. Garde le rythme, la médaille n’est pas loin.`;
    return `Au programme : ${dayItem.title}. Ton petit-déjeuner est renforcé pour alimenter l’effort. Coche tes exercices au fur et à mesure.`;
  }

  const foot = () => (AI.ready
    ? '<p class="foot">Les programmes et repas marqués « coach IA » sont écrits par une IA à partir de ton profil ; les autres sont des exemples calculés dans ton navigateur. Charges et valeurs nutritionnelles sont des estimations. En cas de douleur ou de pathologie, demande l’avis d’un professionnel de santé.</p>'
    : '<p class="foot">Prototype : programmes, défis et valeurs sont des exemples calculés dans ton navigateur, aucun modèle d’IA n’est encore connecté. Les valeurs nutritionnelles sont des estimations. En cas de douleur ou de pathologie, demande l’avis d’un professionnel de santé.</p>');

  function pendingBanner() {
    const x = state.pendingShare; if (!x) return '';
    const c = SOCIAL.find((s) => s.cid === x.cid); if (!c) return '';
    return `<aside class="banner defi--${c.cat}" aria-label="Défi reçu par lien">
      <span class="chip-ico">${icon('inbox')}</span>
      <div><p class="banner-title">${esc(x.from)} te lance un défi : ${esc(c.title)}</p>${x.msg ? `<p>« ${esc(x.msg)} »</p>` : ''}</div>
      <div class="actions"><button type="button" class="btn" data-act="share-accept">Relever le défi</button><button type="button" class="btn btn--ghost" data-act="share-later">Plus tard</button></div>
    </aside>`;
  }

  /* ---------- Views ---------- */

  function scorebar(sess) {
    const r = rangOf(sess.points); const nx = nextRang(sess.points); const streak = streakOf(sess);
    const fresh = sess.inbox.filter((x) => x.status === 'new').length;
    return `<div class="scorebar">
      ${fresh ? `<button type="button" class="score score--inbox" data-goto="amis">${icon('inbox')}<b>${fresh}</b> défi${fresh > 1 ? 's' : ''} reçu${fresh > 1 ? 's' : ''}</button>` : ''}
      <span class="score score--streak" title="Séances prévues réussies d’affilée">${icon('flame')}<b>${streak}</b> ${streak > 1 ? 'séances' : 'séance'} d’affilée</span>
      <span class="score score--pts">${icon('star')}<b>${sess.points}</b> pts${nx ? `<small> · ${nx.min - sess.points} avant ${nx.n}</small>` : ''}</span>
      <button type="button" class="score score--rang" data-view="album" aria-label="Rang ${r.n}, voir les trophées">${window.NA_BADGE ? window.NA_BADGE(r.id, true) : ''}${r.n}</button>
    </div>`;
  }

  function hero(sess, item, daily, date, future) {
    const p = sess.profile; const day = date[0].toUpperCase() + date.slice(1);
    const title = ui.day === todayIdx ? `${new Date().getHours() < 18 ? 'Bonjour' : 'Bonsoir'}, ${esc(p.prenom)}` : esc(day);
    let name; let meta; let ico;
    if (!item) { name = 'Repos et récupération'; meta = '10 minutes de mobilité'; ico = 'stretch'; }
    else if (item.kind === 'muscu') { const m = sessionMeta(item, p, sess.seed); name = item.title; meta = `${m.duree} min · ${item.ex.length} exercices · intensité ${m.rpe}/10`; ico = 'dumbbell'; }
    else { name = item.type; meta = `${item.duree} min de cardio`; ico = 'heart'; }
    const done = daily[0].progress >= daily[0].target;
    const n = daily.filter((c) => c.progress >= c.target).length; const C = 2 * Math.PI * 52;
    const cta = future ? 'Voir la séance' : done ? 'Voir ma séance' : 'Commencer';
    return `<section class="hero" aria-labelledby="hero-title">
      <div class="hero-copy">
        <h1 class="hero-title" id="hero-title">${title}</h1>
        <p class="lede">${ui.day === todayIdx ? `${esc(day)} · ` : ''}${esc(sportName(p))}, objectif ${OBJECTIFS[p.objectif].toLowerCase()}${future ? ' · à venir' : ''}</p>
        <div class="hero-session"><span class="chip-ico">${icon(ico)}</span><div><b>${esc(name)}</b><span>${esc(meta)}</span></div></div>
        <div class="actions"><button type="button" class="btn btn--big btn--sheen" data-act="start">${cta}</button><button type="button" class="btn btn--big btn--ghost btn--glass" data-act="parcours">${icon('bolt')}Faire un parcours</button></div>
      </div>
      <div class="hero-ring" role="img" aria-label="${n} défis du jour réussis sur ${daily.length}">
        <svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="ring-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3a1"/><stop offset=".45" stop-color="#d4af37"/><stop offset="1" stop-color="#8a6416"/></linearGradient></defs>
          <circle class="ring-track" cx="60" cy="60" r="52"/><circle class="ring-val" cx="60" cy="60" r="52" stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${(C * (1 - n / daily.length)).toFixed(1)}" style="--c0:${C.toFixed(1)}"/></svg>
        <p><b>${n}<small>/${daily.length}</small></b><span>défis du jour</span></p>
      </div>
    </section>`;
  }

  function viewToday(sess) {
    const plan = buildPlan(sess); const item = plan.byDay(ui.day);
    const d = dayDate(ui.day); const key = iso(d); const L0 = lg(sess, key);
    const future = ui.day > todayIdx;
    const date = d.toLocaleDateString(window.NA_I18N.locale, { weekday: 'long', day: 'numeric', month: 'long' });
    const week = DAYS.map((l, i) => {
      const it = plan.byDay(i); const k = iso(dayDate(i));
      const done = it ? !!sess.done[doneKey(it, k)] : !!sess.done[`j:mob:${k}`];
      const kind = it ? (it.kind === 'muscu' ? 'Muscu' : 'Cardio') : 'Repos';
      return `<button type="button" class="day day--${it ? it.kind : 'repos'}${i === todayIdx ? ' is-today' : ''}${done ? ' is-done' : ''}" data-day="${i}" aria-pressed="${i === ui.day}" aria-label="${DAYS_FULL[i]}, ${kind}${done ? ', réussi' : ''}${i === todayIdx ? ', aujourd’hui' : ''}">
        <span class="day-l">${l}</span><span class="day-n">${dayDate(i).getDate()}</span><span class="day-k">${done ? icon('check') : kind}</span></button>`;
    }).join('');
    const ro = future;
    const main = !item ? recoCard(sess, 'Repos et récupération', { log: L0, readOnly: ro }) : item.kind === 'muscu' ? sessionCard(item, sess, { check: true, log: L0, readOnly: ro }) : cardioCard(item, sess, { check: true, log: L0, readOnly: ro });
    const daily = dailyList(sess, ui.day);
    const water = daily.find((c) => c.mode === 'water');
    return `${pendingBanner()}
      ${hero(sess, item, daily, date, future)}
      <div class="hello hello--today">${scorebar(sess)}</div>
      <div class="week" role="group" aria-label="Semaine">${week}</div>
      <section class="daily" aria-label="Défis du jour">${daily.map((c) => defiCard(c, sess, { readOnly: true })).join('')}</section>
      <div class="today-grid">
        <div class="stack">${main}</div>
        <div class="stack">
          ${breakfastCard(sess, item, L0, { readOnly: ro })}
          ${mealsCard(sess, ui.day)}
          <article class="card card--eau"><header class="card-head"><span class="chip-ico">${icon('drop')}</span><div><h2 class="h2">Eau</h2><p class="muted">${water.progress} verre${water.progress > 1 ? 's' : ''} sur 8 · objectif 2 litres</p></div></header>${ro ? '' : glasses(water.progress)}</article>
          <article class="card card--coach"><header class="card-head"><span class="chip-ico">${icon('chat')}</span><div><h2 class="h2">Le mot du coach</h2></div></header>
            <p aria-live="polite">${esc(coachNote(sess, item, L0))}</p>
            <div class="actions"><button type="button" class="btn btn--ghost" data-view="coach">Poser une question</button><button type="button" class="btn btn--ghost" data-act="launch">${icon('send')}Lancer un défi</button></div></article>
        </div>
      </div>${foot()}`;
  }

  function viewDefis(sess) {
    const w = weekList(sess);
    const tabs = [['jour', 'Jour'], ['semaine', 'Semaine'], ['sport', 'Sport'], ['amis', 'Amis']];
    const fresh = sess.inbox.filter((x) => x.status === 'new').length;
    let body = '';
    if (ui.defisTab === 'jour') body = `<div class="defis">${dailyList(sess, todayIdx).map((c) => defiCard(c, sess)).join('')}</div>`;
    if (ui.defisTab === 'semaine') body = `<div class="defis">${w.semaine.map((c) => defiCard(c, sess)).join('')}</div>`;
    if (ui.defisTab === 'sport') body = `<div class="defis">${w.sport.map((c) => defiCard(c, sess, { big: true })).join('')}</div><p class="hint">Ajoute tes répétitions après chaque entraînement de ${esc(sportName(sess.profile))}. L’objectif s’adapte à ton niveau${/genou/i.test(sess.profile.restrictions || '') ? ' et à ton genou' : ''}.</p>`;
    if (ui.defisTab === 'amis') body = viewAmis(sess);
    return `${pendingBanner()}
      <header class="hello"><div><h1 class="h1">Défis</h1><p class="lede">Chaque défi réussi rapporte des points et des médailles pour tes trophées.</p></div>${scorebar(sess)}</header>
      <div class="tabs" role="tablist" aria-label="Catégories de défis">${tabs.map(([k, l]) => `<button type="button" role="tab" aria-selected="${ui.defisTab === k}" data-tab="${k}">${l}${k === 'amis' && fresh ? ` <span class="dot-count">${fresh}</span>` : ''}</button>`).join('')}</div>
      <div role="tabpanel">${body}</div>${foot()}`;
  }

  function participants(item) {
    if (item.cloud) {
      const m = (item.members || []).filter((x) => x.status !== 'declined').map((x) => ({ n: x.pseudo, v: Math.min(x.me ? item.progress || 0 : x.progress || 0, item.target), me: x.me, wait: x.status === 'invited' }));
      return m.length > 1 ? `<ul class="duel" aria-label="Qui participe">${m.sort((a, b) => b.v - a.v).map((o) => `<li${o.me ? ' class="is-me"' : ''}><span>${esc(o.n)}${o.me ? ' (toi)' : o.wait ? ' (invité)' : ''}</span><i style="--v:${Math.round((o.v / item.target) * 100)}%"></i><b>${o.v}</b></li>`).join('')}</ul>` : '';
    }
    const out = [];
    state.sessions.forEach((s) => { const x = s.inbox.find((y) => y.id === item.id && y.status === 'accepted'); if (x) out.push({ n: s.profile.prenom, v: Math.min(x.progress || 0, x.target), me: s.id === state.current }); });
    return out.length > 1 ? `<ul class="duel" aria-label="Qui participe">${out.sort((a, b) => b.v - a.v).map((o) => `<li${o.me ? ' class="is-me"' : ''}><span>${esc(o.n)}${o.me ? ' (toi)' : ''}</span><i style="--v:${Math.round((o.v / item.target) * 100)}%"></i><b>${o.v}</b></li>`).join('')}</ul>` : '';
  }

  function viewAmis(sess) {
    const fresh = sess.inbox.filter((x) => x.status === 'new');
    const active = sess.inbox.filter((x) => x.status === 'accepted');
    return `${friendsBlock()}<div class="amis-head"><p>Lance un défi à quelqu’un sur cet appareil ou partage-le par lien. Chacun suit sa progression, et le premier arrivé gagne la médaille.</p>
        <button type="button" class="btn btn--amis" data-act="launch">${icon('send')}Lancer un défi</button></div>
      ${fresh.length ? `<h2 class="h3">Défis reçus</h2><div class="defis">${fresh.map((x) => `<article class="defi defi--${x.cat} is-invite">
        <div class="defi-badge">${icon(x.icon)}</div><div class="defi-body"><div class="defi-top"><h3>${esc(x.title)}</h3><span class="pts">+50 pts</span></div>
        <p class="defi-desc">De la part de ${esc(x.from)}</p>${x.msg ? `<p class="defi-msg">« ${esc(x.msg)} »</p>` : ''}
        <div class="actions"><button type="button" class="btn btn--cat" data-accept="${x.id}">Relever le défi</button><button type="button" class="btn btn--ghost" data-decline="${x.id}">Refuser</button></div></div></article>`).join('')}</div>` : ''}
      <h2 class="h3">En cours</h2>
      ${active.length ? `<div class="defis">${active.map((x) => defiCard(socialCard(x), sess, { extra: participants(x) + (x.cloud ? '' : `<button type="button" class="link-btn" data-copy="${x.id}">${icon('link')}Copier le lien du défi</button>`) })).join('')}</div>` : `<p class="empty">Aucun défi entre amis pour l’instant. Lance le premier !</p>`}
      ${sess.sent.length ? `<h2 class="h3">Envoyés</h2><ul class="sent">${sess.sent.slice(0, 8).map((x) => `<li>${icon('send')}<span><b>${esc(x.title)}</b> à ${esc(x.to)}</span></li>`).join('')}</ul>` : ''}`;
  }

  function viewAlbum(sess) {
    const owned = (id) => sess.stickers.includes(id);
    const total = STICKERS.length; const have = sess.stickers.length;
    const pages = ALBUM.map(([title, cats]) => {
      const list = STICKERS.filter((s) => cats.includes(s.cat));
      return `<section class="album-page"><h2 class="album-title">${title}<span>${list.filter((s) => owned(s.id)).length} / ${list.length}</span></h2>
        <div class="slots">${list.map((s) => { const d = owned(s.id) ? (sess.dupes[s.id] || 0) : 0; return `<div class="slot-wrap">${stickerArt(s, STICKERS.indexOf(s) + 1, owned(s.id), false, d)}${d && state.sessions.length > 1 ? `<button type="button" class="link-btn" data-give="${s.id}">${icon('send')}Donner un doublon</button>` : ''}</div>`; }).join('')}</div></section>`;
    }).join('');
    const r = rangOf(sess.points); const nx = nextRang(sess.points);
    return `<header class="hello"><div><h1 class="h1">Trophées</h1><p class="lede">${have} médaille${have > 1 ? 's' : ''} sur ${total}. Les emplacements vides indiquent comment les obtenir.</p></div>${scorebar(sess)}</header>
      <section class="rangs" aria-label="Rangs">
        <div class="patches">${STICKERS.filter((s) => s.cat === 'rang').map((s) => patchArt(s.rang, s.n, owned(s.id))).join('')}</div>
        <div><p class="h3">Rang ${r.n}</p><p class="muted">${nx ? `Encore ${nx.min - sess.points} points pour l’écusson ${nx.n}.` : 'Tu as tous les écussons. Respect.'}</p>
          ${nx ? `<div class="meter meter--rang" role="progressbar" aria-label="Progression vers ${nx.n}" aria-valuemin="${r.min}" aria-valuemax="${nx.min}" aria-valuenow="${sess.points}"><i style="--p:${((sess.points - r.min) / (nx.min - r.min)).toFixed(3)}"></i></div>` : ''}</div>
      </section>
      ${pages}${foot()}`;
  }

  function profileFacts(p, nutrition) {
    const rows = [['Sexe', p.sexe === 'femme' ? 'Femme' : 'Homme'], ['Âge', `${p.age} ans`], ['Taille', `${p.taille} cm`], ['Poids', `${p.poids} kg`], ['Objectif', OBJECTIFS[p.objectif]], [nutrition ? 'Sport principal' : 'Sports', nutrition ? sportName(p) : sportList(p)]];
    if (nutrition) rows.push(['Niveau d’activité', activity(p).label], ['Régime', M.REGIMES[p.regime || 'omni']], ['Pratiques', (p.pratiques || []).map((x) => M.PRATIQUES[x]).join(', ') || 'aucune'], ['Repas plaisir', `${p.cheat ?? 1} par semaine`], ['Budget', M.BUDGETS[p.budget || 'moyen']], ['Région', M.REGIONS[window.NA_I18N.region]]);
    else rows.push(['Niveau', `<span data-lv>${lvLabel(p.niveau)}</span>`], ['Séances', `${p.seances} par semaine`], ['Durée', `${durOf(p)} min par séance`], ['Matériel', p.materiel.map((m) => MATERIEL[m]).join(', ')]);
    return `<dl class="facts">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${k === 'Niveau' ? v : esc(v)}</dd></div>`).join('')}</dl>`;
  }

  /* ---------- Weekly shopping list ---------- */
  const AISLES = [
    ['Fruits et légumes', /haricots verts|petits pois|edamame|légume|brocoli|courgette|épinard|poivron|concombre|tomate|salade|crudité|champignon|bok choy|chou|carotte|avocat|banane|pomme(?! de terre)|fruit|citron|mangue|herbe|ail|cébette|algue|basilic|igname|plantain/i],
    ['Protéines', /poulet|dinde|bœuf|steak|agneau|saumon|thon|cabillaud|sardine|maquereau|lieu|merlu|crevette|tilapia|capitaine|œuf|tofu|viande|falafel|kebab/i],
    ['Produits laitiers et alternatives', /lait de coco|yaourt|skyr|feta|parmesan|emmental|fromage|mozzarella|cottage|cheddar|lait/i],
    ['Féculents et céréales', /riz|quinoa|pâte|nouille|pain|avoine|flocon|boulgour|orge|couscous|fonio|pommes de terre|patate|lentille|haricot|pois chiche|sarrasin|tortilla|galette|frite|naan|brioché|pita|burger/i],
    ['Épicerie', /./],
  ];
  const aisleOf = (n) => { const low = n.toLowerCase(); if (/^(pommes? de terre|patate|purée de patate|igname|plantain|pain|riz|sushis)/.test(low)) return 'Féculents et céréales'; if (/^lait de coco/.test(low) || /huile|sauce|miel|sirop|beurre de|purée de graines|amande|graine|curry|miso|bouillon|épice|cacahuète|tahini|vinaigr|sésame/.test(low)) return 'Épicerie'; return AISLES.find(([, re]) => re.test(n))[0]; };

  function shoppingList(sess) {
    const p = sess.profile; const plan = buildPlan(sess);
    const items = new Map(); const snacks = new Map();
    const DRY = /^(riz|quinoa|pâtes|nouilles|boulgour|orge|couscous|fonio)/i;
    const add = (name0, grams, pieces) => { const name = name0 === 'Œufs entiers' ? 'Œufs' : name0; const k = name; const v = items.get(k) || { n: name, g: 0, pcs: 0, dry: DRY.test(name) && (/cuit/.test(name) || /^Riz (rond|vinaigré)$/.test(name)) }; v.g += grams || 0; v.pcs += pieces || 0; items.set(k, v); };
    for (let i = 0; i < 7; i++) {
      const it = plan.byDay(i);
      const b = breakfast(p, it ? 1.08 : 0.95);
      b.items.forEach((x) => { const f = FOOD[x.id]; add(f.n + (x.id === 'dinde' ? b.meat : ''), x.g); });
      const m = mealsFor(sess, i);
      [m.dej, m.diner].filter(Boolean).forEach((d) => d.ing.forEach((x) => {
        const pc = x.q.match(/^(\d+) pièces$/); const g = x.q.match(/^(\d+) g$/);
        if (pc) add(x.n, 0, +pc[1]); else if (g) add(x.n, +g[1]);
      }));
      if (m.snack) snacks.set(m.snack.n, (snacks.get(m.snack.n) || 0) + 1);
    }
    const groups = new Map(AISLES.map(([a]) => [a, []]));
    items.forEach((v) => groups.get(aisleOf(v.n)).push(v));
    groups.forEach((list) => list.sort((a, b) => a.n.localeCompare(b.n, 'fr')));
    return { groups: [...groups].filter(([, l]) => l.length), snacks: [...snacks] };
  }
  const qtyLabel = (v) => {
    if (/^Œufs/.test(v.n) && v.g) { const n = Math.round(v.g / 55); return `${n} œufs`; }
    if (v.pcs) return `${v.pcs} pièces`;
    if (v.dry) { const d = Math.max(10, Math.round((v.g * 0.38) / 10) * 10); return `${d} g sec`; }
    const g = Math.round(v.g / 10) * 10;
    return g >= 1000 ? `${(g / 1000).toFixed(1).replace('.', ',')} kg` : `${g} g`;
  };

  function viewCourses(sess, tabs) {
    const sl = shoppingList(sess); const checked = new Set(sess.shop[weekId] || []);
    const total = sl.groups.reduce((n, [, l]) => n + l.length, 0);
    const done = sl.groups.reduce((n, [, l]) => n + l.filter((v) => checked.has(v.n)).length, 0);
    return `<header class="hello"><div><h1 class="h1">Liste de courses</h1><p class="lede">Pour 7 jours : petits-déjeuners, déjeuners et dîners du plan, adaptés à ton budget et à ta région. Coche ce que tu as déjà.</p></div>
      <div class="actions"><button type="button" class="btn" data-act="shop-share">${icon('share')}Partager</button><button type="button" class="btn btn--ghost" data-act="shop-copy">${icon('link')}Copier la liste</button><button type="button" class="btn btn--ghost" data-act="print">Imprimer</button></div></header>${tabs}
      <article class="card shop">
        <header class="card-head"><span class="chip-ico">${icon('calendar')}</span><div><h2 class="h2">Semaine du ${dayDate(0).toLocaleDateString(window.NA_I18N.locale, { day: 'numeric', month: 'long' })}</h2><p class="muted"><span>${done} articles cochés sur ${total}</span> · ${esc(M.summary(sess.profile))}</p></div>
          ${done ? '<button type="button" class="link-btn" data-act="shop-reset">Tout décocher</button>' : ''}</header>
        <div class="shop-grid">${sl.groups.map(([aisle, list]) => `<section class="shop-aisle"><h3 class="h3">${aisle}</h3><ul>${list.map((v) => `<li><label class="shop-item${checked.has(v.n) ? ' is-checked' : ''}"><input type="checkbox" data-shop="${esc(v.n)}"${checked.has(v.n) ? ' checked' : ''}><span class="shop-box" aria-hidden="true">${icon('check')}</span><span class="shop-name">${esc(v.n)}</span><b class="shop-qty">${qtyLabel(v)}</b></label></li>`).join('')}</ul></section>`).join('')}
          ${sl.snacks.length ? `<section class="shop-aisle"><h3 class="h3">Collations</h3><ul>${sl.snacks.map(([n, k]) => `<li class="shop-snack"><span>${esc(n)}</span><b>× ${k}</b></li>`).join('')}</ul></section>` : ''}</div>
        <p class="hint">Les quantités sont des estimations, arrondies pour faciliter les courses. Riz, pâtes et céréales sont indiqués en poids sec.</p>
      </article>${foot()}`;
  }

  function shoppingText(sess) {
    const T = (x) => window.NA_I18N.t(x); const sl = shoppingList(sess); const checked = new Set(sess.shop[weekId] || []);
    const lines = [`Kin Fit · ${T('Liste de courses')}`];
    sl.groups.forEach(([aisle, list]) => { lines.push('', T(aisle)); list.forEach((v) => lines.push(`${checked.has(v.n) ? '[x]' : '[ ]'} ${T(v.n)} · ${T(qtyLabel(v))}`)); });
    if (sl.snacks.length) { lines.push('', T('Collations')); sl.snacks.forEach(([n, k]) => lines.push(`- ${T(n)} × ${k}`)); }
    return lines.join('\n');
  }

  /* ---------- Circuits (parcours) ---------- */

  function viewParcours(sess, tabs) {
    const p = sess.profile; const C = window.NA_CIRCUITS;
    const c = C.build(p, ui.circuit, ui.circuitDur || durOf(p));
    const list = (xs) => `<ul class="ai-list">${xs.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    return `<header class="hello"><div><h1 class="h1">Parcours</h1><p class="lede">Des circuits à enchaîner sans temps mort : choisis ton style et ta durée, le rythme et le nombre de tours suivent ton niveau.</p></div>
      <div class="actions"><button type="button" class="btn btn--ghost" data-act="print">Imprimer</button></div></header>${tabs}
      <div class="parcours-pick">
        <div class="seg" role="group" aria-label="Type de parcours">${Object.entries(C.TYPES).map(([k, t]) => `<button type="button" data-circuit="${k}" aria-pressed="${k === c.type}">${icon(t.icon)}${t.name}</button>`).join('')}</div>
        <div class="seg" role="group" aria-label="Durée du parcours">${DUREES.map((n) => `<button type="button" data-cdur="${n}" aria-pressed="${n === c.duree}">${n} min</button>`).join('')}</div>
      </div>
      <article class="card card--sport parcours">
        <header class="card-head"><span class="chip-ico">${icon(c.icon)}</span><div><h2 class="h2">Parcours ${c.name.toLowerCase()}</h2><p class="muted">${c.duree} min · ${c.rounds} tours · ${c.stations.length} exercices</p></div></header>
        ${c.missing ? '<p class="note">Il te faut une paire d’haltères. Pour débuter, des bouteilles d’eau ou un sac chargé font l’affaire.</p>' : ''}
        ${c.knee ? '<p class="note">Genou signalé : les sauts sont remplacés par des versions sans impact.</p>' : ''}
        <dl class="facts"><div><dt>Effort</dt><dd>${c.pace.on} s</dd></div><div><dt>Repos entre exercices</dt><dd>${c.pace.off} s</dd></div><div><dt>Repos entre les tours</dt><dd>${c.pace.rest} s</dd></div><div><dt>Tours</dt><dd>${c.rounds}</dd></div></dl>
        <p>${esc(c.why)}</p>
        <section class="parcours-part"><h3 class="h3">Échauffement · ${c.warm} min</h3>${list(c.warmList)}</section>
        <section class="parcours-part"><h3 class="h3">Le circuit · ${c.rounds} tours</h3>
          <ol class="exs">${c.stations.map((x, i) => `<li class="ex"><span class="ex-num">${i + 1}</span><div class="ex-main">
            <h4>${esc(x.n)}</h4>
            <p class="ex-meta">${c.pace.on} s d’effort · ${c.pace.off} s de repos · ${esc(x.load)}</p>
            <p class="ex-muscle">${esc(x.m)}</p>
            <details><summary>Technique et vidéo</summary><div class="more">
              <p><b>Explication.</b> ${esc(x.tech)}</p>
              <p><b>Erreur à éviter.</b> ${esc(x.err)}</p>
              <p><a href="${yt(x.q)}" target="_blank" rel="noopener">${icon('link')}Chercher « ${esc(x.q)} » sur YouTube</a></p>
            </div></details></div></li>`).join('')}</ol></section>
        <section class="parcours-part"><h3 class="h3">Retour au calme · ${c.cool} min</h3>${list(c.coolList)}</section>
        <p class="hint">Bois quelques gorgées entre les tours. Si une position fait mal, passe à l’exercice suivant.</p>
      </article>${foot()}`;
  }

  function viewPlan(sess) {
    const p = sess.profile;
    const tabs = `<div class="tabs" role="tablist" aria-label="Plan"><button type="button" role="tab" data-ptab="programme" aria-selected="${ui.planTab === 'programme'}">Programme sportif</button><button type="button" role="tab" data-ptab="nutrition" aria-selected="${ui.planTab === 'nutrition'}">Nutrition</button><button type="button" role="tab" data-ptab="parcours" aria-selected="${ui.planTab === 'parcours'}">Parcours</button><button type="button" role="tab" data-ptab="courses" aria-selected="${ui.planTab === 'courses'}">Courses</button></div>`;
    if (ui.planTab === 'courses') return viewCourses(sess, tabs);
    if (ui.planTab === 'parcours') return viewParcours(sess, tabs);
    if (ui.planTab === 'nutrition') {
      const item = buildPlan(sess).byDay(todayIdx);
      const nut = sess.ai && sess.ai.nut && sess.ai.nut.date === iso(TODAY) ? sess.ai.nut : null;
      const nutBtns = AI.can('nutrition') ? `<div class="actions"><button type="button" class="btn" data-act="ai-nut"${ui.aiBusy ? ' disabled' : ''}>${icon('star')}${nut ? 'Réécrire avec l’IA' : 'Ma journée avec l’IA'}</button>${nut ? '<button type="button" class="btn btn--ghost" data-act="ai-nut-clear">Version exemple</button>' : ''}</div>` : '';
      const today = ui.aiBusy === 'nut' ? aiBusyCard('Le coach IA prépare tes repas du jour. Compte une vingtaine de secondes.')
        : nut ? aiNutritionCards(nut, sess) : breakfastCard(sess, item, lg(sess, iso(TODAY)), { full: true, readOnly: true });
      return `<header class="hello"><div><h1 class="h1">Nutrition</h1><p class="lede">Besoin estimé : ${dailyKcal(p)} kcal par jour. Petit-déjeuner 25 %, déjeuner 35 %, dîner 30 %, collation 10 %, ajustés selon que tu t’entraînes ou non.</p></div>${nutBtns}</header>${tabs}
        <div class="today-grid"><div class="stack">${today}
          <article class="card card--nutrition"><header class="card-head"><span class="chip-ico">${icon('calendar')}</span><div><h2 class="h2">Repas de la semaine</h2><p class="muted">${esc(M.summary(p))}</p></div></header>
            <div class="week-meals">${DAYS.map((l, i) => { const m = mealsFor(sess, i); const cheat = (m.dej && m.dej.cheat) || (m.diner && m.diner.cheat); return `<details${i === todayIdx ? ' open' : ''}><summary><span class="wm-day">${DAYS_FULL[i]}</span><span class="wm-names">${esc(m.dej ? m.dej.n : '—')} · ${esc(m.diner ? m.diner.n : '—')}</span>${cheat ? '<span class="tag">Plaisir</span>' : ''}</summary>${dishBlock('Déjeuner', m.dej)}${dishBlock('Dîner', m.diner)}</details>`; }).join('')}</div>
          </article></div>
        <div class="stack"><article class="card"><header class="card-head"><span class="chip-ico">${icon('user')}</span><div><h2 class="h2">Profil nutrition</h2></div></header>${profileFacts(p, true)}
          <p><b>À éviter :</b> ${p.eviter.length ? esc(p.eviter.map((a) => ALLERG[a]).join(', ')) : 'rien de signalé'}.</p>
          <div class="actions"><button type="button" class="btn btn--ghost" data-act="edit">Modifier mon profil</button></div></article></div></div>${foot()}`;
    }
    const plan = buildPlan(sess);
    const prog = sess.ai && sess.ai.prog;
    const aiBtns = AI.can('programme') ? `<button type="button" class="btn" data-act="ai-prog"${ui.aiBusy ? ' disabled' : ''}>${icon('star')}${prog ? 'Réécrire avec l’IA' : 'Générer avec l’IA'}</button>${prog ? '<button type="button" class="btn btn--ghost" data-act="ai-prog-clear">Version exemple</button>' : ''}` : '';
    const cards = prog
      ? [...prog.seances.map((x) => ({ day: x.day, html: aiSessionCard(x) })), ...prog.cardio.map((x) => ({ day: x.day ?? 9, html: aiCardioCard(x) }))].sort((a, b) => a.day - b.day).map((x) => x.html).join('') + aiRecoCard(prog.recuperation)
      : plan.items.map((it) => (it.kind === 'muscu' ? sessionCard(it, sess) : cardioCard(it, sess))).join('') + recoCard(sess, 'Récupération et conseils');
    return `<header class="hello"><div><h1 class="h1">Programme sportif</h1><p class="lede">${OBJECTIFS[p.objectif]} · ${esc(sportList(p))} · ${prog ? 'coach IA' : `version ${sess.seed + 1}`}</p></div>
      <div class="actions">${aiBtns}${prog ? '' : `<button type="button" class="btn${AI.can('programme') ? ' btn--ghost' : ''}" data-act="regen">Régénérer</button>`}<button type="button" class="btn btn--ghost" data-act="print">Imprimer</button></div></header>${tabs}
      <div class="stack">
        <article class="card"><header class="card-head"><span class="chip-ico">${icon('user')}</span><div><h2 class="h2">Profil résumé</h2></div></header>${profileFacts(p, false)}${prog ? '' : `${levelControl(p)}${durControl(p)}<p class="hint">Niveau et durée recalculent les charges, les séries et le nombre d’exercices de toutes les séances.</p>`}</article>
        ${ui.aiBusy === 'prog' ? aiBusyCard('Le coach IA écrit tes séances, une par une. Compte environ 30 secondes.') : ''}
        ${prog && ui.aiBusy !== 'prog' ? `${aiNote(prog, 'Écrit par le coach IA')}<p class="hint">Charges et durées sont des estimations de départ : ajuste-les dès ta première séance et arrête tout exercice douloureux. L’onglet Aujourd’hui garde le programme d’exemple pour cocher tes exercices.</p>` : ''}
        <div class="plan-grid">${ui.aiBusy === 'prog' ? '' : cards}</div>
      </div>${foot()}`;
  }

  function viewCoach(sess) {
    const msgs = sess.chat.length
      ? sess.chat.map((m) => (m.pending
        ? '<div class="msg msg--wait" aria-busy="true"><b>Coach</b><span class="ai-dots" aria-hidden="true"><i></i><i></i><i></i></span><span class="sr-only">Le coach écrit</span><small class="wait-note" aria-live="polite"></small></div>'
        : `<div class="msg${m.me ? ' msg--me' : ''}"><b>${m.me ? 'Toi' : 'Coach'}</b>${m.ai ? ai(m.t) : esc(m.t)}</div>`)).join('')
      : '<p class="empty">Aucun message pour l’instant. Essaie : « Par quoi remplacer le squat ? », « J’ai faim le soir », « Je suis fatigué aujourd’hui ».</p>';
    return `<header class="hello"><div><h1 class="h1">Ton coach</h1><p class="lede">${AI.ready ? 'Pose une question sur ta séance, ton assiette ou tes défis. Le coach IA répond à partir de ton profil.' : 'Pose une question sur ta séance, ton assiette ou tes défis. Les réponses de ce prototype sont écrites à l’avance.'}</p></div></header>
      <article class="card card--coach chat-card">
        <div class="chat" id="chat" role="log" aria-label="Conversation avec le coach">${msgs}</div>
        <form class="chat-form" id="chat-form"><input class="input" id="chat-input" type="text" aria-label="Ton message" placeholder="Écris ta question" autocomplete="off" required><button class="btn" type="submit">${icon('send')}Envoyer</button></form>
      </article>${foot()}`;
  }

  /* ---------- Install as an app (PWA) ---------- */
  let installEvt = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; if (ui.view === 'profil') render(); });
  window.addEventListener('appinstalled', () => { installEvt = null; toast('Kin Fit est installée.'); if (ui.view === 'profil') render(); });
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function installCard() {
    let body;
    if (standalone()) body = '<p>Kin Fit est installée sur cet appareil. Elle fonctionne aussi hors connexion.</p>';
    else if (installEvt) body = `<p>Ajoute Kin Fit à ton écran d’accueil : elle s’ouvre en plein écran et fonctionne hors connexion.</p><div class="actions"><button type="button" class="btn" data-act="install">${icon('share')}Installer l’app</button></div>`;
    else if (isIOS()) body = '<p>Sur iPhone : ouvre Kin Fit dans Safari, touche le bouton Partager, puis « Sur l’écran d’accueil ».</p>';
    else body = '<p>Ouvre Kin Fit dans Chrome, Edge ou Safari, puis choisis « Installer l’application » ou « Ajouter à l’écran d’accueil » dans le menu du navigateur.</p>';
    return `<article class="card"><header class="card-head"><span class="chip-ico">${icon('home')}</span><div><h2 class="h2">Installer l’app</h2></div></header>${body}</article>`;
  }

  /* ---------- Account (Supabase, see cloud.js) ---------- */

  const CLOUD_ERR = {
    pseudo_taken: 'Ce pseudo est déjà pris. Essaie une variante.',
    pseudo_invalid: 'Pseudo de 3 à 20 caractères : lettres, chiffres, point, tiret ou tiret bas.',
    not_found: 'Aucun compte avec ce pseudo. Vérifie l’orthographe.',
    network: 'Pas de connexion. Réessaie quand tu as du réseau.',
    offline: 'Le service de comptes ne répond pas. Réessaie plus tard.',
  };
  const cloudErr = (e) => CLOUD_ERR[e && e.code] || 'Ça n’a pas marché. Réessaie dans un moment.';

  // What the account keeps: the whole session, minus device-only bits; shared challenges live on the server.
  function cloudState(sess) {
    const s = JSON.parse(JSON.stringify(sess)); delete s.id; delete s.uid; delete s.cloudAt;
    s.inbox = (s.inbox || []).filter((x) => !x.cloud);
    s.prefs = { lang: window.NA_I18N.lang, country: window.NA_I18N.prefs.country || '' };
    return s;
  }

  let pushTimer = null;
  function cloudPush(now) {
    const sess = cur();
    if (!CLOUD.linked || !sess || sess.uid !== CLOUD.user.id) return Promise.resolve();
    clearTimeout(pushTimer);
    const run = () => CLOUD.push(cloudState(sess)).then((at) => {
      if (!at) return; sess.cloudAt = at; ui.syncAt = new Date(at).toLocaleTimeString(window.NA_I18N.locale, { hour: '2-digit', minute: '2-digit' });
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* in-memory only */ }
    }).catch(() => { /* offline: the next save retries */ });
    if (now) return run();
    pushTimer = setTimeout(run, 2500); return Promise.resolve();
  }

  function adopt(sess, remote, at) {
    const keep = { id: sess.id, uid: sess.uid, inbox: (sess.inbox || []).filter((x) => x.cloud) };
    Object.keys(sess).forEach((k) => { delete sess[k]; });
    Object.assign(sess, JSON.parse(JSON.stringify(remote)), keep, { cloudAt: at });
    migrate(sess); delete sess.prefs;
    if (remote.prefs && remote.prefs.country && !window.NA_I18N.prefs.country) window.NA_I18N.set(remote.prefs);
  }

  // Ties the signed-in account to a session on this device; the newest copy wins.
  async function linkAccount() {
    const u = CLOUD.user; const pr = CLOUD.profile;
    if (!u || !pr) { if (ui.view === 'profil' || ui.ob) render(); return; }
    const remote = pr.state && pr.state.profile ? pr.state : null;
    let sess = state.sessions.find((x) => x.uid === u.id);
    if (!sess) {
      const c = cur();
      if (!remote) { if (c) { c.uid = u.id; save(); await cloudPush(true); } render(); return refreshSocial(); }
      const untouched = (x) => !x.points && !Object.keys(x.done || {}).length;
      if (c && !c.uid && untouched(c)) sess = c;
      else { sess = migrate({ id: `s${Date.now()}`, seed: 0, profile: remote.profile }); state.sessions.push(sess); }
      sess.uid = u.id; adopt(sess, remote, pr.updated_at); state.current = sess.id; ui.ob = null;
      toast(`Progression de ${pr.pseudo} récupérée.`);
    } else if (remote && pr.updated_at > (sess.cloudAt || '')) adopt(sess, remote, pr.updated_at);
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* in-memory only */ }
    if (!document.activeElement.matches('input, textarea, select')) render();
    refreshSocial();
  }

  async function refreshSocial() {
    if (!CLOUD.linked) { ui.friends = null; return; }
    try {
      const [fr, ch] = await Promise.all([CLOUD.friends(), CLOUD.challenges()]);
      ui.friends = fr || [];
      const sess = state.sessions.find((x) => x.uid === CLOUD.user.id);
      if (sess) {
        const me = CLOUD.profile.pseudo; const prev = new Map(sess.inbox.filter((x) => x.cloud).map((x) => [x.id, x]));
        const items = (ch || []).map((c) => {
          const old = prev.get(c.id); const mine = Math.max(c.my_progress || 0, old ? old.progress || 0 : 0);
          if (old && (old.progress || 0) > (c.my_progress || 0)) CLOUD.setProgress(c.id, old.progress).catch(() => {});
          const status = old && old.status === 'accepted' ? 'accepted' : c.my_status === 'invited' ? 'new' : 'accepted';
          return { id: c.id, cloud: true, cid: c.cid, title: c.title, unit: c.unit, target: c.target, cat: c.cat, icon: c.icon, steps: c.steps, msg: c.msg, from: c.from_pseudo, self: c.from_pseudo === me, status, progress: mine, members: c.members || [], at: String(c.created_at).slice(0, 10) };
        });
        sess.inbox = [...items, ...sess.inbox.filter((x) => !x.cloud)];
        if (sess === cur()) settle(sess, true); else save();
      }
      if (['defis', 'profil', 'today'].includes(ui.view) && !ui.ob && !document.activeElement.matches('input, textarea, select')) render();
    } catch (e) { /* offline: keep what we have */ }
  }

  const loginForm = () => `<form id="login-form" class="ai-block" novalidate>
      <div class="field"><label for="login-email">Ton e-mail</label><input class="input" id="login-email" type="email" autocomplete="email" inputmode="email" placeholder="prenom@exemple.fr"></div>
      <div class="actions"><button type="submit" class="btn">Recevoir le lien de connexion</button>${CLOUD.google ? '<button type="button" class="btn btn--ghost" data-act="login-google">Continuer avec Google</button>' : ''}</div>
      <p class="hint ai-status" id="login-status" role="status"></p></form>`;

  function accountCard(sess) {
    if (!CLOUD.enabled) return '';
    const u = CLOUD.user; const pr = CLOUD.profile; let body;
    if (!u) body = `<p>Facultatif et gratuit : sauvegarde ta progression, retrouve-la sur tous tes appareils et défie tes amis où qu’ils soient. Pas de mot de passe : tu reçois un lien par e-mail.</p>${loginForm()}`;
    else if (!pr) body = `<form id="pseudo-form" class="ai-block" novalidate><p>Connecté avec ${esc(u.email || 'ton compte')}. Choisis ton pseudo : c’est lui que tes amis chercheront.</p>
        <div class="field"><label for="pseudo">Pseudo</label><input class="input" id="pseudo" type="text" maxlength="20" autocomplete="nickname" autocapitalize="off" spellcheck="false" placeholder="adil_fit"><p class="hint">3 à 20 caractères : lettres, chiffres, point, tiret ou tiret bas.</p></div>
        <label class="consent"><input type="checkbox" id="consent"><span>J’accepte que Kin Fit enregistre mon profil sportif et ma progression, y compris des données de santé (poids, douleurs, allergies), pour me les rendre sur mes appareils. Je peux les exporter ou les supprimer à tout moment. <a href="confidentialite.html" target="_blank" rel="noopener">Politique de confidentialité</a></span></label>
        <div class="actions"><button type="submit" class="btn">Créer mon compte</button><button type="button" class="btn btn--ghost" data-act="logout">Se déconnecter</button></div>
        <p class="hint ai-status" id="pseudo-status" role="status"></p></form>`;
    else body = `<div class="ai-block"><p><b>${esc(pr.pseudo)}</b> · ${esc(u.email || '')}</p>
        <p class="hint">${sess.uid === u.id ? `Progression sauvegardée${ui.syncAt ? ` à ${ui.syncAt}` : ''}.` : 'Ce compte est lié à une autre session de cet appareil.'}</p>
        <div class="actions"><button type="button" class="btn btn--ghost" data-act="sync-now">Synchroniser</button><button type="button" class="btn btn--ghost" data-act="export">Exporter mes données</button><button type="button" class="btn btn--ghost" data-act="logout">Se déconnecter</button></div>
        ${ui.confirmDeleteAccount ? `<div class="note" role="alertdialog" aria-label="Confirmer la suppression du compte"><p>Supprimer définitivement le compte ${esc(pr.pseudo)} ? Sa sauvegarde, ses amis et ses défis partagés seront effacés. Les données de cet appareil restent.</p><div class="actions"><button type="button" class="btn" data-act="account-delete-yes">Supprimer mon compte</button><button type="button" class="btn btn--ghost" data-act="account-delete-no">Garder</button></div></div>`
          : '<div class="actions"><button type="button" class="btn btn--danger" data-act="account-delete">Supprimer mon compte</button></div>'}
        <p class="hint"><a href="confidentialite.html" target="_blank" rel="noopener">Politique de confidentialité</a></p></div>`;
    return `<article class="card ai-card"><header class="card-head"><span class="chip-ico">${icon('user')}</span><div><h2 class="h2">Compte Kin Fit</h2><p class="muted">${u ? (pr ? 'Connecté' : 'Encore une étape') : 'Facultatif'}</p></div></header>${body}</article>`;
  }

  function friendsBlock() {
    if (!CLOUD.enabled) return '';
    const head = (sub) => `<header class="card-head"><span class="chip-ico">${icon('user')}</span><div><h2 class="h2">Tes amis Kin Fit</h2><p class="muted">${sub}</p></div></header>`;
    if (!CLOUD.linked) return `<article class="card friends">${head('Avec un compte gratuit')}<p>Ajoute des amis par leur pseudo, lance-leur des défis et suis leur progression, où qu’ils soient.</p><div class="actions"><button type="button" class="btn btn--amis" data-view="profil">Créer mon compte</button></div></article>`;
    const fr = ui.friends || []; const inc = fr.filter((f) => f.status === 'pending' && f.incoming); const out = fr.filter((f) => f.status === 'pending' && !f.incoming); const ok = fr.filter((f) => f.status === 'accepted');
    const av = (p) => `<span class="avatar">${esc(p.slice(0, 1).toUpperCase())}</span>`;
    return `<article class="card friends">${head(`Ton pseudo : ${esc(CLOUD.profile.pseudo)}`)}
      <form id="friend-form" class="friend-add" novalidate><label class="sr-only" for="friend-pseudo">Pseudo de ton ami</label><input class="input" id="friend-pseudo" type="text" maxlength="20" autocapitalize="off" spellcheck="false" placeholder="Pseudo de ton ami"><button type="submit" class="btn btn--amis">${icon('plus')}Ajouter</button></form>
      <p class="hint ai-status" id="friend-status" role="status"></p>
      ${inc.length ? `<ul class="session-list">${inc.map((f) => `<li>${av(f.pseudo)}<span><b>${esc(f.pseudo)}</b><small>veut être ton ami</small></span><span class="actions"><button type="button" class="btn btn--amis" data-faccept="${f.friendship_id}">Accepter</button><button type="button" class="btn btn--ghost" data-fremove="${f.friendship_id}">Refuser</button></span></li>`).join('')}</ul>` : ''}
      ${ok.length ? `<ul class="session-list">${ok.map((f) => `<li>${av(f.pseudo)}<span><b>${esc(f.pseudo)}</b><small>Ami</small></span><button type="button" class="link-btn" data-fremove="${f.friendship_id}">Retirer</button></li>`).join('')}</ul>` : '<p class="empty">Ajoute un ami avec son pseudo : il recevra ta demande.</p>'}
      ${out.length ? `<p class="hint">En attente de réponse : ${out.map((f) => esc(f.pseudo)).join(', ')}</p>` : ''}
    </article>`;
  }

  /* ---------- Coach IA settings (per device) ---------- */

  const AI_ERR = {
    bad_key: 'Google refuse cette clé. Vérifie que tu l’as copiée en entier, sans espace.',
    forbidden: 'Google refuse l’accès avec cette clé : région, facturation ou projet non autorisé. Vérifie ton compte sur Google AI Studio.',
    rate_limited: 'Quota gratuit atteint pour le moment. Réessaie dans quelques minutes.',
    model: 'Le modèle Gemini prévu n’est pas disponible pour cette clé.',
    network: 'Pas de connexion à Google. Vérifie ta connexion Internet.',
    timeout: 'Google met trop de temps à répondre. Réessaie.',
    webgpu: 'Ton navigateur ne permet pas encore l’IA sur l’appareil (WebGPU indisponible). Essaie Chrome ou Edge récents.',
    local: 'Le téléchargement du modèle a échoué. Vérifie ta connexion et l’espace libre, puis réessaie.',
  };
  const aiErr = (e) => AI_ERR[e && e.code] || 'Ça n’a pas marché. Réessaie dans un moment.';
  const localProgress = (r) => `Chargement du modèle sur ton appareil : ${Math.round((r.progress || 0) * 100)} %`;

  function aiSettingsCard(sess) {
    const c = AI.config; const cur0 = AI.provider;
    const pick = ui.aiPick || (c.provider && c.provider !== 'server' ? c.provider : cur0);
    const minor = +sess.profile.age < 18;
    const opt = (v, title, desc, dis) => `<label class="choice choice--block"><input type="radio" name="aiprov" value="${v}"${pick === v ? ' checked' : ''}${dis ? ' disabled' : ''}><span><b>${title}</b><small>${desc}</small></span></label>`;
    const now = { none: 'sans IA, exemples de l’app', gemini: 'Gemini, avec ta clé', local: 'IA sur ton appareil (coach)', server: 'serveur Kin Fit' }[cur0];
    const gemini = `<form id="gemini-form" class="ai-block" novalidate>
        <ol class="ai-steps"><li>Ouvre <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener">Google AI Studio</a> avec ton compte Google.</li><li>Touche « Create API key », puis copie la clé.</li><li>Colle-la ici et touche Connecter. Kin Fit vérifie qu’elle marche.</li></ol>
        <div class="field"><label for="gemini-key">Ta clé Gemini</label><input class="input" id="gemini-key" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${c.key ? 'Clé enregistrée sur cet appareil' : 'Colle ta clé ici'}"></div>
        <div class="actions"><button type="submit" class="btn">${c.key ? 'Changer de clé' : 'Connecter'}</button>${c.key ? '<button type="button" class="btn btn--ghost" data-act="gemini-forget">Retirer la clé</button>' : ''}</div>
        <p class="hint ai-status" id="gemini-status" role="status">${cur0 === 'gemini' ? 'Gemini est connecté sur cet appareil.' : ''}</p>
        <div class="note ai-terms"><p><b>À savoir avant de connecter.</b> Ton profil (âge, taille, poids, objectif, sport, restrictions, alimentation) part directement de ton appareil vers Google, avec ta clé. Kin Fit ne voit ni ta clé ni les réponses.</p>
          <p>Avec l’offre gratuite, Google peut utiliser ces échanges pour améliorer ses services et les faire relire par des personnes : n’écris pas de détails médicaux.</p>
          <p>Google réserve son API aux 18 ans et plus. Dans l’Union européenne, au Royaume-Uni et en Suisse, il demande un compte Google avec facturation activée pour ce type d’usage : l’éventuel coût est alors facturé sur ton compte Google, jamais par Kin Fit.</p>
          <p>La clé reste enregistrée sur cet appareil. Sur un appareil partagé, retire-la après usage.</p></div>
      </form>`;
    const local = !AI.webgpu ? `<p class="note">${AI_ERR.webgpu}</p>`
      : `<div class="ai-block"><p>Modèle open source Qwen 2.5 (1,5 milliard de paramètres) qui tourne dans ton navigateur. Il répond aux questions du coach ; programmes et repas restent ceux de l’app.</p>
        ${c.local ? `<p class="hint ai-status">${cur0 === 'local' ? 'Le modèle est téléchargé et actif sur cet appareil.' : 'Le modèle est déjà téléchargé.'}</p>${cur0 === 'local' ? '' : '<div class="actions"><button type="button" class="btn" data-act="local-use">Utiliser l’IA sur l’appareil</button></div>'}`
        : `<div class="actions"><button type="button" class="btn" data-act="local-load">Télécharger le modèle (environ 1 Go)</button></div>`}
        <div class="ai-progress" id="local-progress" hidden><progress max="1" value="0"></progress><p class="hint" id="local-status" role="status"></p></div>
        <p class="hint">Rien ne quitte ton appareil. Wi-Fi conseillé pour le premier téléchargement, ensuite ça marche hors connexion. Les réponses sont plus simples qu’avec Gemini et peuvent être lentes sur un téléphone ancien.</p></div>`;
    return `<article class="card ai-card"><header class="card-head"><span class="chip-ico">${icon('star')}</span><div><h2 class="h2">Coach IA</h2><p class="muted">Sur cet appareil : ${now}</p></div></header>
      <fieldset><legend class="sr-only">Source de l’IA</legend><div class="choices choices--stack">
        ${opt('none', 'Sans IA', 'Programmes, repas et coach d’exemple, calculés dans ton navigateur. Gratuit et hors connexion.')}
        ${opt('gemini', 'Gemini, avec ta clé Google', minor ? 'Réservé aux 18 ans et plus par Google.' : 'Programmes, repas et coach écrits par Gemini, avec ta propre clé créée sur Google AI Studio.', minor)}
        ${opt('local', 'IA sur ton appareil', 'Le coach répond sans rien envoyer sur Internet. Premier téléchargement d’environ 1 Go.', false)}
        ${AI.serverReady ? opt('server', 'Serveur Kin Fit', 'L’IA du site Kin Fit, si elle est activée.', false) : ''}
      </div></fieldset>
      ${pick === 'gemini' && !minor ? gemini : ''}${pick === 'local' ? local : ''}
    </article>`;
  }

  function viewProfil(sess) {
    const p = sess.profile;
    return `<header class="hello"><div><h1 class="h1">${esc(p.prenom)}</h1><p class="lede">Ta session est enregistrée dans ce navigateur. Chaque personne a la sienne, et vous pouvez vous lancer des défis.</p></div>${scorebar(sess)}</header>
      <div class="today-grid">
        <article class="card"><header class="card-head"><span class="chip-ico">${icon('user')}</span><div><h2 class="h2">Mon profil</h2></div></header>${profileFacts(p, false)}
          <p><b>Petit-déjeuner :</b> ${PDJ[p.petitdej]}. <b>Alimentation :</b> ${esc(M.summary(p))}. <b>À éviter :</b> ${p.eviter.length ? esc(p.eviter.map((a) => ALLERG[a]).join(', ')) : 'rien de signalé'}. <b>Restrictions :</b> ${p.restrictions.trim() ? esc(p.restrictions) : 'aucune'}.</p>
          <div class="actions"><button type="button" class="btn" data-act="edit">Modifier mon profil</button><button type="button" class="btn btn--ghost" data-act="new">Nouvelle session</button></div></article>
        ${accountCard(sess)}
        ${aiSettingsCard(sess)}
        ${installCard()}
        <article class="card"><header class="card-head"><span class="chip-ico">${icon('user')}</span><div><h2 class="h2">Langue et pays</h2></div></header>
          <form id="prefs-form" class="stack" novalidate>${langCountryFields(window.NA_I18N)}<div class="actions"><button type="submit" class="btn btn--ghost">Enregistrer</button></div></form></article>
        <article class="card"><header class="card-head"><span class="chip-ico">${icon('album')}</span><div><h2 class="h2">Sessions sur cet appareil</h2></div></header>
          <ul class="session-list">${state.sessions.map((s) => `<li><span class="avatar">${esc(s.profile.prenom.slice(0, 1).toUpperCase())}</span><span><b>${esc(s.profile.prenom)}</b><small>${esc(sportName(s.profile))} · ${s.points} pts · ${rangOf(s.points).n}</small></span>${s.id === sess.id ? '<span class="tag">Active</span>' : `<button type="button" class="btn btn--ghost" data-switch="${s.id}">Ouvrir</button>`}</li>`).join('')}</ul>
          ${ui.confirmDelete ? `<div class="note" role="alertdialog" aria-label="Confirmer la suppression"><p>Supprimer définitivement la session de ${esc(p.prenom)} ? Son programme, son album et ses messages seront effacés.</p><div class="actions"><button type="button" class="btn" data-act="delete-yes">Supprimer</button><button type="button" class="btn btn--ghost" data-act="delete-no">Garder</button></div></div>` : `<div class="actions"><button type="button" class="btn btn--danger" data-act="delete">Supprimer la session de ${esc(p.prenom)}</button></div>`}
        </article>
      </div>${foot()}`;
  }

  /* ---------- Launch dialog ---------- */

  function openLaunch() {
    const sess = cur(); if (!sess) return;
    const others = state.sessions.filter((s) => s.id !== sess.id);
    const pals = CLOUD.linked ? (ui.friends || []).filter((f) => f.status === 'accepted') : [];
    let dlg = $('#launch'); if (dlg) dlg.remove();
    dlg = document.createElement('dialog'); dlg.id = 'launch'; dlg.className = 'dlg'; dlg.setAttribute('aria-labelledby', 'launch-title');
    dlg.innerHTML = `<form method="dialog" id="launch-form" class="dlg-body">
      <header class="dlg-head"><h2 class="h2" id="launch-title">Lancer un défi</h2><button type="button" class="round" data-act="launch-close" aria-label="Fermer">${icon('x')}</button></header>
      <fieldset><legend>Choisis le défi</legend><div class="pick">${SOCIAL.map((c, i) => `<label class="pick-item defi--${c.cat}"><input type="radio" name="cid" value="${c.cid}"${i === 0 ? ' checked' : ''}><span class="chip-ico">${icon(c.icon)}</span><span>${esc(c.title)}</span></label>`).join('')}</div></fieldset>
      <fieldset><legend>À qui ?</legend>${others.length ? `<div class="choices">${others.map((s) => `<label class="choice"><input type="checkbox" name="to" value="${s.id}"><span>${esc(s.profile.prenom)}</span></label>`).join('')}</div><p class="hint">Les sessions de cet appareil le reçoivent tout de suite. Pour quelqu’un d’autre, partage le lien.</p>` : '<p class="hint">Aucune autre session sur cet appareil : partage le lien avec qui tu veux.</p>'}</fieldset>
      ${pals.length ? `<fieldset><legend>Tes amis Kin Fit</legend><div class="choices">${pals.map((f) => `<label class="choice"><input type="checkbox" name="friend" value="${f.friend_id}" data-pseudo="${esc(f.pseudo)}"><span>${esc(f.pseudo)}</span></label>`).join('')}</div><p class="hint">Ils le reçoivent sur leur téléphone et vous voyez la progression de chacun.</p></fieldset>` : ''}
      <div class="field"><label for="launch-msg">Un mot pour motiver (facultatif)</label><input type="text" id="launch-msg" name="msg" maxlength="120" placeholder="Exemple : Cap ou pas cap ?"></div>
      <p class="error" id="launch-error" role="alert"></p>
      <div class="dlg-actions">${others.length || pals.length ? `<button type="button" class="btn btn--amis" data-act="launch-send">${icon('send')}Envoyer</button>` : ''}<button type="button" class="btn btn--ghost" data-act="launch-share">${icon('share')}Partager le lien</button></div>
    </form>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('close', () => dlg.remove());
    dlg.showModal();
  }

  function openGive(id) {
    const sess = cur(); const st = STICKERS.find((x) => x.id === id); if (!sess || !st) return;
    const others = state.sessions.filter((x) => x.id !== sess.id);
    let dlg = $('#give'); if (dlg) dlg.remove();
    dlg = document.createElement('dialog'); dlg.id = 'give'; dlg.className = 'dlg'; dlg.setAttribute('aria-labelledby', 'give-title');
    dlg.innerHTML = `<form method="dialog" id="give-form" class="dlg-body">
      <header class="dlg-head"><h2 class="h2" id="give-title">Donner un doublon</h2><button type="button" class="round" data-act="give-close" aria-label="Fermer">${icon('x')}</button></header>
      <div class="give-stk">${stickerArt(st, STICKERS.indexOf(st) + 1, true)}<p>Tu as ${(sess.dupes[id] || 0) + 1} exemplaires de la médaille <b>${esc(st.n)}</b>. Donne le doublon à quelqu’un de cet appareil : elle rejoint ses trophées s’il ne l’a pas encore.</p></div>
      <fieldset><legend>À qui ?</legend><div class="choices">${others.map((x, i) => `<label class="choice"><input type="radio" name="to" value="${x.id}"${i === 0 ? ' checked' : ''}><span>${esc(x.profile.prenom)}${x.stickers.includes(id) ? '' : ' · ne l’a pas'}</span></label>`).join('')}</div></fieldset>
      <input type="hidden" name="sid" value="${id}">
      <div class="dlg-actions"><button type="button" class="btn btn--amis" data-act="give-send">${icon('send')}Donner</button></div>
    </form>`;
    document.body.appendChild(dlg);
    dlg.addEventListener('close', () => dlg.remove());
    dlg.showModal();
  }

  function createChallenge(sess, toNames) {
    const f = $('#launch-form'); const fd = new FormData(f);
    const c = SOCIAL.find((x) => x.cid === fd.get('cid'));
    const msg = String(fd.get('msg') || '').trim().slice(0, 120);
    const id = `d${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    const base = { id, cid: c.cid, title: c.title, unit: c.unit, target: c.target, cat: c.cat, icon: c.icon, steps: c.steps, msg, progress: 0, at: iso(TODAY) };
    addToInbox(sess, { ...base, from: sess.profile.prenom, self: true, status: 'accepted' });
    sess.sent.unshift({ id, title: c.title, to: toNames, at: iso(TODAY) });
    return base;
  }

  /* ---------- Onboarding ---------- */

  const STEPS = ['Ton profil', 'Ton niveau', 'Ton sport', 'Ton alimentation', 'Tes repas'];
  const radio = (name, val, label, curv) => `<label class="choice"><input type="radio" name="${name}" value="${val}"${curv === val ? ' checked' : ''}><span>${label}</span></label>`;
  const check = (name, val, label, list) => `<label class="choice"><input type="checkbox" name="${name}" value="${val}"${list.includes(val) ? ' checked' : ''}><span>${label}</span></label>`;
  const num = (id, label, unit, v, min, max) => `<div class="field"><label for="${id}">${label}</label><div class="unit"><input type="number" id="${id}" name="${id}" inputmode="numeric" min="${min}" max="${max}" value="${esc(v)}" required><span>${unit}</span></div></div>`;

  function stepFields(o) {
    const p = o.p;
    if (o.step === 0) return `
      <div class="field"><label for="prenom">Prénom</label><input type="text" id="prenom" name="prenom" value="${esc(p.prenom)}" autocomplete="given-name" required></div>
      <fieldset><legend>Sexe</legend><div class="choices">${radio('sexe', 'femme', 'Femme', p.sexe)}${radio('sexe', 'homme', 'Homme', p.sexe)}</div></fieldset>
      <div class="row">${num('age', 'Âge', 'ans', p.age, 14, 90)}${num('taille', 'Taille', 'cm', p.taille, 120, 230)}${num('poids', 'Poids', 'kg', p.poids, 35, 220)}</div>
      <fieldset><legend>Objectif</legend><div class="choices">${Object.entries(OBJECTIFS).map(([k, l]) => radio('objectif', k, l, p.objectif)).join('')}</div></fieldset>`;
    if (o.step === 1) return `
      <div class="field"><label for="niveau">Niveau sportif : <output id="niveau-out">${lvLabel(p.niveau)}</output></label><input type="range" id="niveau" name="niveau" min="0" max="100" value="${p.niveau}"><p class="hint">De débutant à avancé. Tu pourras l’ajuster à tout moment.</p></div>
      <fieldset><legend>Séances par semaine</legend><div class="choices">${[2, 3, 4, 5, 6].map((n) => radio('seances', String(n), String(n), String(p.seances))).join('')}</div></fieldset>
      <fieldset><legend>Durée d’une séance, échauffement compris</legend><div class="choices">${DUREES.map((n) => radio('duree', String(n), `${n} min`, String(durOf(p)))).join('')}</div></fieldset>
      <fieldset><legend>Matériel disponible (plusieurs choix possibles)</legend><div class="choices">${Object.entries(MATERIEL).map(([k, l]) => check('materiel', k, l, p.materiel)).join('')}</div></fieldset>
      <div class="field"><label for="restrictions">Pathologies, douleurs ou restrictions (facultatif)</label><textarea id="restrictions" name="restrictions" placeholder="Exemple : douleur au genou droit">${esc(p.restrictions)}</textarea></div>`;
    if (o.step === 2) return `
      <fieldset><legend>Ton ou tes sports (le premier coché oriente le programme et ton défi sport)</legend><div class="choices choices--sport">${SPORTS.map((s) => `<label class="choice"><input type="checkbox" name="sports" value="${s}"${p.sports.includes(s) ? ' checked' : ''}><span>${icon(SPORT_ICON[s] || 'bolt')}${s === 'JJB' ? 'JJB (Jiu-Jitsu Brésilien)' : s}</span></label>`).join('')}</div></fieldset>
      <div class="field"><label for="autre">Autre sport (facultatif)</label><input type="text" id="autre" name="autre" value="${esc(p.autre)}" placeholder="Exemple : escalade"></div>`;
    if (o.step === 3) return `
      <fieldset><legend>Ton régime</legend><div class="choices">${Object.entries(M.REGIMES).map(([k, l]) => radio('regime', k, l, p.regime || 'omni')).join('')}</div></fieldset>
      <fieldset><legend>Pratiques alimentaires (facultatif)</legend><div class="choices">${Object.entries(M.PRATIQUES).map(([k, l]) => check('pratiques', k, l, p.pratiques || [])).join('')}</div><p class="hint">Halal et casher : les viandes proposées sont indiquées comme certifiées, jamais de porc. Casher : pas de crustacés ni de plat mêlant viande et produit laitier.</p></fieldset>
      <fieldset><legend>Allergies et intolérances (facultatif)</legend><div class="choices">${Object.entries(ALLERG).map(([k, l]) => check('eviter', k, l, p.eviter)).join('')}</div><p class="hint">Aucun plat proposé ne contiendra ces aliments. En cas d’allergie sévère, vérifie toujours les étiquettes.</p></fieldset>`;
    return `
      <fieldset><legend>Type de petit-déjeuner (obligatoire)</legend><div class="choices choices--big">
        <label class="choice"><input type="radio" name="petitdej" value="sale"${p.petitdej === 'sale' ? ' checked' : ''}><span><b>Salé</b><small>Œufs, pain complet, avocat</small></span></label>
        <label class="choice"><input type="radio" name="petitdej" value="sucre"${p.petitdej === 'sucre' ? ' checked' : ''}><span><b>Sucré</b><small>Avoine, yaourt, fruits</small></span></label>
        <label class="choice"><input type="radio" name="petitdej" value="mixte"${p.petitdej === 'mixte' ? ' checked' : ''}><span><b>Sucré-salé</b><small>Œufs, pain, pomme, miel</small></span></label>
      </div><p class="hint">Les ingrédients sont remplacés automatiquement selon ton alimentation.</p></fieldset>
      <fieldset><legend>Ton budget courses</legend><div class="choices">${Object.entries(M.BUDGETS).map(([k, l]) => radio('budget', k, l, p.budget || 'moyen')).join('')}</div><p class="hint">Budget serré : les ingrédients chers sont remplacés par des équivalents économiques, de saison ou surgelés.</p></fieldset>
      <fieldset><legend>Repas plaisir par semaine</legend><div class="choices">${[['0', 'Aucun'], ['1', 'Un'], ['2', 'Deux']].map(([k, l]) => radio('cheat', k, l, String(p.cheat ?? 1))).join('')}</div><p class="hint">Un cheat meal planifié aide à tenir sur la durée. Il remplace un dîner le samedi, et un déjeuner le mercredi si tu en choisis deux.</p></fieldset>`;
  }

  function langCountryFields(I) {
    return `<fieldset><legend>Langue</legend><div class="choices">${['fr', 'en', 'es'].map((l) => `<label class="choice"><input type="radio" name="lang" value="${l}"${I.lang === l ? ' checked' : ''}><span data-no-i18n>${I.LANG_NAMES[l]}</span></label>`).join('')}</div></fieldset>
      <div class="field"><label for="country">Pays</label><select id="country" name="country" class="select" data-no-i18n><option value="">—</option>${I.COUNTRIES.map((c) => `<option value="${c.code}"${I.prefs.country === c.code ? ' selected' : ''}>${esc(I.countryName(c))}</option>`).join('')}</select></div>`;
  }

  function viewWelcome() {
    const I = window.NA_I18N;
    return `<div class="ob">
      <div class="ob-side"><p class="wordmark"><span class="seal" aria-hidden="true">金</span>Kin Fit</p><p class="ob-pitch">Ton programme sport et nutrition, des défis à relever, des médailles à gagner.</p></div>
      <form class="ob-form" id="welcome-form" novalidate>
        <h1 class="h1">Bienvenue</h1>
        <p class="lede">Choisis ta langue et ton pays : on adapte la langue, les plats et les alternatives à ta région.</p>
        ${langCountryFields(I)}
        <p class="error" id="welcome-error" role="alert"></p>
        <div class="ob-actions"><span></span><button type="submit" class="btn btn--big btn--sheen">Commencer</button></div>
      </form></div>`;
  }

  function viewOnboarding() {
    const o = ui.ob;
    const preview = STICKERS.slice(0, 3).map((s, i) => stickerArt(s, i + 1, true)).join('');
    return `<div class="ob">
      <div class="ob-side">
        <p class="wordmark"><span class="seal" aria-hidden="true">金</span>Kin Fit</p>
        <p class="ob-pitch">Ton programme sport et nutrition, des défis à relever, des médailles à gagner.</p>
        <div class="ob-stickers" aria-hidden="true">${preview}</div>
      </div>
      <form class="ob-form" id="ob-form" novalidate>
        <ol class="steps" aria-label="Étapes">${STEPS.map((s, i) => `<li${i === o.step ? ' aria-current="step"' : ''}${i < o.step ? ' class="done"' : ''}><span>${i < o.step ? icon('check') : i + 1}</span>${s}</li>`).join('')}</ol>
        <h1 class="h1" id="ob-title" tabindex="-1">${STEPS[o.step]}</h1>
        ${stepFields(o)}
        <p class="error" id="ob-error" role="alert"></p>
        <div class="ob-actions">
          ${o.step > 0 ? '<button type="button" class="btn btn--ghost" data-act="ob-back">Retour</button>' : (state.sessions.length ? '<button type="button" class="btn btn--ghost" data-act="ob-cancel">Annuler</button>' : '<span></span>')}
          <button type="submit" class="btn btn--big btn--sheen">${o.step === STEPS.length - 1 ? 'Créer mon profil' : 'Continuer'}</button>
        </div>
      </form>${!state.sessions.length && !o.editId && CLOUD.enabled ? `<div class="ob-login">${CLOUD.signedIn && !CLOUD.profile ? '<p class="hint">Ce compte n’a pas encore de profil Kin Fit : termine ces étapes, puis choisis ton pseudo dans Profil.</p>' : `<details><summary>J’ai déjà un compte Kin Fit</summary>${loginForm()}</details>`}</div>` : ''}</div>`;
  }

  function collect() {
    const f = $('#ob-form'); const p = ui.ob.p; const fd = new FormData(f);
    if (ui.ob.step === 0) { p.prenom = (fd.get('prenom') || '').trim(); p.sexe = fd.get('sexe') || ''; ['age', 'taille', 'poids'].forEach((k) => { p[k] = fd.get(k) ? +fd.get(k) : ''; }); p.objectif = fd.get('objectif') || ''; }
    if (ui.ob.step === 1) { p.niveau = +fd.get('niveau'); p.seances = +(fd.get('seances') || 0); p.duree = +(fd.get('duree') || 60); p.materiel = fd.getAll('materiel'); p.restrictions = fd.get('restrictions') || ''; }
    if (ui.ob.step === 2) { p.sports = fd.getAll('sports'); p.autre = (fd.get('autre') || '').trim(); }
    if (ui.ob.step === 3) { p.regime = fd.get('regime') || 'omni'; p.pratiques = fd.getAll('pratiques'); p.eviter = fd.getAll('eviter'); }
    if (ui.ob.step === 4) { p.petitdej = fd.get('petitdej') || ''; p.cheat = +(fd.get('cheat') ?? 1); p.budget = fd.get('budget') || 'moyen'; }
  }

  function validate() {
    const p = ui.ob.p; const s = ui.ob.step;
    if (s === 0) {
      if (!p.prenom) return 'Indique ton prénom pour créer ta session.';
      if (!p.sexe) return 'Choisis ton sexe : il sert au calcul de tes besoins.';
      if (!(p.age >= 14 && p.age <= 90)) return 'Indique un âge entre 14 et 90 ans.';
      if (!(p.taille >= 120 && p.taille <= 230)) return 'Indique ta taille en centimètres, entre 120 et 230.';
      if (!(p.poids >= 35 && p.poids <= 220)) return 'Indique ton poids en kilos, entre 35 et 220.';
      if (!p.objectif) return 'Choisis un objectif.';
    }
    if (s === 1) {
      if (!p.seances) return 'Choisis ton nombre de séances par semaine.';
      if (!p.materiel.length) return 'Coche au moins un type de matériel. Sans rien, coche « Poids du corps ».';
    }
    if (s === 2 && !p.sports.length && !p.autre) return 'Coche au moins un sport, ou écris le tien dans « Autre sport ».';
    if (s === 4 && !p.petitdej) return 'Choisis un type de petit-déjeuner : salé, sucré ou sucré-salé.';
    return '';
  }

  function finishOnboarding() {
    const o = ui.ob; let sess;
    if (o.editId) { sess = state.sessions.find((x) => x.id === o.editId); sess.profile = o.p; sess.seed += 1; sess.ai = {}; }
    else { sess = migrate({ id: `s${Date.now()}`, seed: 0, profile: o.p }); state.sessions.push(sess); }
    state.current = sess.id; ui.ob = null; ui.view = 'today'; ui.day = todayIdx;
    save();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('#app').classList.add('is-onboarding');
    $('#main').innerHTML = `<div class="loading" role="status"><div class="loading-stk">${stickerArt(STICKERS[0], 1, true, true)}</div><h1 class="h1">On prépare ton programme</h1><p>Programme, petit-déjeuner et premiers défis.</p></div>`;
    setTimeout(() => { settle(sess); ui.printing = true; render(); ui.printing = false; }, reduce ? 300 : 1400);
  }

  /* ---------- Render ---------- */

  function renderRail(sess) {
    $$('[data-view]').forEach((b) => { if (b.closest('.nav')) { if (b.dataset.view === ui.view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); } });
    $('#session-select').innerHTML = state.sessions.map((s) => `<option value="${s.id}"${sess && s.id === sess.id ? ' selected' : ''}>${esc(s.profile.prenom)} · ${esc(sportName(s.profile))}</option>`).join('');
    const n = sess ? sess.inbox.filter((x) => x.status === 'new').length : 0;
    $$('.nav-badge').forEach((b) => { b.textContent = n; b.hidden = !n; });
  }

  function render() {
    const app = $('#app'); const main = $('#main'); const sess = cur();
    // Scoped styling per screen, and the entrance only when the screen changes (not on every re-render).
    const mark = (key) => {
      document.body.dataset.view = key;
      const entering = ui.lastView !== key; ui.lastView = key;
      main.classList.remove('is-entering');
      if (entering) { void main.offsetWidth; main.classList.add('is-entering'); }
    };
    if (!window.NA_I18N.prefs.country) { app.classList.add('is-onboarding'); main.innerHTML = viewWelcome(); mark('welcome'); return; }
    if (!sess && !ui.ob) ui.ob = { step: 0, p: blank(), editId: null };
    if (ui.ob) { app.classList.add('is-onboarding'); main.innerHTML = viewOnboarding(); mark('onboarding'); return; }
    app.classList.remove('is-onboarding');
    const views = { today: viewToday, defis: viewDefis, album: viewAlbum, plan: viewPlan, coach: viewCoach, profil: viewProfil };
    main.classList.toggle('printing', ui.printing);
    main.innerHTML = (views[ui.view] || viewToday)(sess);
    mark(ui.view);
    renderRail(sess);
    const chat = $('#chat'); if (chat) chat.scrollTop = chat.scrollHeight;
  }

  function updateLevel(v) {
    const sess = cur(); if (!sess) return;
    sess.profile.niveau = v; const p = sess.profile;
    $$('[data-w]').forEach((el) => { el.textContent = loadText(variant(E[el.dataset.w], p), p); });
    $$('[data-sr]').forEach((el) => { el.textContent = setsReps(E[el.dataset.sr], p, sess.seed, +el.dataset.i).txt; });
    $$('[data-lv]').forEach((el) => { el.textContent = lvLabel(v); });
    const out = $('#level-out'); if (out) out.textContent = lvLabel(v);
  }

  function coachContext(sess) {
    const it = buildPlan(sess).byDay(todayIdx); const L0 = lg(sess, iso(TODAY));
    return `${DAYS_FULL[todayIdx]} : ${it ? it.title : 'jour de repos'}${L0.status ? ` (${L0.status})` : ''}. Exercices cochés : ${L0.ex.length}. Petit-déjeuner pris : ${L0.pdj ? 'oui' : 'non'}. Verres d’eau : ${L0.eau} sur 8. Points : ${sess.points}.`;
  }

  function reply(text, sess) {
    const t = text.toLowerCase(); const p = sess.profile;
    if (/défi|defi|médaille|trophée|album|point/.test(t)) return 'Chaque défi réussi rapporte des points. Les médailles se gagnent en terminant des séances, en prenant ton petit-déjeuner, en buvant tes 8 verres et en relevant des défis entre amis. Les emplacements vides de tes trophées indiquent comment les obtenir.';
    if (/faim/.test(t)) return 'La faim du soir vient souvent d’un déjeuner trop léger en protéines. Ajoute 100 à 150 g de skyr ou deux œufs à 16 h et garde un dîner complet : légumes, féculent, protéine.';
    if (/fatigu|crev|épuis|dormi/.test(t)) return 'Journée de fatigue : garde la séance mais retire une série à chaque exercice et reste dans le bas des charges. Si tu as dormi moins de six heures, remplace-la par 30 minutes de marche.';
    if (/mal|douleur|bless/.test(t)) return 'Une douleur n’est pas une courbature : arrête l’exercice concerné, garde ceux qui ne déclenchent rien, et consulte si elle persiste. Note-la dans ton profil pour que j’adapte le programme et tes défis.';
    if (/remplac|alternative|à la place/.test(t)) return `Pour remplacer un exercice, garde le même groupe musculaire et le même nombre de séries. Avec ton matériel (${p.materiel.map((m) => MATERIEL[m].toLowerCase()).join(', ')}), dis-moi lequel te gêne et je te propose l’équivalent.`;
    if (/pourquoi/.test(t)) return `Chaque exercice est choisi pour ton sport (${sportName(p)}) et ton objectif (${OBJECTIFS[p.objectif].toLowerCase()}). Ouvre « Pourquoi, technique, vidéo » sous un exercice : la raison y est écrite.`;
    if (/petit|déj|manger|repas|calorie|eau/.test(t)) return `Ton petit-déjeuner couvre environ un quart de tes ${dailyKcal(p)} kcal du jour. Il monte un peu les jours d’entraînement et redescend les jours de repos. Côté eau, vise 8 verres : c’est un défi du jour.`;
    return 'Bien reçu. Dans ce prototype, je réponds à quelques thèmes : les défis et les trophées, la faim, la fatigue, une douleur, remplacer un exercice, le pourquoi d’un choix, ton petit-déjeuner.';
  }

  /* ---------- Events ---------- */

  function go(view) { ui.view = view; ui.confirmDelete = false; if (view === 'defis') refreshSocial(); render(); $('#main').focus({ preventScroll: true }); window.scrollTo(0, 0); }
  function startOnboarding(editId) {
    const s = editId ? state.sessions.find((x) => x.id === editId) : null;
    ui.ob = { step: 0, p: s ? JSON.parse(JSON.stringify(s.profile)) : blank(), editId: editId || null };
    render(); window.scrollTo(0, 0);
  }
  const refocus = (sel) => { const b = $(sel); if (b) b.focus({ preventScroll: true }); };

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (e2) { ok = false; } ta.remove(); return ok;
    }
  }

  async function shareItem(item, sess) {
    const url = shareLink(item, sess);
    const text = `${sess.profile.prenom} te lance un défi sur Kin Fit : ${item.title}${item.msg ? ` « ${item.msg} »` : ''}`;
    if (navigator.share) { try { await navigator.share({ title: 'Un défi pour toi', text, url }); return 'partagé'; } catch (e) { if (e && e.name === 'AbortError') return ''; } }
    return (await copyText(url)) ? 'copié' : '';
  }

  document.addEventListener('click', async (e) => {
    const t = e.target.closest('button'); if (!t) return;
    const sess = cur();
    if (t.dataset.view) return go(t.dataset.view);
    if (t.dataset.goto) { ui.defisTab = t.dataset.goto; return go('defis'); }
    if (t.dataset.tab) { ui.defisTab = t.dataset.tab; render(); return refocus(`[data-tab="${ui.defisTab}"]`); }
    if (t.dataset.circuit) { ui.circuit = t.dataset.circuit; render(); return refocus(`[data-circuit="${ui.circuit}"]`); }
    if (t.dataset.cdur) { ui.circuitDur = +t.dataset.cdur; render(); return refocus(`[data-cdur="${ui.circuitDur}"]`); }
    if (t.dataset.dur && sess) { sess.profile.duree = +t.dataset.dur; save(); render(); return refocus(`[data-dur="${t.dataset.dur}"]`); }
    if (t.dataset.ptab) { ui.planTab = t.dataset.ptab; render(); return refocus(`[data-ptab="${ui.planTab}"]`); }
    if (t.dataset.day != null) { ui.day = +t.dataset.day; render(); return refocus(`[data-day="${ui.day}"]`); }
    if (t.dataset.switch) { state.current = t.dataset.switch; save(); ui.day = todayIdx; return go('today'); }
    if (t.id === 'new-session') return startOnboarding(null);
    if (!sess && !t.dataset.act) return;

    const dayI = ui.view === 'today' ? ui.day : todayIdx;
    const L0 = sess ? lg(sess, iso(dayDate(dayI))) : null;
    if (t.dataset.tap && sess) {
      const a = t.dataset.tap;
      if (a === 'pdj') L0.pdj = !L0.pdj;
      if (a === 'mob') L0.mob = !L0.mob;
      if (a === 'cardio') L0.status = L0.status === 'faite' ? '' : 'faite';
      if (a === 'miss') L0.status = L0.status === 'manquee' ? '' : 'manquee';
      settle(sess); render(); refocus(`[data-tap="${a}"]`); return;
    }
    if (t.dataset.eau && sess) {
      const n = +t.dataset.eau; L0.eau = L0.eau === n ? n - 1 : n;
      settle(sess); render(); refocus(`[data-eau="${n}"]`); return;
    }
    if (t.dataset.step && sess) {
      const n = +t.dataset.step.split('|')[1];
      sess.sportCount[weekId] = Math.max(0, (sess.sportCount[weekId] || 0) + n);
      settle(sess); render(); refocus(`[data-step="${t.dataset.step}"]`); return;
    }
    if (t.dataset.sstep && sess) {
      const [id, v] = t.dataset.sstep.split('|'); const x = sess.inbox.find((y) => y.id === id);
      if (x) { x.progress = Math.max(0, (x.progress || 0) + +v); if (x.cloud) CLOUD.setProgress(x.id, x.progress).catch(() => {}); settle(sess); render(); refocus(`[data-sstep="${t.dataset.sstep}"]`); }
      return;
    }
    if (t.dataset.accept && sess) { const x = sess.inbox.find((y) => y.id === t.dataset.accept); if (x) { x.status = 'accepted'; if (x.cloud) CLOUD.respond(x.id, 'accepted').catch(() => {}); save(); render(); toast('Défi relevé. À toi de jouer !'); } return; }
    if (t.dataset.decline && sess) { const x = sess.inbox.find((y) => y.id === t.dataset.decline); if (x) { x.status = 'declined'; if (x.cloud) CLOUD.respond(x.id, 'declined').catch(() => {}); save(); render(); } return; }
    if (t.dataset.copy && sess) { const x = sess.inbox.find((y) => y.id === t.dataset.copy); if (x) { const r = await shareItem(x, sess); if (r) toast(r === 'copié' ? 'Lien copié. Envoie-le à qui tu veux.' : 'Défi partagé.'); } return; }
    if (t.dataset.give && sess) return openGive(t.dataset.give);
    if (t.dataset.faccept) { try { await CLOUD.acceptFriend(+t.dataset.faccept); toast('Ami ajouté.'); } catch (err) { toast(cloudErr(err)); } return refreshSocial(); }
    if (t.dataset.fremove) { try { await CLOUD.removeFriend(+t.dataset.fremove); } catch (err) { toast(cloudErr(err)); } return refreshSocial(); }
    if (t.dataset.bf && sess) { sess.profile.petitdej = t.dataset.bf; save(); render(); return refocus(`[data-bf="${t.dataset.bf}"]`); }

    const a = t.dataset.act; if (!a) return;
    if (a === 'cele-close') { const c = $('.cele'); if (c) c.remove(); return; }
    if (a === 'launch') return openLaunch();
    if (a === 'install' && installEvt) { installEvt.prompt(); try { await installEvt.userChoice; } catch (err) { /* dismissed */ } installEvt = null; render(); return; }
    if (a === 'shop-reset' && sess) { sess.shop[weekId] = []; save(); render(); return; }
    if (a === 'shop-copy' && sess) { const ok = await copyText(shoppingText(sess)); toast(ok ? 'Liste copiée.' : 'Impossible de copier la liste.'); return; }
    if (a === 'shop-share' && sess) {
      const text = shoppingText(sess);
      if (navigator.share) { try { await navigator.share({ title: window.NA_I18N.t('Liste de courses'), text }); return; } catch (err) { if (err && err.name === 'AbortError') return; } }
      const ok = await copyText(text); toast(ok ? 'Liste copiée.' : 'Impossible de copier la liste.'); return;
    }
    if (a === 'give-close') { const d = $('#give'); if (d) d.close(); return; }
    if (a === 'give-send' && sess) {
      const fd = new FormData($('#give-form')); const id = fd.get('sid'); const to = state.sessions.find((x) => x.id === fd.get('to'));
      if (to && (sess.dupes[id] || 0) > 0) {
        sess.dupes[id] -= 1; to.dupes = to.dupes || {};
        if (to.stickers.includes(id)) to.dupes[id] = (to.dupes[id] || 0) + 1; else to.stickers.push(id);
        save(); $('#give').close(); render(); toast(`Doublon donné à ${to.profile.prenom}.`);
      }
      return;
    }
    if (a === 'launch-close') { const d = $('#launch'); if (d) d.close(); return; }
    if (a === 'launch-send' && sess) {
      const fd = new FormData($('#launch-form')); const ids = fd.getAll('to'); const fids = fd.getAll('friend');
      if (!ids.length && !fids.length) { $('#launch-error').textContent = 'Coche au moins une personne, ou partage le lien.'; return; }
      const names = [];
      if (fids.length) {
        const c = SOCIAL.find((x) => x.cid === fd.get('cid')); const msg = String(fd.get('msg') || '').trim().slice(0, 120);
        const pseudos = [...$$('input[name="friend"]:checked')].map((i) => i.dataset.pseudo);
        t.disabled = true;
        try {
          const id = await CLOUD.createChallenge(c, msg, fids);
          addToInbox(sess, { id, cloud: true, cid: c.cid, title: c.title, unit: c.unit, target: c.target, cat: c.cat, icon: c.icon, steps: c.steps, msg, progress: 0, from: CLOUD.profile.pseudo, self: true, status: 'accepted', members: [], at: iso(TODAY) });
          sess.sent.unshift({ id, title: c.title, to: pseudos.join(', '), at: iso(TODAY) }); names.push(...pseudos);
        } catch (err) { t.disabled = false; $('#launch-error').textContent = 'Le défi n’a pas pu partir. Vérifie ta connexion et réessaie.'; return; }
      }
      if (ids.length) {
        const local = ids.map((id) => state.sessions.find((s) => s.id === id).profile.prenom);
        const base = createChallenge(sess, local.join(', '));
        ids.forEach((id) => { const s = state.sessions.find((x) => x.id === id); addToInbox(s, { ...base, from: sess.profile.prenom, fromSid: sess.id, status: 'new' }); });
        names.push(...local);
      }
      save(); $('#launch').close(); ui.defisTab = 'amis'; settle(sess); go('defis'); toast(`Défi envoyé à ${names.join(', ')}.`); refreshSocial(); return;
    }
    if (a === 'launch-share' && sess) {
      const base = createChallenge(sess, 'lien partagé'); save();
      const r = await shareItem(base, sess);
      const d = $('#launch'); if (d) d.close();
      ui.defisTab = 'amis'; settle(sess); go('defis');
      toast(r === 'copié' ? 'Lien copié. Envoie-le à qui tu veux.' : r ? 'Défi partagé.' : 'Défi créé. Copie son lien depuis « En cours ».');
      return;
    }
    if (a === 'share-accept') {
      const x = state.pendingShare; const c = x && SOCIAL.find((s) => s.cid === x.cid);
      if (sess && c) { addToInbox(sess, { id: x.id, cid: c.cid, title: c.title, unit: c.unit, target: c.target, cat: c.cat, icon: c.icon, steps: c.steps, msg: x.msg, from: x.from, status: 'accepted', progress: 0, at: iso(TODAY) }); }
      state.pendingShare = null; save(); ui.defisTab = 'amis'; go('defis'); toast('Défi relevé. À toi de jouer !'); return;
    }
    if (a === 'share-later') { state.pendingShare = null; save(); render(); return; }
    if (a === 'login-google') { try { await CLOUD.signInGoogle(); } catch (err) { toast(cloudErr(err)); } return; }
    if (a === 'logout') { await CLOUD.signOut().catch(() => {}); ui.friends = null; render(); toast('Déconnecté. Tes données restent sur cet appareil.'); return; }
    if (a === 'sync-now') { await cloudPush(true); await refreshSocial(); render(); toast('Progression synchronisée.'); return; }
    if (a === 'export') {
      try {
        const data = await CLOUD.exportData();
        const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
        const link = document.createElement('a'); link.href = url; link.download = `kin-fit-${CLOUD.profile.pseudo}.json`; document.body.appendChild(link); link.click(); link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 2000);
      } catch (err) { toast(cloudErr(err)); }
      return;
    }
    if (a === 'account-delete') { ui.confirmDeleteAccount = true; render(); return refocus('[data-act="account-delete-no"]'); }
    if (a === 'account-delete-no') { ui.confirmDeleteAccount = false; render(); return; }
    if (a === 'account-delete-yes') {
      try { await CLOUD.deleteAccount(); state.sessions.forEach((x) => { delete x.uid; x.inbox = (x.inbox || []).filter((y) => !y.cloud); }); ui.confirmDeleteAccount = false; ui.friends = null; save(); render(); toast('Compte supprimé. Les données de cet appareil restent.'); }
      catch (err) { toast(cloudErr(err)); }
      return;
    }
    if (a === 'gemini-forget') { AI.setConfig({ provider: 'none', key: '' }); ui.aiPick = 'none'; render(); toast('Clé Gemini retirée de cet appareil.'); return refocus('input[name="aiprov"][value="none"]'); }
    if (a === 'local-use') { AI.setConfig({ provider: 'local' }); render(); toast('IA sur l’appareil activée pour le coach.'); return; }
    if (a === 'local-load') {
      const box = $('#local-progress'); const bar = box && box.querySelector('progress'); const st = $('#local-status');
      if (box) box.hidden = false; t.disabled = true;
      try {
        await AI.loadLocal((r) => { if (bar) bar.value = r.progress || 0; if (st) st.textContent = localProgress(r); });
        AI.setConfig({ provider: 'local' }); ui.aiPick = 'local'; render(); toast('IA sur l’appareil prête pour le coach.');
      } catch (err) { t.disabled = false; if (st) st.textContent = aiErr(err); }
      return;
    }
    if (a === 'parcours') { ui.planTab = 'parcours'; return go('plan'); }
    if (a === 'start') {
      const r = t.getBoundingClientRect(); sparks(r.left + r.width / 2, r.top + r.height / 2, 40, 0.5);
      const card = $('.today-grid .stack > .card'); if (!card) return;
      card.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      const first = card.querySelector('input:not(:checked):not(:disabled), .card-foot .btn'); if (first) setTimeout(() => first.focus({ preventScroll: true }), 450);
      return;
    }
    if (a === 'ai-prog' && sess && !ui.aiBusy) {
      ui.aiBusy = 'prog'; render();
      try { const prog = await AI.programme(sess); sess.ai = { ...sess.ai, prog }; save(); toast('Programme écrit par le coach IA.'); }
      catch (err) { toast('Le coach IA n’a pas pu répondre. Ton programme actuel reste affiché, réessaie plus tard.'); }
      ui.aiBusy = null; render(); return;
    }
    if (a === 'ai-nut' && sess && !ui.aiBusy) {
      ui.aiBusy = 'nut'; render();
      try { const nut = await AI.nutrition(sess, todayIdx, !!buildPlan(sess).byDay(todayIdx)); sess.ai = { ...sess.ai, nut: { ...nut, date: iso(TODAY) } }; save(); toast('Repas du jour écrits par le coach IA.'); }
      catch (err) { toast('Le coach IA n’a pas pu répondre. Tes repas actuels restent affichés, réessaie plus tard.'); }
      ui.aiBusy = null; render(); return;
    }
    if (a === 'ai-prog-clear' && sess && sess.ai) { delete sess.ai.prog; save(); render(); return; }
    if (a === 'ai-nut-clear' && sess && sess.ai) { delete sess.ai.nut; save(); render(); return; }
    if (a === 'regen' && sess) { sess.seed += 1; save(); ui.printing = true; render(); ui.printing = false; }
    if (a === 'print') window.print();
    if (a === 'edit' && sess) startOnboarding(sess.id);
    if (a === 'new') startOnboarding(null);
    if (a === 'delete') { ui.confirmDelete = true; render(); refocus('[data-act="delete-no"]'); }
    if (a === 'delete-no') { ui.confirmDelete = false; render(); }
    if (a === 'delete-yes' && sess) {
      ui.confirmDelete = false;
      state.sessions.forEach((s) => { s.inbox = s.inbox.filter((x) => x.fromSid !== sess.id || x.status !== 'new'); });
      state.sessions = state.sessions.filter((s) => s.id !== sess.id); state.current = state.sessions[0] ? state.sessions[0].id : null; save(); ui.view = 'today'; render();
    }
    if (a === 'ob-back') { collect(); ui.ob.step -= 1; render(); refocus('#ob-title'); }
    if (a === 'ob-cancel') { ui.ob = null; render(); }
  });

  document.addEventListener('change', (e) => {
    const sess = cur();
    if (e.target.matches('[data-ex]') && sess) {
      const L0 = lg(sess, iso(dayDate(ui.day))); const id = e.target.dataset.ex;
      L0.ex = e.target.checked ? [...new Set([...L0.ex, id])] : L0.ex.filter((x) => x !== id);
      if (L0.status === 'manquee' && e.target.checked) L0.status = '';
      settle(sess); render(); refocus(`[data-ex="${id}"]`);
    }
    if (e.target.matches('[data-shop]') && sess) {
      const n = e.target.dataset.shop; const set = new Set(sess.shop[weekId] || []);
      if (e.target.checked) set.add(n); else set.delete(n);
      sess.shop[weekId] = [...set]; save(); render(); refocus(`[data-shop="${CSS.escape(n)}"]`); return;
    }
    if (e.target.matches('[data-level]')) save();
    if (e.target.name === 'aiprov') {
      const v = e.target.value; ui.aiPick = v;
      if (v === 'none' || v === 'server') { AI.setConfig({ provider: v }); toast(v === 'none' ? 'Coach IA désactivé : l’app utilise ses exemples.' : 'Serveur Kin Fit sélectionné.'); }
      else if (v === 'local' && AI.config.local) AI.setConfig({ provider: 'local' });
      render(); return refocus(`input[name="aiprov"][value="${v}"]`);
    }
    if (e.target.name === 'lang' && e.target.closest('#welcome-form')) { window.NA_I18N.set({ lang: e.target.value }); render(); return; }
    if (e.target.id === 'session-select') { state.current = e.target.value; save(); ui.day = todayIdx; go('today'); }
  });

  document.addEventListener('input', (e) => {
    if (e.target.matches('[data-level]')) updateLevel(+e.target.value);
    if (e.target.id === 'niveau') $('#niveau-out').textContent = lvLabel(+e.target.value);
  });

  document.addEventListener('submit', (e) => {
    if (e.target.id === 'launch-form' || e.target.id === 'give-form') { e.preventDefault(); return; }
    if (e.target.id === 'login-form') {
      e.preventDefault(); const email = $('#login-email').value.trim(); const st = $('#login-status'); const btn = e.target.querySelector('[type="submit"]');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { st.textContent = 'Entre une adresse e-mail valide.'; return; }
      btn.disabled = true; st.textContent = 'Envoi du lien…';
      CLOUD.signInEmail(email).then(() => { st.textContent = `Lien envoyé à ${email}. Ouvre-le sur cet appareil pour te connecter (pense à regarder les indésirables).`; })
        .catch((err) => { btn.disabled = false; st.textContent = cloudErr(err); });
      return;
    }
    if (e.target.id === 'pseudo-form') {
      e.preventDefault(); const pseudo = $('#pseudo').value.trim(); const st = $('#pseudo-status'); const sess = cur();
      if (!/^[A-Za-z0-9_.-]{3,20}$/.test(pseudo)) { st.textContent = 'Pseudo de 3 à 20 caractères : lettres, chiffres, point, tiret ou tiret bas.'; return; }
      if (!$('#consent').checked) { st.textContent = 'Coche la case de consentement pour créer ton compte.'; return; }
      st.textContent = 'Création du compte…';
      CLOUD.createProfile(pseudo, sess ? cloudState(sess) : {})
        .then((pr) => { if (sess) { sess.uid = CLOUD.user.id; sess.cloudAt = pr.updated_at; } save(); render(); toast(`Compte ${pseudo} créé. Ta progression est sauvegardée.`); refreshSocial(); })
        .catch((err) => { st.textContent = cloudErr(err); });
      return;
    }
    if (e.target.id === 'friend-form') {
      e.preventDefault(); const p = $('#friend-pseudo').value.trim(); const st = $('#friend-status');
      if (!p) { st.textContent = 'Entre le pseudo de ton ami.'; return; }
      st.textContent = 'Recherche…';
      CLOUD.requestFriend(p).then((f) => { st.textContent = `Demande envoyée à ${f.pseudo}.`; refreshSocial(); }).catch((err) => { st.textContent = cloudErr(err); });
      return;
    }
    if (e.target.id === 'gemini-form') {
      e.preventDefault(); const key = $('#gemini-key').value.trim(); const st = $('#gemini-status'); const btn = e.target.querySelector('[type="submit"]');
      if (!key) { st.textContent = 'Colle d’abord ta clé Gemini.'; return; }
      st.textContent = 'Vérification de la clé auprès de Google…'; btn.disabled = true;
      AI.testGemini(key)
        .then(() => { AI.setConfig({ provider: 'gemini', key }); ui.aiPick = 'gemini'; render(); toast('Gemini est connecté.'); })
        .catch((err) => { btn.disabled = false; st.textContent = aiErr(err); });
      return;
    }
    if (e.target.id === 'welcome-form' || e.target.id === 'prefs-form') {
      e.preventDefault(); const fd = new FormData(e.target); const country = fd.get('country');
      if (!country) { const er = $('#welcome-error'); if (er) er.textContent = 'Choisis ton pays pour continuer.'; return; }
      window.NA_I18N.set({ lang: fd.get('lang') || window.NA_I18N.lang, country }); render(); window.scrollTo(0, 0); return;
    }
    e.preventDefault();
    if (e.target.id === 'ob-form') {
      collect(); const err = validate();
      if (err) { $('#ob-error').textContent = err; return; }
      if (ui.ob.step < STEPS.length - 1) { ui.ob.step += 1; render(); refocus('#ob-title'); window.scrollTo(0, 0); } else finishOnboarding();
    }
    if (e.target.id === 'chat-form') {
      const sess = cur(); const input = $('#chat-input'); const text = input.value.trim(); if (!text || !sess) return;
      sess.chat.push({ me: true, t: text });
      if (!AI.ready) { sess.chat.push({ me: false, t: reply(text, sess) }); save(); render(); refocus('#chat-input'); return; }
      const wait = { me: false, t: '', pending: true }; sess.chat.push(wait); render(); refocus('#chat-input');
      AI.coach(sess, coachContext(sess), (r) => { const n = $('.wait-note'); if (n) n.textContent = localProgress(r); })
        .then((t) => { wait.t = t; wait.ai = true; })
        .catch(() => { wait.t = reply(text, sess); })
        .finally(() => { delete wait.pending; save(); if (ui.view === 'coach' && cur() === sess) { render(); refocus('#chat-input'); } });
    }
  });

  window.addEventListener('hashchange', () => { readShare(); render(); });

  state.sessions.forEach((x) => { x.chat = (x.chat || []).filter((m) => !m.pending); });
  readShare();
  if (state.pendingShare && cur()) ui.view = 'defis';
  if (cur()) settle(cur(), true);
  render();
  if (CLOUD.enabled) {
    CLOUD.onChange(() => linkAccount());
    CLOUD.start().then((ok) => { if (ok) linkAccount(); });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && CLOUD.linked) CLOUD.pull().then(() => linkAccount()).catch(() => {}); });
  }
  AI.ping.then((ok) => { if (ok && !ui.ob && !document.activeElement.matches('input, textarea, select')) render(); });
})();
