# Product

<!-- impeccable:product-schema 1 -->

## Name

Kin Fit (chosen by the user on 2026-10-21). "Kin" reads as 金, gold in Japanese, and as kinesis, movement. Replaces the earlier working names Relance and Étincelle.

## Platform

web

## Stack

Static HTML/CSS/JS, no build step (user chose "app dashboard, static HTML"). Prototype: generated content is authored sample data, no live model call yet.

## Users

French-speaking individuals who practise a sport (football, boxe, padel, natation, JJB, judo, handball, or another typed freely) and want a training and nutrition programme built for them. Each user has their own dedicated session: one profile, one generated programme. Levels range from débutant to avancé.

## Product Purpose

An AI coach that turns a profile questionnaire into a personalised sport programme and a personalised nutrition plan, starting with breakfast. Success: the user completes onboarding, receives a complete programme with every field filled, and understands why each exercise and food was chosen.

## Positioning

Training, nutrition and conversation in one coach: the plan is generated from the user's own sport, goal and breakfast preference, re-adapts day by day from what actually happened, and can be questioned or fed (photo, chat). Every choice comes with its "pourquoi".

## Operating Context

Onboarding flow:
1. Base profile: sexe, âge, taille (cm), poids (kg), objectif (perte de poids / maintien / prise de masse; the coach prompt also names remise en forme, endurance, performance).
2. Niveau sportif (débutant / intermédiaire / avancé), séances par semaine, matériel (salle, haltères, élastiques, poids du corps), pathologies, douleurs or restrictions.
3. Sport de prédilection: one or several of Football, Boxe, Paddle, Natation, JJB, Judo, Handball, Autres (free text).
4. Type de petit-déjeuner, mandatory: salé / sucré / sucré-salé.

