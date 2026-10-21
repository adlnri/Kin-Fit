/* Meal library and planner: breakfast, lunch, dinner, snack and cheat meals,
   filtered by diet (vegetarian, pescatarian, vegan), practice (halal, kosher, no pork) and allergens.
   Authored sample dishes; values are estimates. */
(() => {
  'use strict';
  const NA = window.NA;

  const ALLERGENES = { gluten: 'Gluten', lactose: 'Lactose', oeufs: 'Œufs', coque: 'Fruits à coque et arachide', poisson: 'Poisson', crustaces: 'Crustacés et fruits de mer', soja: 'Soja', sesame: 'Sésame' };
  const REGIMES = { omni: 'Je mange de tout', vegetarien: 'Végétarien', pescetarien: 'Pescétarien', vegan: 'Végan' };
  const PRATIQUES = { halal: 'Halal', casher: 'Casher', sansporc: 'Sans porc' };

  function forbidden(p) {
    const f = new Set(p.eviter || []);
    const r = p.regime || 'omni';
    if (r === 'vegetarien') ['viande', 'poisson', 'crustaces'].forEach((x) => f.add(x));
    if (r === 'pescetarien') f.add('viande');
    if (r === 'vegan') ['viande', 'poisson', 'crustaces', 'oeufs', 'lactose', 'animal'].forEach((x) => f.add(x));
    const pr = p.pratiques || [];
    if (pr.length) f.add('porc');
    if (pr.includes('casher')) f.add('crustaces');
    return f;
  }
  const allowed = (d, f, p) => !d.tags.some((t) => f.has(t)) && !((p.pratiques || []).includes('casher') && d.md);
  const meatSuffix = (p) => ((p.pratiques || []).includes('halal') ? ' halal' : (p.pratiques || []).includes('casher') ? ' casher' : '');

  function summary(p) {
    const parts = [];
    if (p.regime && p.regime !== 'omni') parts.push(REGIMES[p.regime].toLowerCase());
    (p.pratiques || []).forEach((x) => parts.push(PRATIQUES[x].toLowerCase()));
    (p.eviter || []).forEach((x) => parts.push(`sans ${ALLERGENES[x].toLowerCase()}`));
    return parts.length ? parts.join(' · ') : 'aucune restriction';
  }

  /* ---------- Breakfast respecting every constraint (replaces the engine's) ---------- */

  Object.assign(NA.FOOD, {
    coco: { n: 'Yaourt au lait de coco', k: 110, p: 1, g: 6, l: 9 },
    erable: { n: 'Sirop d’érable', k: 260, p: 0, g: 67, l: 0 },
    pois: { n: 'Pois chiches', k: 164, p: 9, g: 27, l: 2.6 },
  });
  const FTAGS = { oeuf: ['oeufs', 'animal'], pain: ['gluten'], dinde: ['viande', 'animal'], avoine: ['gluten'], skyr: ['lactose', 'animal'], soja: ['soja'], miel: ['animal'], amande: ['coque'], frais: ['lactose', 'animal'], houmous: ['sesame'], cacahuete: ['coque'], tofu: ['soja'] };
  const ALT = { oeuf: ['oeuf', 'tofu', 'pois'], pain: ['pain', 'painsg'], dinde: ['dinde', 'oeuf', 'tofu', 'pois'], avoine: ['avoine', 'sarrasin'], skyr: ['skyr', 'soja', 'coco'], miel: ['miel', 'erable'], amande: ['amande', 'courge'], frais: ['frais', 'houmous', 'avocat'], cacahuete: ['cacahuete', 'tournesol'] };

  NA.breakfast = (p, dayFactor) => {
    const FOOD = NA.FOOD; const tpl = NA.BF[p.petitdej] || NA.BF.sale; const f = forbidden(p);
    const items = [];
    tpl.items.forEach(([id, g]) => {
      const cand = (ALT[id] || [id]).find((c) => !(FTAGS[c] || []).some((t) => f.has(t)));
      if (!cand) return;
      const prev = items.find((x) => x.id === cand);
      if (prev) { prev.g += g; return; }
      items.push({ id: cand, g, swapped: cand !== id });
    });
    const kcalOf = (list) => list.reduce((s, it) => s + (FOOD[it.id].k * it.g) / 100, 0);
    const target = NA.dailyKcal(p) * 0.25 * dayFactor;
    const fixed = kcalOf(items.filter((it) => FOOD[it.id].fixed));
    const k = (target - fixed) / Math.max(1, kcalOf(items) - fixed);
    items.forEach((it) => {
      const fd = FOOD[it.id]; if (fd.fixed) return;
      if (fd.unit) it.g = Math.max(1, Math.round((it.g * k) / fd.unit)) * fd.unit;
      else it.g = Math.max(5, Math.round((it.g * k) / 5) * 5);
    });
    const tot = { k: 0, p: 0, g: 0, l: 0 };
    items.forEach((it) => { const fd = FOOD[it.id]; ['k', 'p', 'g', 'l'].forEach((m) => { tot[m] += (fd[m] * it.g) / 100; }); });
    Object.keys(tot).forEach((m) => { tot[m] = Math.round(tot[m]); });
    return { items, tot, tpl, swaps: items.some((it) => it.swapped), meat: items.some((it) => it.id === 'dinde') ? meatSuffix(p) : '' };
  };

  /* ---------- Lunch, dinner and cheat meals ---------- */
  // ing: [name, grams, isMeat]; md = mixes meat and dairy (excluded for casher)
  const DISHES = [
    { id: 'bowl-poulet', t: 'plat', when: 'both', tags: ['viande'], k: 620, p: 45, g: 58, l: 22, ing: [['Filet de poulet', 150, 1], ['Quinoa cuit', 160], ['Avocat', 60], ['Légumes rôtis', 150], ['Huile d’olive', 8]], why: 'Protéines maigres et glucides complets pour récupérer sans lourdeur.' },
    { id: 'saumon-riz', t: 'plat', when: 'both', tags: ['poisson'], k: 640, p: 42, g: 62, l: 24, ing: [['Pavé de saumon', 140], ['Riz complet cuit', 170], ['Brocolis', 150], ['Citron et herbes', 10]], why: 'Oméga-3 du saumon contre l’inflammation, riz complet pour l’énergie durable.' },
    { id: 'chili-sin', t: 'plat', when: 'both', tags: [], k: 600, p: 26, g: 92, l: 12, ing: [['Haricots rouges', 150], ['Lentilles cuites', 100], ['Riz basmati cuit', 140], ['Sauce tomate épicée', 120], ['Poivrons', 80]], why: 'Légumineuses et céréales associées : protéines complètes et beaucoup de fibres.' },
    { id: 'curry-pois', t: 'plat', when: 'diner', tags: [], k: 650, p: 20, g: 90, l: 22, ing: [['Pois chiches', 160], ['Lait de coco léger', 100], ['Épinards', 80], ['Riz basmati cuit', 150], ['Curry et gingembre', 5]], why: 'Un plat réconfortant, riche en fibres et en fer végétal.' },
    { id: 'boeuf-saute', t: 'plat', when: 'dej', tags: ['viande', 'soja'], k: 640, p: 42, g: 70, l: 18, ing: [['Bœuf émincé', 140, 1], ['Nouilles de riz cuites', 180], ['Légumes sautés', 150], ['Sauce soja', 15]], why: 'Fer et zinc du bœuf pour l’oxygénation des muscles.' },
    { id: 'omelette', t: 'plat', when: 'diner', tags: ['oeufs'], k: 560, p: 30, g: 40, l: 30, ing: [['Œufs', 165], ['Pommes de terre', 200], ['Salade verte', 80], ['Huile d’olive', 8]], why: 'Rapide, rassasiant, et des protéines de très bonne qualité.' },
    { id: 'lentilles-feta', t: 'plat', when: 'dej', tags: ['lactose', 'animal'], k: 560, p: 28, g: 60, l: 20, ing: [['Lentilles vertes cuites', 200], ['Feta', 40], ['Concombre et tomates', 150], ['Huile d’olive', 8]], why: 'Une salade complète qui tient jusqu’au soir.' },
    { id: 'poke-thon', t: 'plat', when: 'dej', tags: ['poisson', 'soja', 'sesame'], k: 620, p: 40, g: 70, l: 16, ing: [['Thon frais', 130], ['Riz vinaigré', 170], ['Edamame', 60], ['Concombre et mangue', 100], ['Graines de sésame', 5]], why: 'Frais, léger et très protéiné pour les jours d’entraînement.' },
    { id: 'pates-dinde', t: 'plat', when: 'both', tags: ['viande', 'gluten'], k: 650, p: 42, g: 78, l: 16, ing: [['Pâtes complètes cuites', 200], ['Boulettes de dinde', 130, 1], ['Sauce tomate', 120], ['Parmesan ou levure maltée', 10]], why: 'Des glucides pour recharger après l’effort et une protéine maigre.' },
    { id: 'tofu-laque', t: 'plat', when: 'diner', tags: ['soja', 'sesame'], k: 580, p: 30, g: 72, l: 18, ing: [['Tofu ferme', 180], ['Riz complet cuit', 150], ['Bok choy', 120], ['Sauce soja et huile de sésame', 15]], why: 'Une protéine végétale complète, facile à digérer le soir.' },
    { id: 'crevettes', t: 'plat', when: 'dej', tags: ['crustaces'], k: 560, p: 38, g: 66, l: 12, ing: [['Crevettes', 160], ['Riz basmati cuit', 170], ['Courgettes', 150], ['Ail et citron', 10]], why: 'Très riche en protéines et pauvre en graisses.' },
    { id: 'tikka', t: 'plat', when: 'diner', tags: ['viande', 'lactose', 'animal'], md: true, k: 640, p: 46, g: 66, l: 18, ing: [['Poulet mariné', 150, 1], ['Yaourt nature', 60], ['Riz basmati cuit', 160], ['Épinards', 100]], why: 'Épices et yaourt pour une marinade tendre et protéinée.' },
    { id: 'cabillaud', t: 'plat', when: 'diner', tags: ['poisson'], k: 520, p: 38, g: 56, l: 12, ing: [['Dos de cabillaud', 160], ['Patate douce', 200], ['Haricots verts', 150], ['Huile d’olive', 6]], why: 'Léger le soir, avec des glucides lents pour bien dormir.' },
    { id: 'falafel-bowl', t: 'plat', when: 'dej', tags: ['gluten', 'sesame'], k: 640, p: 22, g: 80, l: 24, ing: [['Falafels au four', 120], ['Boulgour cuit', 150], ['Houmous', 50], ['Crudités', 120]], why: 'Végétal et gourmand, riche en fibres.' },
    { id: 'dinde-patate', t: 'plat', when: 'diner', tags: ['viande'], k: 560, p: 44, g: 58, l: 14, ing: [['Escalope de dinde', 150, 1], ['Purée de patate douce', 200], ['Champignons', 120]], why: 'Une assiette simple, protéinée et riche en potassium.' },
    { id: 'miso-saumon', t: 'plat', when: 'diner', tags: ['poisson', 'soja'], k: 580, p: 40, g: 62, l: 16, ing: [['Saumon grillé', 130], ['Riz japonais cuit', 160], ['Soupe miso', 250], ['Algues et cébette', 10]], why: 'Un dîner japonais léger, chaud et très digeste.' },
    { id: 'risotto-orge', t: 'plat', when: 'diner', tags: ['gluten', 'lactose', 'animal'], k: 600, p: 20, g: 86, l: 18, ing: [['Orge perlé cuit', 200], ['Champignons', 150], ['Parmesan', 20], ['Bouillon de légumes', 150]], why: 'Céréale complète à index glycémique bas.' },
    { id: 'steak-lentilles', t: 'plat', when: 'both', tags: [], k: 560, p: 26, g: 80, l: 14, ing: [['Galettes de lentilles corail', 150], ['Quinoa cuit', 150], ['Salade et crudités', 120], ['Sauce citron-herbes', 15]], why: 'Sans allergène majeur, complet et végétal.' },

    { id: 'burger', t: 'cheat', tags: ['viande', 'gluten', 'lactose', 'oeufs', 'animal'], md: true, k: 950, p: 45, g: 85, l: 45, ing: [['Pain brioché', 80], ['Steak haché', 150, 1], ['Cheddar', 30], ['Frites au four', 150]], why: 'Le classique, fait maison : meilleure viande, moins de friture.' },
    { id: 'burger-veg', t: 'cheat', tags: ['gluten', 'soja'], k: 850, p: 30, g: 95, l: 36, ing: [['Pain burger', 80], ['Steak végétal', 120], ['Frites de patate douce', 180], ['Sauce maison', 20]], why: 'Toute la gourmandise du burger, version végétale.' },
    { id: 'pizza', t: 'cheat', tags: ['gluten', 'lactose', 'animal'], k: 900, p: 36, g: 110, l: 32, ing: [['Pâte à pizza', 200], ['Sauce tomate', 80], ['Mozzarella', 100], ['Basilic et huile d’olive', 10]], why: 'Une margherita généreuse, à partager ou non.' },
    { id: 'sushi', t: 'cheat', tags: ['poisson', 'soja', 'sesame'], k: 800, p: 38, g: 110, l: 18, ing: [['Sushis et makis', 12], ['Edamame', 80], ['Sauce soja', 15]], why: 'Un plaisir plus léger, riche en protéines.' },
    { id: 'ramen', t: 'cheat', tags: ['viande', 'gluten', 'soja', 'oeufs', 'animal'], k: 850, p: 42, g: 100, l: 26, ing: [['Nouilles ramen', 200], ['Bouillon tonkotsu sans porc', 400], ['Poulet effiloché', 100, 1], ['Œuf mollet', 55]], why: 'Un bol chaud et réconfortant, version poulet.' },
    { id: 'kebab', t: 'cheat', tags: ['viande', 'gluten', 'lactose', 'animal'], md: true, k: 950, p: 50, g: 90, l: 40, ing: [['Pain pita', 100], ['Viande de kebab', 150, 1], ['Sauce blanche', 40], ['Crudités et frites', 150]], why: 'L’assiette kebab, avec beaucoup de crudités.' },
    { id: 'falafel-wrap', t: 'cheat', tags: ['gluten', 'sesame'], k: 850, p: 24, g: 100, l: 36, ing: [['Galette de blé', 90], ['Falafels', 150], ['Sauce tahini', 30], ['Frites', 120]], why: 'Gourmand, croustillant et 100 % végétal.' },
    { id: 'pad-thai', t: 'cheat', tags: ['crustaces', 'coque', 'oeufs', 'soja', 'animal'], k: 850, p: 36, g: 105, l: 28, ing: [['Nouilles de riz', 200], ['Crevettes', 120], ['Œuf', 55], ['Cacahuètes concassées', 20]], why: 'Sucré, salé, acidulé : le grand classique thaï.' },
    { id: 'curry-coco', t: 'cheat', tags: [], k: 850, p: 22, g: 115, l: 32, ing: [['Curry de légumes au lait de coco', 350], ['Riz basmati', 220], ['Naan sans gluten ou galettes de riz', 60]], why: 'Un repas plaisir sans allergène majeur, épicé et généreux.' },
  ];

  const SNACKS = [
    { n: 'Pomme et 20 g d’amandes', tags: ['coque'] },
    { n: 'Skyr et fruits rouges', tags: ['lactose', 'animal'] },
    { n: 'Banane et 15 g de beurre de cacahuète', tags: ['coque'] },
    { n: 'Houmous et bâtonnets de carotte', tags: ['sesame'] },
    { n: 'Yaourt de soja et myrtilles', tags: ['soja'] },
    { n: 'Galettes de riz et purée de graines de tournesol', tags: [] },
  ];

  const FISH = (n) => [n, ['poisson']];
  const ALTS = {
    'Pavé de saumon': { budget: FISH('Maquereau ou sardines en boîte'), maghreb: FISH('Sardines fraîches'), latam: FISH('Tilapia'), afrique: FISH('Capitaine ou tilapia') },
    'Saumon grillé': { budget: FISH('Maquereau ou sardines en boîte'), maghreb: FISH('Sardines fraîches'), latam: FISH('Tilapia'), afrique: FISH('Capitaine ou tilapia') },
    'Quinoa cuit': { budget: ['Riz complet cuit', []], maghreb: ['Couscous complet cuit', ['gluten']], afrique: ['Fonio cuit', []] },
    'Avocat': { budget: ['Huile d’olive ou graines', [], 0.2] },
    'Huile d’olive': { budget: ['Huile de colza', []] },
    'Thon frais': { budget: FISH('Thon en boîte au naturel') },
    'Crevettes': { budget: ['Crevettes surgelées', ['crustaces']] },
    'Bœuf émincé': { budget: ['Steak haché 5 %', ['viande']], maghreb: ['Agneau ou bœuf', ['viande']] },
    'Filet de poulet': { budget: ['Hauts de cuisse de poulet', ['viande']] },
    'Dos de cabillaud': { budget: FISH('Lieu ou merlu surgelé') },
    'Feta': { budget: ['Fromage blanc ou cottage', ['lactose', 'animal']] },
    'Edamame': { budget: ['Petits pois', []] },
    'Concombre et mangue': { budget: ['Concombre et carotte', []] },
    'Bok choy': { budget: ['Chou ou brocolis', []] },
    'Patate douce': { budget: ['Pommes de terre', []], afrique: ['Igname ou patate douce', []] },
    'Purée de patate douce': { budget: ['Pommes de terre', []], afrique: ['Igname ou patate douce', []] },
    'Riz japonais cuit': { budget: ['Riz rond', []] },
    'Orge perlé cuit': { budget: ['Riz cuit', []] },
    'Parmesan': { budget: ['Emmental râpé', ['lactose', 'animal']] },
    'Haricots rouges': { latam: ['Haricots noirs', []] },
    'Nouilles de riz cuites': { budget: ['Riz cuit', []] },
    'Riz basmati cuit': { budget: ['Riz cuit', []] },
    'Légumes rôtis': { budget: ['Légumes de saison ou surgelés', []] },
    'Brocolis': { budget: ['Légumes surgelés', []] }, 'Haricots verts': { budget: ['Légumes surgelés', []] },
    'Courgettes': { budget: ['Légumes surgelés', []] }, 'Épinards': { budget: ['Légumes surgelés', []] },
    'Boulgour cuit': { latam: ['Riz cuit', []], afrique: ['Fonio cuit', []] },
  };
  const EXPENSIVE = ['Pavé de saumon', 'Saumon grillé', 'Thon frais', 'Crevettes', 'Bœuf émincé', 'Dos de cabillaud', 'Avocat', 'Quinoa cuit', 'Parmesan', 'Feta', 'Edamame'];
  const region = () => (window.NA_I18N ? window.NA_I18N.region : 'eu');

  const BF_ALTS = {
    avocat: { budget: ['Huile d’olive ou graines', []] }, amande: { budget: ['Graines de tournesol', []] },
    skyr: { budget: ['Fromage blanc ou cottage', ['lactose', 'animal']] }, rouges: { budget: ['Pomme ou banane', []] },
    dinde: { budget: ['Œuf supplémentaire', ['oeufs', 'animal']] },
    pain: { maghreb: ['Pain d’orge ou msemen complet', ['gluten']], afrique: ['Pain de mil ou de manioc', []], latam: ['Tortillas de maïs', []] },
    avoine: { afrique: ['Fonio cuit', []] },
  };
  function breakfastAlts(p, items) {
    const f = forbidden(p); const r = region(); const out = [];
    items.forEach((it) => {
      const a = BF_ALTS[it.id]; if (!a) return;
      [['budget', 'petit budget'], [r, 'local']].forEach(([k, kind]) => { const c = a[k]; if (c && !c[1].some((t) => f.has(t))) out.push({ from: NA.FOOD[it.id].n, to: c[0], kind }); });
    });
    return out;
  }

  function swap(d, f0, p, sx) {
    const fb = forbidden(p); const r = region(); const budget = p.budget || 'moyen';
    const ok = (c) => c && !c[1].some((t) => fb.has(t));
    let exp = 0; const alts = [];
    const ing = d.ing.map(([n, g, meat]) => {
      const a = ALTS[n] || {}; let name = n; let q = 1;
      const b = ok(a.budget) ? a.budget : null; const loc = ok(a[r]) ? a[r] : null;
      if (d.t !== 'cheat' && budget === 'serre' && b) { name = b[0]; q = b[2] || 1; alts.push({ from: name, to: n, kind: 'option' }); if (loc && loc[0] !== b[0]) alts.push({ from: name, to: loc[0], kind: 'local' }); }
      else if (d.t !== 'cheat' && loc) { name = loc[0]; alts.push({ from: name, to: n, kind: 'option' }); if (b) alts.push({ from: name, to: b[0], kind: 'petit budget' }); }
      else if (b && d.t !== 'cheat') alts.push({ from: n, to: b[0], kind: 'petit budget' });
      if (EXPENSIVE.includes(name)) exp++;
      const grams = Math.max(5, Math.round((g * f0 * q) / 5) * 5);
      return { n: name + (meat ? sx : ''), q: n.startsWith('Sushis') ? `${g} pièces` : `${grams} g` };
    });
    const cost = Math.min(3, 1 + exp);
    const first = d.ing[0][0]; const main = ing[0].n.replace(sx, '');
    const tag = main !== first ? (alts.find((x) => x.to === first && x.kind === 'option') && budget === 'serre' && (ALTS[first] || {}).budget && (ALTS[first].budget[0] === main) ? 'version économique' : 'version locale') : '';
    return { ing, alts: alts.slice(0, 4), cost: ['petit', 'moyen', 'élevé'][cost - 1], tag };
  }

  function portion(d, target, p) {
    if (!d) return null;
    const cheat = d.t === 'cheat';
    const f = cheat ? 1 : Math.min(1.4, Math.max(0.75, target / d.k));
    const sx = meatSuffix(p);
    const sw = swap(d, f, p, sx);
    return {
      id: d.id, cheat, why: d.why,
      n: (d.n || d.ing[0][0]) + (sw.tag ? ` · ${sw.tag}` : ''),
      k: Math.round(d.k * f), p: Math.round(d.p * f), g: Math.round(d.g * f), l: Math.round(d.l * f),
      ...sw,
    };
  }

  const NAMES = {
    'bowl-poulet': 'Bowl poulet, quinoa et avocat', 'saumon-riz': 'Saumon, riz complet et brocolis', 'chili-sin': 'Chili sin carne', 'curry-pois': 'Curry de pois chiches au lait de coco',
    'boeuf-saute': 'Bœuf sauté aux nouilles de riz', omelette: 'Omelette, pommes de terre et salade', 'lentilles-feta': 'Salade de lentilles et feta', 'poke-thon': 'Poke bowl au thon',
    'pates-dinde': 'Pâtes complètes et boulettes de dinde', 'tofu-laque': 'Tofu laqué, riz et bok choy', crevettes: 'Crevettes ail-citron et riz', tikka: 'Poulet tikka et riz basmati',
    cabillaud: 'Cabillaud, patate douce et haricots verts', 'falafel-bowl': 'Bowl falafels et houmous', 'dinde-patate': 'Dinde, purée de patate douce et champignons', 'miso-saumon': 'Saumon grillé, riz et soupe miso',
    'risotto-orge': 'Risotto d’orge aux champignons', 'steak-lentilles': 'Galettes de lentilles corail et quinoa',
    burger: 'Burger maison et frites au four', 'burger-veg': 'Burger végétal et frites de patate douce', pizza: 'Pizza margherita', sushi: 'Plateau sushis et makis', ramen: 'Ramen au poulet',
    kebab: 'Assiette kebab', 'falafel-wrap': 'Wrap falafels et frites', 'pad-thai': 'Pad thaï aux crevettes', 'curry-coco': 'Curry de légumes et riz parfumé',
  };
  DISHES.forEach((d) => { d.n = NAMES[d.id]; });

  const pick = (arr, i) => (arr.length ? arr[((i % arr.length) + arr.length) % arr.length] : null);

  function dayMeals(p, seed, dayIdx, weekNo, trainingDay) {
    const f = forbidden(p);
    const plats = DISHES.filter((d) => d.t === 'plat' && allowed(d, f, p));
    const dejs = plats.filter((d) => d.when !== 'diner'); const dins = plats.filter((d) => d.when !== 'dej');
    const cheats = DISHES.filter((d) => d.t === 'cheat' && allowed(d, f, p));
    let dej = pick(dejs, dayIdx * 3 + seed + weekNo);
    let din = pick(dins, dayIdx * 3 + seed * 5 + weekNo + 1);
    if (din && dej && din.id === dej.id) din = pick(dins, dayIdx * 3 + seed * 5 + weekNo + 2);
    const nCheat = +(p.cheat ?? 1);
    if (nCheat >= 1 && dayIdx === 5 && cheats.length) din = pick(cheats, seed + weekNo);
    if (nCheat >= 2 && dayIdx === 2 && cheats.length) dej = pick(cheats, seed + weekNo + 3);
    const kcal = NA.dailyKcal(p) * (trainingDay ? 1.05 : 0.97);
    const snack = SNACKS.filter((s) => !s.tags.some((t) => f.has(t)));
    return {
      dej: portion(dej, kcal * 0.35, p),
      diner: portion(din, kcal * 0.3, p),
      snack: pick(snack, dayIdx + seed),
      kcal: Math.round(kcal),
    };
  }

  const CHEAT_TIP = 'Repas plaisir : savoure-le sans culpabilité, mange lentement, ajoute des légumes si tu peux et bois de l’eau. Pas de compensation le lendemain, on reprend simplement le plan.';

  const BUDGETS = { serre: 'Serré', moyen: 'Moyen', confort: 'Confort' };
  const REGIONS = { eu: 'Europe', maghreb: 'Maghreb', afrique: 'Afrique de l’Ouest et centrale', na: 'Amérique du Nord', latam: 'Amérique latine' };
  window.NA_MEALS = { ALLERGENES, REGIMES, PRATIQUES, BUDGETS, REGIONS, forbidden, summary, meatSuffix, dayMeals, breakfastAlts, CHEAT_TIP, DISHES };
})();
