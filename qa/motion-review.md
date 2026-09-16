# Camera/aperture correction — 2026-09-16

The latest user correction supersedes the earlier photograph docking/non-overlap review. All scenic photographs fill the stage again; card placement is unchanged by this correction.

## Verified behavior

- Map camera approaches a photo-filled point before a circular aperture opens.
- During aperture opening/closing, the photograph's bounding box stays at the full stage bounds (maximum allowed test error: 1 stage pixel).
- The enlarged destination point is centered before aperture opening (maximum allowed test error: 3 stage pixels).
- Forward and reverse navigation use the same source/destination mapping, through all four sites.
- Explicit scene steps reveal sequentially, once per block, without opacity regressions.
- Backgrounds fill the stage at 1920 and 1280 widths.
- The corrected mask uses direct scale3d transforms with inverse content scaling; a quickSetter scale alias that did not render was caught and removed.
- Raster map export excludes navigation and menu controls, which stay outside the camera.

## Evidence

Three motion tests passed after the final controller correction. Three general presentation tests passed in the preceding full run (navigation, lock/replay, all scenes/assets, direct hashes, reduced motion, dialogs, scaling, swipe, image fallback). Production build passed after final source changes.

Visually inspected `camera-approach.png`, `camera-aperture.png`, `fullscreen-kermek.png`, and regenerated map raster. The camera zooms geography, then a circular window reveals the fixed photograph. No moving photo rectangle or reduced-size final background remains.

`motion-profile-1.json`: local Chrome 1920×1080, median/p95 16.7ms, p99 16.8ms, no frames over 50ms, no long tasks. At artificial 4× CPU throttling: p99 16.8ms, one frame over 50ms, two 60ms long tasks. These measurements do not certify unknown presentation hardware.
