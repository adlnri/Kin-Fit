/* Language and country. The app is written in French; English and Spanish are applied by
   translating rendered text (exact strings, then patterns, then " · " segments and sentences).
   A MutationObserver keeps every render, dialog and toast translated. */
(() => {
  'use strict';
  const KEY = 'nutriapp.prefs';
  let prefs = {};
  try { prefs = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { prefs = {}; }

  const COUNTRIES = [
    ['FR', 'France', 'France', 'Francia', 'eu', 'fr'], ['BE', 'Belgique', 'Belgium', 'Bélgica', 'eu', 'fr'], ['CH', 'Suisse', 'Switzerland', 'Suiza', 'eu', 'fr'],
    ['LU', 'Luxembourg', 'Luxembourg', 'Luxemburgo', 'eu', 'fr'], ['CA', 'Canada', 'Canada', 'Canadá', 'na', 'fr'], ['MA', 'Maroc', 'Morocco', 'Marruecos', 'maghreb', 'fr'],
    ['DZ', 'Algérie', 'Algeria', 'Argelia', 'maghreb', 'fr'], ['TN', 'Tunisie', 'Tunisia', 'Túnez', 'maghreb', 'fr'], ['SN', 'Sénégal', 'Senegal', 'Senegal', 'afrique', 'fr'],
    ['CI', 'Côte d’Ivoire', 'Ivory Coast', 'Costa de Marfil', 'afrique', 'fr'], ['CM', 'Cameroun', 'Cameroon', 'Camerún', 'afrique', 'fr'], ['ES', 'Espagne', 'Spain', 'España', 'eu', 'es'],
    ['MX', 'Mexique', 'Mexico', 'México', 'latam', 'es'], ['CO', 'Colombie', 'Colombia', 'Colombia', 'latam', 'es'], ['AR', 'Argentine', 'Argentina', 'Argentina', 'latam', 'es'],
    ['PE', 'Pérou', 'Peru', 'Perú', 'latam', 'es'], ['CL', 'Chili', 'Chile', 'Chile', 'latam', 'es'], ['US', 'États-Unis', 'United States', 'Estados Unidos', 'na', 'en'],
    ['GB', 'Royaume-Uni', 'United Kingdom', 'Reino Unido', 'eu', 'en'], ['IE', 'Irlande', 'Ireland', 'Irlanda', 'eu', 'en'], ['DE', 'Allemagne', 'Germany', 'Alemania', 'eu', 'en'],
    ['IT', 'Italie', 'Italy', 'Italia', 'eu', 'en'], ['PT', 'Portugal', 'Portugal', 'Portugal', 'eu', 'es'], ['XX', 'Autre pays', 'Other country', 'Otro país', 'eu', 'en'],
  ].map(([code, fr, en, es, region, lang]) => ({ code, name: { fr, en, es }, region, lang }));
  const LOCALES = { fr: 'fr-FR', en: 'en-GB', es: 'es-ES' };
  const LANG_NAMES = { fr: 'Français', en: 'English', es: 'Español' };

  const NAV = ((navigator.language || 'fr').slice(0, 2)).toLowerCase();
  const L = () => (['fr', 'en', 'es'].includes(prefs.lang) ? prefs.lang : (['fr', 'en', 'es'].includes(NAV) ? NAV : 'en'));
  const country = () => COUNTRIES.find((c) => c.code === prefs.country) || null;
  const idx = () => (L() === 'en' ? 0 : 1);

  /* Strings added after the bulk translation (welcome, budget, regions, alternatives, patterns' words). */
  const EXTRA = {
    'Bienvenue': ['Welcome', 'Bienvenido'],
    'Choisis ta langue et ton pays : on adapte la langue, les plats et les alternatives à ta région.': ['Choose your language and country: we adapt the language, dishes and alternatives to where you live.', 'Elige tu idioma y tu país: adaptamos el idioma, los platos y las alternativas a tu región.'],
    'Langue': ['Language', 'Idioma'], 'Pays': ['Country', 'País'], 'Commencer': ['Get started', 'Empezar'],
    'Choisis ton pays pour continuer.': ['Choose your country to continue.', 'Elige tu país para continuar.'],
    'Langue et pays': ['Language and country', 'Idioma y país'], 'Enregistrer': ['Save', 'Guardar'],
    'Ton budget courses': ['Your grocery budget', 'Tu presupuesto para la compra'],
    'Serré': ['Tight', 'Ajustado'], 'Moyen': ['Medium', 'Medio'], 'Confort': ['Comfortable', 'Holgado'],
    'Budget serré : les ingrédients chers sont remplacés par des équivalents économiques, de saison ou surgelés.': ['Tight budget: pricey ingredients are swapped for cheaper, seasonal or frozen equivalents.', 'Presupuesto ajustado: los ingredientes caros se cambian por equivalentes económicos, de temporada o congelados.'],
    'Alternatives': ['Alternatives', 'Alternativas'], 'petit budget': ['budget', 'económico'], 'local': ['local', 'local'], 'option': ['option', 'opción'],
    'Coût :': ['Cost:', 'Coste:'], 'petit': ['low', 'bajo'], 'moyen': ['medium', 'medio'], 'élevé': ['high', 'alto'],
    'Budget': ['Budget', 'Presupuesto'], 'Région': ['Region', 'Región'],
    'Europe': ['Europe', 'Europa'], 'Maghreb': ['North Africa', 'Magreb'], 'Afrique de l’Ouest et centrale': ['West and Central Africa', 'África occidental y central'],
    'Amérique du Nord': ['North America', 'Norteamérica'], 'Amérique latine': ['Latin America', 'América Latina'],
    'Repas plaisir': ['Treat meal', 'Comida libre'], 'Plaisir': ['Treat', 'Libre'],
    'Ingrédients et conseils': ['Ingredients and tips', 'Ingredientes y consejos'], 'Collation': ['Snack', 'Merienda'],
    'Déjeuner et dîner': ['Lunch and dinner', 'Comida y cena'], 'Déjeuner': ['Lunch', 'Comida'], 'Dîner': ['Dinner', 'Cena'],
    'Repas de la semaine': ['Meals this week', 'Comidas de la semana'], 'Ton alimentation': ['Your diet', 'Tu alimentación'], 'Tes repas': ['Your meals', 'Tus comidas'],
    'Ton régime': ['Your diet type', 'Tu tipo de dieta'], 'Je mange de tout': ['I eat everything', 'Como de todo'], 'Végétarien': ['Vegetarian', 'Vegetariano'], 'Pescétarien': ['Pescatarian', 'Pescetariano'], 'Végan': ['Vegan', 'Vegano'],
    'Pratiques alimentaires (facultatif)': ['Dietary practices (optional)', 'Prácticas alimentarias (opcional)'], 'Halal': ['Halal', 'Halal'], 'Casher': ['Kosher', 'Kosher'], 'Sans porc': ['No pork', 'Sin cerdo'],
    'Allergies et intolérances (facultatif)': ['Allergies and intolerances (optional)', 'Alergias e intolerancias (opcional)'],
    'Gluten': ['Gluten', 'Gluten'], 'Lactose': ['Lactose', 'Lactosa'], 'Œufs': ['Eggs', 'Huevos'], 'Fruits à coque et arachide': ['Tree nuts and peanuts', 'Frutos secos y cacahuete'], 'Poisson': ['Fish', 'Pescado'], 'Crustacés et fruits de mer': ['Shellfish and seafood', 'Crustáceos y marisco'], 'Soja': ['Soy', 'Soja'], 'Sésame': ['Sesame', 'Sésamo'],
    'gluten': ['gluten', 'gluten'], 'lactose': ['lactose', 'lactosa'], 'œufs': ['eggs', 'huevo'], 'fruits à coque et arachide': ['nuts and peanuts', 'frutos secos y cacahuete'], 'poisson': ['fish', 'pescado'], 'crustacés et fruits de mer': ['shellfish', 'marisco'], 'soja': ['soy', 'soja'], 'sésame': ['sesame', 'sésamo'],
    'halal': ['halal', 'halal'], 'casher': ['kosher', 'kosher'], 'sans porc': ['no pork', 'sin cerdo'], 'végétarien': ['vegetarian', 'vegetariano'], 'pescétarien': ['pescatarian', 'pescetariano'], 'végan': ['vegan', 'vegano'],
    'aucune restriction': ['no restrictions', 'sin restricciones'], 'aucune': ['none', 'ninguna'], 'Régime': ['Diet', 'Dieta'], 'Pratiques': ['Practices', 'Prácticas'],
    'Aucun': ['None', 'Ninguna'], 'Un': ['One', 'Una'], 'Deux': ['Two', 'Dos'], 'Repas plaisir par semaine': ['Treat meals per week', 'Comidas libres por semana'],
    'Créer mon profil': ['Create my profile', 'Crear mi perfil'], 'Continuer': ['Continue', 'Continuar'], 'Retour': ['Back', 'Atrás'], 'Annuler': ['Cancel', 'Cancelar'],
    'Trophées': ['Trophies', 'Trofeos'], 'Aujourd’hui': ['Today', 'Hoy'], 'Défis': ['Challenges', 'Retos'], 'Plan': ['Plan', 'Plan'], 'Coach': ['Coach', 'Coach'], 'Profil': ['Profile', 'Perfil'],
    'Session': ['Session', 'Sesión'], 'Nouvelle session': ['New session', 'Nueva sesión'], 'Profil et sessions': ['Profile and sessions', 'Perfil y sesiones'],
    'Aller au contenu': ['Skip to content', 'Ir al contenido'], 'Navigation principale': ['Main navigation', 'Navegación principal'],
    'Jour': ['Day', 'Día'], 'Semaine': ['Week', 'Semana'], 'Sport': ['Sport', 'Deporte'], 'Amis': ['Friends', 'Amigos'],
    'Lun': ['Mon', 'Lun'], 'Mar': ['Tue', 'Mar'], 'Mer': ['Wed', 'Mié'], 'Jeu': ['Thu', 'Jue'], 'Ven': ['Fri', 'Vie'], 'Sam': ['Sat', 'Sáb'], 'Dim': ['Sun', 'Dom'],
    'lundi': ['Monday', 'lunes'], 'mardi': ['Tuesday', 'martes'], 'mercredi': ['Wednesday', 'miércoles'], 'jeudi': ['Thursday', 'jueves'], 'vendredi': ['Friday', 'viernes'], 'samedi': ['Saturday', 'sábado'], 'dimanche': ['Sunday', 'domingo'],
    'Muscu': ['Strength', 'Fuerza'], 'Cardio': ['Cardio', 'Cardio'], 'Repos': ['Rest', 'Descanso'], 'Réussi': ['Done', 'Logrado'], 'Validé': ['Done', 'Hecho'],
    'Protéines': ['Protein', 'Proteínas'], 'Glucides': ['Carbs', 'Hidratos'], 'Lipides': ['Fat', 'Grasas'], 'Calories': ['Calories', 'Calorías'],
    'Compte pour la médaille': ['Counts toward the medal', 'Cuenta para la medalla'], 'Doublon à gagner': ['Duplicate to win', 'Duplicado en juego'],
    'Donner un doublon': ['Give a duplicate', 'Regalar un duplicado'], 'Donner': ['Give', 'Regalar'],
    'Garde-la pour l’offrir : tu peux la donner à un ami depuis tes trophées.': ['Keep it to gift: you can give it to a friend from your trophies.', 'Guárdala para regalarla: puedes dársela a un amigo desde tus trofeos.'],
    'À offrir depuis tes trophées': ['Give it away from your trophies', 'Regálala desde tus trofeos'],
    'Les emplacements vides indiquent comment les obtenir.': ['Empty slots show how to earn them.', 'Los huecos vacíos indican cómo conseguirlas.'],
    'Ton programme sport et nutrition, des défis à relever, des médailles à gagner.': ['Your training and nutrition plan, challenges to take on, medals to win.', 'Tu plan de entreno y nutrición, retos que superar, medallas que ganar.'],
    'On prépare ton programme': ['Preparing your plan', 'Preparando tu plan'],
    'Les ingrédients sont remplacés automatiquement selon ton alimentation.': ['Ingredients are swapped automatically to match your diet.', 'Los ingredientes se cambian automáticamente según tu alimentación.'],
    'Un cheat meal planifié aide à tenir sur la durée. Il remplace un dîner le samedi, et un déjeuner le mercredi si tu en choisis deux.': ['A planned treat meal helps you stick with it. It replaces Saturday dinner, and Wednesday lunch if you pick two.', 'Una comida libre planificada ayuda a mantener el plan. Sustituye la cena del sábado, y la comida del miércoles si eliges dos.'],
    'Halal et casher : les viandes proposées sont indiquées comme certifiées, jamais de porc. Casher : pas de crustacés ni de plat mêlant viande et produit laitier.': ['Halal and kosher: suggested meats are marked as certified, never pork. Kosher: no shellfish and no dish mixing meat and dairy.', 'Halal y kosher: las carnes propuestas se indican como certificadas, nunca cerdo. Kosher: sin marisco ni platos que mezclen carne y lácteos.'],
    'Aucun plat proposé ne contiendra ces aliments. En cas d’allergie sévère, vérifie toujours les étiquettes.': ['No suggested dish will contain these foods. With a severe allergy, always check labels.', 'Ningún plato propuesto contendrá estos alimentos. Con una alergia grave, revisa siempre las etiquetas.'],
    'Type de petit-déjeuner (obligatoire)': ['Breakfast type (required)', 'Tipo de desayuno (obligatorio)'], 'Salé': ['Savory', 'Salado'], 'Sucré': ['Sweet', 'Dulce'], 'Sucré-salé': ['Sweet and savory', 'Dulce y salado'],
    'Œufs, pain complet, avocat': ['Eggs, wholegrain bread, avocado', 'Huevos, pan integral, aguacate'], 'Avoine, yaourt, fruits': ['Oats, yogurt, fruit', 'Avena, yogur, fruta'], 'Œufs, pain, pomme, miel': ['Eggs, bread, apple, honey', 'Huevos, pan, manzana, miel'],
    'Repas plaisir : savoure-le sans culpabilité, mange lentement, ajoute des légumes si tu peux et bois de l’eau. Pas de compensation le lendemain, on reprend simplement le plan.': ['Treat meal: enjoy it guilt-free, eat slowly, add vegetables if you can and drink water. No making up for it the next day, just get back to the plan.', 'Comida libre: disfrútala sin culpa, come despacio, añade verduras si puedes y bebe agua. Nada de compensar al día siguiente, simplemente vuelves al plan.'],
    'Aucun plat ne correspond à toutes tes restrictions pour ce repas. Modifie ton profil ou demande au coach.': ['No dish matches all your restrictions for this meal. Edit your profile or ask the coach.', 'Ningún plato cumple todas tus restricciones para esta comida. Edita tu perfil o pregunta al coach.'],
    'Petit-déjeuner 25 %, déjeuner 35 %, dîner 30 %, collation 10 %, ajustés selon que tu t’entraînes ou non.': ['Breakfast 25%, lunch 35%, dinner 30%, snack 10%, adjusted for training and rest days.', 'Desayuno 25 %, comida 35 %, cena 30 %, merienda 10 %, ajustados según entrenes o no.'],
    'Alimentation :': ['Diet:', 'Alimentación:'],
    'Âge': ['Age', 'Edad'], 'Installer l’app': ['Install the app', 'Instalar la app'], 'Kin Fit est installée.': ['Kin Fit is installed.', 'Kin Fit está instalada.'],
    'Kin Fit est installée sur cet appareil. Elle fonctionne aussi hors connexion.': ['Kin Fit is installed on this device. It also works offline.', 'Kin Fit está instalada en este dispositivo. También funciona sin conexión.'],
    'Ajoute Kin Fit à ton écran d’accueil : elle s’ouvre en plein écran et fonctionne hors connexion.': ['Add Kin Fit to your home screen: it opens full screen and works offline.', 'Añade Kin Fit a tu pantalla de inicio: se abre a pantalla completa y funciona sin conexión.'],
    'Sur iPhone : ouvre Kin Fit dans Safari, touche le bouton Partager, puis « Sur l’écran d’accueil ».': ['On iPhone: open Kin Fit in Safari, tap the Share button, then “Add to Home Screen”.', 'En iPhone: abre Kin Fit en Safari, toca el botón Compartir y luego «Añadir a pantalla de inicio».'],
    'Ouvre Kin Fit dans Chrome, Edge ou Safari, puis choisis « Installer l’application » ou « Ajouter à l’écran d’accueil » dans le menu du navigateur.': ['Open Kin Fit in Chrome, Edge or Safari, then choose “Install app” or “Add to Home Screen” from the browser menu.', 'Abre Kin Fit en Chrome, Edge o Safari y elige «Instalar aplicación» o «Añadir a pantalla de inicio» en el menú del navegador.'], 'Courses': ['Groceries', 'Compra'], 'Liste de courses': ['Shopping list', 'Lista de la compra'],
    'Pour 7 jours : petits-déjeuners, déjeuners et dîners du plan, adaptés à ton budget et à ta région. Coche ce que tu as déjà.': ['For 7 days: the plan’s breakfasts, lunches and dinners, adapted to your budget and region. Tick what you already have.', 'Para 7 días: desayunos, comidas y cenas del plan, adaptados a tu presupuesto y tu región. Marca lo que ya tienes.'],
    'Partager': ['Share', 'Compartir'], 'Copier la liste': ['Copy list', 'Copiar la lista'], 'Imprimer': ['Print', 'Imprimir'], 'Tout décocher': ['Untick all', 'Desmarcar todo'],
    'Liste copiée.': ['List copied.', 'Lista copiada.'], 'Impossible de copier la liste.': ['Couldn’t copy the list.', 'No se pudo copiar la lista.'],
    'Fruits et légumes': ['Fruit and vegetables', 'Frutas y verduras'], 'Protéines': ['Protein', 'Proteínas'], 'Produits laitiers et alternatives': ['Dairy and alternatives', 'Lácteos y alternativas'],
    'Féculents et céréales': ['Starches and grains', 'Féculas y cereales'], 'Épicerie': ['Pantry', 'Despensa'], 'Collations': ['Snacks', 'Meriendas'],
    'Les quantités sont des estimations, arrondies pour faciliter les courses. Riz, pâtes et céréales sont indiqués en poids sec.': ['Quantities are estimates, rounded to make shopping easier. Rice, pasta and grains are shown as dry weight.', 'Las cantidades son estimaciones, redondeadas para facilitar la compra. Arroz, pasta y cereales se indican en peso seco.'],
    'Les quantités sont des estimations, arrondies pour faciliter les courses.': ['Quantities are estimates, rounded to make shopping easier.', 'Las cantidades son estimaciones, redondeadas para facilitar la compra.'], 'Avocat': ['Avocado', 'Aguacate'], 'Banane': ['Banana', 'Plátano'], 'Pomme': ['Apple', 'Manzana'], 'Miel': ['Honey', 'Miel'], 'Amandes': ['Almonds', 'Almendras'],
    'Feta': ['Feta', 'Feta'], 'Parmesan': ['Parmesan', 'Parmesano'], 'Edamame': ['Edamame', 'Edamame'], 'Brocolis': ['Broccoli', 'Brócoli'], 'Courgettes': ['Zucchini', 'Calabacín'], 'Épinards': ['Spinach', 'Espinacas'],
    'Poivrons': ['Bell peppers', 'Pimientos'], 'Crevettes': ['Shrimp', 'Gambas'], 'Champignons': ['Mushrooms', 'Champiñones'], 'Houmous': ['Hummus', 'Hummus'], 'Edamames': ['Edamame', 'Edamame'],
    'version économique': ['budget version', 'versión económica'], 'version locale': ['local version', 'versión local'], 'Élastiques': ['Resistance bands', 'Bandas elásticas'], 'Haltères': ['Dumbbells', 'Mancuernas'], 'Salle de sport': ['Gym', 'Gimnasio'], 'Poids du corps': ['Bodyweight', 'Peso corporal'], 'Défis sport et nutrition': ['Training and nutrition challenges', 'Retos de deporte y nutrición'], 'Récupération et conseils': ['Recovery and tips', 'Recuperación y consejos'], 'Repos et récupération': ['Rest and recovery', 'Descanso y recuperación'],
    'Salade et crudités': ['Salad and raw vegetables', 'Ensalada y verduras crudas'], 'Crudités': ['Raw vegetables', 'Verduras crudas'],
    'Aucun message pour l’instant. Essaie : « Par quoi remplacer le squat ? », « J’ai faim le soir », « Je suis fatigué aujourd’hui ».': ['No messages yet. Try: “What can replace squats?”, “I get hungry in the evening”, “I’m tired today”.', 'Aún no hay mensajes. Prueba: «¿Por qué cambio la sentadilla?», «Tengo hambre por la noche», «Hoy estoy cansado».'],
    'Version jour de repos': ['Rest-day version', 'Versión día de descanso'], 'Version jour d’entraînement': ['Training-day version', 'Versión día de entrenamiento'], 'valeurs estimées': ['estimated values', 'valores estimados'],
    'Prototype : programmes, défis et valeurs sont des exemples calculés dans ton navigateur, aucun modèle d’IA n’est encore connecté. Les valeurs nutritionnelles sont des estimations. En cas de douleur ou de pathologie, demande l’avis d’un professionnel de santé.': ['Prototype: plans, challenges and values are examples calculated in your browser; no AI model is connected yet. Nutrition values are estimates. If you have pain or a medical condition, ask a health professional.', 'Prototipo: planes, retos y valores son ejemplos calculados en tu navegador; aún no hay ningún modelo de IA conectado. Los valores nutricionales son estimaciones. Si tienes dolor o una patología, consulta a un profesional de la salud.'],
  };

  // Ingredient alternatives (meals.js) and their labels
  const ALT_WORDS = {
    'Maquereau ou sardines en boîte': ['Canned mackerel or sardines', 'Caballa o sardinas en lata'], 'Sardines fraîches': ['Fresh sardines', 'Sardinas frescas'], 'Tilapia': ['Tilapia', 'Tilapia'], 'Capitaine ou tilapia': ['Nile perch or tilapia', 'Perca del Nilo o tilapia'],
    'Riz complet cuit': ['Cooked brown rice', 'Arroz integral cocido'], 'Couscous complet cuit': ['Cooked wholewheat couscous', 'Cuscús integral cocido'], 'Fonio cuit': ['Cooked fonio', 'Fonio cocido'], 'Riz cuit': ['Cooked rice', 'Arroz cocido'],
    'Huile d’olive': ['Olive oil', 'Aceite de oliva'], 'Huile de colza': ['Rapeseed oil', 'Aceite de colza'], 'Huile d’olive ou graines': ['Olive oil or seeds', 'Aceite de oliva o semillas'],
    'Thon en boîte au naturel': ['Canned tuna in water', 'Atún en lata al natural'], 'Crevettes surgelées': ['Frozen shrimp', 'Gambas congeladas'], 'Steak haché 5 %': ['5% ground beef', 'Carne picada 5 %'],
    'Hauts de cuisse de poulet': ['Chicken thighs', 'Contramuslos de pollo'], 'Lieu ou merlu surgelé': ['Frozen pollock or hake', 'Abadejo o merluza congelados'], 'Fromage blanc ou cottage': ['Quark or cottage cheese', 'Queso fresco batido o cottage'],
    'Petits pois': ['Peas', 'Guisantes'], 'Concombre et carotte': ['Cucumber and carrot', 'Pepino y zanahoria'], 'Chou ou brocolis': ['Cabbage or broccoli', 'Col o brócoli'], 'Pommes de terre': ['Potatoes', 'Patatas'],
    'Igname ou patate douce': ['Yam or sweet potato', 'Ñame o boniato'], 'Riz rond': ['Short-grain rice', 'Arroz redondo'], 'Emmental râpé': ['Grated Emmental', 'Emmental rallado'], 'Haricots noirs': ['Black beans', 'Frijoles negros'],
    'Légumes de saison ou surgelés': ['Seasonal or frozen vegetables', 'Verduras de temporada o congeladas'], 'Légumes surgelés': ['Frozen vegetables', 'Verduras congeladas'], 'Tortillas de maïs': ['Corn tortillas', 'Tortillas de maíz'],
    'Pain d’orge ou msemen complet': ['Barley bread or wholewheat msemen', 'Pan de cebada o msemen integral'], 'Pain de mil ou de manioc': ['Millet or cassava bread', 'Pan de mijo o de yuca'], 'Graines de tournesol': ['Sunflower seeds', 'Pipas de girasol'],
    'Pomme ou banane': ['Apple or banana', 'Manzana o plátano'], 'Œuf supplémentaire': ['An extra egg', 'Un huevo más'], 'Agneau ou bœuf': ['Lamb or beef', 'Cordero o ternera'], 'Maïs et haricots noirs': ['Corn and black beans', 'Maíz y frijoles negros'],
    'Plantain et haricots': ['Plantain and beans', 'Plátano macho y alubias'], 'Lentilles et riz': ['Lentils and rice', 'Lentejas y arroz'],
  };
  Object.assign(EXTRA, ALT_WORDS);

  const DICT = () => Object.assign({}, window.NA_I18N_DATA || {}, EXTRA);
  let dict = null;
  const look = (s) => { dict = dict || DICT(); const v = dict[s]; return v ? v[idx()] : null; };

  const pick = (en, es) => (L() === 'en' ? en : es);
  const PAT = [
    [/^(Bonjour|Bonsoir), (.+)$/, (m) => pick(`${m[1] === 'Bonjour' ? 'Good morning' : 'Good evening'}, ${m[2]}`, `${m[1] === 'Bonjour' ? 'Buenos días' : 'Buenas noches'}, ${m[2]}`)],
    [/^séances? d’affilée$/, (m) => pick(/séances/.test(m[0]) ? 'sessions in a row' : 'session in a row', /séances/.test(m[0]) ? 'sesiones seguidas' : 'sesión seguida')],
    [/^pts$/, () => pick('pts', 'pts')],
    [/^(\d+) articles cochés sur (\d+)$/, (m) => pick(`${m[1]} of ${m[2]} items ticked`, `${m[1]} de ${m[2]} artículos marcados`)],
    [/^Semaine du (.+)$/, (m) => pick(`Week of ${m[1]}`, `Semana del ${m[1]}`)],
    [/^(\d+) œufs$/, (m) => pick(`${m[1]} eggs`, `${m[1]} huevos`)],
    [/^(\d+) g sec$/, (m) => pick(`${m[1]} g dry`, `${m[1]} g en seco`)],
    [/^· (.+)$/, (m) => `· ${tr(m[1])}`],
    [/^environ ([\d,]+) litres d’eau par jour, 7 à 9 heures de sommeil, 10 minutes de mobilité les jours sans séance, un jour de repos complet par semaine$/, (m) => pick(`about ${m[1].replace(',', '.')} liters of water a day, 7 to 9 hours of sleep, 10 minutes of mobility on non-training days, one full rest day a week`, `unos ${m[1]} litros de agua al día, de 7 a 9 horas de sueño, 10 minutos de movilidad los días sin sesión y un día de descanso completo por semana`)],
    [/^· (\d+) avant (.+)$/, (m) => pick(`· ${m[1]} to ${tr(m[2])}`, `· ${m[1]} para ${tr(m[2])}`)],
    [/^défis? reçus?$/, (m) => pick(/défis/.test(m[0]) ? 'challenges received' : 'challenge received', /défis/.test(m[0]) ? 'retos recibidos' : 'reto recibido')],
    [/^Petit-déjeuner (salé|sucré|sucré-salé)$/, (m) => pick(`${tr(m[1].charAt(0).toUpperCase() + m[1].slice(1))} breakfast`, `Desayuno ${tr(m[1].charAt(0).toUpperCase() + m[1].slice(1)).toLowerCase()}`)],
    [/^(\d+) séances sur (\d+)$/, (m) => pick(`${m[1]} of ${m[2]} sessions`, `${m[1]} de ${m[2]} sesiones`)],
    [/^\/ (\d+) ?(.*)$/, (m) => `/ ${m[1]}${m[2] ? ` ${tr(m[2])}` : ''}`],
    [/^Séance (\d+)$/, (m) => pick(`Session ${m[1]}`, `Sesión ${m[1]}`)],
    [/^intensité (\d+)\/10$/, (m) => pick(`intensity ${m[1]}/10`, `intensidad ${m[1]}/10`)],
    [/^repos (\d+) s$/, (m) => pick(`rest ${m[1]} s`, `descanso ${m[1]} s`)],
    [/^(\d+) (œufs?|tofu) · (\d+) g$/, (m) => pick(`${m[1]} egg${+m[1] > 1 ? 's' : ''} · ${m[3]} g`, `${m[1]} huevo${+m[1] > 1 ? 's' : ''} · ${m[3]} g`)],
    [/^(Protéines|Glucides|Lipides) (\d+) g$/, (m) => `${tr(m[1])} ${m[2]} g`],
    [/^sans (.+)$/, (m) => pick(`no ${tr(m[1])}`, `sin ${tr(m[1])}`)],
    [/^(.+), objectif (.+)$/, (m) => pick(`${tr(m[1])}, goal: ${tr(m[2]).toLowerCase()}`, `${tr(m[1])}, objetivo: ${tr(m[2]).toLowerCase()}`)],
    [/^(\d+) médailles? sur (\d+)$/, (m) => pick(`${m[1]} of ${m[2]} medals`, `${m[1]} de ${m[2]} medallas`)],
    [/^Encore (\d+) points pour l’écusson (.+)$/, (m) => pick(`${m[1]} more points for the ${tr(m[2])} badge`, `Faltan ${m[1]} puntos para el escudo ${tr(m[2])}`)],
    [/^Rang (.+)$/, (m) => pick(`${tr(m[1])} rank`, `Rango ${tr(m[1])}`)],
    [/^Défi de (.+)$/, (m) => pick(`Challenge from ${m[1]}`, `Reto de ${m[1]}`)],
    [/^De la part de (.+)$/, (m) => pick(`From ${m[1]}`, `De parte de ${m[1]}`)],
    [/^Défi envoyé à (.+)$/, (m) => pick(`Challenge sent to ${m[1]}`, `Reto enviado a ${m[1]}`)],
    [/^Doublon donné à (.+)$/, (m) => pick(`Duplicate given to ${m[1]}`, `Duplicado regalado a ${m[1]}`)],
    [/^(.+) te lance un défi : (.+)$/, (m) => pick(`${m[1]} challenges you: ${tr(m[2])}`, `${m[1]} te reta: ${tr(m[2])}`)],
    [/^Nouvelle médaille\s?: (.+)$/, (m) => pick(`New medal: ${tr(m[1])}`, `Nueva medalla: ${tr(m[1])}`)],
    [/^Doublon\s?: (.+)$/, (m) => pick(`Duplicate: ${tr(m[1])}`, `Duplicado: ${tr(m[1])}`)],
    [/^Défi réussi\s?: (.+)$/, (m) => pick(`Challenge complete: ${tr(m[1])}`, `Reto logrado: ${tr(m[1])}`)],
    [/^(\d+) défis réussis$/, (m) => pick(`${m[1]} challenges complete`, `${m[1]} retos logrados`)],
    [/^\+(\d+) points$/, (m) => pick(`+${m[1]} points`, `+${m[1]} puntos`)],
    [/^\+(\d+) pts$/, (m) => `+${m[1]} pts`],
    [/^et (\d+) autres? dans tes trophées$/, (m) => pick(`and ${m[1]} more in your trophies`, `y ${m[1]} más en tus trofeos`)],
    [/^version (\d+)$/, (m) => pick(`version ${m[1]}`, `versión ${m[1]}`)],
    [/^(\d+) ans$/, (m) => pick(`${m[1]} years`, `${m[1]} años`)],
    [/^(\d+) par semaine$/, (m) => pick(`${m[1]} per week`, `${m[1]} por semana`)],
    [/^Besoin estimé : (\d+) kcal par jour$/, (m) => pick(`Estimated needs: ${m[1]} kcal per day`, `Necesidades estimadas: ${m[1]} kcal al día`)],
    [/^(\d+) verres? sur 8$/, (m) => pick(`${m[1]} of 8 glasses`, `${m[1]} de 8 vasos`)],
    [/^(\d+) verres?$/, (m) => pick(`${m[1]} glass${+m[1] > 1 ? 'es' : ''}`, `${m[1]} vaso${+m[1] > 1 ? 's' : ''}`)],
    [/^objectif 2 litres$/, () => pick('goal 2 liters', 'objetivo 2 litros')],
    [/^Chercher « (.+?)( technique)? » sur YouTube$/, (m) => { const q = tr(m[1]); return pick(`Search “${q}${m[2] ? ' technique' : ''}” on YouTube`, `Buscar «${q}${m[2] ? ' técnica' : ''}» en YouTube`); }],
    [/^(.+) ·$/, (m) => `${tr(m[1])} ·`],
    [/^Déjà (\d+) exercices? sur (\d+)$/, (m) => pick(`${m[1]} of ${m[2]} exercises done`, `Ya llevas ${m[1]} de ${m[2]} ejercicios`)],
    [/^Vise environ (\d+) g de protéines dans les deux heures$/, (m) => pick(`Aim for about ${m[1]} g of protein within two hours`, `Apunta a unos ${m[1]} g de proteína en las dos horas siguientes`)],
    [/^Au programme : (.+)$/, (m) => pick(`On the plan: ${tr(m[1])}`, `En el plan: ${tr(m[1])}`)],
    [/^environ ([\d,]+) litres d’eau par jour$/, (m) => pick(`about ${m[1].replace(',', '.')} liters of water a day`, `unos ${m[1]} litros de agua al día`)],
    [/^(.+) (halal|casher)$/, (m) => { const b = tr(m[1]); return b === m[1] ? null : `${b} ${tr(m[2])}`; }],
    [/^(\d+) pièces$/, (m) => pick(`${m[1]} pieces`, `${m[1]} piezas`)],
    [/^Tu as (\d+) exemplaires de la médaille$/, (m) => pick(`You have ${m[1]} copies of the medal`, `Tienes ${m[1]} ejemplares de la medalla`)],
    [/^(\d+) (.+)$/, (m) => { const u = look(m[2]); return u ? `${m[1]} ${u}` : null; }],
  ];

  function tr(raw) {
    if (L() === 'fr' || raw == null) return raw;
    const s = String(raw);
    const lead = s.match(/^\s*/)[0]; const trail = s.match(/\s*$/)[0];
    const core = s.trim();
    if (!core || !/[A-Za-zÀ-ÿŒœ]/.test(core)) return s;
    const out = trCore(core);
    return out == null ? s : lead + out + trail;
  }
  function trCore(core) {
    let v = look(core); if (v) return v;
    const m1 = core.match(/^(.*?)([.:!?…]+)$/);
    if (m1 && m1[1]) { v = look(m1[1]); if (v) return v + (/[.!?]$/.test(v) ? '' : m1[2].replace(/^ ?:/, ':')); }
    for (const [re, fn] of PAT) { const m = core.match(re); if (m) { const r = fn(m); if (r != null) return r; } }
    if (m1 && m1[1]) for (const [re, fn] of PAT) { const m = m1[1].match(re); if (m) { const r = fn(m); if (r != null) return r + m1[2].replace(/^ ?:/, ':'); } }
    if (core.includes(' · ')) { const parts = core.split(' · '); const t = parts.map((p) => tr(p)); if (t.some((x, i) => x !== parts[i])) return t.join(' · '); }
    const sentences = core.split(/(?<=[.!?])\s+/);
    if (sentences.length > 1) { const t = sentences.map((p) => tr(p)); if (t.some((x, i) => x !== sentences[i])) return t.join(' '); }
    if (core.includes(', ')) { const parts = core.split(', '); const t = parts.map((p) => { const x = look(p) || look(p.charAt(0).toUpperCase() + p.slice(1)); return x || p; }); if (t.some((x, i) => x !== parts[i])) return t.join(', '); }
    return null;
  }

  const ATTRS = ['aria-label', 'placeholder', 'title', 'alt'];
  const SKIP = 'script,style,svg,textarea,input,[data-no-i18n]';
  function translateNode(root) {
    if (L() === 'fr' || !root) return;
    if (root.nodeType === 3) { if (!root.parentElement || !root.parentElement.closest(SKIP)) { const v = tr(root.nodeValue); if (v !== root.nodeValue) root.nodeValue = v; } return; }
    if (root.nodeType !== 1 || root.closest(SKIP)) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && n.parentElement.closest(SKIP) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    const nodes = []; while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((n) => { const v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; });
    [root, ...root.querySelectorAll('[aria-label],[placeholder],[title],[alt]')].forEach((el) => ATTRS.forEach((a) => { if (el.hasAttribute && el.hasAttribute(a)) { const v = tr(el.getAttribute(a)); if (v !== el.getAttribute(a)) el.setAttribute(a, v); } }));
  }

  let obs = null;
  function start() {
    document.documentElement.lang = L();
    if (L() === 'fr') { if (obs) { obs.disconnect(); obs = null; } return; }
    document.title = tr(document.title);
    translateNode(document.body);
    if (!obs) {
      obs = new MutationObserver((list) => {
        for (const m of list) {
          if (m.type === 'characterData') translateNode(m.target);
          else if (m.type === 'attributes') translateNode(m.target);
          else m.addedNodes.forEach((n) => translateNode(n));
        }
      });
      obs.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
    }
  }

  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) { /* in memory */ } };

  window.NA_I18N = {
    COUNTRIES, LANG_NAMES,
    get lang() { return L(); },
    get locale() { return LOCALES[L()]; },
    get prefs() { return prefs; },
    get country() { return country(); },
    get region() { const c = country(); return c ? c.region : 'eu'; },
    countryName: (c) => c.name[L()],
    set(next) { const before = L(); prefs = Object.assign({}, prefs, next); save(); dict = null; if (before !== L() && before !== 'fr') { location.reload(); return; } start(); },
    t: tr,
    start,
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
