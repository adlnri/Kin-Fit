/* Kin Fit accounts (Supabase): sign-in by e-mail link or Google, progress backup, friends and shared challenges.
   Off until config.js holds the project URL and its public (anon) key; the app then works exactly as before.
   Security lives in the database rules (supabase/schema.sql): each person only reads their own data,
   their friendships and the challenges they take part in. */
(() => {
  'use strict';

  const CFG = window.KINFIT_CLOUD || {};
  const LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.1/+esm';
  const enabled = !!(CFG.url && CFG.key);
  const st = { sb: null, user: null, profile: null, ready: null, listeners: [] };

  const fail = (code, cause) => { const e = new Error(code); e.code = code; e.cause = cause; return e; };
  const check = ({ data, error }) => {
    if (error) {
      if (error.code === '23505') throw fail('pseudo_taken', error);
      if (error.code === '23514') throw fail('pseudo_invalid', error);
      if (/fetch|network/i.test(error.message || '')) throw fail('network', error);
      throw fail('server', error);
    }
    return data;
  };
  const here = () => location.href.split('#')[0].split('?')[0];

  function emit(ev) { st.listeners.forEach((f) => { try { f(ev); } catch (e) { /* listener errors stay local */ } }); }

  async function loadProfile() {
    if (!st.user) { st.profile = null; return null; }
    const data = check(await st.sb.from('profiles').select('id, pseudo, consent_at, updated_at, state').eq('id', st.user.id).maybeSingle());
    st.profile = data || null;
    return st.profile;
  }

  function start() {
    if (!enabled) return Promise.resolve(false);
    if (!st.ready) {
      st.ready = import(LIB).then(async ({ createClient }) => {
        // Implicit flow: the e-mail link works even when the mail app opens it in another browser.
        st.sb = createClient(CFG.url, CFG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'implicit' } });
        const { data } = await st.sb.auth.getSession();
        st.user = (data.session && data.session.user) || null;
        try { await loadProfile(); } catch (e) { /* offline: keep going without the profile */ }
        st.sb.auth.onAuthStateChange((ev, session) => {
          const before = st.user && st.user.id; st.user = (session && session.user) || null;
          if ((st.user && st.user.id) !== before || ev === 'SIGNED_OUT') loadProfile().catch(() => {}).finally(() => emit(ev));
        });
        return true;
      }).catch(() => { st.ready = null; return false; });
    }
    return st.ready;
  }
  async function sb() { if (!(await start())) throw fail('offline'); return st.sb; }

  /* ---------- Sign-in ---------- */

  async function signInEmail(email) {
    const c = await sb();
    check(await c.auth.signInWithOtp({ email, options: { emailRedirectTo: here(), shouldCreateUser: true } }));
  }
  async function signInGoogle() {
    const c = await sb();
    check(await c.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: here() } }));
  }
  async function signOut() { const c = await sb(); await c.auth.signOut(); st.user = null; st.profile = null; emit('SIGNED_OUT'); }

  /* ---------- Profile and progress ---------- */

  async function createProfile(pseudo, state) {
    const c = await sb(); if (!st.user) throw fail('signed_out');
    const row = { id: st.user.id, pseudo, consent_at: new Date().toISOString(), state: state || {}, updated_at: new Date().toISOString() };
    st.profile = check(await c.from('profiles').insert(row).select('id, pseudo, consent_at, updated_at, state').single());
    return st.profile;
  }
  async function push(state) {
    const c = await sb(); if (!st.user || !st.profile) return null;
    const updated_at = new Date().toISOString();
    check(await c.from('profiles').update({ state, updated_at }).eq('id', st.user.id));
    st.profile = { ...st.profile, state, updated_at };
    return updated_at;
  }
  const pull = () => loadProfile();

  /* ---------- Friends ---------- */

  const rpc = async (fn, args) => check(await (await sb()).rpc(fn, args));
  const friends = () => rpc('my_friends');
  async function requestFriend(pseudo) {
    const found = await rpc('find_user', { p_pseudo: pseudo });
    if (!found || !found.length) throw fail('not_found');
    const c = await sb();
    check(await c.from('friendships').insert({ requester: st.user.id, addressee: found[0].id }));
    return found[0];
  }
  async function acceptFriend(id) { const c = await sb(); check(await c.from('friendships').update({ status: 'accepted' }).eq('id', id)); }
  async function removeFriend(id) { const c = await sb(); check(await c.from('friendships').delete().eq('id', id)); }

  /* ---------- Shared challenges ---------- */

  const challenges = () => rpc('my_challenges');
  const createChallenge = (c, msg, friendIds) => rpc('create_challenge', { p_cid: c.cid, p_title: c.title, p_unit: c.unit, p_target: c.target, p_cat: c.cat, p_icon: c.icon, p_steps: c.steps, p_msg: msg || '', p_friends: friendIds });
  async function setProgress(id, progress) { const c = await sb(); check(await c.from('challenge_members').update({ progress, updated_at: new Date().toISOString() }).eq('challenge_id', id).eq('user_id', st.user.id)); }
  async function respond(id, status) { const c = await sb(); check(await c.from('challenge_members').update({ status, updated_at: new Date().toISOString() }).eq('challenge_id', id).eq('user_id', st.user.id)); }

  /* ---------- Rights: export and deletion ---------- */

  async function exportData() {
    const c = await sb();
    const profile = check(await c.from('profiles').select('*').eq('id', st.user.id).maybeSingle());
    const [amis, defis] = await Promise.all([friends(), challenges()]);
    return { exporte_le: new Date().toISOString(), compte: { id: st.user.id, email: st.user.email }, profil: profile, amis, defis };
  }
  async function deleteAccount() { await rpc('delete_my_account'); await signOut(); }

  window.NA_CLOUD = {
    enabled, google: !!CFG.google,
    get user() { return st.user; }, get profile() { return st.profile; }, get signedIn() { return !!st.user; }, get linked() { return !!(st.user && st.profile); },
    start, onChange: (f) => st.listeners.push(f),
    signInEmail, signInGoogle, signOut, createProfile, push, pull,
    friends, requestFriend, acceptFriend, removeFriend,
    challenges, createChallenge, setProgress, respond, exportData, deleteAccount,
  };
})();
