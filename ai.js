/* Kin Fit AI layer: talks to the /api/ai function (Netlify). If the function is missing (GitHub Pages,
   offline) or fails, every call rejects and the app keeps its authored examples. */
(() => {
  'use strict';

  const NA = window.NA; const M = window.NA_MEALS; const I = window.NA_I18N;
  const URL_AI = window.KINFIT_AI_URL || 'api/ai';
  const state = { ready: false };

  async function call(task, payload, timeout = 90000) {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), timeout);
    try {
      const res = await fetch(URL_AI, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ task, lang: I.lang, ...payload }), signal: ctl.signal });
      const out = await res.json().catch(() => null);
      if (!res.ok || !out || !out.ok) throw new Error((out && out.error) || `http_${res.status}`);
      return out.data;
    } finally { clearTimeout(t); }
  }

  // Answers from onboarding, as readable labels (the server never sees the app's internal codes).
  function profil(sess) {
    const p = sess.profile; const c = I.country;
    return {
      prenom: p.prenom, sexe: p.sexe, age: +p.age, taille_cm: +p.taille, poids_kg: +p.poids,
      objectif: NA.OBJECTIFS[p.objectif], niveau: NA.lvLabel(p.niveau), seances_par_semaine: +p.seances, duree_seance_min: NA.durOf(p),
      materiel: p.materiel.map((m) => NA.MATERIEL[m]), restrictions: (p.restrictions || '').trim() || 'aucune',
      sports: NA.sportList(p), petit_dejeuner: NA.PDJ[p.petitdej],
      regime: M.REGIMES[p.regime] || M.REGIMES.omni, pratiques: (p.pratiques || []).map((x) => M.PRATIQUES[x]),
      allergies_et_aliments_a_eviter: p.eviter.map((a) => M.ALLERGENES[a]),
      budget: M.BUDGETS[p.budget] || M.BUDGETS.moyen, pays: c ? c.name.fr : '', region: M.REGIONS[I.region] || '',
      niveau_activite: NA.activity(p).label, besoin_kcal_jour: NA.dailyKcal(p), repas_plaisir_par_semaine: +(p.cheat ?? 1),
    };
  }

  /* Programme: the engine keeps the weekly split (days and zones); the AI writes each session. */
  async function programme(sess) {
    const plan = NA.buildPlan(sess); const pf = profil(sess); const variation = sess.seed + 1;
    const muscu = plan.items.filter((it) => it.kind === 'muscu'); const cardio = plan.items.filter((it) => it.kind === 'cardio');
    const zones = muscu.map((it) => it.tpl.zone);
    const [seances, comp] = await Promise.all([
      Promise.all(muscu.map((it, i) => call('seance', { profil: pf, variation, seance: { num: i + 1, total: muscu.length, duree: NA.durOf(sess.profile), zone: it.tpl.zone, autres: zones.filter((_, j) => j !== i).join(', ') || 'aucune' } })
        .then((data) => ({ day: it.day, num: i + 1, zone: it.tpl.zone, data })))),
      call('complements', { profil: pf, variation, cardio: Math.max(1, cardio.length) }),
    ]);
    if (seances.some((s) => !s.data.exercices || s.data.exercices.length < 5)) throw new Error('incomplete');
    const days = cardio.map((it) => it.day);
    return {
      at: new Date().toISOString(), lang: I.lang, seed: sess.seed, seances,
      cardio: comp.cardio.map((data, i) => ({ day: days[i] ?? null, data })), recuperation: comp.recuperation,
    };
  }

  async function nutrition(sess, dayI, training) {
    const data = await call('nutrition', { profil: profil(sess), variation: sess.seed + 1 + dayI, jour: NA.DAYS_FULL[dayI], entrainement: !!training });
    return { at: new Date().toISOString(), lang: I.lang, day: dayI, training: !!training, data };
  }

  async function coach(sess, contexte) {
    const data = await call('coach', { profil: profil(sess), contexte, messages: sess.chat.filter((m) => !m.pending).slice(-12) }, 45000);
    return data.texte;
  }

  const ping = fetch(URL_AI, { method: 'GET' }).then((r) => (r.ok ? r.json() : null)).then((d) => { state.ready = !!(d && d.ready); return state.ready; }).catch(() => false);

  window.NA_AI = { get ready() { return state.ready; }, ping, programme, nutrition, coach, profil };
})();
