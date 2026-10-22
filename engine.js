(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const round = (v, step) => Math.round(v / step) * step;

  /* ---------- Reference data (authored sample content, no model connected) ---------- */

  const SPORTS = ['Football', 'Boxe', 'Paddle', 'Natation', 'JJB', 'Judo', 'Handball'];
  const OBJECTIFS = { perte: 'Perte de poids', maintien: 'Maintien', masse: 'Prise de masse' };
  const MATERIEL = { salle: 'Salle de sport', halteres: 'Haltères', elastiques: 'Élastiques', corps: 'Poids du corps' };
  const PDJ = { sale: 'salé', sucre: 'sucré', mixte: 'sucré-salé' };
  const EVITER = { gluten: 'Gluten', lactose: 'Lactose', oeufs: 'Œufs', coque: 'Fruits à coque et arachide' };
  const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const DAYS_FULL = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

  const SPORT = {
    Football: {
      bas: 'Au football, la force des jambes se paie en accélérations et en duels gagnés.',
      haut: 'Un haut du corps solide protège le ballon et résiste aux charges à l’épaule.',
      tronc: 'Un tronc gainé transmet la puissance dans la frappe et les changements d’appui.',
      cardio: { type: 'Intervalles navette 15/15', duree: 24, format: '15 s de sprint / 15 s de trot × 10, 3 blocs, 3 min de marche entre les blocs', obj: 'Répéter les sprints sans perdre de vitesse en fin de match', conseils: 'Pose deux plots à 20 m. Freine sur deux appuis avant chaque demi-tour, buste bas, et repars sur la jambe extérieure.', q: 'intervalles 15/15 football navette' },
      food: 'Le football alterne sprints et récupération : il faut des glucides complexes disponibles dès le matin.',
      tip: 'Garde 48 h entre la séance bas du corps et ton match.',
    },
    Boxe: {
      bas: 'En boxe, la frappe part du sol : des jambes fortes donnent des coups lourds.',
      haut: 'Épaules et dos endurants gardent la garde haute jusqu’au dernier round.',
      tronc: 'La rotation du tronc relie les appuis au poing et encaisse les coups au corps.',
      cardio: { type: 'Corde à sauter et shadow en rounds', duree: 24, format: '3 min d’effort / 1 min de repos × 6 rounds', obj: 'Tenir le rythme d’un combat et récupérer en une minute', conseils: 'Rounds impairs à la corde, rounds pairs en shadow. Les 30 dernières secondes de chaque round se font à pleine cadence.', q: 'corde à sauter boxe rounds 3 minutes' },
      food: 'Les rounds vident vite les réserves de glycogène : le petit-déjeuner les recharge sans alourdir.',
      tip: 'Travaille toujours la technique avant la musculation, jamais après.',
    },
    Paddle: {
      bas: 'Au paddle, tout se joue sur des fentes basses et des reprises d’appui explosives.',
      haut: 'La stabilité de l’épaule protège le bras de frappe sur les smashs répétés.',
      tronc: 'La rotation du buste donne de la vitesse à la balle sans forcer sur le bras.',
      cardio: { type: 'HIIT déplacements latéraux', duree: 22, format: '20 s d’effort / 40 s de repos × 12, 2 blocs, 2 min entre les blocs', obj: 'Enchaîner les points longs en restant lucide à la volée', conseils: 'Pas chassés sur 4 m, touche le sol à chaque extrémité, garde le regard devant toi comme face au filet.', q: 'HIIT déplacements latéraux padel' },
      food: 'Un match de paddle dure : il faut une énergie stable plutôt qu’un pic de sucre.',
      tip: 'Échauffe les épaules à l’élastique 5 minutes avant chaque match.',
    },
    Natation: {
      bas: 'En natation, la poussée au mur et le battement dépendent de hanches puissantes.',
      haut: 'Dorsaux et épaules sont le moteur de chaque traction dans l’eau.',
      tronc: 'Le gainage maintient la ligne de corps et réduit la traînée.',
      cardio: { type: 'Séries en bassin', duree: 35, format: '8 × 100 m allure soutenue, 20 s de récupération', obj: 'Améliorer l’endurance spécifique et tenir l’allure', conseils: 'Garde le même temps sur les huit répétitions. Si la huitième dérape de plus de 5 s, pars moins vite.', q: 'séries 8x100 natation allure' },
      food: 'L’eau fait dépenser plus qu’on ne le sent : le matin doit apporter glucides et protéines.',
      tip: 'Mobilise les épaules chaque jour, même sans nager.',
    },
    JJB: {
      bas: 'En JJB, des hanches fortes font les ponts, les balayages et les relevés.',
      haut: 'La force de tirage et de préhension tient les grips jusqu’à la soumission.',
      tronc: 'Le tronc résiste à la pression et garde la garde fermée.',
      cardio: { type: 'Circuit grappling', duree: 30, format: '5 min d’effort / 1 min de repos × 5 rounds', obj: 'Tenir le rythme d’un combat de cinq minutes', conseils: 'Enchaîne sprawls, crevettes et relevés techniques. Respire par le nez tant que tu le peux.', q: 'circuit cardio JJB solo drills' },
      food: 'Les rounds de JJB mêlent force et endurance : protéines et glucides doivent être là tous les deux.',
      tip: 'Renforce ta nuque et tes avant-bras deux fois par semaine.',
    },
    Judo: {
      bas: 'Au judo, la puissance des jambes fait entrer la projection.',
      haut: 'Le tirage et la saisie décident du kumi-kata.',
      tronc: 'La rotation du tronc termine le mouvement et résiste au déséquilibre.',
      cardio: { type: 'Uchi-komi fractionné', duree: 20, format: '20 s d’effort / 10 s de repos × 8, 3 blocs, 2 min entre les blocs', obj: 'Reproduire l’intensité d’un combat et ses relances', conseils: 'Avec un élastique fixé à hauteur de poitrine, entre vite et propre. La qualité du placement passe avant le nombre.', q: 'uchi komi élastique tabata judo' },
      food: 'Le judo demande de l’explosivité : un matin riche en protéines préserve le muscle.',
      tip: 'Travaille ton côté faible autant que ton côté fort.',
    },
    Handball: {
      bas: 'Au handball, l’impulsion et les appuis décident du tir en suspension.',
      haut: 'Une épaule forte et stable protège le bras de tir.',
      tronc: 'Le tronc transmet la force du sol jusqu’au ballon.',
      cardio: { type: 'Fractionné avec changements de direction', duree: 24, format: '30 s d’effort / 30 s de repos × 8, 2 blocs, 3 min entre les blocs', obj: 'Enchaîner montées de balle et replis défensifs', conseils: 'Course en zigzag entre des plots à 5 m. Freine fort, hanches basses, et accélère sur trois foulées.', q: 'fractionné 30/30 handball changements de direction' },
      food: 'Sprints, sauts et contacts : le handball réclame des glucides et des protéines dès le matin.',
      tip: 'Renforce la coiffe des rotateurs à chaque échauffement.',
    },
    Autre: {
      bas: 'Des jambes fortes servent toutes les disciplines : elles portent, poussent et freinent.',
      haut: 'Un haut du corps équilibré entre poussée et tirage protège les épaules.',
      tronc: 'Le gainage transmet la force et protège le dos.',
      cardio: { type: 'HIIT 40/20', duree: 20, format: '40 s d’effort / 20 s de repos × 5 tours de 4 exercices', obj: 'Améliorer l’endurance et renforcer le cœur', conseils: 'Montées de genoux, squats, grimpeur, fentes alternées. Garde un rythme que tu peux tenir cinq tours.', q: 'HIIT 40/20 débutant sans matériel' },
      food: 'Ton activité demande une énergie régulière : on mise sur des aliments simples et complets.',
      tip: 'La régularité bat l’intensité : mieux vaut trois séances tenues que cinq abandonnées.',
    },
  };

  const ZONE2 = { type: 'Endurance fondamentale', duree: 35, format: '35 min en continu, allure où tu peux parler', obj: 'Construire la base aérobie et accélérer la récupération', conseils: 'Course, vélo ou rameur. Si tu ne peux plus dire une phrase entière, ralentis.', q: 'endurance fondamentale zone 2 explication' };

  const BODY3 = ['3 s à la descente', '4 s à la descente', '4 s à la descente, pause 1 s en bas'];

  const E = {
    squat: { m: 'Quadriceps, fessiers', s: 4, r: 8, rest: 90, key: 'bas',
      gym: { n: 'Squat barre', kg: 70 }, dumb: { n: 'Squat goblet', kg: 18 }, body: { n: 'Squat tempo', txt: BODY3 },
      tech: 'Pieds largeur d’épaules, inspire et gaine avant de descendre, cuisses au moins parallèles au sol, expire en poussant.', err: 'Les genoux qui rentrent vers l’intérieur à la remontée.' },
    fente: { m: 'Quadriceps, fessiers, équilibre', s: 3, r: 10, rest: 75, key: 'bas',
      gym: { n: 'Fente bulgare haltères', kg: 14, per: ' par main' }, dumb: { n: 'Fente bulgare haltères', kg: 12, per: ' par main' }, body: { n: 'Fente bulgare', txt: BODY3 },
      tech: 'Pied arrière sur un banc, buste légèrement penché, descends à la verticale jusqu’à frôler le sol du genou.', err: 'Un pas trop court qui envoie le genou loin devant la pointe du pied.' },
    rdl: { m: 'Ischio-jambiers, fessiers, lombaires', s: 4, r: 8, rest: 90, key: 'bas',
      gym: { n: 'Soulevé de terre roumain', kg: 65 }, dumb: { n: 'Soulevé roumain haltères', kg: 16, per: ' par main' }, band: { n: 'Good morning élastique', txt: ['Élastique léger', 'Élastique moyen', 'Élastique fort'] }, body: { n: 'Soulevé roumain une jambe', txt: BODY3 },
      tech: 'Genoux à peine fléchis, pousse les hanches vers l’arrière, dos plat, la charge glisse le long des cuisses.', err: 'Arrondir le bas du dos pour aller chercher plus bas.' },
    hip: { m: 'Fessiers', s: 3, r: 10, rest: 75, key: 'bas',
      gym: { n: 'Hip thrust barre', kg: 80 }, dumb: { n: 'Hip thrust haltère', kg: 22 }, body: { n: 'Pont fessier une jambe', txt: ['Pause 1 s en haut', 'Pause 2 s en haut', 'Pause 3 s en haut'] },
      tech: 'Omoplates sur le banc, menton rentré, monte le bassin jusqu’à l’alignement épaules-genoux et serre en haut.', err: 'Cambrer le dos au lieu de finir avec les fessiers.' },
    mollet: { m: 'Mollets', s: 3, r: 12, rest: 60, key: 'bas',
      gym: { n: 'Mollets debout machine', kg: 60 }, dumb: { n: 'Mollets une jambe haltère', kg: 14 }, body: { n: 'Mollets une jambe', txt: ['Sur marche, 2 s en haut', 'Sur marche, 3 s en haut', 'Sur marche, 3 s en haut et en bas'] },
      tech: 'Monte le plus haut possible sur la pointe, marque l’arrêt, redescends talon sous la marche.', err: 'Rebondir en bas sans contrôler l’étirement.' },
    planche: { m: 'Sangle abdominale', s: 3, r: '40 s', rest: 45, key: 'tronc',
      body: { n: 'Planche avant', txt: ['30 s tenues', '45 s tenues', '60 s tenues'] },
      tech: 'Coudes sous les épaules, fessiers serrés, bassin en rétroversion, respire lentement.', err: 'Laisser le bassin tomber et creuser le bas du dos.' },
    bench: { m: 'Pectoraux, triceps, épaules', s: 4, r: 8, rest: 90, key: 'haut',
      gym: { n: 'Développé couché', kg: 60 }, dumb: { n: 'Développé haltères au sol', kg: 16, per: ' par main' }, body: { n: 'Pompes', txt: ['Mains surélevées', 'Au sol, 3 s à la descente', 'Pieds surélevés'] },
      tech: 'Omoplates serrées, pieds ancrés, descends en contrôle, coudes à 45° du buste, expire en poussant.', err: 'Décoller les fesses ou rebondir sur la poitrine.' },
    row: { m: 'Dorsaux, trapèzes, biceps', s: 4, r: 10, rest: 75, key: 'haut',
      gym: { n: 'Rowing barre', kg: 55 }, dumb: { n: 'Rowing haltère un bras', kg: 18 }, band: { n: 'Rowing élastique assis', txt: ['Élastique léger', 'Élastique moyen', 'Élastique fort'] }, body: { n: 'Rowing inversé sous table', txt: ['Genoux fléchis', 'Jambes tendues', 'Pieds surélevés'] },
      tech: 'Dos plat, tire le coude vers la hanche, serre l’omoplate une seconde, redescends lentement.', err: 'Tirer avec un élan du buste plutôt qu’avec le dos.' },
    ohp: { m: 'Épaules, triceps', s: 3, r: 10, rest: 75, key: 'haut',
      gym: { n: 'Développé militaire haltères', kg: 16, per: ' par main' }, dumb: { n: 'Développé épaules haltères', kg: 12, per: ' par main' }, body: { n: 'Pompes piquées', txt: ['Amplitude partielle', 'Amplitude complète', 'Pieds surélevés'] },
      tech: 'Abdos gainés, pousse à la verticale, bras près des oreilles en haut, sans cambrer.', err: 'Cambrer le dos pour compenser une charge trop lourde.' },
    pull: { m: 'Grand dorsal, biceps', s: 3, r: 10, rest: 75, key: 'haut',
      gym: { n: 'Tirage vertical poulie', kg: 55 }, band: { n: 'Tirage élastique à genoux', txt: ['Élastique léger', 'Élastique moyen', 'Élastique fort'] }, body: { n: 'Superman en W', txt: ['Pause 1 s en haut', 'Pause 2 s en haut', 'Pause 3 s en haut'] },
      tech: 'Poitrine sortie, tire les coudes vers les hanches, contrôle la remontée bras presque tendus.', err: 'Se pencher loin en arrière pour tricher.' },
    face: { m: 'Arrière d’épaule, coiffe des rotateurs', s: 3, r: 15, rest: 60, key: 'haut',
      gym: { n: 'Face pull poulie', kg: 20 }, band: { n: 'Écarté arrière élastique', txt: ['Élastique léger', 'Élastique léger', 'Élastique moyen'] }, body: { n: 'Y-T-W au sol', txt: ['Sans charge', 'Pause 2 s', 'Pause 3 s'] },
      tech: 'Tire vers le visage, coudes hauts, finis en rotation externe, pouces vers l’arrière.', err: 'Prendre trop lourd et hausser les épaules.' },
    pallof: { m: 'Obliques, anti-rotation', s: 3, r: 10, rest: 45, key: 'tronc',
      gym: { n: 'Pallof press poulie', kg: 15 }, band: { n: 'Pallof press élastique', txt: ['Élastique léger', 'Élastique moyen', 'Élastique fort'] }, body: { n: 'Planche latérale', txt: ['25 s par côté', '40 s par côté', '50 s par côté'] },
      tech: 'De profil, tends les bras devant toi sans laisser le buste tourner, reviens lentement.', err: 'Laisser les hanches pivoter vers le point d’attache.' },
    deadlift: { m: 'Chaîne postérieure, dos', s: 4, r: 5, rest: 120, key: 'bas',
      gym: { n: 'Soulevé de terre', kg: 90 }, dumb: { n: 'Soulevé de terre haltères', kg: 20, per: ' par main' }, band: { n: 'Soulevé de terre élastique', txt: ['Élastique moyen', 'Élastique fort', 'Élastique fort doublé'] }, body: { n: 'Hip hinge une jambe', txt: BODY3 },
      tech: 'Barre contre les tibias, dos plat, pousse le sol avec les jambes, verrouille les hanches en haut.', err: 'Tirer avec le dos avant que les jambes ne poussent.' },
    thruster: { m: 'Jambes, épaules, cardio', s: 3, r: 10, rest: 75, key: 'tronc',
      gym: { n: 'Thruster haltères', kg: 14, per: ' par main' }, dumb: { n: 'Thruster haltères', kg: 10, per: ' par main' }, body: { n: 'Squat sauté contrôlé', txt: ['Réception douce', 'Réception douce, 2 s en bas', 'Enchaîné sans pause'] },
      tech: 'Squat complet puis utilise l’élan des jambes pour pousser au-dessus de la tête en un seul geste.', err: 'Couper le mouvement en deux temps distincts.' },
    traction: { m: 'Dorsaux, biceps, préhension', s: 4, r: 6, rest: 90, key: 'haut',
      gym: { n: 'Tractions', txt: ['Assistées à l’élastique', 'Poids du corps', 'Lestées 5 à 10 kg'] }, band: { n: 'Rowing élastique debout', txt: ['Élastique léger', 'Élastique moyen', 'Élastique fort'] }, body: { n: 'Rowing inversé sous table', txt: ['Genoux fléchis', 'Jambes tendues', 'Pieds surélevés'] },
      tech: 'Pars bras tendus, épaules basses, tire la poitrine vers la barre, descends en 3 secondes.', err: 'Demi-répétitions sans tendre les bras en bas.' },
    farmer: { m: 'Préhension, trapèzes, gainage', s: 3, r: '30 m', rest: 60, key: 'tronc',
      gym: { n: 'Marche du fermier', kg: 24, per: ' par main' }, dumb: { n: 'Marche du fermier', kg: 16, per: ' par main' }, body: { n: 'Portage de sac chargé', txt: ['Sac de 8 à 10 kg', 'Sac de 12 à 15 kg', 'Sac de 18 à 20 kg'] },
      tech: 'Épaules basses, regard loin, petits pas rapides, buste droit du début à la fin.', err: 'Se pencher d’un côté ou regarder ses pieds.' },
    chop: { m: 'Obliques, rotation', s: 3, r: 12, rest: 60, key: 'tronc',
      gym: { n: 'Rotation à la poulie', kg: 20 }, band: { n: 'Rotation à l’élastique', txt: ['Élastique léger', 'Élastique moyen', 'Élastique fort'] }, body: { n: 'Rotation russe', txt: ['Pieds au sol', 'Pieds décollés', 'Pieds décollés, lente'] },
      tech: 'Pivote sur le pied arrière, les bras restent tendus, la rotation part des hanches.', err: 'Tourner seulement les bras, hanches bloquées.' },
    deadbug: { m: 'Abdominaux profonds', s: 3, r: 10, rest: 45, key: 'tronc',
      body: { n: 'Dead bug', txt: ['Jambes fléchies', 'Jambes tendues', 'Jambes tendues, 3 s par répétition'] },
      tech: 'Dos plaqué au sol, allonge bras et jambe opposés en expirant, reviens sans décoller les lombaires.', err: 'Laisser le bas du dos se creuser.' },
  };
  Object.keys(E).forEach((id) => { E[id].id = id; });

  const TPL = {
    A: { zone: 'Bas du corps et puissance', key: 'bas', obj: 'Construire la force des jambes et des hanches', ex: ['squat', 'rdl', 'fente', 'hip', 'mollet', 'planche'] },
    B: { zone: 'Haut du corps, poussée et tirage', key: 'haut', obj: 'Équilibrer poussée et tirage, protéger les épaules', ex: ['bench', 'row', 'ohp', 'pull', 'face', 'pallof'] },
    C: { zone: 'Corps entier et gainage', key: 'tronc', obj: 'Relier le bas et le haut du corps par un tronc solide', ex: ['deadlift', 'thruster', 'traction', 'farmer', 'chop', 'deadbug'] },
  };
  // Session length chosen in onboarding. Short sessions switch to an express format (supersets, shorter rests,
  // a 4-minute finisher) so the energy spent stays close to a classic hour. MET values follow the
  // Compendium of Physical Activities: strength training 5, faster supersets 6.5, vigorous circuit 8.
  const DUREES = [30, 45, 60, 75, 90];
  const DUR = {
    30: { n: 5, ds: -1, rest: 0.5, ss: true, met: 8 },
    45: { n: 5, ds: 0, rest: 0.7, ss: true, met: 6.5 },
    60: { n: 6, ds: 0, rest: 1, met: 5 },
    75: { n: 7, ds: 0, rest: 1, met: 5 },
    90: { n: 7, ds: 1, rest: 1, met: 5 },
  };
  const durOf = (p) => (DUR[p.duree] ? +p.duree : 60);
  // Estimated energy burned: MET × weight (kg) × hours, rounded to 5 kcal.
  const burnOf = (met, p, min) => Math.round((met * (+p.poids || 70) * min) / 60 / 5) * 5;
  const restOf = (ex, p) => Math.max(20, Math.round((ex.rest * DUR[durOf(p)].rest) / 5) * 5);
  // Superset labels in express sessions: 1A, 1B, 2A, 2B, then a single last exercise.
  function pairOf(i, n, p) {
    if (!DUR[durOf(p)].ss) return null;
    const paired = i < n - (n % 2);
    return { label: paired ? `${(i >> 1) + 1}${i % 2 ? 'B' : 'A'}` : `${(i >> 1) + 1}`, first: paired && i % 2 === 0 };
  }
  const FINISHER = {
    std: 'Burpees, mountain climbers, squats sautés et montées de genoux, en alternance',
    knee: 'Mountain climbers lents, gainage dynamique et rameur ou vélo, en alternance (sans saut)',
  };
  const EXTRA_EX = ['deadbug', 'pallof', 'chop', 'farmer', 'planche', 'face', 'mollet'];
  const ORDER = { 2: ['C', 'K'], 3: ['A', 'K', 'B'], 4: ['A', 'B', 'K', 'C'], 5: ['A', 'K', 'B', 'C', 'K'], 6: ['A', 'K', 'B', 'K', 'C', 'K'] };
  const DAYMAP = { 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 5], 5: [0, 1, 3, 4, 5], 6: [0, 1, 2, 3, 4, 5] };

  const FOOD = {
    oeuf: { n: 'Œufs entiers', k: 143, p: 12.6, g: 0.7, l: 9.5, unit: 55, un: 'œuf' },
    pain: { n: 'Pain complet', k: 247, p: 9, g: 41, l: 3.4 },
    avocat: { n: 'Avocat', k: 160, p: 2, g: 8.5, l: 14.7 },
    dinde: { n: 'Blanc de dinde', k: 107, p: 21, g: 1, l: 2 },
    tomate: { n: 'Tomates cerises', k: 18, p: 0.9, g: 3.9, l: 0.2, fixed: true },
    avoine: { n: 'Flocons d’avoine', k: 372, p: 13.5, g: 58.7, l: 7 },
    skyr: { n: 'Skyr nature', k: 63, p: 11, g: 4, l: 0.2 },
    banane: { n: 'Banane', k: 89, p: 1.1, g: 22.8, l: 0.3 },
    miel: { n: 'Miel', k: 304, p: 0.3, g: 82, l: 0 },
    amande: { n: 'Amandes', k: 579, p: 21, g: 9, l: 50 },
    rouges: { n: 'Fruits rouges', k: 45, p: 0.9, g: 9, l: 0.3, fixed: true },
    frais: { n: 'Fromage frais', k: 250, p: 6, g: 3, l: 24 },
    pomme: { n: 'Pomme', k: 52, p: 0.3, g: 14, l: 0.2 },
    cacahuete: { n: 'Beurre de cacahuète', k: 588, p: 25, g: 20, l: 50 },
    painsg: { n: 'Pain sans gluten aux graines', k: 250, p: 5, g: 44, l: 5 },
    sarrasin: { n: 'Flocons de sarrasin', k: 343, p: 13, g: 62, l: 3.4 },
    soja: { n: 'Yaourt de soja nature', k: 50, p: 4.5, g: 2.5, l: 2.3 },
    houmous: { n: 'Houmous', k: 240, p: 7, g: 12, l: 17 },
    tofu: { n: 'Tofu ferme brouillé', k: 126, p: 14, g: 2, l: 7 },
    courge: { n: 'Graines de courge', k: 559, p: 30, g: 10.7, l: 49 },
    tournesol: { n: 'Purée de graines de tournesol', k: 600, p: 20, g: 12, l: 52 },
  };
  const SUB = {
    gluten: { pain: 'painsg', avoine: 'sarrasin' },
    lactose: { skyr: 'soja', frais: 'houmous' },
    oeufs: { oeuf: 'tofu' },
    coque: { amande: 'courge', cacahuete: 'tournesol' },
  };
  const BF = {
    sale: { items: [['oeuf', 110], ['pain', 60], ['avocat', 50], ['dinde', 40], ['tomate', 80]],
      why: 'Les œufs et la dinde apportent des protéines complètes, le pain complet des glucides lents, l’avocat de bons lipides qui prolongent la satiété.',
      alt: 'Wrap complet garni de 2 œufs durs préparés la veille et d’un demi-avocat, à manger en route.' },
    sucre: { items: [['avoine', 60], ['skyr', 150], ['banane', 100], ['amande', 15], ['miel', 10], ['rouges', 80]],
      why: 'L’avoine libère son énergie lentement, le skyr couvre les protéines, la banane et le miel donnent le sucre rapide utile avant l’effort, les amandes apportent les bons lipides.',
      alt: 'Overnight oats préparés la veille : avoine, skyr et banane écrasée dans un bocal, amandes ajoutées le matin.' },
    mixte: { items: [['oeuf', 110], ['pain', 60], ['frais', 30], ['pomme', 120], ['cacahuete', 15], ['miel', 5]],
      why: 'Œufs et fromage frais sur pain complet pour les protéines et les glucides lents, pomme, miel et beurre de cacahuète pour la touche sucrée et les bons lipides.',
      alt: 'Deux tranches de pain complet, beurre de cacahuète et rondelles de pomme, avec un œuf dur préparé la veille.' },
  };
  const GOAL_FOOD = {
    perte: 'Pour la perte de poids, la portion reste modérée et riche en protéines afin de tenir jusqu’au déjeuner.',
    maintien: 'Pour le maintien, la portion couvre un quart de tes besoins du jour, sans excès.',
    masse: 'Pour la prise de masse, la portion est augmentée et les glucides sont renforcés.',
  };
  const DRINK = {
    perte: 'Thé vert ou café noir sans sucre, avec un grand verre d’eau',
    maintien: 'Café ou thé, avec 300 ml d’eau citronnée',
    masse: 'Smoothie protéiné : 250 ml de lait ou de boisson végétale, une poignée de fruits rouges',
  };

  /* ---------- Generation ---------- */

  const lvLabel = (v) => (v < 34 ? 'Débutant' : v < 67 ? 'Intermédiaire' : 'Avancé');
  const lvIdx = (v) => (v < 34 ? 0 : v < 67 ? 1 : 2);
  const sportName = (p) => p.sports[0] || p.autre || 'Sport';
  const sportData = (p) => SPORT[p.sports[0]] || SPORT.Autre;
  const sportList = (p) => [...p.sports, p.autre].filter(Boolean).join(', ');

  function variant(ex, p) {
    const m = p.materiel;
    if (m.includes('salle') && ex.gym) return ex.gym;
    if (m.includes('halteres') && ex.dumb) return ex.dumb;
    if (m.includes('elastiques') && ex.band) return ex.band;
    return ex.body || ex.band || ex.dumb || ex.gym;
  }

  function loadText(v, p) {
    if (v.kg == null) return Array.isArray(v.txt) ? v.txt[lvIdx(p.niveau)] : v.txt;
    const f = (0.55 + (p.niveau / 100) * 0.8) * (p.sexe === 'femme' ? 0.62 : 1) * Math.min(1.25, Math.max(0.75, p.poids / 75));
    const base = v.kg * f;
    const step = base < 12 ? 1 : 2.5;
    const lo = Math.max(step, round(base * 0.92, step));
    const hi = Math.max(lo + step, round(base * 1.08, step));
    return `${lo}–${hi} kg${v.per || ''}`.replace(/\./g, ',');
  }

  function setsReps(ex, p, seed, i) {
    let s = ex.s + (lvIdx(p.niveau) - 1) + DUR[durOf(p)].ds;
    let r = ex.r;
    if (typeof r === 'number') {
      const k = (seed + i) % 3;
      if (k === 1) { s += 1; r -= 2; }
      if (k === 2) { r += 2; }
      if (p.objectif === 'perte') r += 2;
    }
    s = Math.max(2, Math.min(6, s));
    return { s, r, txt: `${s} × ${r}` };
  }

  function restrictionNote(p, key) {
    const t = (p.restrictions || '').toLowerCase();
    if (!t.trim()) return '';
    if (/genou/.test(t) && key !== 'haut') return 'Genou signalé : amplitude limitée à la zone sans douleur sur squats et fentes, descente lente, aucun saut.';
    if (/dos|lombaire/.test(t) && key !== 'haut') return 'Dos signalé : reste dans le bas de la fourchette de charge, gaine avant chaque série, arrête si la douleur apparaît.';
    if (/[ée]paule/.test(t) && key !== 'bas') return 'Épaule signalée : pas de travail au-dessus de la tête en douleur, amplitude réduite sur les développés.';
    if (/genou|dos|lombaire|[ée]paule/.test(t)) return '';
    return `Restriction notée (« ${p.restrictions.trim()} ») : adapte l’amplitude et arrête tout exercice douloureux.`;
  }

  function buildPlan(sess) {
    const p = sess.profile;
    const n = Math.min(6, Math.max(2, +p.seances || 3));
    const sd = sportData(p);
    let mi = 0; let ki = 0;
    const items = ORDER[n].map((c, i) => {
      const day = DAYMAP[n][i];
      if (c === 'K') {
        const k = ki++ % 2 === 0 ? sd.cardio : ZONE2;
        const D = durOf(p); const extra = D - 10 - k.duree;
        const c = { ...k, kind: 'cardio', day, title: k.type };
        if (extra >= 5) { c.duree = D; c.format = `${k.format}. Échauffement 10 min, puis ${extra} min d’endurance facile pour finir`; }
        // The base format at its own intensity; any added warm-up and easy endurance at MET 5.
        c.kcal = burnOf(k === ZONE2 ? 6 : 8, p, k.duree) + burnOf(5, p, c.duree - k.duree);
        return c;
      }
      const t = TPL[c];
      const rot = t.ex.slice(1);
      const shift = sess.seed % rot.length;
      const all = [t.ex[0], ...rot.slice(shift), ...rot.slice(0, shift)];
      const want = DUR[durOf(p)].n; const ex = all.slice(0, want);
      EXTRA_EX.forEach((id) => { if (ex.length < want && !ex.includes(id)) ex.push(id); });
      return { kind: 'muscu', day, num: ++mi, tpl: t, ex, title: `Séance ${mi} · ${t.zone}`, short: t.zone };
    });
    return { items, byDay: (d) => items.find((it) => it.day === d) || null };
  }

  function sessionMeta(item, p, seed) {
    const d = DUR[durOf(p)]; const kcal = burnOf(d.met, p, durOf(p)); const ref = burnOf(5, p, 60);
    return { duree: durOf(p), rpe: Math.min(9, [6, 7, 8][lvIdx(p.niveau)] + (d.ss ? 1 : 0)), kcal, ref, pct: Math.round((kcal / ref) * 100), express: !!d.ss };
  }

  function activity(p) {
    const n = +p.seances;
    if (n <= 2) return { label: 'faible', f: 1.4 };
    if (n <= 4) return { label: 'modéré', f: 1.55 };
    return { label: 'intense', f: 1.75 };
  }

  function dailyKcal(p) {
    const bmr = 10 * p.poids + 6.25 * p.taille - 5 * p.age + (p.sexe === 'femme' ? -161 : 5);
    const goal = { perte: 0.85, maintien: 1, masse: 1.1 }[p.objectif] || 1;
    return round(bmr * activity(p).f * goal, 10);
  }

  function breakfast(p, dayFactor) {
    const tpl = BF[p.petitdej] || BF.sale;
    const items = tpl.items.map(([id, g]) => {
      let fid = id;
      p.eviter.forEach((a) => { if (SUB[a] && SUB[a][fid]) fid = SUB[a][fid]; });
      return { id: fid, g, swapped: fid !== id };
    });
    const kcalOf = (list) => list.reduce((s, it) => s + (FOOD[it.id].k * it.g) / 100, 0);
    const target = dailyKcal(p) * 0.25 * dayFactor;
    const fixed = kcalOf(items.filter((it) => FOOD[it.id].fixed));
    const k = (target - fixed) / (kcalOf(items) - fixed);
    items.forEach((it) => {
      const f = FOOD[it.id];
      if (f.fixed) return;
      if (f.unit) it.g = Math.max(1, Math.round((it.g * k) / f.unit)) * f.unit;
      else it.g = Math.max(5, round(it.g * k, 5));
    });
    const tot = { k: 0, p: 0, g: 0, l: 0 };
    items.forEach((it) => { const f = FOOD[it.id]; ['k', 'p', 'g', 'l'].forEach((m) => { tot[m] += (f[m] * it.g) / 100; }); });
    Object.keys(tot).forEach((m) => { tot[m] = Math.round(tot[m]); });
    return { items, tot, tpl, swaps: items.some((it) => it.swapped) };
  }


  window.NA = { $, $$, esc, round, DUREES, durOf, burnOf, restOf, pairOf, FINISHER, SPORTS, OBJECTIFS, MATERIEL, PDJ, EVITER, DAYS, DAYS_FULL, SPORT, ZONE2, E, TPL, FOOD, BF, GOAL_FOOD, DRINK,
    lvLabel, lvIdx, sportName, sportData, sportList, variant, loadText, setsReps, restrictionNote, buildPlan, sessionMeta, activity, dailyKcal, breakfast };
})();
