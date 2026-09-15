# 0. MASTER SPEC

## Canvas

Базовая система координат:

```text
1920 × 1080
aspect-ratio: 16 / 9
```

Всё проектируется относительно этого canvas и пропорционально масштабируется.

На электронной доске возможен 4K, поэтому raster backgrounds желательно:

```text
minimum: 2560 × 1440
ideal:   3840 × 2160
```

Основной режим:

```text
overflow: hidden
100vw × 100vh
no browser scrolling
```

Презентация — конечный автомат:

```text
slide 1
slide 2
slide 3
slide 4
slide 5
slide 6
slide 7
```

---

# 1. НАВИГАЦИЯ ДЛЯ ЭЛЕКТРОННОЙ ДОСКИ

Это важно вынести в отдельный постоянный слой.

## Кнопка «Назад»

```text
position: fixed
left: 32px
bottom: 30px

width: 88px
height: 88px
```

Внутри:

```text
←
```

или минимальная стрелка-chevron.

Не текст `Назад`: на доске стрелка считывается быстрее.

## Кнопка «Следующий»

```text
position: fixed
right: 32px
bottom: 30px

width: 88px
height: 88px
```

```text
→
```

Touch target **не меньше 80 × 80 px**.

Для 4K масштабировать примерно до `110–120 px`.

### Стиль

Фон:

```text
rgba(20,20,18,.72)
```

Backdrop:

```text
backdrop-filter: blur(12px)
```

Border:

```text
1px solid rgba(255,255,255,.18)
```

Иконка белая.

Не делать кнопки частью дизайна конкретного слайда. Они принадлежат **presentation UI layer**.

`z-index: 1000`.

---

## Индикатор страниц

В центре снизу:

```text
03 / 07
```

или:

```text
● ● ● ○ ○ ○ ○
```

Я бы выбрал цифры:

> `03 / 07`

потому что они меньше отвлекают.

```text
bottom: 52px
font-size: 16px
letter-spacing: .14em
```

На светлых экранах цвет тёмный, на тёмных — белый.

Можно дать UI автоматически определять `light / dark theme` для каждого slide.

---

## Дополнительное управление

Обязательно:

```text
ArrowRight → next
ArrowLeft  → previous
Space      → next
```

Но **wheel/scroll я бы отключил**, чтобы на электронной доске никто случайно не переключил сцену касанием.

Swipe:

```text
horizontal swipe > 80px
```

можно оставить.

---

# 2. ПОВЕДЕНИЕ КНОПОК

Во время перехода:

```text
pointer-events: none
opacity: .45
```

После завершения:

```text
pointer-events: auto
opacity: 1
```

Это предотвращает двойное нажатие.

Минимальный lock:

```text
transitionLock = 1800–2600 ms
```

в зависимости от сцены.

---

# 3. СОСТОЯНИЕ СЛАЙДА

Каждый экран имеет:

```text
PRELOAD
ENTER
REVEAL
HOLD
EXIT
```

### ENTER

Spatial transition из предыдущего экрана.

### REVEAL

Автоматическое появление текста/материалов.

### HOLD

Полностью готовое состояние для рассказа.

### EXIT

Начало spatial transition в следующий экран.

---

# SLIDE 01

# ДО РОССИИ

## Assets

```text
01-hero-landscape.webp
```

---

## S01_INITIAL

```text
background: #000
```

Никаких элементов.

Продолжительность после загрузки страницы:

```text
350 ms
```

---

## S01_A — число

### TIME

```text
0.35 → 1.30 s
```

### Element

```text
#opening-year
```

Контент:

```text
2 000 000
лет назад
```

### Начало

```text
opacity: 0
y: 12px
```

### Конец

```text
opacity: 1
y: 0
```

Главное число:

```text
font-size: 172px
```

Подпись:

```text
font-size: 25px
margin-top: 10px
```

Position:

```text
x: 960
y: 520
transform-origin: center
```

---

# S01_B — открытие пространства

## TIME

```text
1.30 → 3.00 s
```

Появляется background.

Начальное состояние:

```text
opacity: .15
brightness: .18
scale: 1.08
```

Финальное:

```text
opacity: 1
brightness: 1
scale: 1
```

Число одновременно перемещается:

