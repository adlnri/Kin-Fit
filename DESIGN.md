---
name: Kin Fit
description: Training and breakfast challenges won as struck gold medals, on near-black, with real sparks.
colors:
  bg: "#0a0907"
  rail: "#050403"
  surface: "#14120e"
  surface-2: "#1c1914"
  surface-3: "#27231b"
  line: "#322c20"
  line-2: "#7d6c48"
  text: "#f6eedc"
  text-2: "#b8ab8c"
  placeholder: "#8f8468"
  on-gold: "#0a0907"
  gold: "#d4af37"
  gold-hi: "#f3dc8c"
  gold-lo: "#8a6416"
  engrave: "#3a2806"
  sport: "#ff8a3d"
  cardio: "#ff5d6c"
  nutrition: "#b7d96a"
  eau: "#6fd0ea"
  amis: "#c9a3ff"
  serie: "#f2c14e"
  metal-bronze: "#d9915a"
  metal-argent: "#c9d2de"
  metal-or: "#ffc93c"
  metal-platine: "#86e1ea"
typography:
  display:
    fontFamily: "Sora, Manrope, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.2rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Sora, Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 3.6vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  section:
    fontFamily: "Sora, Manrope, system-ui, sans-serif"
    fontSize: "clamp(1.4rem, 2.3vw, 1.9rem)"
    fontWeight: 700
    lineHeight: 1.1
  title:
    fontFamily: "Sora, Manrope, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title-sm:
    fontFamily: "Sora, Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.3
  numeral:
    fontFamily: "Sora, Manrope, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "\"tnum\""
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    fontFeature: "\"tnum\""
  lede:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  action:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 800
    lineHeight: 1
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  md: "14px"
  lg: "20px"
  xl: "26px"
  pill: "999px"
  coin: "50%"
spacing:
  xs: "4px"
  sm: "8px"
  md: "14px"
  lg: "20px"
  card: "22px"
  section: "28px"
  page: "clamp(20px, 3vw, 40px)"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.on-gold}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "46px"
  button-primary-big:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.on-gold}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 30px"
    height: "56px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "46px"
  button-ghost-hover:
    backgroundColor: "{colors.surface-2}"
  button-category:
    backgroundColor: "transparent"
    textColor: "{colors.sport}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "46px"
  button-friends:
    backgroundColor: "transparent"
    textColor: "{colors.amis}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "46px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.text-2}"
    rounded: "{rounded.pill}"
    padding: "11px 14px"
  nav-item-active:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.on-gold}"
    rounded: "{rounded.pill}"
    padding: "11px 14px"
  score-chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.pill}"
    padding: "0 14px 0 10px"
    height: "40px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.xl}"
    padding: "{spacing.card}"
  challenge-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "18px"
  input:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "10px 16px"
    height: "50px"
  medal-owned:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.engrave}"
    rounded: "{rounded.coin}"
  medal-locked:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.line-2}"
    rounded: "{rounded.coin}"
---

# Design System: Kin Fit

## Overview

**Creative North Star: "The Medal Vitrine"**

