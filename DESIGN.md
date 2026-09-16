---
name: "До России"
description: "Seven-scene archaeological presentation"
colors:
  paper: "#eee9df"
  ink: "#171714"
  ochre: "#a56a45"
  stage-surround: "#080908"
  scene-dark: "#141512"
  text-on-dark: "#f3eee5"
  artifact-mat: "#e3ded2"
  credit: "#585249"
  focus: "#c88b59"
  nav-surface: "#141412b8"
  nav-hover: "#38372fea"
  map-land: "#d9d1c2"
  map-border: "#bcb19c"
  symbol-emphasis: "#e0ad7a"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "148px"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "116px"
    fontWeight: 500
    lineHeight: 0.94
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "24px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.09em"
spacing:
  archive-padding: "20px"
  archive-caption: "14px"
  museum-gap: "20px"
  timeline-gap: "40px"
components:
  nav-arrow:
    backgroundColor: "{colors.nav-surface}"
    width: "88px"
    height: "88px"
  nav-arrow-hover:
    backgroundColor: "{colors.nav-hover}"
  archival-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "20px"
  presentation-menu:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: "340px"
    padding: "18px 24px 24px"
  image-dialog:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: "min(1200px, 94vw)"
    height: "92dvh"
    padding: "24px"
---

# Design System: До России

## Overview

**Creative North Star: "До России"**

A cinematic archaeological presentation using limestone paper, dark photographic reconstructions, fine serif display type, and restrained ochre map marks. The supplied layouts and imagery are the visual authority; this document records the implemented system, not a new identity.

**Key Characteristics:**

- Large display typography and deliberately paced scenes.
- Museum-style archival captions kept distinct from artistic reconstructions.
- Flat rectangular surfaces and independent presentation controls.

## Colors

Ochre anchors the geography; warm neutrals connect museum material to dark reconstruction scenes. The frontmatter records the core palette; detailed scene-specific tones remain in `src/styles.css`.

- **Primary — ochre:** route lines and geographic accents; circular map points are filled with reconstruction photographs.
- **Neutral — paper and ink:** the overview map, archive cards, menu, and dialogs.
- **Neutral — stage surround / scene dark:** letterboxing, scenic canvas, and the final map.
- **Text on dark:** primary scenic copy. Credit uses a subdued warm gray on paper.
- **Focus:** the brighter ochre outline identifies keyboard focus across buttons, links, and inputs.
- **Symbol emphasis:** pale warm ochre emphasizes the Sungir conclusion; it is not a second action color.

## Typography

Cormorant Garamond (Georgia/serif fallback) carries headlines, dates, and large numbers. Inter (sans-serif fallback) carries supporting explanations, controls, labels, and attribution. Sizes below are design-stage pixels; the stage scales as one composition.

| Role | Implemented scale | Use |
| --- | --- | --- |
| Opening title | 148px, 500, .94 line height | ДО РОССИИ |
| Site title | Sungir 116px; Denisova 104px; Kermek/Kostenki 92px | Location identity |
| Map / conclusion title | 80px / 86px, .98 line height | Geographic opening / final thesis |
| Date | 37–46px, serif | Site chronology |
| Opening number / bead count | 68px / 126px, serif | Time depth / material detail |
| Thesis | 32px, 1.5 line height; Kermek/Kostenki 27px, 1.45 | Main explanatory sentence |
| Supporting body | 24px, 1.6 line height | Context; typically max-width 650px |
| Region label | 19px, .16em tracking | Uppercase location metadata |
| Archive label / credit | 13px; compact variants 10–12px | Type, attribution, license |

Archive enlargement and source dialogs use viewport-sized text outside the scaled stage. Do not enlarge small caption roles independently inside the composition without checking their available space.

## Layout

The presentation is a centered, fixed 1920×1080 stage scaled by `min(viewport width / 1920, viewport height / 1080)`. Black-toned letterboxing preserves the composition. There is no stage scroll or mobile content reflow. Most copy begins at x=94–104px; Kermek and Kostenki use x=76px, y=90px, width=490px. Major scene panels are absolutely placed.

Every scenic background fills the 1920×1080 stage. Kermek and Kostenki keep their existing archive strip at x=620px, y=808px, width=1180px, height=170px. Kermek uses one horizontal figure; Kostenki uses two columns with a 24px gap. The latest user correction restores full-stage photographs and leaves card placement unchanged. Denisova retains a 550px museum column over the right side of a full-stage photograph. Sungir retains a large burial model with three smaller artifacts. The overview uses a four-column timeline with 40px gaps. The final map is 900×523px at x=510px, y=-25px, above centered copy beginning at y=475px.

