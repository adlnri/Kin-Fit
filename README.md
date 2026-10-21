# Kin Fit

**金 Kin Fit** — programme sportif et nutrition personnalisés, défis entre amis et médailles à gagner.
Application web installable (PWA), en français, anglais et espagnol.

> Prototype : programmes, repas et valeurs sont calculés dans le navigateur à partir de données d'exemple.
> Aucun modèle d'IA ni serveur n'est encore connecté ; les données restent sur l'appareil (localStorage).

## Fonctionnalités

- **Inscription** : profil, niveau, matériel, restrictions, sport(s), régime (végétarien, pescétarien, végan), pratiques (halal, casher, sans porc), 8 allergènes, type de petit-déjeuner, budget, repas plaisir.
- **Programme sportif** : séances de musculation (5+ exercices), cardio adapté au sport, charges et séries réglées par le niveau, technique, erreur à éviter, vidéo.
- **Nutrition** : petit-déjeuner, déjeuner, dîner, collation et cheat meals filtrés selon le régime et les allergies, portions selon les besoins, alternatives petit budget et locales selon la région.
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
| `meals.js` | Plats, cheat meals, régimes, allergènes, budget, alternatives régionales |
| `stickers.js` | Dessins des médailles et écussons de rang (SVG) |
| `i18n-data.js` | Traductions anglais / espagnol des textes de l'app |
| `i18n.js` | Langue, pays, région et traduction en direct |
| `app.js` | Interface : écrans, défis, trophées, partage, liste de courses, installation |
| `manifest.webmanifest`, `sw.js`, `icons/` | Application installable et hors ligne |
| `fonts/` | Polices auto-hébergées (Manrope, Sora, Dela Gothic One — licence SIL OFL) |
| `PRODUCT.md`, `DESIGN.md`, `.impeccable/` | Documentation produit et design |

## Publier

- **Netlify Drop** : copier les fichiers de l'app (sans `PRODUCT.md`, `DESIGN.md`, `.impeccable/`) dans un dossier et le glisser sur <https://app.netlify.com/drop>.
- **GitHub Pages** : Settings → Pages → Deploy from branch → `main` / racine. Le site sert directement `index.html`.

## Mettre à jour

Le numéro de version `?v=…` des fichiers apparaît dans `index.html` **et** dans `sw.js` (`CACHE` et `V`).
Il faut l'augmenter aux deux endroits à chaque modification, sinon les téléphones gardent l'ancienne version en cache.
