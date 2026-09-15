# 1. Technical animation manifest

Базовая система координат: `1920 × 1080`. Все `x/y/w/h` ниже заданы относительно неё. На реальном экране canvas масштабируется пропорционально.

```ts
const PRESENTATION = {
  baseWidth: 1920,
  baseHeight: 1080,
  totalSlides: 7,

  navigation: {
    next: ["ArrowRight", "Space", "button-next", "swipe-left"],
    prev: ["ArrowLeft", "button-prev", "swipe-right"],
    replay: ["KeyR"],
    fullscreen: ["KeyF"],
  },

  timing: {
    uiFade: 300,
    textReveal: 650,
    cardReveal: 550,
    standardTransition: 1900,
  },

  easing: {
    camera: "power2.inOut",
    cameraSoft: "power3.inOut",
    reveal: "power2.out",
    fade: "power1.out",
  }
}
```

Главное правило реализации:

```text
transform + opacity = разрешены
filter = ограниченно
layout-анимации = избегать
WebGL = не использовать
scroll-driven animation = не использовать
```

Все переходы запускаются программно кнопками `← / →`, а не scroll position.

---

# 2. Глобальная структура сцены

```html
<div id="presentation">
    <div id="world-layer">
        <!-- active slide -->
    </div>

    <div id="transition-layer">
        <!-- временные элементы для переходов -->
    </div>

    <div id="grain-layer"></div>

    <div id="presentation-ui">
        <button id="prev"></button>
        <div id="counter"></div>
        <button id="next"></button>
    </div>
</div>
```

Z-index:

```text
world-layer       0–100
transition-layer  200
grain-layer       500
presentation-ui   1000
```

`grain-layer`:

```css
opacity: .025;
pointer-events: none;
mix-blend-mode: soft-light;
```

---

# 3. Slide state contract

Каждый экран обязан существовать независимо.

```ts
type SlideState =
  | "hidden"
  | "entering"
  | "revealing"
  | "hold"
  | "exiting";
```

API:

```ts
goToSlide(index, direction)
nextSlide()
prevSlide()
replaySlide()
renderSlide(index, { immediate: true })
```

Критично:

```ts
renderSlide(4, { immediate: true })
```

должен сразу показать **полностью собранный HOLD Денисовой пещеры**, даже если пользователь не проходил первые три сцены.

---

# 4. SLIDE 01 — HERO

## DOM IDs

```text
s01
s01-bg
s01-opening-number
s01-opening-suffix
s01-title
s01-subtitle
s01-date
s01-date-caption
s01-reconstruction-label
```

## Initial state

```ts
{
  "#s01-bg": {
    opacity: 0,
    scale: 1.08,
    filter: "brightness(.18)"
  },

  "#s01-opening-number": {
    opacity: 0,
    y: 12,
    fontSize: 172,
    x: 960,
    yPos: 500
  },

  "#s01-title": { opacity: 0, y: 18 },
  "#s01-subtitle": { opacity: 0, y: 16 },
  "#s01-date": { opacity: 0 },
  "#s01-date-caption": { opacity: 0 }
}
```

---

## S01 timeline

```text
0.00–0.35
black screen

0.35–1.20
opening-number opacity 0→1
opening-number y +12→0

0.55–1.20
"лет назад" opacity 0→1

1.20–2.95
background opacity 0→1
background scale 1.08→1
brightness .18→1

1.20–2.80
opening-number:
  position center → x 105 / y 535
  font 172 → 56

2.25–2.95
title opacity 0→1
title y 18→0

2.43–3.08
subtitle opacity 0→1

2.65–3.30
date / date-caption opacity 0→1

3.20–3.55
reconstruction label opacity 0→.75
```

### HOLD

```ts
gsap.to("#s01-bg", {
  scale: 1.009,
  duration: 14,
  ease: "none"
})
```

Один раз, потом stop.

---

# 5. TRANSITION 01 → 02

ID:

```text
t01-02
```

Duration:

```text
2200 ms
```

Sequence:

```text
0–450
all hero text:
opacity 1→0
y 0→-10

200–1500
hero bg:
scale 1→.74
saturation 1→.25
contrast 1→.70
brightness 1→1.12

850–1650
map mask opacity 0→1

1300–2100
hero opacity 1→0

1700–2200
s02 map scale 1.035→1
```

Не делать настоящий географический спутниковый zoom. Это **визуальный zoom-out**, завершающийся картой.

