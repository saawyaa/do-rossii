---
version: 1
slug: "route"
primary_target: "route:/"
related_targets: ["src/App.tsx","src/components/Slides.tsx"]
---

# Presentation surface

## Scope and visitor mode

`route:/`, with direct scene hashes `#1`–`#7`. Mode: **Experience**. The audience follows a presenter through deep time; the presenter advances, revisits, and opens evidence on demand.

## Story and action

The seven scenes move from the opening two-million-year scale to a geographic overview, Kermek, Denisova Cave, Kostenki, Sungir, and a concluding map. Each archaeological location pairs a short claim with visible evidence. The audience should leave understanding that human history here precedes states.

The primary action is next scene. Previous, replay, fullscreen, direct contents selection, and horizontal swipe support live delivery. Source and archive dialogs support closer inspection without replacing the scene.

## Chosen direction and memorable moment

The latest user correction keeps all backgrounds full-stage and leaves cards as positioned. Every ordinary site transition, forward or backward, closes a circular aperture over the stationary current reconstruction, pulls the camera back to the map, zooms the map toward the destination photo point, then opens a circular aperture over the stationary destination reconstruction. All four map circles contain their corresponding photos at real geographic coordinates. The photo never flies out of a point as a moving rectangle. Each scene reveals its unique elements sequentially. The final callback resolves into a black screen with restart.

## Proof and content

Archive records live in `src/data/sources.ts`; captions, license status, and linked originals remain visible. Reconstruction backgrounds are labeled. Source notes distinguish the adult bead count from the illustrated double-burial model, qualify dates, and clarify that the route is presentation order.

## Constraints and unresolved decisions

Preserve the projection-first scene composition, independent controls, transition locks, and simplified-motion path. Small screens retain scaled scenes; archive dialogs provide readable image inspection.
