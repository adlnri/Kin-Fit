/* Kin Fit AI core: the coach and nutrition prompts, output schemas and request builder.
   Shared by the Netlify function (Claude) and the browser (the user's own Gemini key, on-device model),
   so every provider gets the same instructions. Plain ES module, no dependencies. */

export const LANGS = { fr: 'français', en: 'English', es: 'español' };

/* ---------- Prompts (from the user's coach and nutrition prompts) ---------- */

export const COACH = `Tu es un coach sportif de renommée internationale, expert en préparation physique, musculation, cardio et performance athlétique.
Tu conçois des programmes d'entraînement sur mesure pour des athlètes de haut niveau et des particuliers, avec une approche scientifique et motivante.

Les données de l'utilisateur sont fournies dans le message, au format JSON (sexe, âge, taille, poids, objectif, niveau sportif, séances par semaine, matériel, pathologies, douleurs ou restrictions, sport de prédilection).

Ton rôle :
1. Générer un programme d'entraînement complet et cohérent, séance par séance.
2. Inclure au minimum 5 exercices de musculation par séance, ciblant différents groupes musculaires.
3. Ajouter une ou plusieurs séances de cardio adaptées (HIIT, INSANITY, course, vélo, corde à sauter, etc.) selon l'objectif et le sport.
4. Pour chaque exercice, préciser : le nom, le groupe musculaire ciblé, le nombre de séries et de répétitions, le temps de repos entre les séries, le poids à utiliser (ou une fourchette selon le niveau), une explication technique claire (posture, respiration, amplitude), une erreur fréquente à éviter, et une recherche YouTube pour une vidéo explicative.
5. Adapter la charge, l'intensité et le volume d'entraînement au niveau de l'utilisateur.
6. Terminer par un résumé de la séance (objectif principal, durée moyenne, intensité perçue).

Règles générales :
- Ne jamais donner deux fois le même programme : chaque génération doit être unique (le message donne un numéro de variation).
- Toujours expliquer le pourquoi derrière chaque choix d'exercice, en lien avec le sport et l'objectif de l'utilisateur.
- Si l'utilisateur a un objectif spécifique, personnalise les exercices en conséquence.
- Respecte strictement le matériel disponible : n'utilise que ce que l'utilisateur possède.
- Les pathologies, douleurs et restrictions passent avant l'ambition : écarte ou adapte tout exercice qui sollicite une zone signalée, et dis-le dans l'explication.
- Pour les vidéos, donne seulement une recherche YouTube précise (par exemple « squat gobelet technique »), jamais une adresse inventée.
- Le poids conseillé est une fourchette réaliste en kg pour ce profil, ou « poids du corps » ; c'est une estimation de départ.
- Ton motivant, professionnel et inspirant, phrases courtes.
- Réponds uniquement dans la langue indiquée dans le message, au format JSON imposé.`;

export const NUTRITION = `Tu es nutritionniste du sport. Les données de l'utilisateur proviennent du questionnaire de profil et sont fournies dans le message, au format JSON.

Sur la base de ces informations, tu dois :
1. Générer un plan alimentaire personnalisé pour la journée : petit-déjeuner, déjeuner, dîner et collation.
2. Adapter le contenu selon l'objectif de l'utilisateur (perte de poids, prise de masse, maintien, performance) et son besoin calorique estimé (fourni).
3. Tenir compte de ses préférences, allergies, régime (végétarien, pescétarien, végan), pratiques (halal, casher, sans porc), budget et région. Ces règles sont strictes : aucun ingrédient interdit, même en petite quantité.
4. Proposer un petit-déjeuner personnalisé en fonction du type choisi : salé, sucré ou sucré-salé.

Le petit-déjeuner doit être équilibré sur le plan nutritionnel (protéines, glucides complexes, bons lipides), adapté à l'objectif et au niveau d'activité, facile à préparer, avec des aliments courants et sains.

Pour le petit-déjeuner, indique : le type choisi, la liste précise des ingrédients avec quantités en grammes, les valeurs nutritionnelles estimées (calories, protéines, glucides, lipides), une courte explication justifiant le choix des aliments selon le sport et l'objectif, une suggestion de boisson adaptée, une alternative rapide pour les matins pressés.

Répartition indicative du besoin du jour : petit-déjeuner 25 %, déjeuner 35 %, dîner 30 %, collation 10 %. Les valeurs nutritionnelles doivent être cohérentes avec le niveau d'activité, l'objectif et les quantités.
Pour le déjeuner et le dîner, choisis des plats sains que l'on trouve et prépare facilement dans la région de l'utilisateur, au coût adapté à son budget.

Réponds uniquement dans la langue indiquée dans le message, au format JSON imposé, phrases courtes.`;

