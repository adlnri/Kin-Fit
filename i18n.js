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
    "Compte Kin Fit": ["Kin Fit account", "Cuenta Kin Fit"],
    "Facultatif": ["Optional", "Opcional"],
    "Connecté": ["Signed in", "Conectado"],
    "Encore une étape": ["One more step", "Un paso más"],
    "Facultatif et gratuit : sauvegarde ta progression, retrouve-la sur tous tes appareils et défie tes amis où qu’ils soient. Pas de mot de passe : tu reçois un lien par e-mail.": ["Optional and free: back up your progress, get it back on all your devices and challenge your friends wherever they are. No password: you get a link by e-mail.", "Opcional y gratis: guarda tu progreso, recupéralo en todos tus dispositivos y reta a tus amigos estén donde estén. Sin contraseña: recibes un enlace por correo."],
    "Ton e-mail": ["Your e-mail", "Tu correo"],
    "Recevoir le lien de connexion": ["Send me a sign-in link", "Recibir el enlace de acceso"],
    "Continuer avec Google": ["Continue with Google", "Continuar con Google"],
    "Pseudo": ["Username", "Seudónimo"],
    "3 à 20 caractères : lettres, chiffres, point, tiret ou tiret bas.": ["3 to 20 characters: letters, digits, dot, hyphen or underscore.", "De 3 a 20 caracteres: letras, números, punto, guion o guion bajo."],
    "J’accepte que Kin Fit enregistre mon profil sportif et ma progression, y compris des données de santé (poids, douleurs, allergies), pour me les rendre sur mes appareils. Je peux les exporter ou les supprimer à tout moment.": ["I agree that Kin Fit stores my training profile and progress, including health data (weight, pain, allergies), to give them back to me on my devices. I can export or delete them at any time.", "Acepto que Kin Fit guarde mi perfil deportivo y mi progreso, incluidos datos de salud (peso, dolores, alergias), para devolvérmelos en mis dispositivos. Puedo exportarlos o eliminarlos en cualquier momento."],
    "Politique de confidentialité": ["Privacy policy", "Política de privacidad"],
    "Créer mon compte": ["Create my account", "Crear mi cuenta"],
    "Se déconnecter": ["Sign out", "Cerrar sesión"],
    "Synchroniser": ["Sync", "Sincronizar"],
    "Exporter mes données": ["Export my data", "Exportar mis datos"],
    "Supprimer mon compte": ["Delete my account", "Eliminar mi cuenta"],
    "Garder": ["Keep", "Conservar"],
    "Progression sauvegardée.": ["Progress backed up.", "Progreso guardado."],
    "Ce compte est lié à une autre session de cet appareil.": ["This account is linked to another session on this device.", "Esta cuenta está vinculada a otra sesión de este dispositivo."],
    "Tes amis Kin Fit": ["Your Kin Fit friends", "Tus amigos de Kin Fit"],
    "Avec un compte gratuit": ["With a free account", "Con una cuenta gratis"],
    "Ajoute des amis par leur pseudo, lance-leur des défis et suis leur progression, où qu’ils soient.": ["Add friends by username, send them challenges and follow their progress, wherever they are.", "Añade amigos por su seudónimo, lánzales retos y sigue su progreso, estén donde estén."],
    "Pseudo de ton ami": ["Your friend’s username", "Seudónimo de tu amigo"],
    "Ajouter": ["Add", "Añadir"],
    "veut être ton ami": ["wants to be your friend", "quiere ser tu amigo"],
    "Accepter": ["Accept", "Aceptar"],
    "Refuser": ["Decline", "Rechazar"],
    "Ami": ["Friend", "Amigo"],
    "Retirer": ["Remove", "Quitar"],
    "Ajoute un ami avec son pseudo : il recevra ta demande.": ["Add a friend by username: they will get your request.", "Añade un amigo con su seudónimo: recibirá tu solicitud."],
    "Ils le reçoivent sur leur téléphone et vous voyez la progression de chacun.": ["They get it on their phone and you all see each other’s progress.", "Lo reciben en su teléfono y veis el progreso de cada uno."],
    "J’ai déjà un compte Kin Fit": ["I already have a Kin Fit account", "Ya tengo una cuenta Kin Fit"],
    "Ce compte n’a pas encore de profil Kin Fit : termine ces étapes, puis choisis ton pseudo dans Profil.": ["This account has no Kin Fit profile yet: finish these steps, then choose your username in Profile.", "Esta cuenta aún no tiene perfil Kin Fit: termina estos pasos y luego elige tu seudónimo en Perfil."],
    "Ce pseudo est déjà pris. Essaie une variante.": ["That username is taken. Try a variation.", "Ese seudónimo ya está cogido. Prueba una variante."],
    "Pseudo de 3 à 20 caractères : lettres, chiffres, point, tiret ou tiret bas.": ["Username of 3 to 20 characters: letters, digits, dot, hyphen or underscore.", "Seudónimo de 3 a 20 caracteres: letras, números, punto, guion o guion bajo."],
    "Aucun compte avec ce pseudo. Vérifie l’orthographe.": ["No account with that username. Check the spelling.", "Ninguna cuenta con ese seudónimo. Revisa la ortografía."],
    "Pas de connexion. Réessaie quand tu as du réseau.": ["No connection. Try again when you have signal.", "Sin conexión. Vuelve a intentarlo cuando tengas red."],
    "Le service de comptes ne répond pas. Réessaie plus tard.": ["The account service is not responding. Try again later.", "El servicio de cuentas no responde. Inténtalo más tarde."],
    "Entre une adresse e-mail valide.": ["Enter a valid e-mail address.", "Introduce un correo válido."],
    "Envoi du lien…": ["Sending the link…", "Enviando el enlace…"],
    "Coche la case de consentement pour créer ton compte.": ["Tick the consent box to create your account.", "Marca la casilla de consentimiento para crear tu cuenta."],
    "Création du compte…": ["Creating the account…", "Creando la cuenta…"],
    "Entre le pseudo de ton ami.": ["Enter your friend’s username.", "Introduce el seudónimo de tu amigo."],
    "Recherche…": ["Searching…", "Buscando…"],
    "Ami ajouté.": ["Friend added.", "Amigo añadido."],
    "Déconnecté. Tes données restent sur cet appareil.": ["Signed out. Your data stays on this device.", "Sesión cerrada. Tus datos se quedan en este dispositivo."],
    "Progression synchronisée.": ["Progress synced.", "Progreso sincronizado."],
    "Compte supprimé. Les données de cet appareil restent.": ["Account deleted. The data on this device stays.", "Cuenta eliminada. Los datos de este dispositivo se quedan."],
    "Le défi n’a pas pu partir. Vérifie ta connexion et réessaie.": ["The challenge could not be sent. Check your connection and try again.", "No se pudo enviar el reto. Comprueba tu conexión y vuelve a intentarlo."],
    "(invité)": ["(invited)", "(invitado)"],
    "Coach IA": ["AI coach", "Coach IA"],
    "Source de l’IA": ["AI source", "Fuente de la IA"],
    "sans IA, exemples de l’app": ["no AI, app samples", "sin IA, ejemplos de la app"],
    "Gemini, avec ta clé": ["Gemini, with your key", "Gemini, con tu clave"],
    "IA sur ton appareil (coach)": ["on-device AI (coach)", "IA en tu dispositivo (coach)"],
    "serveur Kin Fit": ["Kin Fit server", "servidor Kin Fit"],
    "Sur cet appareil :": ["On this device:", "En este dispositivo:"],
    "Sans IA": ["No AI", "Sin IA"],
    "Programmes, repas et coach d’exemple, calculés dans ton navigateur. Gratuit et hors connexion.": ["Sample programmes, meals and coach, calculated in your browser. Free and offline.", "Programas, comidas y coach de ejemplo, calculados en tu navegador. Gratis y sin conexión."],
    "Gemini, avec ta clé Google": ["Gemini, with your Google key", "Gemini, con tu clave de Google"],
    "Réservé aux 18 ans et plus par Google.": ["Google restricts it to people 18 and over.", "Google lo reserva a mayores de 18 años."],
    "Programmes, repas et coach écrits par Gemini, avec ta propre clé créée sur Google AI Studio.": ["Programmes, meals and coach written by Gemini, with your own key from Google AI Studio.", "Programas, comidas y coach escritos por Gemini, con tu propia clave creada en Google AI Studio."],
    "IA sur ton appareil": ["AI on your device", "IA en tu dispositivo"],
    "Le coach répond sans rien envoyer sur Internet. Premier téléchargement d’environ 1 Go.": ["The coach answers without sending anything online. First download of about 1 GB.", "El coach responde sin enviar nada a Internet. Primera descarga de 1 GB aprox."],
    "Serveur Kin Fit": ["Kin Fit server", "Servidor Kin Fit"],
    "L’IA du site Kin Fit, si elle est activée.": ["The Kin Fit site’s AI, when enabled.", "La IA del sitio Kin Fit, si está activada."],
    "Touche « Create API key », puis copie la clé.": ["Tap “Create API key”, then copy the key.", "Toca «Create API key» y copia la clave."],
    "Colle-la ici et touche Connecter. Kin Fit vérifie qu’elle marche.": ["Paste it here and tap Connect. Kin Fit checks that it works.", "Pégala aquí y toca Conectar. Kin Fit comprueba que funciona."],
    "Ta clé Gemini": ["Your Gemini key", "Tu clave de Gemini"],
    "Clé enregistrée sur cet appareil": ["Key saved on this device", "Clave guardada en este dispositivo"],
    "Colle ta clé ici": ["Paste your key here", "Pega tu clave aquí"],
    "Changer de clé": ["Change key", "Cambiar de clave"],
    "Connecter": ["Connect", "Conectar"],
    "Retirer la clé": ["Remove the key", "Quitar la clave"],
    "Gemini est connecté sur cet appareil.": ["Gemini is connected on this device.", "Gemini está conectado en este dispositivo."],
    "À savoir avant de connecter.": ["Before you connect.", "Antes de conectar."],
    "Ton profil (âge, taille, poids, objectif, sport, restrictions, alimentation) part directement de ton appareil vers Google, avec ta clé. Kin Fit ne voit ni ta clé ni les réponses.": ["Your profile (age, height, weight, goal, sport, restrictions, diet) goes straight from your device to Google, with your key. Kin Fit never sees your key or the answers.", "Tu perfil (edad, altura, peso, objetivo, deporte, restricciones, alimentación) va directamente de tu dispositivo a Google, con tu clave. Kin Fit no ve ni tu clave ni las respuestas."],
    "Avec l’offre gratuite, Google peut utiliser ces échanges pour améliorer ses services et les faire relire par des personnes : n’écris pas de détails médicaux.": ["On the free tier, Google may use these exchanges to improve its services and have people review them: do not write medical details.", "Con la oferta gratuita, Google puede usar estos intercambios para mejorar sus servicios y hacer que personas los revisen: no escribas detalles médicos."],
    "Google réserve son API aux 18 ans et plus. Dans l’Union européenne, au Royaume-Uni et en Suisse, il demande un compte Google avec facturation activée pour ce type d’usage : l’éventuel coût est alors facturé sur ton compte Google, jamais par Kin Fit.": ["Google restricts its API to people 18 and over. In the European Union, the UK and Switzerland it requires a Google account with billing enabled for this kind of use: any cost is then charged to your Google account, never by Kin Fit.", "Google reserva su API a mayores de 18 años. En la Unión Europea, Reino Unido y Suiza exige una cuenta de Google con facturación activada para este uso: el posible coste se cobra en tu cuenta de Google, nunca por Kin Fit."],
    "La clé reste enregistrée sur cet appareil. Sur un appareil partagé, retire-la après usage.": ["The key stays saved on this device. On a shared device, remove it after use.", "La clave queda guardada en este dispositivo. En un dispositivo compartido, quítala después de usarla."],
    "Modèle open source Qwen 2.5 (1,5 milliard de paramètres) qui tourne dans ton navigateur. Il répond aux questions du coach ; programmes et repas restent ceux de l’app.": ["Open-source Qwen 2.5 model (1.5 billion parameters) running in your browser. It answers coach questions; programmes and meals stay the app’s.", "Modelo de código abierto Qwen 2.5 (1.500 millones de parámetros) que funciona en tu navegador. Responde al coach; programas y comidas siguen siendo los de la app."],
    "Le modèle est téléchargé et actif sur cet appareil.": ["The model is downloaded and active on this device.", "El modelo está descargado y activo en este dispositivo."],
    "Le modèle est déjà téléchargé.": ["The model is already downloaded.", "El modelo ya está descargado."],
    "Utiliser l’IA sur l’appareil": ["Use the on-device AI", "Usar la IA del dispositivo"],
    "Télécharger le modèle (environ 1 Go)": ["Download the model (about 1 GB)", "Descargar el modelo (1 GB aprox.)"],
    "Rien ne quitte ton appareil. Wi-Fi conseillé pour le premier téléchargement, ensuite ça marche hors connexion. Les réponses sont plus simples qu’avec Gemini et peuvent être lentes sur un téléphone ancien.": ["Nothing leaves your device. Wi-Fi recommended for the first download, then it works offline. Answers are simpler than with Gemini and can be slow on an older phone.", "Nada sale de tu dispositivo. Se recomienda wifi para la primera descarga; después funciona sin conexión. Las respuestas son más simples que con Gemini y pueden ser lentas en un teléfono antiguo."],
    "Google refuse cette clé. Vérifie que tu l’as copiée en entier, sans espace.": ["Google rejects this key. Check that you copied all of it, with no spaces.", "Google rechaza esta clave. Comprueba que la copiaste entera, sin espacios."],
    "Google refuse l’accès avec cette clé : région, facturation ou projet non autorisé. Vérifie ton compte sur Google AI Studio.": ["Google denies access with this key: region, billing or project not allowed. Check your account on Google AI Studio.", "Google deniega el acceso con esta clave: región, facturación o proyecto no autorizado. Revisa tu cuenta en Google AI Studio."],
    "Quota gratuit atteint pour le moment. Réessaie dans quelques minutes.": ["Free quota reached for now. Try again in a few minutes.", "Cuota gratuita alcanzada por ahora. Vuelve a intentarlo en unos minutos."],
    "Le modèle Gemini prévu n’est pas disponible pour cette clé.": ["The planned Gemini model is not available for this key.", "El modelo de Gemini previsto no está disponible para esta clave."],
    "Pas de connexion à Google. Vérifie ta connexion Internet.": ["Cannot reach Google. Check your internet connection.", "Sin conexión con Google. Comprueba tu conexión a Internet."],
    "Google met trop de temps à répondre. Réessaie.": ["Google is taking too long to answer. Try again.", "Google tarda demasiado en responder. Vuelve a intentarlo."],
    "Ton navigateur ne permet pas encore l’IA sur l’appareil (WebGPU indisponible). Essaie Chrome ou Edge récents.": ["Your browser does not support on-device AI yet (WebGPU unavailable). Try a recent Chrome or Edge.", "Tu navegador aún no admite la IA en el dispositivo (WebGPU no disponible). Prueba Chrome o Edge recientes."],
    "Le téléchargement du modèle a échoué. Vérifie ta connexion et l’espace libre, puis réessaie.": ["The model download failed. Check your connection and free space, then try again.", "La descarga del modelo falló. Comprueba tu conexión y el espacio libre, y vuelve a intentarlo."],
    "Ça n’a pas marché. Réessaie dans un moment.": ["That did not work. Try again in a moment.", "No funcionó. Vuelve a intentarlo en un momento."],
    "Clé Gemini retirée de cet appareil.": ["Gemini key removed from this device.", "Clave de Gemini quitada de este dispositivo."],
    "IA sur l’appareil activée pour le coach.": ["On-device AI enabled for the coach.", "IA del dispositivo activada para el coach."],
    "IA sur l’appareil prête pour le coach.": ["On-device AI ready for the coach.", "IA del dispositivo lista para el coach."],
    "Coach IA désactivé : l’app utilise ses exemples.": ["AI coach turned off: the app uses its samples.", "Coach IA desactivado: la app usa sus ejemplos."],
    "Serveur Kin Fit sélectionné.": ["Kin Fit server selected.", "Servidor Kin Fit seleccionado."],
    "Colle d’abord ta clé Gemini.": ["Paste your Gemini key first.", "Pega primero tu clave de Gemini."],
    "Vérification de la clé auprès de Google…": ["Checking the key with Google…", "Comprobando la clave con Google…"],
    "Gemini est connecté.": ["Gemini is connected.", "Gemini está conectado."],
    "Durée d’une séance, échauffement compris": ["Session length, warm-up included", "Duración de la sesión, calentamiento incluido"],
    "Durée": ["Duration", "Duración"],
    "Niveau et durée recalculent les charges, les séries et le nombre d’exercices de toutes les séances.": ["Level and duration recalculate loads, sets and the number of exercises in every session.", "Nivel y duración recalculan cargas, series y número de ejercicios de todas las sesiones."],
    "Parcours": ["Circuits", "Circuitos"],
    "Faire un parcours": ["Do a circuit", "Hacer un circuito"],
    "Des circuits à enchaîner sans temps mort : choisis ton style et ta durée, le rythme et le nombre de tours suivent ton niveau.": ["Circuits to run back to back: pick your style and length, pace and rounds follow your level.", "Circuitos para encadenar sin pausa: elige estilo y duración, el ritmo y las vueltas siguen tu nivel."],
    "Type de parcours": ["Circuit type", "Tipo de circuito"],
    "Durée du parcours": ["Circuit length", "Duración del circuito"],
    "Parcours poids du corps": ["Bodyweight circuit", "Circuito de peso corporal"],
    "Parcours cardio": ["Cardio circuit", "Circuito de cardio"],
    "Parcours haltères": ["Dumbbell circuit", "Circuito con mancuernas"],
    "Effort": ["Work", "Esfuerzo"],
    "Repos entre exercices": ["Rest between exercises", "Descanso entre ejercicios"],
    "Repos entre les tours": ["Rest between rounds", "Descanso entre vueltas"],
    "Tours": ["Rounds", "Vueltas"],
    "Technique et vidéo": ["Technique and video", "Técnica y vídeo"],
    "Rythme soutenu": ["Steady high pace", "Ritmo sostenido"],
    "Sans impact": ["No impact", "Sin impacto"],
    "Il te faut une paire d’haltères. Pour débuter, des bouteilles d’eau ou un sac chargé font l’affaire.": ["You need a pair of dumbbells. To start, water bottles or a loaded bag will do.", "Necesitas un par de mancuernas. Para empezar, sirven botellas de agua o una mochila cargada."],
    "Genou signalé : les sauts sont remplacés par des versions sans impact.": ["Knee reported: jumps are replaced with no-impact versions.", "Rodilla señalada: los saltos se cambian por versiones sin impacto."],
    "Bois quelques gorgées entre les tours. Si une position fait mal, passe à l’exercice suivant.": ["Take a few sips between rounds. If a position hurts, move on to the next exercise.", "Bebe unos sorbos entre vueltas. Si una posición duele, pasa al siguiente ejercicio."],
    "Un parcours sans matériel qui alterne jambes, poussée, tirage et gainage : chaque groupe récupère pendant que le suivant travaille.": ["A no-equipment circuit alternating legs, push, pull and core: each group recovers while the next one works.", "Un circuito sin material que alterna piernas, empuje, tracción y core: cada grupo se recupera mientras trabaja el siguiente."],
    "Des efforts courts et intenses qui font monter le cœur, puis une récupération incomplète : idéal pour l’endurance et la dépense calorique.": ["Short, intense efforts that raise your heart rate, then incomplete recovery: ideal for endurance and calorie burn.", "Esfuerzos cortos e intensos que suben el pulso y una recuperación incompleta: ideal para la resistencia y el gasto calórico."],
    "Une paire d’haltères suffit : mouvements polyarticulaires enchaînés pour la force et le cardio en même temps.": ["One pair of dumbbells is enough: compound moves back to back for strength and cardio at once.", "Basta un par de mancuernas: movimientos multiarticulares encadenados para fuerza y cardio a la vez."],
    "Rotations des épaules et des hanches, 1 min": ["Shoulder and hip circles, 1 min", "Rotaciones de hombros y caderas, 1 min"],
    "Marche puis trot sur place, 2 min": ["Walk then jog on the spot, 2 min", "Caminar y luego trotar en el sitio, 2 min"],
    "Squats et fentes lents à vide, 1 min": ["Slow unloaded squats and lunges, 1 min", "Sentadillas y zancadas lentas sin peso, 1 min"],
    "Montées de genoux légères, 1 min": ["Light high knees, 1 min", "Rodillas al pecho suaves, 1 min"],
    "Marche lente et respiration nasale, 2 min": ["Slow walk and nasal breathing, 2 min", "Caminar despacio y respirar por la nariz, 2 min"],
    "Étirement des quadriceps et ischio-jambiers, 1 min": ["Quad and hamstring stretch, 1 min", "Estiramiento de cuádriceps e isquios, 1 min"],
    "Étirement des pectoraux et du dos, 1 min": ["Chest and back stretch, 1 min", "Estiramiento de pecho y espalda, 1 min"],
    "Respiration ventrale allongé, 1 min": ["Belly breathing lying down, 1 min", "Respiración abdominal tumbado, 1 min"],
    "Jumping jacks": ["Jumping jacks", "Jumping jacks"],
    "Step jacks sans saut": ["Step jacks, no jump", "Step jacks sin salto"],
    "Montées de genoux": ["High knees", "Rodillas al pecho"],
    "Montées de genoux marchées": ["Marching high knees", "Rodillas al pecho caminando"],
    "Burpees": ["Burpees", "Burpees"],
    "Burpees sans saut, en reculant les pieds un par un": ["Burpees without the jump, stepping feet back one at a time", "Burpees sin salto, retrocediendo los pies de uno en uno"],
    "Mountain climbers": ["Mountain climbers", "Escaladores"],
    "Mountain climbers lents": ["Slow mountain climbers", "Escaladores lentos"],
    "Sauts du patineur": ["Skater jumps", "Saltos de patinador"],
    "Pas chassés latéraux": ["Lateral shuffles", "Desplazamientos laterales"],
    "Corde à sauter (ou sans corde)": ["Jump rope (or without a rope)", "Saltar a la comba (o sin comba)"],
    "Marche rapide sur place": ["Fast march on the spot", "Marcha rápida en el sitio"],
    "Shadow boxing": ["Shadow boxing", "Shadow boxing"],
    "Shadow boxing pieds ancrés": ["Shadow boxing, feet planted", "Shadow boxing con pies fijos"],
    "Sprint sur place": ["Sprint on the spot", "Sprint en el sitio"],
    "Marche rapide sur place en pompant les bras": ["Fast march on the spot, driving the arms", "Marcha rápida en el sitio moviendo los brazos"],
    "Cardio, mollets, épaules": ["Cardio, calves, shoulders", "Cardio, gemelos, hombros"],
    "Cardio, fléchisseurs de hanche": ["Cardio, hip flexors", "Cardio, flexores de cadera"],
    "Corps entier": ["Full body", "Cuerpo entero"],
    "Gainage, cardio": ["Core, cardio", "Core, cardio"],
    "Fessiers, équilibre, cardio": ["Glutes, balance, cardio", "Glúteos, equilibrio, cardio"],
    "Mollets, coordination, cardio": ["Calves, coordination, cardio", "Gemelos, coordinación, cardio"],
    "Épaules, gainage, cardio": ["Shoulders, core, cardio", "Hombros, core, cardio"],
    "Cardio, mollets": ["Cardio, calves", "Cardio, gemelos"],
    "Ouvre bras et jambes en même temps, atterris sur l’avant du pied, garde un rythme régulier.": ["Open arms and legs together, land on the balls of your feet, keep a steady rhythm.", "Abre brazos y piernas a la vez, aterriza con la parte delantera del pie y mantén un ritmo regular."],
    "Atterrir talons tendus et genoux verrouillés.": ["Landing on your heels with locked knees.", "Aterrizar con los talones y las rodillas bloqueadas."],
    "Buste droit, genoux à hauteur de hanche, bras qui suivent le rythme des jambes.": ["Chest tall, knees to hip height, arms following the legs’ rhythm.", "Tronco recto, rodillas a la altura de la cadera, brazos al ritmo de las piernas."],
    "Se pencher en arrière pour monter les genoux.": ["Leaning back to lift the knees.", "Inclinarse hacia atrás para subir las rodillas."],
    "Mains au sol, saute ou recule les pieds en planche, reviens accroupi puis relève-toi en expirant.": ["Hands down, jump or step feet back to a plank, return to a squat, then stand up as you breathe out.", "Manos al suelo, salta o retrocede los pies a plancha, vuelve en cuclillas y levántate exhalando."],
    "Laisser le bassin s’effondrer en position de planche.": ["Letting the hips sag in the plank.", "Dejar caer la cadera en la plancha."],
    "Épaules au-dessus des mains, ramène un genou vers la poitrine puis l’autre, hanches basses.": ["Shoulders over hands, drive one knee to the chest then the other, hips low.", "Hombros sobre las manos, lleva una rodilla al pecho y luego la otra, cadera baja."],
    "Lever les fesses haut pour aller plus vite.": ["Hiking the hips up to go faster.", "Subir la cadera para ir más rápido."],
    "Saute d’un pied sur l’autre en latéral, réception amortie, le pied libre croise derrière.": ["Jump sideways from one foot to the other, soft landing, free foot crossing behind.", "Salta lateralmente de un pie a otro, aterrizaje suave, el pie libre cruza por detrás."],
    "Réception jambe tendue sans amorti.": ["Landing on a straight leg with no cushioning.", "Aterrizar con la pierna recta sin amortiguar."],
    "Petits sauts sur l’avant du pied, coudes près du corps, la rotation vient des poignets.": ["Small hops on the balls of your feet, elbows close, the turn comes from the wrists.", "Saltos pequeños con la parte delantera del pie, codos pegados, el giro viene de las muñecas."],
    "Sauter trop haut et se fatiguer en deux minutes.": ["Jumping too high and tiring out in two minutes.", "Saltar demasiado alto y cansarse en dos minutos."],
    "Garde haute, enchaîne direct, crochet et uppercut en tournant les hanches, reste léger sur les appuis.": ["Guard up, chain jab, hook and uppercut turning the hips, stay light on your feet.", "Guardia alta, encadena directo, gancho y uppercut girando la cadera, mantente ligero."],
    "Baisser la garde entre deux coups.": ["Dropping your guard between punches.", "Bajar la guardia entre golpes."],
    "Sur l’avant des pieds, bras à 90° qui pompent fort, fréquence maximale.": ["On the balls of your feet, arms at 90° driving hard, maximum cadence.", "Sobre la parte delantera del pie, brazos a 90° con fuerza, frecuencia máxima."],
    "Courir sur les talons.": ["Running on your heels.", "Correr sobre los talones."],
    "Voir la séance": ["See the session", "Ver la sesión"],
    "Voir ma séance": ["See my session", "Ver mi sesión"],
    "défis du jour": ["today’s challenges", "retos del día"],
    "exercices": ["exercises", "ejercicios"],
    "Sexe": ["Sex", "Sexo"],
    "Homme": ["Male", "Hombre"],
    "Femme": ["Female", "Mujer"],
    "Taille": ["Height", "Altura"],
    "Poids": ["Weight", "Peso"],
    "Objectif": ["Goal", "Objetivo"],
    "Niveau": ["Level", "Nivel"],
    "Générer avec l’IA": ["Generate with AI", "Generar con IA"],
    "Réécrire avec l’IA": ["Rewrite with AI", "Reescribir con IA"],
    "Ma journée avec l’IA": ["My day with AI", "Mi día con IA"],
    "Version exemple": ["Sample version", "Versión de ejemplo"],
    "Écrit par le coach IA": ["Written by the AI coach", "Escrito por el coach IA"],
    "coach IA": ["AI coach", "coach IA"],
    "jour d’entraînement": ["training day", "día de entrenamiento"],
    "jour de repos": ["rest day", "día de descanso"],
    "Pourquoi :": ["Why:", "Por qué:"],
    "YouTube": ["YouTube", "YouTube"],
    "Le coach écrit": ["The coach is typing", "El coach está escribiendo"],
    "Le coach IA écrit tes séances, une par une. Compte environ 30 secondes.": ["The AI coach is writing your sessions, one by one. Allow about 30 seconds.", "El coach IA escribe tus sesiones, una a una. Cuenta unos 30 segundos."],
    "Le coach IA prépare tes repas du jour. Compte une vingtaine de secondes.": ["The AI coach is preparing today’s meals. Allow about 20 seconds.", "El coach IA prepara tus comidas del día. Cuenta unos 20 segundos."],
    "Programme écrit par le coach IA.": ["Programme written by the AI coach.", "Programa escrito por el coach IA."],
    "Repas du jour écrits par le coach IA.": ["Today’s meals written by the AI coach.", "Comidas del día escritas por el coach IA."],
    "Le coach IA n’a pas pu répondre. Ton programme actuel reste affiché, réessaie plus tard.": ["The AI coach could not answer. Your current programme stays on screen, try again later.", "El coach IA no pudo responder. Se mantiene tu programa actual, inténtalo más tarde."],
    "Le coach IA n’a pas pu répondre. Tes repas actuels restent affichés, réessaie plus tard.": ["The AI coach could not answer. Your current meals stay on screen, try again later.", "El coach IA no pudo responder. Se mantienen tus comidas actuales, inténtalo más tarde."],
    "Pose une question sur ta séance, ton assiette ou tes défis. Le coach IA répond à partir de ton profil.": ["Ask about your session, your plate or your challenges. The AI coach answers from your profile.", "Pregunta sobre tu sesión, tu plato o tus retos. El coach IA responde a partir de tu perfil."],
    "Charges et durées sont des estimations de départ : ajuste-les dès ta première séance et arrête tout exercice douloureux. L’onglet Aujourd’hui garde le programme d’exemple pour cocher tes exercices.": ["Loads and durations are starting estimates: adjust them from your first session and stop any exercise that hurts. The Today tab keeps the sample programme for ticking off your exercises.", "Cargas y duraciones son estimaciones iniciales: ajústalas desde tu primera sesión y detén cualquier ejercicio doloroso. La pestaña Hoy mantiene el programa de ejemplo para marcar tus ejercicios."],
    "Les programmes et repas marqués « coach IA » sont écrits par une IA à partir de ton profil ; les autres sont des exemples calculés dans ton navigateur. Charges et valeurs nutritionnelles sont des estimations. En cas de douleur ou de pathologie, demande l’avis d’un professionnel de santé.": ["Programmes and meals marked “AI coach” are written by an AI from your profile; the rest are samples calculated in your browser. Loads and nutrition values are estimates. If you have pain or a medical condition, ask a health professional.", "Los programas y comidas marcados «coach IA» los escribe una IA a partir de tu perfil; el resto son ejemplos calculados en tu navegador. Cargas y valores nutricionales son estimaciones. Si tienes dolor o una patología, consulta a un profesional de la salud."],
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
    [/^(\d+) défis du jour réussis sur (\d+)$/, (m) => pick(`${m[1]} of ${m[2]} challenges done today`, `${m[1]} de ${m[2]} retos del día logrados`)],
    [/^(\d+) tours$/, (m) => pick(`${m[1]} rounds`, `${m[1]} vueltas`)],
    [/^(\d+) s d’effort$/, (m) => pick(`${m[1]} s work`, `${m[1]} s de esfuerzo`)],
    [/^(\d+) s de repos$/, (m) => pick(`${m[1]} s rest`, `${m[1]} s de descanso`)],
    [/^(\d+) min par séance$/, (m) => pick(`${m[1]} min per session`, `${m[1]} min por sesión`)],
    [/^Échauffement · (\d+) min$/, (m) => pick(`Warm-up · ${m[1]} min`, `Calentamiento · ${m[1]} min`)],
    [/^Le circuit · (\d+) tours$/, (m) => pick(`The circuit · ${m[1]} rounds`, `El circuito · ${m[1]} vueltas`)],
    [/^Retour au calme · (\d+) min$/, (m) => pick(`Cool-down · ${m[1]} min`, `Vuelta a la calma · ${m[1]} min`)],
    [/^Échauffement 10 min, puis (\d+) min d’endurance facile pour finir$/, (m) => pick(`10 min warm-up, then ${m[1]} min of easy endurance to finish`, `10 min de calentamiento y luego ${m[1]} min de resistencia suave para terminar`)],
    [/^Chargement du modèle sur ton appareil : (\d+) %$/, (m) => pick(`Loading the model on your device: ${m[1]}%`, `Cargando el modelo en tu dispositivo: ${m[1]} %`)],
    [/^(\d+) min de cardio$/, (m) => pick(`${m[1]} min of cardio`, `${m[1]} min de cardio`)],
    [/^Connecté avec (.+)\. Choisis ton pseudo : c’est lui que tes amis chercheront\.$/, (m) => pick(`Signed in with ${m[1]}. Choose your username: it is what your friends will search for.`, `Conectado con ${m[1]}. Elige tu seudónimo: es el que buscarán tus amigos.`)],
    [/^Progression sauvegardée à (.+)\.$/, (m) => pick(`Progress backed up at ${m[1]}.`, `Progreso guardado a las ${m[1]}.`)],
    [/^Ton pseudo : (.+)$/, (m) => pick(`Your username: ${m[1]}`, `Tu seudónimo: ${m[1]}`)],
    [/^En attente de réponse : (.+)$/, (m) => pick(`Waiting for: ${m[1]}`, `Esperando respuesta: ${m[1]}`)],
    [/^Lien envoyé à (.+)\. Ouvre-le sur cet appareil pour te connecter \(pense à regarder les indésirables\)\.$/, (m) => pick(`Link sent to ${m[1]}. Open it on this device to sign in (check your spam folder).`, `Enlace enviado a ${m[1]}. Ábrelo en este dispositivo para conectarte (revisa el correo no deseado).`)],
    [/^Demande envoyée à (.+)\.$/, (m) => pick(`Request sent to ${m[1]}.`, `Solicitud enviada a ${m[1]}.`)],
    [/^Compte (.+) créé\. Ta progression est sauvegardée\.$/, (m) => pick(`Account ${m[1]} created. Your progress is backed up.`, `Cuenta ${m[1]} creada. Tu progreso está guardado.`)],
    [/^Progression de (.+) récupérée\.$/, (m) => pick(`${m[1]}’s progress restored.`, `Progreso de ${m[1]} recuperado.`)],
    [/^Supprimer définitivement le compte (.+) \? Sa sauvegarde, ses amis et ses défis partagés seront effacés\. Les données de cet appareil restent\.$/, (m) => pick(`Permanently delete the account ${m[1]}? Its backup, friends and shared challenges will be erased. The data on this device stays.`, `¿Eliminar definitivamente la cuenta ${m[1]}? Se borrarán su copia, sus amigos y sus retos compartidos. Los datos de este dispositivo se quedan.`)],
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
