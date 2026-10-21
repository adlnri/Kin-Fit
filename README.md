# Kin Fit

**金 Kin Fit** — programme sportif et nutrition personnalisés, défis entre amis et médailles à gagner.
Application web installable (PWA), en français, anglais et espagnol.

> Sans réglage, l'app est gratuite et hors connexion : programmes, repas, parcours et coach sont calculés dans le navigateur.
> Chaque utilisateur peut activer un coach IA dans **Profil › Coach IA**, sans aucun coût pour l'éditeur de l'app :
> - **Gemini avec sa propre clé Google** (créée sur Google AI Studio) : programmes, repas et coach ; l'appel part directement de son appareil vers Google ;
> - **IA sur l'appareil** (modèle open source Qwen 2.5, environ 1 Go téléchargé une fois, WebGPU) : réponses du coach, rien ne quitte l'appareil.
>
> Les données du profil restent sur l'appareil (localStorage). Aucune clé n'est jamais stockée dans le code.

## Fonctionnalités

- **Inscription** : profil, niveau, matériel, restrictions, sport(s), régime (végétarien, pescétarien, végan), pratiques (halal, casher, sans porc), 8 allergènes, type de petit-déjeuner, budget, repas plaisir.
- **Programme sportif** : séances de musculation (5 à 7 exercices selon la durée choisie : 30, 45, 60, 75 ou 90 min), cardio adapté au sport, charges et séries réglées par le niveau, technique, erreur à éviter, vidéo.
- **Nutrition** : petit-déjeuner, déjeuner, dîner, collation et cheat meals filtrés selon le régime et les allergies, portions selon les besoins, alternatives petit budget et locales selon la région.
- **Parcours** : circuits poids du corps, cardio et haltères, à la durée voulue ; effort, repos et nombre de tours suivent le niveau, versions sans impact si un genou est signalé.
- **Liste de courses** de la semaine, par rayon, avec cases à cocher, copie et partage.
- **Défis** du jour, de la semaine, du sport, et entre amis (même appareil ou lien `#defi=`).
- **Trophées** : 21 médailles, rangs Bronze à Platine, doublons à offrir.
- **Langues et pays** : écran d'accueil, traduction FR / EN / ES, adaptation régionale.

## Lancer en local

Aucune installation : ce sont des fichiers statiques.

```bash
python -m http.server 4180
```

Puis ouvrir <http://127.0.0.1:4180/>.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Page unique, coquille de l'app, enregistrement du service worker |
| `styles.css` | Styles (noir et or, médailles, mobile) |
| `engine.js` | Données et génération du programme sportif et du petit-déjeuner de base |
| `circuits.js` | Parcours poids du corps, cardio et haltères |
| `meals.js` | Plats, cheat meals, régimes, allergènes, budget, alternatives régionales |
| `stickers.js` | Dessins des médailles et écussons de rang (SVG) |
| `i18n-data.js` | Traductions anglais / espagnol des textes de l'app |
| `i18n.js` | Langue, pays, région et traduction en direct |
| `ai.js` | Coach IA : Gemini (clé de l'utilisateur), IA sur l'appareil (WebLLM), serveur facultatif ; repli sur les exemples |
| `ai-core.mjs` | Prompts coach et nutrition, schémas des réponses, partagés par toutes les sources d'IA |
| `app.js` | Interface : écrans, défis, trophées, partage, liste de courses, installation |
| `netlify/functions/ai.mjs` | Option serveur `/api/ai` (Claude), inactive sans clé |
| `netlify.toml`, `package.json`, `scripts/build.mjs` | Déploiement Netlify (copie de l'app dans `dist/`) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Application installable et hors ligne |
| `images/`, `scripts/silk.py` | Fond « soie d’or » de l’accueil, généré par script (aucune photo ni banque d’images) |
| `fonts/` | Polices auto-hébergées (Manrope, Sora, Dela Gothic One — licence SIL OFL) |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | Documentation produit et design |

## Publier

- **GitHub Pages** (gratuit) : Settings → Pages → Deploy from branch → `main` / racine. Toute l'app marche, y compris Gemini et l'IA sur l'appareil, puisque ces deux options tournent dans le navigateur de l'utilisateur.
- **Netlify** (facultatif) : import du dépôt GitHub ; Netlify lit `netlify.toml` (build `npm run build`, dossier `dist`).

### Coach IA : ce que l'utilisateur doit savoir (affiché dans l'app)

- **Gemini** : conditions de Google pour l'API gratuite. Usage réservé aux 18 ans et plus (l'option est désactivée sous 18 ans). Avec l'offre gratuite, Google peut utiliser les échanges pour améliorer ses services et les faire relire par des personnes. Dans l'Union européenne, au Royaume-Uni et en Suisse, Google demande un compte avec facturation activée pour ce type d'usage : l'éventuel coût est facturé sur le compte Google de l'utilisateur, jamais à l'éditeur. La clé est enregistrée sur l'appareil (localStorage) et envoyée seulement à Google, dans un en-tête.
- **IA sur l'appareil** : bibliothèque WebLLM 0.2.85 chargée depuis jsDelivr, modèle `Qwen2.5-1.5B-Instruct-q4f16_1-MLC`. Navigateur compatible WebGPU nécessaire (Chrome, Edge, Safari récents). Coach seulement : un si petit modèle n'écrit pas de programmes fiables.

### Option serveur (Claude, payante, désactivée par défaut)

`netlify/functions/ai.mjs` peut appeler Claude d'Anthropic avec une clé de l'éditeur. **Rien ne se passe tant que la variable `ANTHROPIC_API_KEY` n'est pas définie dans Netlify**, et aucune clé n'existe aujourd'hui. Si un jour elle est activée, l'usage est facturé au propriétaire de la clé (voir console.anthropic.com, avec une limite de dépense). Variables facultatives : `KINFIT_MODEL_PLAN`, `KINFIT_MODEL_CHAT`, `KINFIT_EFFORT`, `KINFIT_RATE_LIMIT`, `ALLOWED_ORIGINS`.

Les prompts coach et nutrition sont dans `ai-core.mjs`, partagés par Gemini, l'IA sur l'appareil et le serveur.

## Mettre à jour

Le numéro de version `?v=…` des fichiers apparaît dans `index.html` **et** dans `sw.js` (`CACHE` et `V`).
Il faut l'augmenter aux deux endroits à chaque modification, sinon les téléphones gardent l'ancienne version en cache.