```text
center → x: 105px
          y: 535px
```

Scale typography:

```text
172px → 56px
```

---

# S01_C — title reveal

## TIME

```text
2.35 → 3.65 s
```

Появляется:

```text
ДО РОССИИ
```

Position:

```text
x: 104
y: 192
```

Font:

```text
148px
line-height: .88
```

Animation:

```text
opacity 0 → 1
y 18px → 0
duration 700ms
```

---

## S01_D — subtitle

Delay:

```text
180 ms
```

Появляется:

> Первобытные люди и их стоянки  
> на территории современной России

Position:

```text
x: 110
y: 375
width: 760
```

---

## S01_E — date context

Появляется строка:

> ≈ 2 000 000 лет  
> человеческого присутствия

и tiny label:

> ХУДОЖЕСТВЕННАЯ РЕКОНСТРУКЦИЯ

---

## S01_HOLD

Общее время входа:

```text
≈3.8 s
```

После этого всё статично.

Разрешён только один очень слабый drift:

```text
background scale:
1 → 1.009

duration:
14 sec
```

затем остановка.

---

# S01 → S02

## Trigger

```text
NEXT
```

## Duration

```text
2200 ms
```

### Phase 1

`0–450 ms`

Весь текст:

```text
opacity 1 → 0
y 0 → -10
```

### Phase 2

`200–1500 ms`

Camera:

```text
scale 1 → .74
```

Landscape:

```text
saturation 1 → .25
contrast 1 → .65
brightness 1 → 1.15
```

### Phase 3

`900–2000 ms`

Карта начинает проявляться через mask/dissolve.

К моменту:

```text
t = 2.0s
```

фотографии уже нет.

---

# SLIDE 02

# ОДНА ТЕРРИТОРИЯ. МИЛЛИОНЫ ЛЕТ.

## Background

```text
#EEE9DF
```

---

# S02_A — карта

После завершения предыдущего transition:

контур карты уже видим.

Map placement:

```text
x: 595
y: 95
w: 1230
h: 715
```

Camera/map initial:

```text
scale: 1.035
opacity: .9
```

settle:

```text
scale: 1
opacity: 1
duration: 650ms
```

---

# S02_B — заголовок

Position:

```text
x: 94
y: 120
w: 480
```

Текст:

> ОДНА ТЕРРИТОРИЯ.  
> МИЛЛИОНЫ ЛЕТ.

Font:

```text
80px
```

Subtitle:

> Четыре памятника — четыре точки нашего маршрута через первобытную историю.

---

# S02_C — последовательность точек

Старт:

```text
+350ms after title
```

### Point 1

```text
KERMEK
```

Animation:

```text
opacity 0 → 1
scale .7 → 1
duration 420ms
```

Однократный pulse:

```text
1 → 1.18 → 1
```

### +220ms

```text
DENISOVA
```

### +220ms

```text
KOSTENKI
```

### +220ms

```text
SUNGIR
```

---

# S02_D — нижние данные

Все четыре блока поднимаются снизу примерно на `15px`.

Вместе, но с stagger:

```text
100ms
```

Финальные данные:

```text
КЕРМЕК
2,1–1,8 млн
ранний палеолит

ДЕНИСОВА ПЕЩЕРА
≈300 тыс.
многослойный памятник

КОСТЁНКИ
≈42–45 тыс.
ранний верхний палеолит

СУНГИРЬ
≈30 тыс.
верхний палеолит
```

---

# S02_HOLD

Общее reveal:

```text
≈2.1 sec
```

---

# S02 → S03

# ZOOM INTO KERMEK

Duration:

```text
1900 ms
```

Остальные маркеры:

```text
opacity 1 → .12
```

Кермек:

```text
scale 1 → 1.5
```

за `300ms`.

Затем camera target:

```text
Kermek coordinates → viewport center
```

Map zoom:

```text
1 → 4 → 10+
```

Blur:

```text
0 → 4px
```

только в средней фазе.

Последние `500 ms`:

Map texture cross-masks into:

```text
03-kermek.webp
```

---

# SLIDE 03

# КЕРМЕК

## Asset

```text
03-kermek.webp
```

---

# S03_A — landing

Image initial:

```text
scale 1.12
```

Finish:

```text
scale 1
duration 850ms
```