---

# 6. SLIDE 02 — MAP

IDs:

```text
s02
s02-title
s02-subtitle
s02-map

marker-kermek
marker-denisova
marker-kostenki
marker-sungir

info-kermek
info-denisova
info-kostenki
info-sungir
```

## Positions

```text
title:
x 94
y 120
w 480

map:
x 595
y 95
w 1230
h 715
```

---

## S02 reveal

```text
0–650
title opacity 0→1
title y 16→0

150–750
subtitle opacity 0→1

650
Kermek marker

870
Denisova marker

1090
Kostenki marker

1310
Sungir marker

marker animation each:
opacity 0→1
scale .7→1
duration 420

after appearance:
scale 1→1.18→1
duration 400
only once

1100–1800
info blocks appear
100ms stagger
y +15→0
opacity 0→1
```

HOLD — полностью статичный.

---

# 7. TRANSITION 02 → 03

Duration:

```text
1900ms
```

Camera target:

```text
Kermek marker
```

```text
0–300
other markers opacity 1→.12

0–300
Kermek marker scale 1→1.5

250–1450
map world scale 1→10+
translate so Kermek = center

600–1450
blur 0→4px→2px

1250–1900
map opacity 1→0
Kermek image opacity 0→1
Kermek image scale 1.18→1.12
```

Marker должен исчезнуть точно в месте, где появляется грунт Кермека.

---

# 8. SLIDE 03 — KERMEK

IDs:

```text
s03
s03-bg
s03-region
s03-title
s03-date
s03-thesis
s03-environment
s03-card-tools
s03-card-source
```

Positions:

```text
text:
x 96
y 120
w 620

card:
x 1320
y 585
w 480
h 340
```

---

## S03 reveal

```text
0–850
bg scale 1.12→1

350–900
region opacity 0→1

470–1050
title opacity 0→1
y 18→0

630–1150
date opacity 0→1

950–1600
thesis opacity 0→1
y 14→0

1200–1800
environment text opacity 0→1

1850–2400
bg brightness 1→.80

1850–2450
tools card:
opacity 0→1
y +20→0

2100–2500
source caption opacity 0→.7
```

HOLD ambient:

```text
background x: 0 → -2%
duration: 12s
ease: none
then stop
```

---

# 9. TRANSITION 03 → 04

Duration:

```text
1700ms
```

```text
0–300
card opacity 1→0

0–400
text opacity 1→0

200–1250
Kermek bg scale 1→1.45
camera target lower center / soil

700–1350
brightness slightly ↓
contrast slightly ↓

1100–1700
Kermek soil crossfade →
Denisova sediment texture

1450–1700
Denisova scene opacity →1
```

Визуальный смысл:

```text
поверхность → земля → археологический слой
```

---

# 10. SLIDE 04 — DENISOVA

IDs:

```text
s04
s04-main
s04-title
s04-location
s04-date
s04-layer-thesis

s04-column
s04-real-cave
s04-stratigraphy
s04-artifacts
```

Layout:

```text
main:
x 0
y 0
w 1370
h 1080

column:
x 1370
w 550
h 1080
```

---

## S04 initial camera

```text
main scale: 1.12
translateY: +180
```

---

## S04 timeline

```text
0–650
title opacity 0→1
y 18→0

180–800
location opacity 0→1

350–950
date opacity 0→1

1200–3800
vertical descent:
translateY +180→-210
scale 1.12→1.18

2050–2700
layer thesis opacity 0→1
fixed in viewport

3900–4400
main x 0→-50

4000–4550
column bg opacity 0→1

4100–4650
real cave card

4320–4870
stratigraphy card

4540–5090
artifacts card
```

После `5090ms` — HOLD.

Никакого ambient movement.

---

# 11. TRANSITION 04 → 05

Duration:

```text
2050ms
```

```text
0–350
museum cards opacity →0

150–500
texts opacity →0

250–1600
camera moves upward through profile

visual translation:
dark soil
→ brown
→ light loess
→ surface

1300–2050
Denisova surface →
Kostenki ground crossfade

1600–2050
Kostenki opacity 0→1
scale 1.10→1.08
```

---

# 12. SLIDE 05 — KOSTENKI

IDs:

```text
s05
s05-bg
s05-title
s05-location
s05-date
s05-period
s05-thesis

s05-card-lithics
s05-card-art
s05-chronology-note
```