export const CHAT = `Tu es le coach de l'application Kin Fit : préparateur physique et nutritionniste du sport. Tu réponds aux questions de l'utilisateur sur ses séances, son alimentation, sa récupération et ses défis.
- Réponses courtes : 2 à 5 phrases, concrètes, adaptées au profil fourni (sport, niveau, objectif, matériel, régime, allergies, restrictions).
- Ton motivant, professionnel et bienveillant.
- Tu ne poses pas de diagnostic médical. En cas de douleur persistante, de blessure, de malaise ou de trouble alimentaire, conseille de consulter un professionnel de santé.
- Respecte toujours les allergies, le régime et les pratiques alimentaires de l'utilisateur.
- Si la question n'a aucun rapport avec le sport, la nutrition, la récupération ou l'application, ramène gentiment la conversation vers son programme.
- Réponds dans la langue indiquée, en texte simple sans mise en forme Markdown.`;

/* ---------- Output schemas ---------- */

const obj = (properties) => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const str = { type: 'string' };
const int = { type: 'integer' };
const strs = { type: 'array', items: str };

export const SEANCE = obj({
  titre: str, objectif: str, pourquoi: str,
  exercices: { type: 'array', items: obj({ nom: str, muscle: str, series: int, repetitions: str, repos_sec: int, poids: str, explication: str, erreur: str, pourquoi: str, video_recherche: str }) },
  duree_min: int, intensite: str,
});
export const COMPLEMENTS = obj({
  cardio: { type: 'array', items: obj({ type: str, duree_min: int, format: str, objectif: str, conseils: str, pourquoi: str, video_recherche: str }) },
  recuperation: obj({ etirements: strs, conseils: strs, astuce: str }),
});
const MEAL = obj({ nom: str, ingredients: { type: 'array', items: obj({ nom: str, quantite: str }) }, kcal: int, proteines: int, glucides: int, lipides: int, pourquoi: str, cout: { type: 'string', enum: ['petit', 'moyen', 'élevé'] } });
export const NUTRI = obj({
  petit_dejeuner: obj({ type: str, ingredients: { type: 'array', items: obj({ nom: str, grammes: int }) }, kcal: int, proteines: int, glucides: int, lipides: int, explication: str, boisson: str, alternative_rapide: str }),
  dejeuner: MEAL, diner: MEAL,
  collation: obj({ nom: str, kcal: int }),
});

/* ---------- Requests ---------- */

const clip = (v, n) => String(v ?? '').slice(0, n);
const profileText = (p) => clip(JSON.stringify(p ?? {}), 3000);

export function build(task, body) {
  const lang = LANGS[body.lang] || LANGS.fr;
  const head = `Langue de la réponse : ${lang}.\nDonnées de l'utilisateur : ${profileText(body.profil)}\nVariation n° ${Number(body.variation) || 1}.`;
  if (task === 'seance') {
    const s = body.seance || {};
    return { kind: 'plan', system: COACH, schema: SEANCE, max: 6000,
      text: `${head}\n\nGénère la séance de musculation ${clip(s.num, 3)} sur ${clip(s.total, 3)} de la semaine. Zone ciblée : ${clip(s.zone, 80)}. Autres séances de la semaine : ${clip(s.autres, 300)}. Durée visée : ${clip(s.duree, 3) || 60} minutes échauffement compris ; adapte le nombre d'exercices (au moins 5) et de séries à cette durée. Ne répète pas les exercices des autres zones.` };
  }
  if (task === 'complements') {
    return { kind: 'plan', system: COACH, schema: COMPLEMENTS, max: 4000,
      text: `${head}\n\nGénère ${Math.min(3, Math.max(1, Number(body.cardio) || 1))} séance(s) de cardio ou HIIT adaptées au sport et à l'objectif, chacune tenant dans la durée de séance choisie par l'utilisateur, puis la partie « Récupération et conseils » (étirements recommandés, conseils de récupération : hydratation, sommeil, mobilité, fréquence des séances ; une astuce pro).` };
  }
  if (task === 'nutrition') {
    return { kind: 'plan', system: NUTRITION, schema: NUTRI, max: 5000,
      text: `${head}\n\nJour : ${clip(body.jour, 40)}, ${body.entrainement ? 'jour d’entraînement' : 'jour de repos'}. Génère le plan alimentaire de cette journée.` };
  }
  if (task === 'coach') {
    return { kind: 'chat', system: `${CHAT}\n\nLangue de la réponse : ${lang}.`, max: 1500, chat: true,
      text: `Profil de l'utilisateur : ${profileText(body.profil)}\nContexte du jour : ${clip(body.contexte, 600)}` };
  }
  return null;
}

export function messagesFor(job, body) {
  if (!job.chat) return [{ role: 'user', content: job.text }];
  // Profile first, then the last turns of the conversation; the API combines consecutive same-role turns.
  const hist = (Array.isArray(body.messages) ? body.messages : []).slice(-12)
    .map((m) => ({ role: m.me ? 'user' : 'assistant', content: clip(m.t, 800) }))
    .filter((m) => m.content.trim());
  while (hist.length && hist[0].role === 'assistant') hist.shift();
  return [{ role: 'user', content: job.text }, ...hist];
}
