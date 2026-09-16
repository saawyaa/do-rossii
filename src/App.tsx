import type { CSSProperties } from "react";
import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { gsap } from "gsap";
import { Map } from "./components/Map";
import { locations } from "./data/locations";
import { SlideContent } from "./components/Slides";
import { slides, backgrounds } from "./data/slides";
import { sources } from "./data/sources";
import { config, reveal, transition } from "./animation/controller";
type State = {
  slide: number;
  phase: "enter" | "reveal" | "hold" | "exit";
  locked: boolean;
  ended: boolean;
};
function hashSlide() {
  const n = Number(location.hash.slice(1));
  return Number.isInteger(n) && n >= 1 && n <= 7 ? n - 1 : 0;
}
function Arrow({ back = false }: { back?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      <path
        d={back ? "M32 20H8m12-12L8 20l12 12" : "M8 20h24M20 8l12 12-12 12"}
      />
    </svg>
  );
}
export default function App() {
  const [state, dispatch] = useReducer(
    (s: State, p: Partial<State>) => ({ ...s, ...p }),
    { slide: hashSlide(), phase: "enter", locked: true, ended: false },
  );
  const [ready, setReady] = useState(false),
    [assetError, setAssetError] = useState(false),
    [menu, setMenu] = useState(false),
    [sourceOpen, setSourceOpen] = useState(false),
    [low, setLow] = useState(
      config.lowMotion ||
        matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
    [scale, setScale] = useState(
      Math.min(innerWidth / 1920, innerHeight / 1080),
    );
  const stage = useRef<HTMLDivElement>(null),
    sections = useRef<(HTMLElement | null)[]>([]),
    current = useRef(state.slide),
    lock = useRef(true),
    timeline = useRef<gsap.core.Timeline | null>(null),
    ended = useRef(false),
    actions = useRef({
      go: (_n: number, _instant = false) => {},
      replay: () => {},
    }),
    menuButton = useRef<HTMLButtonElement>(null),
    dialog = useRef<HTMLDialogElement>(null);
  const finish = () => {
    lock.current = false;
    dispatch({ phase: "hold", locked: false });
  };
  const syncHash = (n: number) => history.replaceState(null, "", `#${n + 1}`);
  useEffect(() => {
    let live = true;
    const load = (src: string) =>
      new Promise<boolean>((resolve) => {
        const im = new Image();
        im.onload = () => {
          im.decode()
            .catch(() => {})
            .finally(() => resolve(true));
        };
        im.onerror = () => resolve(false);
        im.src = src;
      });
    Promise.all(backgrounds.map(load)).then((result) => {
      if (live) {
        setAssetError(result.some((v) => !v));
        setReady(true);
      }
      Object.values(sources).forEach((s) => void load("/assets/" + s.image));
    });
    const resize = () =>
      setScale(Math.min(innerWidth / 1920, innerHeight / 1080));
    addEventListener("resize", resize);
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setLow(mq.matches);
    mq.addEventListener("change", change);
    return () => {
      live = false;
      removeEventListener("resize", resize);
      mq.removeEventListener("change", change);
    };
  }, []);
  useLayoutEffect(() => {
    if (!ready) return;
    sections.current.forEach((s, i) =>
      gsap.set(s, { autoAlpha: i === current.current ? 1 : 0 }),
    );
    syncHash(current.current);
    dispatch({ phase: "reveal" });
    timeline.current = reveal(
      sections.current[current.current]!,
      current.current,
      low,
      finish,
    );
    return () => {
      timeline.current?.kill();
    };
  }, [ready]);
  const go = (n: number, immediate = false) => {
    if (lock.current || n < 0 || n > 7) return;
    if (ended.current) {
      if (n === 7) return;
      ended.current = false;
      dispatch({ ended: false });
    }
    const prev = current.current;
    if (n === prev && !immediate) return;
    lock.current = true;
    dispatch({ locked: true, phase: "exit" });
    timeline.current?.kill();
    setMenu(false);
    if (n === 7) {
      const el = sections.current[6]!;
      timeline.current = gsap
        .timeline({
          onComplete: () => {
            ended.current = true;
            dispatch({ ended: true });
            finish();
          },
        })
        .to(
          el.querySelectorAll(".final-copy,.map-world,.callback-tail"),
          { opacity: 0, duration: low ? 0.18 : 0.65 },
          0,
        )
        .to(
          el.querySelector(".callback"),
          { opacity: 0, duration: low ? 0.1 : 0.65 },
          low ? 0.18 : 1.25,
        );
      return;
    }
    syncHash(n);
    timeline.current = transition(
      sections.current[prev]!,
      sections.current[n]!,
      prev,
      n,
      stage.current!,
      low,
      finish,
      () => {
        current.current = n;
        dispatch({ slide: n, phase: "reveal" });
      },
      immediate,
    );
  };
  const replay = () => {
    if (lock.current) return;
    ended.current = false;
    dispatch({ ended: false, phase: "reveal", locked: true });
    lock.current = true;
    timeline.current?.kill();
    timeline.current = reveal(
      sections.current[current.current]!,
      current.current,
      low,
      finish,
    );
  };
  actions.current = { go, replay };
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (sourceOpen || document.querySelector("dialog[open]")) return;
      if (e.key === "Escape") {
        setMenu(false);
        return;
      }
      if (e.key.toLowerCase() === "f") {
        e.preventDefault();
        void fullscreen();
        return;
      }
      if (menu || (e.target as HTMLElement).closest("input")) return;
      if (e.key === " " && (e.target as HTMLElement).closest("button,a"))
        return;
      if (["ArrowRight", "ArrowLeft", " ", "r", "R"].includes(e.key)) {
        e.preventDefault();
        if (e.repeat) return;
        if (e.key.toLowerCase() === "r") actions.current.replay();
        else
          actions.current.go(
            current.current + (e.key === "ArrowLeft" ? -1 : 1),
          );
      }
    };
    const hash = () => {
      const n = hashSlide();
      if (lock.current) syncHash(current.current);
      else actions.current.go(n, true);
    };
    addEventListener("keydown", key);
    addEventListener("hashchange", hash);
    return () => {
      removeEventListener("keydown", key);
      removeEventListener("hashchange", hash);
    };
  }, [menu, sourceOpen]);
  useEffect(() => {
    if (sourceOpen) dialog.current?.showModal();
    else if (dialog.current?.open) dialog.current.close();
  }, [sourceOpen]);
  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setMenu(true);
    }
  };
  const touch = useRef<{ x: number; y: number } | null>(null);
  return (
    <main
      className={`presentation ${state.slide === 1 ? "light-ui" : ""}`}
      data-slide={state.slide + 1}
      data-phase={state.phase}
      data-locked={state.locked}
    >
      {!ready && (
        <div className="loader" role="status" aria-label="Загрузка презентации">
          <span />
        </div>
      )}
      {assetError && (
        <div className="asset-warning">
          Не удалось загрузить часть фонов.{" "}
          <button onClick={() => location.reload()}>Повторить загрузку</button>
        </div>
      )}
      <div
        className="stage"
        ref={stage}
        style={
          {
            transform: `translate(-50%, -50%) scale(${scale})`,
            "--nav-safe-x": `${136 / scale}px`,
          } as CSSProperties
        }
        onTouchStart={(e) => {
          if ((e.target as HTMLElement).closest("a,button")) return;
          touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }}
        onTouchEnd={(e) => {
          if (!touch.current || menu || sourceOpen) return;
          const dx = e.changedTouches[0].clientX - touch.current.x,
            dy = e.changedTouches[0].clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.4)
            go(current.current + (dx < 0 ? 1 : -1));
        }}
      >
        <div className="travel-layer" aria-hidden="true" inert>
          <div className="travel-camera"><img className="travel-map-raster" src="/assets/map-overview.webp" alt="" /><Map travel /></div>
          <div className="travel-aperture"><div className="aperture-content">
            {locations.map(place=><img key={place.id} data-place={place.id} src={place.image} alt="" />)}
          </div></div>
        </div>
        {slides.map((title, i) => (
          <section
            key={title}
            ref={(el) => {
              sections.current[i] = el;
            }}
            className={`slide slide-${i + 1}`}
            aria-label={`${i + 1}. ${title}`}
            aria-hidden={state.slide !== i || state.ended}
            inert={state.slide !== i || state.ended}
          >
            <SlideContent index={i} />
          </section>
        ))}
      </div>
      {ready && !state.ended && (
        <>
          <button
            ref={menuButton}
            className="menu-toggle"
            aria-label="Меню презентации"
            aria-expanded={menu}
            onClick={() => setMenu(!menu)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
          <nav className="navigation" aria-label="Переключение сцен">
            <button
              className="nav-arrow prev"
              disabled={state.locked || state.slide === 0}
              aria-label="Предыдущая сцена"
              onClick={() => go(current.current - 1)}
            >
              <Arrow back />
            </button>
            <div className="counter" aria-live="polite">
              {String(state.slide + 1).padStart(2, "0")}
              <span> / </span>07
            </div>
            <button
              className="nav-arrow next"
              disabled={state.locked}
              aria-label={
                state.slide === 6 ? "Завершить презентацию" : "Следующая сцена"
              }
              onClick={() => go(current.current + 1)}
            >
              <Arrow />
            </button>
          </nav>
        </>
      )}
      {state.ended && (
        <div className="end-state">
          <button className="restart" onClick={() => go(0, true)}>
            ↻ С начала
          </button>
        </div>
      )}
      {menu && (
        <aside className="presentation-menu" aria-label="Содержание">
          <div className="menu-heading">
            СОДЕРЖАНИЕ
            <button
              aria-label="Закрыть меню"
              onClick={() => {
                setMenu(false);
                menuButton.current?.focus();
              }}
            >
              ×
            </button>
          </div>
          {slides.map((s, i) => (
            <button
              key={s}
              disabled={state.locked}
              aria-current={i === state.slide ? "page" : undefined}
              onClick={() => go(i, true)}
            >
              <span>0{i + 1}</span>
              {s}
            </button>
          ))}
          <div className="menu-tools">
            <button
              onClick={() => {
                setMenu(false);
                setSourceOpen(true);
              }}
            >
              Источники и материалы
            </button>
            <button onClick={() => void fullscreen()}>
              Полный экран <kbd>F</kbd>
            </button>
            <button
              disabled={state.locked}
              onClick={() => {
                setMenu(false);
                replay();
              }}
            >
              Повторить сцену <kbd>R</kbd>
            </button>
            <label>
              <input
                type="checkbox"
                checked={low}
                onChange={(e) => setLow(e.target.checked)}
              />{" "}
              Упрощённые переходы
            </label>
          </div>
          <p className="help">
            ← → / Пробел — навигация
            <br />R — повтор · F — полный экран
          </p>
        </aside>
      )}
      <dialog
        ref={dialog}
        className="sources-dialog"
        onCancel={() => setSourceOpen(false)}
        onClose={() => {
          setSourceOpen(false);
          menuButton.current?.focus();
        }}
      >
        <header>
          <h2>Источники и материалы</h2>
          <button
            autoFocus
            aria-label="Закрыть источники"
            onClick={() => setSourceOpen(false)}
          >
            ×
          </button>
        </header>
        <p>
          Художественные фоны предоставлены автором презентации. Музейные
          фотографии и научные иллюстрации отделены от реконструкций.
        </p>
        {Object.entries(sources).map(([key, s]) => (
          <article key={key}>
            <h3>{s.title}</h3>
            <p>{s.author}</p>
            <a href={s.url} target="_blank" rel="noreferrer">
              Открыть первоисточник ↗
            </a>
            <span className="license">
              {s.license.startsWith("CC") ? (
                <a
                  href={
                    s.license === "CC0"
                      ? "https://creativecommons.org/publicdomain/zero/1.0/"
                      : s.license.includes("SA")
                        ? "https://creativecommons.org/licenses/by-sa/4.0/"
                        : "https://creativecommons.org/licenses/by/4.0/"
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {s.license}
                </a>
              ) : (
                s.license
              )}
            </span>
            {s.note && <p>{s.note}</p>}
          </article>
        ))}
        <article>
          <h3>Карта и обработка изображений</h3>
          <p>
            Natural Earth, public domain. Схематичная карта современной
            географии; линия обозначает последовательность презентации, а не
            доказанный маршрут миграции. Фотографии уменьшены и переведены в
            WebP без обрезки. Научные рисунки извлечены из PDF с сохранением
            всех объектов.
          </p>
          <a
            href="https://www.naturalearthdata.com/about/terms-of-use/"
            target="_blank"
            rel="noreferrer"
          >
            Natural Earth · условия использования ↗
          </a>
        </article>
        <article>
          <h3>Сунгирь: бусины и хронология</h3>
          <p>
            3500+ относится к погребению взрослого мужчины; справа показана
            музейная модель другого, двойного погребения. Даты в сценах
            округлены согласно ТЗ.
          </p>
          <a
            href="https://old.bigenc.ru/archeology/text/4173507"
            target="_blank"
            rel="noreferrer"
          >
            Большая российская энциклопедия · Сунгирь ↗
          </a>
        </article>
      </dialog>
    </main>
  );
}