---

# S03_B — heading

Position:

```text
x: 96
y: 120
w: 620
```

Sequence:

```text
ТАМАНСКИЙ ПОЛУОСТРОВ
        120ms
КЕРМЕК
        160ms
2,1–1,8 млн лет назад
```

КЕРМЕК:

```text
font-size: 116px
```

---

# S03_C — thesis

Delay:

```text
300ms
```

> Одна из древнейших известных стоянок человека  
> в Западной Евразии за пределами Кавказа.

Далее:

> Пляжевая зона древнего опреснённого  
> морского залива или эстуария.

---

# S03_D — archaeological card

Start:

```text
~2 sec after slide enter
```

Background image:

```text
brightness 1 → .80
```

Card:

```text
x: 1320
y: 585
w: 480
h: 340
```

Animation:

```text
opacity 0 → 1
y 20 → 0
duration 600ms
```

Content:

> АРХЕОЛОГИЧЕСКИЙ МАТЕРИАЛ

> **Каменная индустрия Кермека**

Real archaeological image.

Source line below.

---

# S03_HOLD

Background camera:

```text
x: 0 → -2%
```

за первые `12 sec`, затем stop.

---

# S03 → S04

# INTO THE EARTH

Duration:

```text
1700ms
```

Card:

```text
opacity 1 → 0
duration 300ms
```

Scene:

```text
scale 1 → 1.45
```

Target — грунт в lower/central part.

Последние `550ms`:

```text
03 ground texture
       ↓
04 Denisova sediment texture
```

Camera direction постепенно становится вертикальной.

---

# SLIDE 04

# ДЕНИСОВА ПЕЩЕРА

## Main asset

```text
04-denisova-cutaway.webp
```

Real materials:

```text
denisova-real-cave
denisova-stratigraphy
denisova-artifacts
```

---

# S04_A — cave entry

Image bounds:

```text
x: 0
y: 0
w: 1370
h: 1080
```

Начальный crop:

показываем преимущественно верхнюю часть.

Camera:

```text
scale 1.12
translateY: +180px
```

---

# S04_B — title

```text
x: 88
y: 108
```

> ДЕНИСОВА  
> ПЕЩЕРА

Font:

```text
104px
```

Затем:

> Алтай

> ≈300 000 лет истории в слоях

---

# S04_C — vertical descent

Start:

```text
~1.8 sec
```

Duration:

```text
2600ms
```

Camera:

```text
translateY:
+180 → -210px

scale:
1.12 → 1.18
```

Очень важно:

```text
linear spatial perception,
but eased start/end
```

Не делать ускорение «лифт падает вниз».

---

## Overlay phrase

На середине движения появляется:

> **Археология здесь буквально читается слоями.**

Этот текст:

```text
position: fixed relative to viewport
```

Он не двигается вместе с профилем.

---

# S04_D — museum column reveal

После остановки камера:

```text
main visual x:
0 → -50px
```

Правая колонка:

```text
x: 1370
w: 550
```

Background:

```text
#EEE9DF
```

---

## Card D1

Delay:

```text
0ms
```

> Денисова пещера сегодня

Реальное фото.

---

## Card D2

Delay:

```text
220ms
```

> Научный профиль Южной камеры

Nature stratigraphy.

---

## Card D3

Delay:

```text
440ms
```

> Каменные и костяные находки

Real artifacts.

---

# S04_HOLD

Никакого ambient movement.

Экран уже визуально сложный.

---

# S04 → S05

# OUT OF THE GROUND

Duration:

```text
2050ms
```

Museum column:

```text
opacity 1 → 0
duration 350ms
```

Camera:

```text
translateY -210 → +700px
```

но визуально движение воспринимается как **вверх через профиль**.

Texture:

```text
dark cave soil
→
lighter loess
→
surface
```

Последняя поверхность morph в:

```text
05-kostenki.webp
```

---

# SLIDE 05

# КОСТЁНКИ

Asset:

```text
05-kostenki.webp
```

---

# S05_A — surface arrival

Начальный crop низкий:

```text
camera Y slightly lower
scale 1.08
```

За `900ms`:

```text
scale 1
camera Y → normal eye level
```

---

# S05_B — heading

```text
x: 96
y: 105
```

