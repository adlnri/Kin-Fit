/* Kin Fit AI layer. Three sources, chosen per device in Profil › Coach IA:
   - gemini: the user's own Google Gemini key, called straight from the browser (the key never leaves this device
     except to Google);
   - local: a small open model run in the browser with WebLLM (WebGPU), coach replies only;
   - server: the optional Kin Fit function /api/ai (Claude), only when the site is deployed with it.
   With no source, or when a call fails, every call rejects and the app keeps its authored examples. */
(() => {
  'use strict';

  const NA = window.NA; const M = window.NA_MEALS; const I = window.NA_I18N;
  const URL_AI = window.KINFIT_AI_URL || 'api/ai';
  const PKEY = 'nutriapp.ai';
  const GEMINI = { plan: 'gemini-3.8-flash', chat: 'gemini-3.5-flash-lite', base: 'https://generativelanguage.googleapis.com/v1beta/models/' };
  const LOCAL = { model: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC', lib: 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/+esm' };

  const read = () => { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch (e) { return {}; } };
  let cfg = read();
  const state = { server: false, engine: null, loading: null, listeners: [], webgpu: !!navigator.gpu };
  // Same ?v= as this script, so the service worker never serves a stale copy of the prompts.
  const VER = document.currentScript ? new URL(document.currentScript.src).search : '';
  let core = null;
  const getCore = () => (core = core || import(`./ai-core.mjs${VER}`));

  function provider() {
    if (cfg.provider === 'gemini' && cfg.key) return 'gemini';
    if (cfg.provider === 'local' && state.webgpu && cfg.local) return 'local';
    if ((cfg.provider === 'server' || !cfg.provider) && state.server) return 'server';
    return 'none';
  }
  const can = (task) => { const p = provider(); return p === 'none' ? false : p === 'local' ? task === 'coach' : true; };

  function setConfig(next) {
    cfg = { ...cfg, ...next };
    try { localStorage.setItem(PKEY, JSON.stringify(cfg)); } catch (e) { /* this visit only */ }
  }

  const fail = (code) => { const e = new Error(code); e.code = code; return e; };

  async function withTimeout(ms, run) {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
    try { return await run(ctl.signal); } catch (e) { throw e.name === 'AbortError' ? fail('timeout') : e.code ? e : fail('network'); } finally { clearTimeout(t); }
  }

  /* ---------- Kin Fit server (Claude) ---------- */

  function viaServer(task, body, timeout) {
    return withTimeout(timeout, async (signal) => {
      const res = await fetch(URL_AI, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ task, ...body }), signal });
      const out = await res.json().catch(() => null);
      if (!res.ok || !out || !out.ok) throw fail((out && out.error) || `http_${res.status}`);
      return out.data;
    });
  }

  /* ---------- Gemini, with the user's own key ---------- */

  async function viaGemini(task, body, timeout, key = cfg.key) {
    const { build, messagesFor } = await getCore();
    const job = build(task, body); if (!job) throw fail('bad_task');
    // Gemini wants alternating user/model turns: merge consecutive turns of the same role.
    const contents = [];
    messagesFor(job, body).forEach((m) => {
      const role = m.role === 'assistant' ? 'model' : 'user'; const last = contents[contents.length - 1];
      if (last && last.role === role) last.parts[0].text += `\n\n${m.content}`; else contents.push({ role, parts: [{ text: m.content }] });
    });
    const model = job.kind === 'chat' ? GEMINI.chat : GEMINI.plan;
    const send = (gen, extra = '') => withTimeout(timeout, (signal) => fetch(`${GEMINI.base}${model}:generateContent`, {
      method: 'POST', signal,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: job.system + extra }] }, contents, generationConfig: gen }),
    }));
    // Room for the model's own reasoning, which counts toward the output budget.
    const gen = { maxOutputTokens: job.max + 8000 };
    let res;
    if (job.schema) {
      res = await send({ ...gen, responseMimeType: 'application/json', responseJsonSchema: job.schema });
      if (res.status === 400) {
        const why = await res.clone().text();
        // Older API surface without JSON Schema support: ask for the same shape in the instructions instead.
        if (/responseJsonSchema|Unknown name|schema/i.test(why) && !/API key/i.test(why)) {
          res = await send({ ...gen, responseMimeType: 'application/json' }, `\n\nRéponds uniquement par un objet JSON conforme à ce schéma JSON, sans texte autour :\n${JSON.stringify(job.schema)}`);
        }
      }
    } else res = await send(gen);
    const out = await res.json().catch(() => null);
    if (!res.ok) {
      const msg = (out && out.error && out.error.message) || '';
      if (res.status === 400 && /API key/i.test(msg)) throw fail('bad_key');
      if (res.status === 401 || res.status === 403) throw fail(/API key/i.test(msg) ? 'bad_key' : 'forbidden');
      if (res.status === 429) throw fail('rate_limited');
      if (res.status === 404) throw fail('model');
      throw fail(`http_${res.status}`);
    }
    const cand = out && out.candidates && out.candidates[0];
    if (!cand) throw fail(out && out.promptFeedback && out.promptFeedback.blockReason ? 'refusal' : 'empty');
    if (cand.finishReason === 'MAX_TOKENS') throw fail('truncated');
    if (/SAFETY|PROHIBITED|BLOCKLIST|SPII|RECITATION/.test(cand.finishReason || '')) throw fail('refusal');
    const text = ((cand.content && cand.content.parts) || []).filter((p) => !p.thought && p.text).map((p) => p.text).join('').trim();
    if (!text) throw fail('empty');
    if (job.chat) return { texte: text };
    try { return JSON.parse(text.replace(/^```(?:json)?\s*|\s*```$/g, '')); } catch (e) { throw fail('bad_output'); }
  }

  /* ---------- On-device model (WebLLM) ---------- */

  function loadLocal(onProgress) {
    if (state.engine) return Promise.resolve(state.engine);
    if (!state.webgpu) return Promise.reject(fail('webgpu'));
    if (onProgress) state.listeners.push(onProgress);
    if (!state.loading) {
      state.loading = import(LOCAL.lib)
        .then((webllm) => webllm.CreateMLCEngine(LOCAL.model, { initProgressCallback: (r) => state.listeners.forEach((f) => f(r)) }))
        .then((engine) => { state.engine = engine; state.listeners = []; setConfig({ local: true }); return engine; })
        .catch((e) => { state.loading = null; state.listeners = []; throw e.code ? e : fail('local'); });
    }
    return state.loading;
  }

  async function viaLocal(task, body, onProgress) {
    if (task !== 'coach') throw fail('unsupported');
    const { build } = await getCore();
    const job = build(task, body);
    const engine = await loadLocal(onProgress);
    const hist = (body.messages || []).slice(-8).map((m) => ({ role: m.me ? 'user' : 'assistant', content: String(m.t).slice(0, 800) }));
    while (hist.length && hist[0].role === 'assistant') hist.shift();
    const r = await engine.chat.completions.create({ messages: [{ role: 'system', content: `${job.system}\n\n${job.text}` }, ...hist], max_tokens: 350, temperature: 0.6 });
    const text = (r.choices[0].message.content || '').trim();
    if (!text) throw fail('empty');
    return { texte: text };
  }

  /* ---------- Tasks ---------- */

  function call(task, payload, { timeout = 120000, onProgress } = {}) {
    const body = { lang: I.lang, ...payload };
    const p = provider();
    if (p === 'gemini') return viaGemini(task, body, timeout);
    if (p === 'local') return viaLocal(task, body, onProgress);
    if (p === 'server') return viaServer(task, body, timeout);
    return Promise.reject(fail('off'));
  }

  // Answers from onboarding, as readable labels. No name or contact detail is sent.
  function profil(sess) {
    const p = sess.profile; const c = I.country;
    return {
      sexe: p.sexe, age: +p.age, taille_cm: +p.taille, poids_kg: +p.poids,
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
    if (seances.some((s) => !Array.isArray(s.data.exercices) || s.data.exercices.length < 5)) throw fail('incomplete');
    if (!comp || !Array.isArray(comp.cardio) || !comp.recuperation) throw fail('incomplete');
    const days = cardio.map((it) => it.day);
    return {
      at: new Date().toISOString(), lang: I.lang, seed: sess.seed, by: provider(), seances,
      cardio: comp.cardio.map((data, i) => ({ day: days[i] ?? null, data })), recuperation: comp.recuperation,
    };
  }

  async function nutrition(sess, dayI, training) {
    const data = await call('nutrition', { profil: profil(sess), variation: sess.seed + 1 + dayI, jour: NA.DAYS_FULL[dayI], entrainement: !!training });
    if (!data || !data.petit_dejeuner || !data.dejeuner || !data.diner || !data.collation) throw fail('incomplete');
    return { at: new Date().toISOString(), lang: I.lang, by: provider(), day: dayI, training: !!training, data };
  }

  async function coach(sess, contexte, onProgress) {
    const data = await call('coach', { profil: profil(sess), contexte, messages: sess.chat.filter((m) => !m.pending).slice(-12) }, { timeout: 60000, onProgress });
    return data.texte;
  }

  // Checks a key with one short request before it is saved.
  function testGemini(key) {
    return viaGemini('coach', { lang: I.lang, profil: {}, contexte: 'Test de connexion.', messages: [{ me: true, t: 'Réponds seulement : OK' }] }, 30000, key);
  }

  const ping = fetch(URL_AI, { method: 'GET' }).then((r) => (r.ok ? r.json() : null)).then((d) => { state.server = !!(d && d.ready); return provider() !== 'none'; }).catch(() => provider() !== 'none');

  window.NA_AI = {
    get ready() { return provider() !== 'none'; }, get provider() { return provider(); }, get config() { return { ...cfg }; },
    get serverReady() { return state.server; }, get webgpu() { return state.webgpu; }, get localLoaded() { return !!state.engine; },
    can, setConfig, testGemini, loadLocal, ping, programme, nutrition, coach, profil, GEMINI, LOCAL,
  };
})();