Navigation remains in viewport coordinates: desktop arrows are 88×88px, 32px from the sides and 30px from the bottom. At ≤900px they are 56×56px with 16px side and 14px bottom offsets; at ≥2400px they are 112×112px. The menu trigger is 52×52px (44×44px on small viewports). Between 901px and 1919px, `--nav-safe-x: 136 / scale` adjusts selected lower captions, cards, timeline, strip, and museum padding to clear full-size controls. Kermek/Kostenki strip widths in that range are `calc(1300px - max(60px, var(--nav-safe-x)))`.

The sources dialog is at most 850px wide and 85dvh high. The archive enlargement dialog is `min(1200px, 94vw)` by 92dvh, portaled to the document body so it does not inherit stage scaling. Menus and dialogs can scroll independently where needed.

## Elevation & Depth

Scenic depth comes from the supplied photographs, directional dark overlays, and camera-like movement. Archive cards stay flat. Only the menu uses a structural shadow (`0 16px 50px #0006`); the scene counter uses `0 1px 8px #000` for legibility on dark imagery, removed on the paper map. Dialog backdrops darken the surrounding presentation (`#000b` for sources, `#080908eb` for images).

## Shapes

Panels, controls, dialogs, and archive mats have square corners. Fine 1px rules separate source and menu rows. Arrow buttons use a thin translucent border and a 34px outlined SVG. Map markers are 26px-radius circles filled by the corresponding reconstruction through SVG patterns, with 3px outlines. The 6px loading dot is also circular. No rounded-card system is implemented.

## Components

- **Presentation controls:** previous/next arrows, centered `01 / 07` counter, and a subdued menu trigger. Disabled controls use .35 opacity; arrows darken on hover. All interactive elements receive a 3px focus outline with 5px offset.
- **Contents menu:** paper panel with seven numbered scene buttons; the current row uses `#dfd6c7` and `#865030`. Includes sources, fullscreen, replay, and a 20px native reduced-motion checkbox. The menu restores focus on its close button path.
- **Archival card:** image mat, material label, title, linked author/license. Images use `contain`; hover offers “Увеличить”. A native modal shows the full image and attribution. Loading failure preserves a readable source-material fallback.
- **Map and timeline:** paper geography and four photo-filled location circles recur in the dark finale. The locations are projected from longitude/latitude in `src/data/locations.ts`; each photo matches its site reconstruction. The dotted line is a narrative sequence, as clarified in sources. Four timeline entries connect location, age, and period.
- **Sources dialog:** native modal with titles, authors, source URLs, license links, and scientific qualifications from `src/data/sources.ts` and the supplementary entries in `src/App.tsx`.
- **Ending / loading:** a black ending offers “С начала”; loading uses a single muted pulsing point, disabled under reduced motion. A failed-background notice offers reload.

Motion is orchestrated in `src/animation/controller.ts` with one GSAP master timeline per navigation. Forward and backward site travel follow the same sequence: hide source content; close a circular aperture over the stationary source photograph (.75s); fade to the enlarged photo point (.18s); pull the map camera out (.9s); pause on the map (.12s); approach the destination point (.95s, scale 4.6); crossfade into its aperture (.18s); open the circle to all screen corners (.85s); then reveal destination content. Photographs remain full-stage throughout the aperture effect, without translation or scaling. Hero and overview have no source site photo; the finale crossfades to the final map.

The camera plane uses `public/assets/map-overview.webp`, generated from the map SVG by `scripts/build-map-snapshot.mjs`. The hidden live SVG provides canonical point coordinates measured before any camera transform. The circular clip container scales while its inner photograph counter-scales, preserving fixed photo bounds. There is no animated SVG geometry, blur, clip-path morph, or burial-image morph.

Each scene owns an explicit ordered reveal list, deduplicated before animation. Text and other non-card steps run for .23s; each archive card runs for .28s, using opacity, 10px vertical travel, and `power1.out`. Steps run sequentially exactly once per normal reveal, including backward arrivals. The already-visible map points are skipped at the travel-to-map handoff. Camera movement uses `power2.inOut`; navigation remains locked through the final reveal. Replay uses the same scene-specific order.

System or manual reduced motion bypasses camera travel: .18s source fade followed by .18s destination fade, then content appears without stagger or movement. Immediate menu/hash jumps similarly bypass travel and restore the complete destination. No sound or automatic advance is present.

## Do's and Don'ts

### Do

- Do preserve the 1920×1080 composition and proportional letterboxing.
- Do retain source, author, license, and reconstruction labels with their images.
- Do show archival images with object-fit: contain and retain enlargement access.
- Do keep controls outside the scaled stage and preserve visible keyboard focus.
- Do honor system reduced motion and the manual simplified-transition toggle.

### Don't

- Don't introduce scrolling to the presentation stage or add sound.
- Don't imply that the map sequence is an established migration route.
- Don't present a supplied reconstruction as archaeological evidence.
- Don't replace the supplied font pairing, imagery, or paper/ink/ochre direction.