Generated output:
- Programme sportif: profil résumé; séances, each with a target zone, an objective and at least 5 strength exercises; one or more cardio/HIIT sessions; récupération et conseils (étirements, récupération, astuce pro); a session summary (objectif principal, durée moyenne, intensité perçue).
- Per exercise: nom, groupe musculaire, séries x répétitions, repos (sec), poids conseillé, explication technique, erreur à éviter, vidéo (link or search suggestion).
- Cardio: type, durée, format (e.g. 40 s effort / 20 s repos x 5 tours), objectif, conseils techniques, vidéo.
- Nutrition: profil (incl. sport principal, niveau d'activité faible / modéré / intense); petit-déjeuner of the chosen type with ingredients in grams, estimated kcal / protéines / glucides / lipides, explication, suggestion de boisson, alternative rapide.

## Capabilities and Constraints

- Copy is French only; tone motivant, professionnel, inspirant.
- Never the same programme twice; each generation is unique.
- Always explain the why behind each exercise and food choice.
- Load, intensity and volume adapt to the user's level; nutrition values must be coherent with activity level and goal.
- Allergies, preferences, restrictions and injuries must be respected.
- Undecided: product name (working name proposed in the prototype), real model integration, full-day meal plan beyond breakfast, photo logging details.

## Evidence on Hand

Three source documents from the user: the coach system prompt, the nutrition system prompt, and the onboarding user story with acceptance criteria. No real users, testimonials, metrics, pricing or brand assets exist; none may be invented. Sample profiles and programmes in the prototype are illustrative.

## Product Principles

1. The profile is the product: everything shown traces back to an answer the user gave.
2. Explain, don't prescribe: each exercise and food carries its reason and its common mistake.
3. Complete or nothing: a programme never displays with a missing field.
4. Sport first: the user's own discipline shapes both the training and the plate.
5. Estimates are labelled as estimates; injuries and restrictions override ambition.

## Challenges, album and sharing (added 2026-10-20 at the user's request)

The user asked for a prettier, playful version "avec des défis", where challenges can be "envoyés et partagés entre les personnes", covering nutrition too.

- Daily challenges: finish the day's session (tick each exercise), finish the cardio, or 10 minutes of mobility on a rest day; take the plan's breakfast; drink 8 glasses (2 L) of water.
- Weekly challenges: every planned session, breakfast 5 mornings, water goal 4 days, plus one sport-specific challenge scaled to level (swapped for core work when a knee is reported).
- Points per challenge, ranks Bronze from 0, Argent from 200, Or from 500, Platine from 1000 points, a streak of planned sessions done in a row.
- A trophy case of 21 medals earned through milestones; a repeat win gives a duplicate that can be given to another session on the same device.
- Between people: send a challenge from a catalogue (sport and nutrition) to other sessions on the same device, or share it as a link (`#defi=` in the URL, carrying only the challenge id, the sender's first name and an optional message). Each person tracks their own progress; on one device, participants see each other's progress.
- Constraints: no accounts, no server, no real-time sync between devices; a shared link creates the challenge on the receiver's side only.

## Meals and dietary rules (added 2026-10-21 at the user's request)

The user asked for healthy breakfast, lunch and dinner dishes plus cheat meals, set up in onboarding and respecting allergens and religious practices.

- Onboarding step "Ton alimentation": diet (omnivore, vegetarian, pescatarian, vegan), practices (halal, casher, no pork) and allergens (gluten, lactose, eggs, tree nuts and peanuts, fish, shellfish, soy, sesame). Step "Tes repas": breakfast type (mandatory) and cheat meals per week (0, 1 or 2).
- Rules: no dish containing a forbidden tag is ever proposed; halal and casher never include pork and label meat as certified; casher also excludes shellfish and dishes mixing meat and dairy; vegan excludes all animal products including honey. Breakfast ingredients are substituted (tofu or chickpeas for eggs, gluten-free bread, soy or coconut yogurt, maple syrup for honey).
- Daily split: breakfast 25 %, lunch 35 %, dinner 30 %, snack 10 % of estimated needs, slightly higher on training days. Portions scale within limits; cheat meals keep a fixed portion and replace Saturday dinner (and Wednesday lunch when two are chosen), with a no-guilt, no-compensation note.
- Dish library: 18 healthy dishes and 9 cheat meals, authored sample content with estimated values. Users with severe allergies are told to check labels.

## Languages, countries, budget and alternatives (added 2026-10-21 at the user's request)

- First launch asks for language (French, English, Spanish) and country; the country sets the region (Europe, North Africa, West and Central Africa, North America, Latin America) and the default language. Both can be changed in Profile.
- Onboarding "Tes repas" adds a grocery budget (tight, medium, comfortable). Tight budget swaps pricey ingredients for cheaper, seasonal, canned or frozen ones and labels the dish "version économique"; regional swaps (couscous, fonio, yam, black beans, local fish…) label it "version locale". Every swap respects diet, practices and allergens.
- Each dish lists its alternatives (option, budget, local) and an estimated cost level (low, medium, high); breakfast lists budget and local alternatives too. No prices or currencies are shown.
- The app is authored in French; English and Spanish come from i18n-data.js (bulk translation of the interface and content) and i18n.js (extra strings, patterns, live translation of each render).

## Session length and circuits (added 2026-10-21 at the user's request)

- Onboarding step 2 asks the length of one session, warm-up included: 30, 45, 60, 75 or 90 minutes (default 60). It can be changed from Plan › Programme. Strength sessions get 5 exercises at 30 and 45 min, 6 at 60, 7 at 75 and 90; sets drop by one at 30 min and rise by one at 90. Cardio sessions longer than their base format add a 10-minute warm-up and an easy endurance finish.
- Plan › Parcours: bodyweight, cardio and dumbbell circuits at any of the five lengths. Work/rest is 30/30 s for beginners, 40/20 s intermediate, 45/15 s advanced; rounds fill the time after a 5 to 8 minute warm-up and a 5 to 7 minute cool-down. A reported knee swaps jumps for no-impact moves; the dumbbell circuit warns when no dumbbells were declared.
- The AI programme receives the chosen length and is asked to fit it.

## AI (added 2026-10-21)

- The publisher must not pay for AI (user, 2026-10-21: "il ne faut pas utiliser mon compte claude"). Each user picks a source in Profil › Coach IA, stored per device: none (default, authored examples), Gemini with their own Google AI Studio key (programmes, meals and coach, called from the browser), or an on-device open model through WebLLM (coach replies only). An optional Claude server function exists but stays inert without a publisher key.
- The same coach and nutrition prompts (ai-core.mjs) drive every source; outputs are schema-checked JSON. Every AI result is labelled as written by the AI coach; on any failure the app keeps its examples.
- Gemini terms surfaced in the app: 18+ only (disabled under 18), free-tier data may be used by Google and reviewed by people, and in the EEA/UK/Switzerland Google requires a billing-enabled account for this use, billed to the user's own Google account.
