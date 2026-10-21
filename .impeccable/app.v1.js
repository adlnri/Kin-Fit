(() => {
  'use strict';

  const KEY = 'relance.v1';
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

  /* ---------- State ---------- */

  let state = { current: null, sessions: [] };
  try { const raw = localStorage.getItem(KEY); if (raw) state = JSON.parse(raw); } catch (e) { /* storage unavailable: run in memory */ }
  if (!state || !Array.isArray(state.sessions)) state = { current: null, sessions: [] };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* in-memory only */ } };
  const cur = () => state.sessions.find((s) => s.id === state.current) || null;

  const today = new Date();
  const todayIdx = (today.getDay() + 6) % 7;
  const weekKey = (() => { const d = new Date(today); d.setDate(d.getDate() - todayIdx); return d.toISOString().slice(0, 10); })();

  const ui = { view: 'today', day: todayIdx, ob: null, printing: false };

  const blank = () => ({ prenom: '', sexe: '', age: '', taille: '', poids: '', objectif: '', niveau: 50, seances: 3, materiel: [], restrictions: '', sports: [], autre: '', petitdej: '', eviter: [] });

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
    let s = ex.s + (lvIdx(p.niveau) - 1);
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
        return { ...k, kind: 'cardio', day, title: k.type };
      }
      const t = TPL[c];
      const rot = t.ex.slice(1);
      const shift = sess.seed % rot.length;
      const ex = [t.ex[0], ...rot.slice(shift), ...rot.slice(0, shift)];
      return { kind: 'muscu', day, num: ++mi, tpl: t, ex, title: `Séance ${mi} · ${t.zone}`, short: t.zone };
    });
    return { items, byDay: (d) => items.find((it) => it.day === d) || null };
  }

  function sessionMeta(item, p, seed) {
    let sec = 0;
    item.ex.forEach((id, i) => { const sr = setsReps(E[id], p, seed, i); sec += sr.s * (E[id].rest + 40); });
    return { duree: round(sec / 60 + 10, 5), rpe: [6, 7, 8][lvIdx(p.niveau)] };
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

  /* ---------- Rendering helpers ---------- */

  const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const ckKey = (d) => `${weekKey}-${d}`;

  function checkinHTML(sess) {
    const ck = sess.checkins[ckKey(ui.day)];
    const opts = [['faite', 'Faite'], ['raccourcie', 'Raccourcie'], ['manquee', 'Manquée']];
    return `<div class="checkin"><p class="label" id="ck-label">Ta séance de ${DAYS_FULL[ui.day]}</p>
      <div class="seg seg--inv" role="group" aria-labelledby="ck-label">${opts.map(([k, l]) => `<button type="button" data-checkin="${k}" aria-pressed="${ck === k}">${l}</button>`).join('')}</div></div>`;
  }

  function levelControl(p) {
    return `<div class="level">
      <label class="label" for="level">Niveau</label>
      <input type="range" id="level" data-level min="0" max="100" step="1" value="${p.niveau}" aria-describedby="level-out">
      <output id="level-out" for="level">${lvLabel(p.niveau)}</output>
    </div>`;
  }

  function boutHTML(id, i, sess, key) {
    const p = sess.profile; const ex = E[id]; const v = variant(ex, p);
    const sd = sportData(p);
    return `<li class="bout${i === 0 ? ' bout--main' : ''}">
      <h3 class="bout-name"><span class="fit">${esc(v.n)}</span></h3>
      <dl class="specs">
        <div><dt>Muscles</dt><dd>${esc(ex.m)}</dd></div>
        <div><dt>Séries × rép.</dt><dd data-sr="${id}" data-i="${i}">${setsReps(ex, p, sess.seed, i).txt}</dd></div>
        <div><dt>Repos</dt><dd>${ex.rest} s</dd></div>
        <div><dt>Poids conseillé</dt><dd data-w="${id}">${esc(loadText(v, p))}</dd></div>
      </dl>
      <details>
        <summary>Technique, erreur à éviter, vidéo</summary>
        <div class="more">
          <p><b>Pourquoi cet exercice.</b> ${esc(sd[ex.key] || sd[key])}</p>
          <p><b>Explication.</b> ${esc(ex.tech)}</p>
          <p><b>Erreur à éviter.</b> ${esc(ex.err)}</p>
          <p><a href="${yt(v.n + ' technique')}" target="_blank" rel="noopener">Chercher « ${esc(v.n)} technique » sur YouTube</a></p>
        </div>
      </details>
    </li>`;
  }

  function muscuSheet(item, sess, withLevel) {
    const p = sess.profile; const meta = sessionMeta(item, p, sess.seed);
    const note = restrictionNote(p, item.tpl.key);
    return `<article class="sheet sheet--jaune">
      <div class="sheet-head"><h2 class="h2">${esc(item.title)}</h2>${withLevel ? '' : `<span class="tag">${DAYS[item.day]}</span>`}</div>
      ${withLevel ? checkinHTML(sess) : ''}
      <p><b>Objectif :</b> ${esc(item.tpl.obj)}.</p>
      ${note ? `<p class="note">${esc(note)}</p>` : ''}
      ${withLevel ? levelControl(p) : ''}
      <ol class="bill">${item.ex.map((id, i) => boutHTML(id, i, sess, item.tpl.key)).join('')}</ol>
      <dl class="facts">
        <div><dt>Objectif principal</dt><dd>${esc(item.tpl.obj)}</dd></div>
        <div><dt>Durée moyenne</dt><dd data-duree="${item.num}">${meta.duree} min</dd></div>
        <div><dt>Intensité perçue</dt><dd data-rpe>${meta.rpe} / 10</dd></div>
      </dl>
    </article>`;
  }

  function cardioSheet(item, sess, isToday) {
    const note = /genou/i.test(sess.profile.restrictions || '') ? 'Genou signalé : remplace les sauts et les sprints par du vélo ou du rameur à la même durée.' : '';
    return `<article class="sheet sheet--orange">
      <div class="sheet-head"><h2 class="h2">Cardio · ${esc(item.type)}</h2>${isToday ? '' : `<span class="tag">${DAYS[item.day]}</span>`}</div>
      ${isToday ? checkinHTML(sess) : ''}
      ${note ? `<p class="note">${esc(note)}</p>` : ''}
      <dl class="facts">
        <div><dt>Type</dt><dd>${esc(item.type)}</dd></div>
        <div><dt>Durée</dt><dd>${item.duree} min</dd></div>
        <div><dt>Format</dt><dd>${esc(item.format)}</dd></div>
      </dl>
      <p><b>Objectif :</b> ${esc(item.obj)}.</p>
      <p><b>Conseils techniques :</b> ${esc(item.conseils)}</p>
      <p><a href="${yt(item.q)}" target="_blank" rel="noopener">Chercher « ${esc(item.q)} » sur YouTube</a></p>
    </article>`;
  }

  function recoSheet(sess, title) {
    const p = sess.profile;
    const eau = (p.poids * 0.035).toFixed(1).replace('.', ',');
    return `<article class="sheet">
      <h2 class="h2">${title}</h2>
      <p><b>Étirements recommandés :</b> fléchisseurs de hanche, ischio-jambiers, pectoraux, dorsaux, mollets. 30 secondes par zone, deux passages.</p>
      <p><b>Conseils récupération :</b> environ ${eau} litres d’eau par jour, 7 à 9 heures de sommeil, 10 minutes de mobilité les jours sans séance, au moins un jour de repos complet par semaine.</p>
      <p><b>Astuce pro :</b> ${esc(sportData(p).tip)}</p>
    </article>`;
  }

  function gramsLabel(it) {
    const f = FOOD[it.id];
    if (f.unit) { const n = it.g / f.unit; return `${n} ${f.un}${n > 1 ? 's' : ''} · ${it.g} g`; }
    return `${it.g} g`;
  }

  function breakfastSheet(sess, dayItem, full) {
    const p = sess.profile;
    const missed = sess.checkins[ckKey(ui.day)] === 'manquee';
    const training = dayItem && !missed;
    const b = breakfast(p, training ? 1.08 : 0.95);
    const kc = { p: b.tot.p * 4, g: b.tot.g * 4, l: b.tot.l * 9 };
    const sum = kc.p + kc.g + kc.l || 1;
    const quick = b.swaps ? `${b.tpl.alt} Remplace les aliments à éviter par ceux de la liste ci-dessus.` : b.tpl.alt;
    return `<article class="sheet sheet--rose">
      <div class="sheet-head"><h2 class="h2">Petit-déjeuner ${PDJ[p.petitdej]}</h2><span class="tag">${training ? 'Jour d’entraînement' : 'Jour de repos'}</span></div>
      ${full ? `<div class="seg" role="group" aria-label="Type de petit-déjeuner">${Object.entries(PDJ).map(([k, l]) => `<button type="button" data-bf="${k}" aria-pressed="${p.petitdej === k}">${l[0].toUpperCase() + l.slice(1)}</button>`).join('')}</div>` : ''}
      <table class="table">
        <caption class="label">Ingrédients</caption>
        <tbody>${b.items.map((it) => `<tr><th scope="row">${esc(FOOD[it.id].n)}</th><td>${gramsLabel(it)}</td></tr>`).join('')}</tbody>
      </table>
      <div>
        <p class="label mb">Valeurs nutritionnelles estimées</p>
        <dl class="macros">
          <div><dt>Calories</dt><dd>${b.tot.k} kcal</dd></div>
          <div><dt>Protéines</dt><dd>${b.tot.p} g</dd></div>
          <div><dt>Glucides</dt><dd>${b.tot.g} g</dd></div>
          <div><dt>Lipides</dt><dd>${b.tot.l} g</dd></div>
        </dl>
        <div class="macro-bar" role="img" aria-label="Répartition des calories : protéines ${Math.round((kc.p / sum) * 100)} %, glucides ${Math.round((kc.g / sum) * 100)} %, lipides ${Math.round((kc.l / sum) * 100)} %">
          <i class="p" style="width:${(kc.p / sum) * 100}%"></i><i class="g" style="width:${(kc.g / sum) * 100}%"></i><i class="l" style="width:${(kc.l / sum) * 100}%"></i>
        </div>
        <p class="small">Plein : protéines. Hachuré : glucides. Vide : lipides.</p>
      </div>
      <p><b>Explication :</b> ${esc(b.tpl.why)} ${esc(sportData(p).food)} ${esc(GOAL_FOOD[p.objectif])}</p>
      <p><b>Suggestion de boisson :</b> ${esc(p.eviter.includes('lactose') && p.objectif === 'masse' ? 'Smoothie protéiné : 250 ml de boisson au soja, une poignée de fruits rouges' : DRINK[p.objectif])}.</p>
      <p><b>Alternative rapide :</b> ${esc(quick)}</p>
    </article>`;
  }

  function coachNote(sess, dayItem) {
    const p = sess.profile; const ck = sess.checkins[ckKey(ui.day)];
    const prot = Math.round(p.poids * 0.3);
    if (!dayItem) return 'Jour de repos : petit-déjeuner allégé en glucides, priorité au sommeil et à dix minutes de mobilité.';
    if (ck === 'faite') return `Séance validée. Vise environ ${prot} g de protéines dans les deux heures. Si tes dernières répétitions étaient propres, on montera les charges la prochaine fois.`;
    if (ck === 'raccourcie') return 'Séance raccourcie, c’est noté. Les trois premiers exercices comptent comme base ; les suivants passent en début de prochaine séance.';
    if (ck === 'manquee') return 'Séance manquée : pas de rattrapage en double. Elle glisse sur ton prochain jour libre et le petit-déjeuner de ce jour repasse en version repos.';
    return `Au programme : ${dayItem.title}. Ton petit-déjeuner est renforcé pour alimenter l’effort. Dis-moi ensuite comment ça s’est passé.`;
  }

  function coachSheet(sess, dayItem) {
    return `<article class="sheet sheet--vert">
      <h2 class="h2">Le mot du coach</h2>
      <p aria-live="polite">${esc(coachNote(sess, dayItem))}</p>
      <p><button type="button" class="btn btn--ghost" data-view="coach">Poser une question</button></p>
    </article>`;
  }

  const foot = '<p class="foot">Prototype : le programme et les valeurs affichés sont des exemples calculés dans ton navigateur, aucun modèle d’IA n’est encore connecté. Les valeurs nutritionnelles sont des estimations. En cas de douleur ou de pathologie, demande l’avis d’un professionnel de santé.</p>';

  /* ---------- Views ---------- */

  function viewToday(sess) {
    const plan = buildPlan(sess); const item = plan.byDay(ui.day);
    const d = new Date(today); d.setDate(d.getDate() + (ui.day - todayIdx));
    const date = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    const week = DAYS.map((l, i) => {
      const it = plan.byDay(i);
      const kind = it ? (it.kind === 'muscu' ? 'Muscu' : 'Cardio') : 'Repos';
      return `<button type="button" class="day${it ? ` day--${it.kind}` : ''}${i === todayIdx ? ' is-today' : ''}" data-day="${i}" aria-pressed="${i === ui.day}" aria-label="${l}, ${kind}${i === todayIdx ? ', aujourd’hui' : ''}"><b>${l}</b><span>${kind}</span></button>`;
    }).join('');
    const main = !item ? recoSheet(sess, 'Repos et récupération') : item.kind === 'muscu' ? muscuSheet(item, sess, true) : cardioSheet(item, sess, true);
    return `<header class="view-head"><div><h1 class="h1">${esc(date)}</h1><p class="lede">${esc(sess.profile.prenom)}, voici ton plan ${ui.day === todayIdx ? 'du jour' : 'pour ce jour'} : ${esc(sportName(sess.profile))}, objectif ${OBJECTIFS[sess.profile.objectif].toLowerCase()}.</p></div></header>
      <div class="week" role="group" aria-label="Semaine">${week}</div>
      <div class="today-grid">${main}<div class="today-side">${breakfastSheet(sess, item, false)}${coachSheet(sess, item)}</div></div>${foot}`;
  }

  function profileFacts(p, nutrition) {
    const rows = [['Sexe', p.sexe === 'femme' ? 'Femme' : 'Homme'], ['Âge', `${p.age} ans`], ['Taille', `${p.taille} cm`], ['Poids', `${p.poids} kg`], ['Objectif', OBJECTIFS[p.objectif]], [nutrition ? 'Sport principal' : 'Sports', nutrition ? sportName(p) : sportList(p)]];
    if (nutrition) rows.push(['Niveau d’activité', activity(p).label]);
    else rows.push(['Niveau', `<span data-lv>${lvLabel(p.niveau)}</span>`], ['Séances', `${p.seances} par semaine`], ['Matériel', p.materiel.map((m) => MATERIEL[m]).join(', ')]);
    return `<dl class="facts">${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${k === 'Niveau' ? v : esc(v)}</dd></div>`).join('')}</dl>`;
  }

  function viewProgramme(sess) {
    const p = sess.profile; const plan = buildPlan(sess);
    return `<header class="view-head"><div><h1 class="h1">Programme sportif personnalisé</h1><p class="lede">${OBJECTIFS[p.objectif]} · ${esc(sportList(p))}. Version ${sess.seed + 1} de ton programme.</p></div>
      <div class="actions"><button type="button" class="btn" data-act="regen">Régénérer</button><button type="button" class="btn btn--ghost" data-act="print">Imprimer</button></div></header>
      <div class="stack">
        <article class="sheet"><h2 class="h2">Profil résumé</h2>${profileFacts(p, false)}${levelControl(p)}<p class="small muted">Déplace le curseur : les charges et le nombre de séries de toutes les séances se recalculent.</p></article>
        ${plan.items.map((it) => (it.kind === 'muscu' ? muscuSheet(it, sess, false) : cardioSheet(it, sess, false))).join('')}
        ${recoSheet(sess, 'Récupération et conseils')}
      </div>${foot}`;
  }

  function viewNutrition(sess) {
    const p = sess.profile; const item = buildPlan(sess).byDay(ui.day);
    return `<header class="view-head"><div><h1 class="h1">Nutrition et petit-déjeuner</h1><p class="lede">Besoin estimé : ${dailyKcal(p)} kcal par jour. Le petit-déjeuner en couvre environ un quart et s’ajuste selon que tu t’entraînes ou non (${DAYS_FULL[ui.day]} affiché).</p></div></header>
      <div class="today-grid">
        ${breakfastSheet(sess, item, true)}
        <div class="today-side"><article class="sheet"><h2 class="h2">Profil de l’utilisateur</h2>${profileFacts(p, true)}
          <p><b>À éviter :</b> ${p.eviter.length ? esc(p.eviter.map((a) => EVITER[a]).join(', ')) : 'rien de signalé'}.</p>
          <p><button type="button" class="btn btn--ghost" data-act="edit">Modifier mon profil</button></p></article></div>
      </div>${foot}`;
  }

  function viewCoach(sess) {
    const msgs = sess.chat.length
      ? sess.chat.map((m) => `<div class="msg${m.me ? ' msg--me' : ''}"><b>${m.me ? 'Toi' : 'Coach'}</b>${esc(m.t)}</div>`).join('')
      : '<p class="empty">Aucun message pour l’instant. Demande par exemple : « Par quoi remplacer le squat ? », « J’ai faim le soir », « Je suis fatigué aujourd’hui ».</p>';
    return `<header class="view-head"><div><h1 class="h1">Ton coach</h1><p class="lede">Pose une question sur ta séance ou ton assiette. Les réponses de ce prototype sont des exemples écrits à l’avance.</p></div></header>
      <article class="sheet sheet--vert">
        <div class="chat" id="chat" role="log" aria-label="Conversation avec le coach">${msgs}</div>
        <form class="chat-form" id="chat-form"><input class="input" id="chat-input" type="text" aria-label="Ton message" placeholder="Écris ta question" autocomplete="off" required><button class="btn" type="submit">Envoyer</button></form>
      </article>${foot}`;
  }

  function viewProfil(sess) {
    const p = sess.profile;
    return `<header class="view-head"><div><h1 class="h1">${esc(p.prenom)}</h1><p class="lede">Ta session est enregistrée dans ce navigateur. Chaque personne a la sienne.</p></div></header>
      <div class="stack">
        <article class="sheet"><h2 class="h2">Mon profil</h2>${profileFacts(p, false)}
          <p><b>Petit-déjeuner :</b> ${PDJ[p.petitdej]}. <b>À éviter :</b> ${p.eviter.length ? esc(p.eviter.map((a) => EVITER[a]).join(', ')) : 'rien de signalé'}. <b>Restrictions :</b> ${p.restrictions.trim() ? esc(p.restrictions) : 'aucune'}.</p>
          <div class="actions"><button type="button" class="btn" data-act="edit">Modifier mon profil</button><button type="button" class="btn btn--ghost" data-act="new">Nouvelle session</button></div></article>
        <article class="sheet"><h2 class="h2">Sessions sur cet appareil</h2>
          <ul class="session-list">${state.sessions.map((s) => `<li><span><b>${esc(s.profile.prenom)}</b> · ${esc(sportName(s.profile))} · ${OBJECTIFS[s.profile.objectif]}</span>${s.id === sess.id ? '<span class="tag">Active</span>' : `<button type="button" class="btn btn--ghost" data-switch="${s.id}">Ouvrir</button>`}</li>`).join('')}</ul>
          ${ui.confirmDelete ? `<div class="note" role="alertdialog" aria-label="Confirmer la suppression"><p>Supprimer définitivement la session de ${esc(p.prenom)} ? Son programme et ses messages seront effacés.</p><div class="actions"><button type="button" class="btn" data-act="delete-yes">Supprimer</button><button type="button" class="btn btn--ghost" data-act="delete-no">Garder</button></div></div>` : `<p><button type="button" class="btn btn--danger" data-act="delete">Supprimer la session de ${esc(p.prenom)}</button></p>`}</article>
      </div>${foot}`;
  }

  /* ---------- Onboarding ---------- */

  const STEPS = ['Profil de base', 'Niveau et matériel', 'Sport de prédilection', 'Petit-déjeuner'];
  const radio = (name, val, label, cur) => `<label class="choice"><input type="radio" name="${name}" value="${val}"${cur === val ? ' checked' : ''}><span>${label}</span></label>`;
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
      <fieldset><legend>Matériel disponible (plusieurs choix possibles)</legend><div class="choices">${Object.entries(MATERIEL).map(([k, l]) => check('materiel', k, l, p.materiel)).join('')}</div></fieldset>
      <div class="field"><label for="restrictions">Pathologies, douleurs ou restrictions (facultatif)</label><textarea id="restrictions" name="restrictions" placeholder="Exemple : douleur au genou droit">${esc(p.restrictions)}</textarea></div>`;
    if (o.step === 2) return `
      <fieldset><legend>Ton ou tes sports (le premier coché oriente le programme)</legend><div class="choices">${SPORTS.map((s) => check('sports', s, s === 'JJB' ? 'JJB (Jiu-Jitsu Brésilien)' : s, p.sports)).join('')}</div></fieldset>
      <div class="field"><label for="autre">Autre sport (facultatif)</label><input type="text" id="autre" name="autre" value="${esc(p.autre)}" placeholder="Exemple : escalade"></div>`;
    return `
      <fieldset><legend>Type de petit-déjeuner (obligatoire)</legend><div class="choices choices--big">
        <label class="choice"><input type="radio" name="petitdej" value="sale"${p.petitdej === 'sale' ? ' checked' : ''}><span><b>Salé</b><small>Œufs, pain complet, avocat</small></span></label>
        <label class="choice"><input type="radio" name="petitdej" value="sucre"${p.petitdej === 'sucre' ? ' checked' : ''}><span><b>Sucré</b><small>Avoine, skyr, fruits</small></span></label>
        <label class="choice"><input type="radio" name="petitdej" value="mixte"${p.petitdej === 'mixte' ? ' checked' : ''}><span><b>Sucré-salé</b><small>Œufs, pain, pomme, miel</small></span></label>
      </div></fieldset>
      <fieldset><legend>Allergies ou aliments à éviter (facultatif)</legend><div class="choices">${Object.entries(EVITER).map(([k, l]) => check('eviter', k, l, p.eviter)).join('')}</div></fieldset>`;
  }

  function viewOnboarding() {
    const o = ui.ob;
    return `<div class="ob">
      <div class="ob-side"><p class="wordmark">Relance</p>
        <p class="lede">Ton programme sportif et ton petit-déjeuner, construits à partir de ton profil, de ton sport et de ton objectif.</p>
        <ol class="steps">${STEPS.map((s, i) => `<li${i === o.step ? ' aria-current="step"' : ''}${i < o.step ? ' class="done"' : ''}>${s}</li>`).join('')}</ol></div>
      <form class="ob-form" id="ob-form" novalidate>
        <div><h1 class="h1" id="ob-title" tabindex="-1">${STEPS[o.step]}</h1><p class="muted step-count">Étape ${o.step + 1} sur ${STEPS.length}</p></div>
        ${stepFields(o)}
        <p class="error" id="ob-error" role="alert"></p>
        <div class="ob-actions">
          ${o.step > 0 ? '<button type="button" class="btn btn--ghost" data-act="ob-back">Retour</button>' : (state.sessions.length ? '<button type="button" class="btn btn--ghost" data-act="ob-cancel">Annuler</button>' : '<span></span>')}
          <button type="submit" class="btn">${o.step === STEPS.length - 1 ? 'Générer mon programme' : 'Continuer'}</button>
        </div>
      </form></div>`;
  }

  function collect() {
    const f = $('#ob-form'); const p = ui.ob.p; const fd = new FormData(f);
    if (ui.ob.step === 0) { p.prenom = (fd.get('prenom') || '').trim(); p.sexe = fd.get('sexe') || ''; ['age', 'taille', 'poids'].forEach((k) => { p[k] = fd.get(k) ? +fd.get(k) : ''; }); p.objectif = fd.get('objectif') || ''; }
    if (ui.ob.step === 1) { p.niveau = +fd.get('niveau'); p.seances = +(fd.get('seances') || 0); p.materiel = fd.getAll('materiel'); p.restrictions = fd.get('restrictions') || ''; }
    if (ui.ob.step === 2) { p.sports = fd.getAll('sports'); p.autre = (fd.get('autre') || '').trim(); }
    if (ui.ob.step === 3) { p.petitdej = fd.get('petitdej') || ''; p.eviter = fd.getAll('eviter'); }
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
    if (s === 3 && !p.petitdej) return 'Choisis un type de petit-déjeuner : salé, sucré ou sucré-salé.';
    return '';
  }

  function finishOnboarding() {
    const o = ui.ob;
    if (o.editId) { const s = state.sessions.find((x) => x.id === o.editId); s.profile = o.p; s.seed += 1; state.current = s.id; }
    else { const s = { id: `s${Date.now()}`, seed: 0, profile: o.p, checkins: {}, chat: [] }; state.sessions.push(s); state.current = s.id; }
    save(); ui.ob = null; ui.view = 'today'; ui.day = todayIdx;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('#app').classList.add('is-onboarding');
    $('#main').innerHTML = `<div class="loading" role="status"><h1 class="h1">Impression de ton programme</h1><p>Profil, sport et objectif pris en compte.</p><div class="bar"><i></i></div></div>`;
    setTimeout(() => { ui.printing = true; render(); ui.printing = false; }, reduce ? 300 : 1600);
  }

  /* ---------- Render ---------- */

  function fitAll() {
    $$('.bout-name').forEach((h) => {
      const span = h.firstElementChild; if (!span) return;
      h.classList.remove('wrap');
      h.style.fontSize = '';
      const w = h.clientWidth; if (!w) return;
      let lo = 62; let hi = 125;
      h.style.fontStretch = '125%';
      if (span.offsetWidth <= w) {
        const base = parseFloat(getComputedStyle(h).fontSize);
        h.style.fontSize = `${Math.min(96, base * Math.min(1.45, (w - 2) / span.offsetWidth))}px`;
        return;
      }
      h.style.fontStretch = '62%';
      if (span.offsetWidth > w) { h.classList.add('wrap'); return; }
      for (let i = 0; i < 7; i++) { const mid = (lo + hi) / 2; h.style.fontStretch = `${mid}%`; if (span.offsetWidth <= w) lo = mid; else hi = mid; }
      h.style.fontStretch = `${lo}%`;
    });
  }

  function renderRail(sess) {
    $$('#nav button').forEach((b) => { if (b.dataset.view === ui.view) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    $('#session-select').innerHTML = state.sessions.map((s) => `<option value="${s.id}"${sess && s.id === sess.id ? ' selected' : ''}>${esc(s.profile.prenom)} · ${esc(sportName(s.profile))}</option>`).join('');
  }

  function render() {
    const app = $('#app'); const main = $('#main'); const sess = cur();
    if (!sess && !ui.ob) ui.ob = { step: 0, p: blank(), editId: null };
    if (ui.ob) { app.classList.add('is-onboarding'); main.innerHTML = viewOnboarding(); return; }
    app.classList.remove('is-onboarding');
    const views = { today: viewToday, programme: viewProgramme, nutrition: viewNutrition, coach: viewCoach, profil: viewProfil };
    main.classList.toggle('printing', ui.printing);
    main.innerHTML = (views[ui.view] || viewToday)(sess);
    renderRail(sess);
    fitAll();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
    const chat = $('#chat'); if (chat) chat.scrollTop = chat.scrollHeight;
  }

  function updateLevel(v) {
    const sess = cur(); if (!sess) return;
    sess.profile.niveau = v; const p = sess.profile;
    $$('[data-w]').forEach((el) => { el.textContent = loadText(variant(E[el.dataset.w], p), p); });
    $$('[data-sr]').forEach((el) => { el.textContent = setsReps(E[el.dataset.sr], p, sess.seed, +el.dataset.i).txt; });
    $$('[data-rpe]').forEach((el) => { el.textContent = `${[6, 7, 8][lvIdx(v)]} / 10`; });
    const plan = buildPlan(sess);
    $$('[data-duree]').forEach((el) => { const it = plan.items.find((x) => x.num === +el.dataset.duree); if (it) el.textContent = `${sessionMeta(it, p, sess.seed).duree} min`; });
    $$('[data-lv]').forEach((el) => { el.textContent = lvLabel(v); });
    const out = $('#level-out'); if (out) out.textContent = lvLabel(v);
  }

  function reply(text, sess) {
    const t = text.toLowerCase(); const p = sess.profile;
    if (/faim/.test(t)) return 'La faim du soir vient souvent d’un déjeuner trop léger en protéines. Ajoute 100 à 150 g de skyr ou deux œufs à 16 h et garde un dîner complet : légumes, féculent, protéine.';
    if (/fatigu|crev|épuis|dormi/.test(t)) return 'Journée de fatigue : garde la séance mais retire une série à chaque exercice et reste dans le bas des charges. Si tu as dormi moins de six heures, remplace-la par 30 minutes de marche.';
    if (/mal|douleur|bless/.test(t)) return 'Une douleur n’est pas une courbature : arrête l’exercice concerné, garde ceux qui ne déclenchent rien, et consulte si elle persiste plus de quelques jours. Note-la dans ton profil pour que j’adapte le programme.';
    if (/remplac|alternative|à la place/.test(t)) return `Pour remplacer un exercice, garde le même groupe musculaire et le même nombre de séries. Avec ton matériel (${p.materiel.map((m) => MATERIEL[m].toLowerCase()).join(', ')}), dis-moi lequel te gêne et je te propose l’équivalent.`;
    if (/pourquoi/.test(t)) return `Chaque exercice est choisi pour ton sport (${sportName(p)}) et ton objectif (${OBJECTIFS[p.objectif].toLowerCase()}). Ouvre « Technique, erreur à éviter, vidéo » sous un exercice : la raison y est écrite.`;
    if (/petit|déj|manger|repas|calorie/.test(t)) return `Ton petit-déjeuner couvre environ un quart de tes ${dailyKcal(p)} kcal du jour. Il monte un peu les jours d’entraînement et redescend les jours de repos. Tu peux changer de type dans l’onglet Nutrition.`;
    return 'Bien reçu. Dans ce prototype, je réponds à quelques thèmes : la faim, la fatigue, une douleur, remplacer un exercice, le pourquoi d’un choix, ton petit-déjeuner.';
  }

  /* ---------- Events ---------- */

  function go(view) { ui.view = view; ui.confirmDelete = false; render(); $('#main').focus({ preventScroll: true }); window.scrollTo(0, 0); }
  function startOnboarding(editId) {
    const s = editId ? state.sessions.find((x) => x.id === editId) : null;
    ui.ob = { step: 0, p: s ? JSON.parse(JSON.stringify(s.profile)) : blank(), editId: editId || null };
    render(); window.scrollTo(0, 0);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button'); if (!t) return;
    const sess = cur();
    if (t.dataset.view) return go(t.dataset.view);
    if (t.dataset.day != null) { ui.day = +t.dataset.day; render(); const b = $(`[data-day="${ui.day}"]`); if (b) b.focus(); return; }
    if (t.dataset.checkin && sess) { const k = ckKey(ui.day); sess.checkins[k] = sess.checkins[k] === t.dataset.checkin ? undefined : t.dataset.checkin; save(); render(); const b = $(`[data-checkin="${t.dataset.checkin}"]`); if (b) b.focus(); return; }
    if (t.dataset.bf && sess) { sess.profile.petitdej = t.dataset.bf; save(); render(); const b = $(`[data-bf="${t.dataset.bf}"]`); if (b) b.focus(); return; }
    if (t.dataset.switch) { state.current = t.dataset.switch; save(); ui.day = todayIdx; return go('today'); }
    if (t.id === 'new-session') return startOnboarding(null);
    const a = t.dataset.act; if (!a) return;
    if (a === 'regen' && sess) { sess.seed += 1; save(); ui.printing = true; render(); ui.printing = false; }
    if (a === 'print') window.print();
    if (a === 'edit' && sess) startOnboarding(sess.id);
    if (a === 'new') startOnboarding(null);
    if (a === 'delete') { ui.confirmDelete = true; render(); const y = $('[data-act="delete-no"]'); if (y) y.focus(); }
    if (a === 'delete-no') { ui.confirmDelete = false; render(); }
    if (a === 'delete-yes' && sess) {
      ui.confirmDelete = false;
      state.sessions = state.sessions.filter((s) => s.id !== sess.id); state.current = state.sessions[0] ? state.sessions[0].id : null; save(); ui.view = 'today'; render();
    }
    if (a === 'ob-back') { collect(); ui.ob.step -= 1; render(); $('#ob-title').focus(); }
    if (a === 'ob-cancel') { ui.ob = null; render(); }
  });

  document.addEventListener('input', (e) => {
    if (e.target.matches('[data-level]')) updateLevel(+e.target.value);
    if (e.target.id === 'niveau') $('#niveau-out').textContent = lvLabel(+e.target.value);
  });
  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-level]')) { save(); fitAll(); }
    if (e.target.id === 'session-select') { state.current = e.target.value; save(); ui.day = todayIdx; go('today'); }
  });

  document.addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id === 'ob-form') {
      collect(); const err = validate();
      if (err) { $('#ob-error').textContent = err; return; }
      if (ui.ob.step < STEPS.length - 1) { ui.ob.step += 1; render(); $('#ob-title').focus(); window.scrollTo(0, 0); } else finishOnboarding();
    }
    if (e.target.id === 'chat-form') {
      const sess = cur(); const input = $('#chat-input'); const text = input.value.trim(); if (!text || !sess) return;
      sess.chat.push({ me: true, t: text }, { me: false, t: reply(text, sess) }); save(); render(); $('#chat-input').focus();
    }
  });

  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(fitAll, 120); });

  render();
})();