Sequence:

> КОСТЁНКИ

> Средний Дон

> ≈42–45 тыс. лет назад

> Ранний верхний палеолит

---

# S05_C — thesis

Через `300ms`:

> Не только каменные орудия —  
> кость, украшения и первые формы искусства.

---

# S05_D — archaeology

AI photo:

```text
brightness 1 → .82
```

### Card 1

```text
x: 1330
y: 155
w: 470
h: 300
```

> Костёнки-14 · слой IVб  
> **Кремневый инвентарь**

---

### Card 2

```text
x: 1330
y: 500
w: 470
h: 330
```

Delay:

```text
250ms
```

> Костёнки-14 · слой IVб  
> **Кость · украшения · искусство**

---

# S05_E — chronology note

Bottom:

> Костёнковская группа в целом: ≈42–20 тыс. лет.  
> Здесь показан её древнейший этап.

Animation:

```text
opacity 0 → .72
```

Не делать prominent.

---

# S05 → S06

Это единственная deliberate pause.

Duration:

```text
1600ms
```

Background:

```text
brightness 1 → 0
```

Карточка №2 остаётся на `250ms` дольше.

Потом:

```text
black screen
220–280ms
```

Затем проявляется Sungir background.

---

# SLIDE 06

# СУНГИРЬ

Assets:

```text
06-sungir-background
sungir-double-burial
sungir-clothing
sungir-ivory-spears
sungir-figurine
```

---

# S06_A — title

```text
x: 96
y: 108
```

> СУНГИРЬ

> под Владимиром

> ≈30 000 лет назад

---

# S06_B — 3500+

Delay:

```text
350ms
```

```text
font-size: 126px
```

> **3500+**

Animation:

```text
opacity 0 → 1
```

Не scale.

Под ним:

> бус из бивня

---

# S06_C — burial reveal

Real model:

```text
x: 885
y: 85
w: 900
h: 620
```

Начало:

```text
opacity: 0
brightness: .4
```

Конец:

```text
opacity: 1
brightness: 1
```

Duration:

```text
900ms
```

Label:

> МУЗЕЙНАЯ МОДЕЛЬ ДВОЙНОГО ПОГРЕБЕНИЯ

---

# S06_D — artifact strip

```text
y: 765
h: 205
```

Три карточки.

Появляются через:

```text
180–220ms stagger
```

### 1

> ОДЕЖДА

### 2

> ОРУЖИЕ

### 3

> СИМВОЛ

После `500ms` category labels немного уменьшаются:

```text
24px → 16px
```

---

# S06_E — emotional thesis

Последним:

> **Первобытный человек создавал  
> не только орудия.  
> Он создавал символы.**

Здесь все остальные подписи:

```text
opacity 1 → .72
```

Главный тезис:

```text
opacity 0 → 1
```

---

# S06 → S07

# BURIAL → POINT → MAP

Самый важный outro transition.

Duration:

```text
2300ms
```

### 0–500ms

Текст исчезает.

### 300–1400ms

Burial image:

```text
scale 1 → .40
```

и движется к координате будущего Sungir marker.

Остальные элементы исчезают.

### 1000–1800ms

Burial image становится:

```text
brightness ↑
detail ↓
blur slight
```

и через radial mask превращается в маленькую точку.

### 1400–2300ms

За ней постепенно проявляется карта России.

В финале:

```text
the resulting dot = Sungir marker
```

Нельзя допустить даже маленького скачка позиции.

---

# SLIDE 07

# ФИНАЛ

Background:

```text
#141512
```

Map centered.

---

# S07_A — Sungir

При входе видима только одна яркая точка:

```text
Сунгирь
```

Остальные:

```text
opacity: .15
```

---

# S07_B — reverse chronology

```text
Sungir
↓ +220ms
Kostenki
↓ +220ms
Denisova
↓ +220ms
Kermek
```

Каждая точка:

```text
opacity .15 → 1
```

Никаких pulse.

---

# S07_C — final heading

После завершения:

> **ИСТОРИЯ НАЧИНАЕТСЯ  
> РАНЬШЕ ГОСУДАРСТВ**

Position center.

Font:

```text
86px
```

---

# S07_D — conclusion

Через `250ms`:

