import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { sources } from "../data/sources";
export function ArchivalCard({
  sourceKey,
  className = "",
  id,
}: {
  sourceKey: string;
  className?: string;
  id?: string;
}) {
  const s = sources[sourceKey];
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <figure className={`archival reveal ${className}`} id={id}>
        <div className="archival-image">
          {failed ? (
            <p className="image-fallback">
              Материал источника временно недоступен
            </p>
          ) : (
            <button
              className="archival-image-button"
              aria-label={`Увеличить: ${s.title}`}
              onClick={() => {
                if (
                  document
                    .querySelector("main")
                    ?.getAttribute("data-locked") === "false"
                )
                  dialog.current?.showModal();
              }}
            >
              <img
                src={`/assets/${s.image}`}
                alt={s.title}
                onError={() => setFailed(true)}
                draggable={false}
              />
            </button>
          )}
        </div>
        <figcaption>
          <span className="card-label">
            {s.label || "АРХЕОЛОГИЧЕСКИЙ МАТЕРИАЛ"}
          </span>
          <h3>{s.title}</h3>
          <a className="credit" href={s.url} target="_blank" rel="noreferrer">
            {s.author} · {s.license}
          </a>
        </figcaption>
      </figure>
      {createPortal(
        <dialog className="image-dialog" ref={dialog}>
          <header>
            <h2>{s.title}</h2>
            <button
              aria-label="Закрыть изображение"
              onClick={() => dialog.current?.close()}
            >
              ×
            </button>
          </header>
          <img src={`/assets/${s.image}`} alt={s.title} />
          <footer>
            <a href={s.url} target="_blank" rel="noreferrer">
              {s.author}
            </a>{" "}
            · {s.license}
          </footer>
        </dialog>,
        document.body,
      )}
    </>
  );
}