Kin Fit is a dark, quiet case lit by one metal. Every surface is near-black with a warm undertone (#0a0907 page, #14120e cards), bounded by a single hairline, and the only thing allowed to shine is gold: the action you should take next, the thing you selected, the challenge you finished, your rank, and the medals you have struck. Training and nutrition categories never compete with that shine; they sit as tinted line icons, outlines and small dots, so a screen reads as black, cream text, and gold.

Winning is the one loud moment. A medal is minted on screen (it arrives oversized and blurred, flashes bright, and settles sharp) and a canvas burst of real sparks fires from it: white-hot heads that cool to gold and then ember, with trails, flicker, gravity and branching. A routine win gets the same metal at a smaller scale, in a corner toast that never blocks the page. Between wins the interface is calm, dense and tabular, an Operate-mode tool for ticking exercises, logging breakfast and water, and daring a friend.

Premium, not childish: the sticker-album idea survives as a trophy case of coins and enamel shields, not as colourful tiles. Display type is Sora, text is Manrope, both self-hosted; no raster assets ship.

**Key Characteristics:**
- Near-black warm surfaces in three tonal steps, separated by 1px hairlines rather than shadows.
- Metallic gold, rendered as a gradient sheen, is the single filled accent.
- Category colours as strokes, outlines, dots, meters and 13-14% washes, never as filled tiles.
- Medals are struck gold coins with engraved line art; locked slots are dark coins with a number; ranks are enamel shields.
- Pill and circle controls; rounded-rectangle containers.
- One celebration grammar: the mint animation plus gold sparks; reduced motion removes both.

## Colors

A warm black-and-cream ground with one metal and five quiet category inks.

### Primary
- **Struck Gold** (#d4af37): the base of the metal. In use it is almost always the gold sheen gradient (seven stops from #7a5612 through #f6e3a1 to #a8812a, at 135deg) on primary buttons, the current nav item, pressed day, selected tab and segment, checked tick and choice, completed challenge badge and points pill, the user's own chat bubble, avatar and tags. Flat gold is used for focus outlines, the skip link, the rank meter, icon strokes on score chips, the wordmark and celebration points text.
- **Gold Highlight** (#f3dc8c): gold as text on black: links, points pills, counts, exercise numbers, quoted challenge messages, ingredient quantities.
- **Burnished Gold** (#8a6416): the low edge of the metal: today's day outline, the border of the celebration card and corner toast.
- **Engraving Brown** (#3a2806): the ink of struck medals. CSS overrides every sticker's SVG strokes and text to this colour on an owned coin, and lightens its fills to a pale wash, so the art reads as engraved into the metal.
- **Coin face** (radial gradient from #fff4c4 at 34% 28% to #4e3608 at the rim): the face of every owned medal, the celebration medal and the corner-toast medal.

### Secondary
- **Ember** (#ff8a3d): sport. Icon stroke, outline button, strength-day dot, lipid bar.
- **Ember Rose** (#ff5d6c): cardio. Icon stroke, cardio-day dot; also the fill of small unread count badges and the outline of form errors.
- **Lime** (#b7d96a): nutrition. Icon stroke, carb bar, check marks on completed days, completed onboarding steps.
- **Ice** (#6fd0ea): water. Water-glass fill and outline, water icon.
- **Lilac** (#c9a3ff): friends. Invitation chip, friend button outline, sent-challenge icons.
- **Streak Gold** (#f2c14e): the streak category's ink, a warmer sibling of the primary gold.

Each category has a soft wash (the same hue at 13-14% alpha) used only for hover and done states of category buttons, the selected item in pickers, and the error panel.

### Tertiary
- **Rank metals**: bronze (#d9915a), argent (#c9d2de), or (#ffc93c), platine (#86e1ea). They appear only as the enamel ground of rank shields.

### Neutral
- **Vitrine Black** (#0a0907): page ground, theme colour, and the ink on gold (`on-gold`).
- **Rail Black** (#050403): navigation rail, mobile brand bar, onboarding side panel.
- **Case Surface** (#14120e): cards, challenge cards, chips, dialogs.
- **Inset Surface** (#1c1914): icon tiles, inputs, notes, macro cells, locked coins, hover fills.
- **Deep Inset** (#27231b): meter and slider tracks, step numbers, the centred toast.
- **Hairline** (#322c20): the default 1px border on every surface and divider.
- **Brass Line** (#7d6c48): the stronger line for inputs, ghost buttons, ticks, dashed empty states, locked-coin numerals and unowned shields.
- **Cream** (#f6eedc): primary text. **Parchment** (#b8ab8c): secondary text, labels, inactive nav. **Placeholder** (#8f8468).

### Named Rules
**The Struck Gold Rule.** Gold is the only filled accent. It marks the next action, the current selection, completion, rank and medals, and nothing else; if a fill is not one of those, it stays on a black surface.

**The Quiet Category Rule.** Category colours draw icons, outlines, 6-9px dots, meters and 13-14% washes. Their only solid fills are small marks (count badges of 22px or less, meter and macro bars, step checks); never a card, tile, button or background.

## Typography

**Display Font:** Sora (with Manrope, system-ui)
**Body Font:** Manrope (with system-ui)

**Character:** Sora's geometric, slightly wide forms carry headings and big numbers like lettering on a medal; Manrope is a compact, legible grotesque that does the work, set with tabular figures everywhere so points and counts line up.

### Hierarchy
- **Display** (Sora 600, clamp(2.4rem, 5vw, 4.2rem), 1): the wordmark on the onboarding panel only.
- **Headline** (Sora 600, clamp(1.9rem, 3.6vw, 3rem), 1.05, -0.035em, balanced): the one page heading per view.
- **Section** (Sora 700, clamp(1.4rem, 2.3vw, 1.9rem), 1.1): trophy-case page titles, underlined by a gold hairline that fades to transparent.
- **Title** (Sora 600, 1.125rem, 1.25) and **Title small** (Sora 600, 1rem, 1.3): card and challenge headings, celebration titles at 1.25rem 700, big challenge headings at 1.5rem 700.
- **Numeral** (Sora 700, 1.25-1.35rem): day numbers, macro values, big choice labels.
- **Body** (Manrope 400, 1rem, 1.55, tabular figures): all running text; secondary copy at 0.9375rem in Parchment; lede at 1.0625rem, max 62ch.
- **Action** (Manrope 800, 1rem): buttons and emphasised values; nav, tabs and choices at 700.
- **Label** (Manrope 700, 0.8125rem, 0.08em, uppercase): form labels for controls such as the level slider, and weekday letters at 0.75rem.

### Named Rules
**The Medal Lettering Rule.** Sora is for headings and big numerals only; anything you read in a sentence or press in a control is Manrope.

## Layout

A two-column shell: a sticky 236px black rail on the left (wordmark, six destinations, session switcher at the foot) and a fluid main column padded clamp(20px, 3vw, 40px). The Today view stacks a greeting with score chips, a seven-day week strip, three daily challenge cards in a row, then a 1.3fr / 1fr grid of the session checklist beside breakfast, water and coach cards. Challenge lists auto-fill at 300px minimum, plan cards at 380px, trophy slots at 150px.

Spacing runs on small steps: 4px inside segmented controls, 8px between chips and days, 14px inside cards and between challenge cards, 20px between cards and stacks, 22px card padding, 28-34px before a new section.

At 1180px the Today grid collapses to one column and daily cards wrap at 240px. At 820px the rail becomes a fixed bottom bar of five icon-over-label items (Profil moves to a round button in a sticky top brand bar), main padding becomes 18px 16px 104px, score chips scroll horizontally, macros go to two columns and trophy slots to three.

## Elevation & Depth

Depth is tonal first: black page, a slightly lifted case surface, an inset surface for anything nested, each with a hairline. Shadows are dark and ambient, never offset, and the only coloured light in the system is gold.

### Shadow Vocabulary
- **Case** (`box-shadow: 0 1px 0 rgba(255, 227, 154, .05) inset, 0 18px 40px -24px rgba(0, 0, 0, .9)`): cards, challenge cards, rank panel; a faint gold top edge plus a deep drop.
- **Lift** (`box-shadow: 0 2px 6px rgba(0, 0, 0, .5), 0 24px 48px -20px rgba(0, 0, 0, .95)`): dialogs, toasts, celebration card.
- **Gold button** (`box-shadow: 0 1px 0 rgba(255, 255, 255, .35) inset, 0 8px 20px -10px rgba(212, 175, 55, .55)`): primary buttons; the glow strengthens to .7 on hover.
- **Gold halo** (`0 0 30px -12px` to `0 0 60px -20px rgba(212, 175, 55, .6)`): added to the corner toast and celebration card; the owned rank shield uses `drop-shadow(0 0 14px rgba(212, 175, 55, .35))`.
- **Struck coin** (`box-shadow: inset 0 0 0 3px rgba(255, 240, 190, .5), inset 0 0 0 8px rgba(78, 54, 8, .35), inset 0 -10px 18px rgba(78, 54, 8, .35), 0 12px 26px -12px rgba(0, 0, 0, .95)`): a bright rim, a darker inner ring and a shaded lower face on every owned medal. Rare medals add a 3px black gap and a 1px pale-gold outer ring.

### Named Rules
**The Only-Gold-Glows Rule.** Coloured light is gold light. No category colour casts a glow, and nothing uses a hard offset shadow.

## Shapes

Everything you press is a pill (999px) or a circle: buttons, nav items, tabs, segments, chips, choices, ticks, round icon buttons, avatars. Containers are rounded rectangles in three sizes: 14px for inputs, notes and inner cells, 20px for challenge cards, days and toasts, 26px for cards, dialogs and banners. Icon tiles are 16px squircles (14px for 44px chips, 24px for the big challenge badge). Medals are circles; ranks are shields. Dashed borders mean "not yet": empty states, locked coins, unowned shields and the destructive button. Chat bubbles keep one 6px corner toward their speaker.

### Named Rules
**The Pill and Coin Rule.** Controls are pills or circles, containers are rounded rectangles, rewards are coins and shields. Do not mix the vocabularies.

## Components

### Buttons
Struck metal you can press.
- **Shape:** full pill (999px), 46px tall, 56px for the big variant.
- **Primary:** gold sheen gradient, Vitrine Black text, Manrope 800, 0 20px padding, gold button shadow.
- **Hover / Focus:** lifts 1px and the gold glow deepens; press sinks 1px and scales to .98 (.2s, cubic-bezier(.22, 1, .36, 1)). Focus is a 2px gold outline at 3px offset.
- **Ghost:** transparent with a Brass Line border and Cream text; Inset Surface on hover.
- **Category:** transparent with the category colour as border and text; the category wash on hover; "done" swaps to the wash with a Hairline border and a check.
- **Friends:** the category treatment in Lilac. **Danger:** transparent with a dashed Brass Line border.
- **Round:** 46px circle on Case Surface with a Brass Line border, scales 1.06 on hover.

### Chips
- **Score chips:** 40px pills on Case Surface with a Hairline border, gold icon with a 25% gold fill, Manrope 800 value and Parchment unit. The invitation chip is Lilac in text, icon and a 45% Lilac border. The rank chip carries a 22px enamel shield.
- **Pills:** points and counts are outline pills with Gold Highlight text, turning to the gold sheen when the challenge is done.
- **Tabs and segments:** a pill track on Case Surface or Inset Surface; the selected item fills with gold sheen. Unread counts are 22px Ember Rose discs with black numerals, inverting to black-on-gold inside a selected tab.

### Cards / Containers
- **Corner Style:** 26px for cards (20px under 820px), 20px for challenge cards.
- **Background:** Case Surface; nested cells on Inset Surface.
- **Shadow Strategy:** the Case shadow (see Elevation & Depth).
- **Border:** 1px Hairline; a 30-55% gold border marks a done or invited challenge or a banner.
- **Internal Padding:** 22px for cards (18px on mobile), 18px for challenge cards, 26px for the big challenge.
- **Challenge card:** a 54px Inset Surface icon tile with the category-coloured icon, a Sora title with a points pill, a 6px meter in the category colour, and the medal it counts toward shown as a 46px gold-outlined coin with gold line art. Done: an 8% gold wash from the top, the icon tile turns gold sheen.

### Inputs / Fields
- **Style:** 50px tall, Inset Surface, 1px Brass Line, 14px radius, 10px 16px padding; onboarding fields 58px at 1.125rem 700.
- **Focus:** border turns gold with a 3px 20% gold ring.
- **Error:** an Ember Rose bordered panel on the cardio wash. **Disabled ticks:** 45% opacity.
- **Choices:** 50px pills with a Brass Line border that fill with gold sheen and scale 1.03 when checked; big choices become 110px tall 20px-radius tiles with a Sora label.
- **Ticks:** 40px circles, 2px Brass Line ring, filled with gold sheen and a black check when done; the exercise title strikes through in gold.
- **Slider:** 6px Deep Inset track, 24px gold-sheen thumb ringed in black and gold with a gold glow.

### Navigation
Black rail, Parchment items in Manrope 700 with 24px line icons, Inset Surface on hover, the current destination filled with gold sheen and black text. The wordmark is Sora 600 in gold. Under 820px it becomes a bottom bar of five 0.75rem icon-over-label items with 16px radii.

### Week strip
Seven 20px-radius day tiles on Case Surface, each with a 7px dot in the day's category (Ember for strength, Ember Rose for cardio, Brass Line for rest), the weekday as an uppercase label, the date as a Sora numeral and a Lime check when complete. Today has a Burnished Gold border; the selected day fills with gold sheen. Tiles lift 3px on hover.

### Trophy case (signature)
- **Struck medal (owned):** a circular coin face in the radial gold gradient with the Struck coin rim, holding the sticker's line art recoloured by CSS to Engraving Brown with pale fills. The slot sits on a case with a faint gold radial glow from the top, a 30% gold border, a slot number at top left, and the caption led by a 6px category dot. Rare medals get a pale-gold outer ring. Duplicates show a gold-sheen "×n" pill.
- **Locked slot:** a dark coin (Inset Surface, dashed Brass Line) with its number in Sora 600 at 1.5rem in Brass Line, and the hint to earn it under the caption.
- **Rank shield:** an enamel pin in SVG: a shield in the rank metal with a near-black ink outline, an inner rim, white stars by rank (one to three) and a crown for platine. Unowned shields are a dashed Brass Line outline with no fill; owned shields glow gold.

### Celebrations (signature)
- **Mint:** the medal arrives at scale 1.35 with 8px blur and doubled brightness, reaches full opacity at 55% at scale .97 and 1.4 brightness, then settles (.8s in the dialog, .7s in the toast, cubic-bezier(.22, 1, .36, 1)).
- **Sparks:** a fixed, pointer-transparent canvas drawn only during a win, additive blending. Each spark has a white-hot head (rgb 255,250,236), a trail of up to seven points drawn as a wide 12% glow and a thin core, and cools by remaining life from white to pale gold (255,221,140) to gold (222,170,58) to ember (196,92,28). Speed damps by .978 per frame with .2 gravity, brightness flickers on a sine, and about a third of primary sparks branch into three smaller ones mid-flight. A milestone fires 150 sparks from the medal and two 60-spark side bursts 220ms later; a corner toast fires 60 at lower force.
- **Milestone dialog:** a black 72% scrim and a 380px card with a gold radial glow from the top, Burnished Gold border and gold halo, the minted medal, a Sora title, gold points line and a primary Continuer button; it dismisses itself after 4.8s.
- **Corner toast:** a non-blocking, pointer-transparent 20px-radius panel at bottom right (full width above the bottom bar on mobile) with a 48-64px medal, the challenge name, gold points and a gold halo; rises in over .4s and leaves after 2.8s.
- **Status toast:** a centred Deep Inset pill for plain messages.

## Do's and Don'ts

### Do:
- **Do** use the gold sheen gradient for every filled gold surface and flat #d4af37 only for outlines, strokes, meters and text.
- **Do** separate every surface with a 1px Hairline (#322c20), or Brass Line (#7d6c48) for controls that need to be found.
- **Do** draw categories as a coloured line icon on an Inset Surface tile, a coloured outline, or a 6-9px dot.
- **Do** present rewards as coins and shields: owned medals struck in gold with Engraving Brown line art, locked slots as dark dashed coins with their number.
- **Do** set numbers with tabular figures, and big numerals in Sora 700.
- **Do** keep the mint animation and sparks for wins only, route routine wins to the corner toast, and remove both under prefers-reduced-motion.

### Don't:
- **Don't** fill a card, tile, button or background with a category colour.
- **Don't** let anything glow that is not gold, and don't use hard offset shadows.
- **Don't** put an uppercase label or eyebrow above a heading; the uppercase label style is for form controls and weekdays.
- **Don't** ship raster medal or badge art; medals are SVG line art recoloured by CSS, ranks are SVG shields.
- **Don't** use square corners on a control or a pill on a container.
- **Don't** block the page for a routine win; the full-screen dialog is for new medals and milestones.


## Today screen (refined 2026-10-21 at the user's request)

The user asked for a home screen "plus jolie, plus glossy et lisse, c'est trop neutre" and chose a mix of black lacquer and polished gold, smoked glass, and a satin hero, plus an abstract gold-and-black background image.

- **Backdrop:** `images/kinfit-silk.jpg` (1920×1200) and `images/kinfit-silk-mobile.jpg` (900×1600), gold silk folds with a lacquer reflection and sparks on black. Provenance: generated procedurally by `scripts/silk.py` (height field of warped sine folds, Blinn-Phong shading, gold colour ramp, blurred spark points, film grain); no photograph, stock image or third-party asset. Shown only on the Today view, fixed behind the content under a black gradient (50 % to 90 %).
- **Hero:** a 32px-radius lacquered panel (26px on mobile) at the top of Today: the greeting in Dela Gothic One at clamp(2.3rem, 4.8vw, 4.1rem), the date and sport, a glass chip with today's session (name, duration, exercises, intensity), the primary "Commencer" button and a ghost-glass "Faire un parcours" button. On the right, a gold ring (stroke gradient #f6e3a1 → #d4af37 → #8a6416) counting today's challenges done out of three. Commencer scrolls to the session card, focuses the first open exercise and fires a small spark burst.
- **Metallic CTA:** the gold sheen button gains an inner bevel and a highlight that slides across it three times after the view opens (none with reduced motion).
- **Smoked glass:** on Today only, cards, challenge cards, score chips and unselected days use a translucent warm-black gradient with an 18px backdrop blur, a 10 % gold hairline and an inset top highlight; cards round to 30px.
- **Entrance:** once per arrival on the view, the hero, chips, week, challenges and cards rise out of a 6px blur, staggered by 40ms; the ring fills from empty. Re-renders inside the view do not replay it.