Positions:

```text
title:
x 96
y 105

card 1:
x 1330
y 155
w 470
h 300

card 2:
x 1330
y 500
w 470
h 330
```

---

## S05 sequence

```text
0–900
bg scale 1.08→1
camera y slight low→normal

320–900
title opacity 0→1

480–1050
location

620–1200
date

760–1300
period

1150–1750
thesis

1900–2350
background brightness 1→.82

1900–2470
card lithics

2150–2720
card art

2550–3050
chronology note opacity 0→.72
```

HOLD.

---

# 13. TRANSITION 05 → 06

Duration:

```text
1600ms
```

Sequence:

```text
0–900
background brightness →0
main text opacity →0

0–1100
card lithics opacity →0

card art remains until ~1050

1050–1300
card art opacity →0

1300–1550
full black

1450–1600
Sungir background opacity 0→1
```

---

# 14. SLIDE 06 — SUNGIR

IDs:

```text
s06
s06-bg
s06-title
s06-location
s06-date
s06-number
s06-number-caption

s06-burial
s06-burial-label

s06-clothing
s06-spears
s06-figurine

s06-thesis
```

---

## Layout

```text
left text:
x 96
y 108
w 670

burial:
x 885
y 85
w 900
h 620

artifact strip:
y 765
h 205
```

---

## S06 sequence

```text
0–650
title

150–750
location

300–900
date

950–1550
3500+ opacity 0→1

1100–1650
number-caption

1650–2550
burial:
opacity 0→1
brightness .4→1

1850–2400
burial-label

2750
clothing

2950
spears

3150
figurine

each:
opacity 0→1
y 14→0
duration 500

category labels:
font 24→16
after 500ms

3650–4300
secondary content opacity 1→.72

3750–4450
main thesis opacity 0→1
y 16→0
```

HOLD.

---

# 15. TRANSITION 06 → 07

Duration:

```text
2300ms
```

Самый точный переход проекта.

```text
0–450
all text except burial opacity →0

250–1350
burial scale 1→.40
burial moves toward future Sungir marker coordinates

700–1500
artifact strip opacity →0

950–1750
burial detail fades:
saturation ↓
contrast ↓
blur 0→2
brightness ↑

1200–1750
radial mask shrinks burial into circle

1500–2100
map opacity 0→1

1750–2300
circle scale → marker size

2300
resulting circle EXACTLY = marker-sungir
```

Разработчик должен использовать **один и тот же target coordinate**, а не визуально подгонять вручную.

---

# 16. SLIDE 07 — FINAL

IDs:

```text
s07
s07-map
marker-kermek-final
marker-denisova-final
marker-kostenki-final
marker-sungir-final

s07-title
s07-thesis
s07-sites
s07-summary
s07-callback
```

---

## Initial

```text
Sungir opacity 1
others opacity .15
```

---

## Sequence

```text
0–220
Sungir already active

220–600
Kostenki .15→1

440–820
Denisova .15→1

660–1040
Kermek .15→1

1200–1900
title opacity 0→1
y 18→0

1450–2100
thesis

1700–2250
sites

1950–2500
summary

2450–3100
callback:
≈ 2 000 000 лет → 7 экранов
```

HOLD static.

---

# 17. END

На `next` с 07:

```text
0–500
all text except "≈2 000 000 лет" fade

200–750
map fade

700–1250
only ≈2 000 000 remains

1250–1900
number opacity →0

1900
black
```

Через `400ms` появляется маленькая:

```text
↻ С начала
```

---

# 18. PREVIOUS behavior

Это важно.

При нажатии назад:

```text
DO NOT:
reverse full slide animation
```

Вместо:

```text
current slide
→ reverse spatial transition
→ previous HOLD state
```

То есть:

```text
04 → BACK → 03 HOLD
```

а не:

```text
04 → replay entire 03 intro backwards
```

`R` replay current slide from ENTER.

---

# 19. UI manifest

```ts
const UI = {
  prev: {
    x: 32,
    bottom: 30,
    size: 88
  },

  next: {
    right: 32,
    bottom: 30,
    size: 88
  },

  counter: {
    centerX: true,
    bottom: 52
  }
}
```

Touch:

```text
minimum hit target = 88×88 px
```

На 4K UI масштабируется вместе с canvas.

Кнопки во время transition:

```css
opacity: .4;
pointer-events: none;
```
