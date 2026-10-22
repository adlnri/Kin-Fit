/* Kin Fit circuits: bodyweight, cardio and dumbbell "parcours" sized to a chosen duration and level.
   Authored sample content; stations reuse the engine's exercises where they exist. */
(() => {
  'use strict';

  const NA = window.NA;

  // Cardio moves that are not strength exercises. `low` replaces a jump when a knee is reported.
  const MOVES = {
    jacks: { n: 'Jumping jacks', m: 'Cardio, mollets, épaules', low: 'Step jacks sans saut', tech: 'Ouvre bras et jambes en même temps, atterris sur l’avant du pied, garde un rythme régulier.', err: 'Atterrir talons tendus et genoux verrouillés.' },
    genoux: { n: 'Montées de genoux', m: 'Cardio, fléchisseurs de hanche', low: 'Montées de genoux marchées', tech: 'Buste droit, genoux à hauteur de hanche, bras qui suivent le rythme des jambes.', err: 'Se pencher en arrière pour monter les genoux.' },
    burpee: { n: 'Burpees', m: 'Corps entier', low: 'Burpees sans saut, en reculant les pieds un par un', tech: 'Mains au sol, saute ou recule les pieds en planche, reviens accroupi puis relève-toi en expirant.', err: 'Laisser le bassin s’effondrer en position de planche.' },
    climber: { n: 'Mountain climbers', m: 'Gainage, cardio', low: 'Mountain climbers lents', tech: 'Épaules au-dessus des mains, ramène un genou vers la poitrine puis l’autre, hanches basses.', err: 'Lever les fesses haut pour aller plus vite.' },
    patineur: { n: 'Sauts du patineur', m: 'Fessiers, équilibre, cardio', low: 'Pas chassés latéraux', tech: 'Saute d’un pied sur l’autre en latéral, réception amortie, le pied libre croise derrière.', err: 'Réception jambe tendue sans amorti.' },
    corde: { n: 'Corde à sauter (ou sans corde)', m: 'Mollets, coordination, cardio', low: 'Marche rapide sur place', tech: 'Petits sauts sur l’avant du pied, coudes près du corps, la rotation vient des poignets.', err: 'Sauter trop haut et se fatiguer en deux minutes.' },
    shadow: { n: 'Shadow boxing', m: 'Épaules, gainage, cardio', low: 'Shadow boxing pieds ancrés', tech: 'Garde haute, enchaîne direct, crochet et uppercut en tournant les hanches, reste léger sur les appuis.', err: 'Baisser la garde entre deux coups.' },
    sprint: { n: 'Sprint sur place', m: 'Cardio, mollets', low: 'Marche rapide sur place en pompant les bras', tech: 'Sur l’avant des pieds, bras à 90° qui pompent fort, fréquence maximale.', err: 'Courir sur les talons.' },
  };

  // Stations per circuit: engine exercises (id) or cardio moves (move).
  const TYPES = {
    corps: { name: 'Poids du corps', icon: 'stretch', kit: 'corps', met: 7, stations: [{ id: 'squat' }, { id: 'bench' }, { id: 'fente' }, { id: 'row' }, { id: 'hip' }, { id: 'ohp' }, { id: 'planche' }, { id: 'deadbug' }],
      why: 'Un parcours sans matériel qui alterne jambes, poussée, tirage et gainage : chaque groupe récupère pendant que le suivant travaille.' },
    cardio: { name: 'Cardio', icon: 'heart', kit: 'corps', met: 8, stations: [{ move: 'jacks' }, { move: 'genoux' }, { move: 'burpee' }, { move: 'climber' }, { move: 'patineur' }, { move: 'corde' }, { move: 'shadow' }, { move: 'sprint' }],
      why: 'Des efforts courts et intenses qui font monter le cœur, puis une récupération incomplète : idéal pour l’endurance et la dépense calorique.' },
    halteres: { name: 'Haltères', icon: 'dumbbell', kit: 'halteres', met: 7.5, stations: [{ id: 'squat' }, { id: 'bench' }, { id: 'row' }, { id: 'fente' }, { id: 'ohp' }, { id: 'rdl' }, { id: 'thruster' }, { id: 'farmer' }],
      why: 'Une paire d’haltères suffit : mouvements polyarticulaires enchaînés pour la force et le cardio en même temps.' },
  };

  const WARM = ['Rotations des épaules et des hanches, 1 min', 'Marche puis trot sur place, 2 min', 'Squats et fentes lents à vide, 1 min', 'Montées de genoux légères, 1 min'];
  const COOL = ['Marche lente et respiration nasale, 2 min', 'Étirement des quadriceps et ischio-jambiers, 1 min', 'Étirement des pectoraux et du dos, 1 min', 'Respiration ventrale allongé, 1 min'];
  const PACE = [{ on: 30, off: 30, rest: 90 }, { on: 40, off: 20, rest: 75 }, { on: 45, off: 15, rest: 60 }]; // débutant, intermédiaire, avancé

  function station(st, kit, p) {
    const knee = /genou/i.test(p.restrictions || '');
    if (st.move) {
      const mv = MOVES[st.move]; const name = knee ? mv.low : mv.n;
      return { n: name, m: mv.m, load: knee ? 'Sans impact' : 'Rythme soutenu', tech: mv.tech, err: mv.err, q: `${name} technique` };
    }
    const ex = NA.E[st.id];
    const v = kit === 'halteres' ? (ex.dumb || ex.body) : (ex.body || ex.band || ex.dumb);
    return { n: v.n, m: ex.m, load: NA.loadText(v, p), tech: ex.tech, err: ex.err, q: `${v.n} technique` };
  }

  function build(p, type, dur) {
    const T = TYPES[type] || TYPES.corps; const D = NA.DUREES.includes(+dur) ? +dur : NA.durOf(p);
    const pace = PACE[NA.lvIdx(p.niveau)];
    const n = D <= 30 ? 6 : 8;
    const warm = D >= 60 ? 8 : 5; const cool = D >= 60 ? 7 : 5;
    const lap = n * (pace.on + pace.off);
    const rounds = Math.max(2, Math.round(((D - warm - cool) * 60 + pace.rest) / (lap + pace.rest)));
    const stations = T.stations.slice(0, n).map((st) => station(st, T.kit, p));
    const missing = T.kit === 'halteres' && !p.materiel.some((m) => m === 'halteres' || m === 'salle');
    return { type, name: T.name, icon: T.icon, why: T.why, duree: D, rounds, pace, stations, warm, cool, kcal: NA.burnOf(T.met, p, D),
      warmList: WARM, coolList: COOL, missing, knee: /genou/i.test(p.restrictions || '') };
  }

  window.NA_CIRCUITS = { TYPES, build };
})();