> На территории современной России люди жили  
> за сотни тысяч лет до появления первых государств.

Далее:

> Кермек · Денисова пещера · Костёнки · Сунгирь

Далее:

> Стоянки позволяют восстановить технологии,  
> среду, быт, миграции, искусство и представления о мире.

---

# S07_E — callback

После ещё `500ms`:

внизу:

> **≈ 2 000 000 лет → 7 экранов**

Это отсылка к самому началу.

---

# S07_HOLD

Финальная композиция полностью статична.

Кнопка `→` на этом экране меняет функцию.

Вместо перехода:

```text
→ END
```

---

# END STATE

Если нажать вправо на 07:

Map:

```text
opacity 1 → 0
```

за `600ms`.

Все тексты кроме:

```text
≈ 2 000 000 лет
```

исчезают.

Затем через `500ms` исчезает и оно.

Black screen.

После этого в центре можно показать маленькую кнопку:

```text
↻
```

**«С начала»**

но только после полного окончания.

---

# КАК РАБОТАЕТ НАЗАД

Очень важное решение.

Кнопка `←` **не должна воспроизводить всю внутреннюю анимацию прошлого слайда задом наперёд**.

Это будет медленно и неестественно.

Используем:

```text
CURRENT EXIT REVERSE
→
PREVIOUS HOLD
```

Например:

с 04 нажали назад → камера выходит из Денисовой через землю → появляется **уже полностью собранный HOLD Кермека**.

То есть докладчик сразу возвращается к информации.

Если ему хочется повторить анимацию конкретного экрана, можно добавить незаметную клавишу:

```text
R = replay current slide
```

Для преподавательской презентации это очень удобно.

---

# UI СОСТОЯНИЯ НА 7 СЛАЙДАХ

|Экран|UI-тема|←|→|
|---|---|---|---|
|01|dark|disabled|active|
|02|light|active|active|
|03|dark|active|active|
|04|mixed/light|active|active|
|05|dark|active|active|
|06|dark|active|active|
|07|dark|active|`finish`|

На первом экране `←` остаётся видимой, но:

```text
opacity: .20
pointer-events: none
```

Так layout не прыгает.

---

# PRELOAD

До старта презентации обязательно грузим:

```text
01 hero
03 Kermek
04 Denisova
05 Kostenki
06 Sungir
```

Плюс map data.

После старта 01 lazy preload:

```text
real archival images
```

Никакого появления пустых карточек.

---

# FAILSAFE ДЛЯ ДОСКИ

Если transition или WebGL/маска не успела:

каждый экран обязан иметь **готовое HOLD-состояние без зависимости от предыдущего**.

То есть разработчик должен уметь выполнить:

```text
renderSlide(5, immediate=true)
```

и получить правильные Костёнки.

Это критично.

Не строим презентацию так, чтобы Slide 05 существовал только если пользователь физически прошёл 01→02→03→04.

---

# РЕЖИМ ПРЕЗЕНТАЦИИ

Я бы добавил скрытый угол или клавишу:

```text
F
```

→ fullscreen.

И кнопку:

```text
☰
```

только если навести курсор/задержать касание в левом верхнем углу.

Там:

```text
01 До России
02 Карта
03 Кермек
04 Денисова
05 Костёнки
06 Сунгирь
07 Финал
```

Это страховка, если преподаватель попросит:

> «Вернитесь на Денисову пещеру».

Но в обычном режиме меню не видно.

---

## Итоговая state machine

```text
START
 │
 ▼
01 HERO ──────→ 02 MAP
 ↑               │
 │               ▼
 └───────────── 03 KERMEK
                  │
                  ▼
              04 DENISOVA
                  │
                  ▼
              05 KOSTENKI
                  │
                  ▼
              06 SUNGIR
                  │
                  ▼
              07 FINAL
                  │
                  ▼
                 END
```

`←` всегда движется по этой же цепочке в обратную сторону, но приводит предыдущий экран **сразу в HOLD**.

Следующим проходом стоит сделать ещё более технический **animation manifest** — буквально JSON-подобную таблицу для разработчика: `elementId / start / end / duration / easing / x / y / scale / opacity / z-index / asset`, чтобы почти не осталось дизайнерских решений, которые ему придётся додумывать самостоятельно.