# Kin Fit

**金 Kin Fit** — programme sportif et nutrition personnalisés, défis entre amis et médailles à gagner.
Application web installable (PWA), en français, anglais et espagnol.

> Les programmes, repas et réponses du coach peuvent être écrits par Claude (IA d'Anthropic) via une fonction Netlify.
> Sans cette fonction (GitHub Pages, hors connexion), l'app utilise ses exemples calculés dans le navigateur.
> Les données du profil restent sur l'appareil (localStorage) ; seules les réponses utiles sont envoyées à la fonction quand on demande une version IA.

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
| `ai.js` | Appels à la fonction IA, avec repli sur les exemples |
| `app.js` | Interface : écrans, défis, trophées, partage, liste de courses, installation |
| `netlify/functions/ai.mjs` | Fonction serveur `/api/ai` : prompts coach et nutrition, appel à Claude, réponses JSON |
| `netlify.toml`, `package.json`, `scripts/build.mjs` | Déploiement Netlify (copie de l'app dans `dist/`) |
| `manifest.webmanifest`, `sw.js`, `icons/` | Application installable et hors ligne |
| `images/`, `scripts/silk.py` | Fond « soie d’or » de l’accueil, généré par script (aucune photo ni banque d’images) |
| `fonts/` | Polices auto-hébergées (Manrope, Sora, Dela Gothic One — licence SIL OFL) |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | Documentation produit et design |

## Publier avec l'IA (Netlify)

1. Sur <https://app.netlify.com> : **Add new site → Import an existing project → GitHub**, choisir le dépôt. Netlify lit `netlify.toml` (build `npm run build`, dossier `dist`, fonctions `netlify/functions`).
2. Créer une clé sur <https://console.anthropic.com> (API Keys) et fixer une **limite de dépense** mensuelle (Billing → Limits).
3. Dans Netlify : **Site configuration → Environment variables → Add a variable** : `ANTHROPIC_API_KEY` = la clé. Ne jamais la mettre dans le code ni dans Git.
4. **Deploys → Trigger deploy**. Vérifier `https://<ton-site>.netlify.app/api/ai` : il doit afficher `{"ok":true,"ready":true}`.

Variables facultatives :

| Variable | Défaut | Rôle |
|---|---|---|
| `KINFIT_MODEL_PLAN` | `claude-sonnet-5-5` | Modèle des programmes et repas |
| `KINFIT_MODEL_CHAT` | `claude-haiku-5-5` | Modèle des réponses du coach |
| `KINFIT_EFFORT` | `low` | Profondeur de réflexion (`low`, `medium`, `high`) : plus haut = plus lent et plus cher |
| `KINFIT_RATE_LIMIT` | `40` | Requêtes max par adresse IP et par 10 minutes |
| `ALLOWED_ORIGINS` | vide | Autres sites autorisés à appeler la fonction (ex. l'adresse GitHub Pages), séparés par des virgules |

Coût indicatif (tarifs Anthropic d'octobre 2026) : un programme complet (4 séances) coûte de l'ordre de 5 à 10 centimes, une journée de repas 1 à 2 centimes, une réponse du coach moins d'un dixième de centime. Les journaux de la fonction (Netlify → Logs → Functions) indiquent les jetons consommés à chaque appel.

## Publier sans IA

- **GitHub Pages** : Settings → Pages → Deploy from branch → `main` / racine. L'app tourne avec ses exemples (pas de fonction serveur).
- **Netlify Drop** : glisser le dossier `dist/` (après `npm run build`) sur <https://app.netlify.com/drop>.

## Mettre à jour

Le numéro de version `?v=…` des fichiers apparaît dans `index.html` **et** dans `sw.js` (`CACHE` et `V`).
Il faut l'augmenter aux deux endroits à chaque modification, sinon les téléphones gardent l'ancienne version en cache.
