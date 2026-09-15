import { gsap } from "gsap";
export const config = {
  lowMotion: false,
  transitionDurations: [1.1, 1.15, 1.05, 1.1, 1.1, 1.15],
};
const q = (el: HTMLElement, selector: string) => el.querySelectorAll(selector);
const placeImages = [
  "",
  "kermek.webp",
  "denisova.webp",
  "kostenki.webp",
  "sungir.webp",
];
const getMapFocus = (el: HTMLElement, placeId?: string) => {
  if (!placeId) return { x: 50, y: 50 };
  const marker = el.querySelector(`#marker-${placeId}`) as SVGCircleElement | null;
  if (!marker) {
    return { x: 50, y: 50 };
  }
  const svg = marker.ownerSVGElement;
  if (!svg) return { x: 50, y: 50 };
  const rect = svg.getBoundingClientRect();
  const cx = marker.cx.baseVal.value;
  const cy = marker.cy.baseVal.value;
  const x = ((cx / rect.width) * 100) || 50;
  const y = ((cy / rect.height) * 100) || 50;
  return { x, y };
};
export function resetScene(el: HTMLElement, index: number) {
  gsap.set([el, ...q(el, "*")], {
    clearProps: "transform,opacity,visibility,filter,clipPath,willChange",
  });
  gsap.set(el, { autoAlpha: 1 });
  if (index === 3)
    gsap.set(q(el, ".scene-bg"), { scale: 1.18, y: -130, x: -30 });
}
export function reveal(
  el: HTMLElement,
  index: number,
  reduced: boolean,
  done: () => void,
) {
  resetScene(el, index);
  const tl = gsap.timeline({ onComplete: done });
  if (reduced) {
    tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.18 });
    return tl;
  }
  const texts = q(el, ".reveal");
  if (index === 0) {
    gsap.set(texts, { opacity: 0, y: 18 });
    gsap.set(q(el, ".scene-bg"), { opacity: 0, scale: 1.08 });
    tl.fromTo(
      q(el, "#opening-year"),
      { opacity: 0, x: 280, y: -24, scale: 1.8 },
      { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.7, ease: "power2.out" },
      0.15,
    )
      .to(q(el, ".scene-bg"), { opacity: 1, scale: 1, duration: 0.8, ease: "power2.inOut" }, 0.3)
      .fromTo(texts, { y: 18 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.12, ease: "power2.out" }, 0.42);
  } else if (index === 3) {
    tl.fromTo(
      texts,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" },
      0,
    )
      .fromTo(
        q(el, ".scene-bg"),
        { scale: 1.08, y: 50, x: -12 },
        { scale: 1.18, y: -130, x: -30, duration: 0.9, ease: "power2.inOut" },
        0.12,
      )
      .fromTo(
        q(el, ".layer-thesis"),
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        0.36,
      )
      .fromTo(
        q(el, ".museum-column .archival"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, stagger: 0.14, duration: 0.38 },
        0.52,
      );
  } else if (index === 5) {
    tl.fromTo(
      texts,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: "power2.out" },
      0,
    )
      .fromTo(q(el, ".beads"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.18)
      .fromTo(q(el, ".burial-card"), { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.28)
      .fromTo(
        q(el, ".artifact-strip .archival"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.36, stagger: 0.12 },
        0.38,
      )
      .fromTo(q(el, ".sungir-thesis"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 }, 0.48);
  } else if (index === 6) {
    const markers = ["kostenki", "denisova", "kermek"].map((k) =>
      el.querySelector(".location-" + k),
    );
    tl.fromTo(
      markers,
      { opacity: 0.15 },
      { opacity: 1, duration: 0.28, stagger: 0.12 },
      0,
    ).fromTo(
      texts,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.42, stagger: 0.14, ease: "power2.out" },
      0.18,
    );
  } else {
    tl.fromTo(
      texts,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.12, ease: "power2.out" },
      0.08,
    );
    if (index === 1)
      tl.fromTo(q(el, ".map-location"), { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.12 }, 0.2);
    if (index === 2 || index === 4) {
      tl.fromTo(
        q(el, ".scene-bg"),
        { scale: 1.08 },
        { scale: 1, duration: 0.5 },
        0,
      ).fromTo(
        q(el, ".archival"),
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.38, stagger: 0.12 },
        0.2,
      );
    }
  }
  return tl;
}
export function transition(
  from: HTMLElement,
  to: HTMLElement,
  index: number,
  target: number,
  stage: HTMLElement,
  reduced: boolean,
  done: () => void,
) {
  resetScene(to, target);
  gsap.set(to, { autoAlpha: 0, zIndex: 2 });
  gsap.set(from, { zIndex: 3 });
  const cleanup = () => {
    gsap.set(from, { autoAlpha: 0 });
    gsap.set([from, to, ...q(from, "*"), ...q(to, "*")], {
      willChange: "auto",
    });
    done();
  };
  const tl = gsap.timeline({ onComplete: cleanup, defaults: { ease: "power2.out" } });
  if (reduced || Math.abs(target - index) !== 1) {
    tl.to(from, { opacity: 0, duration: 0.18 }, 0).to(to, { autoAlpha: 1, duration: 0.2 }, 0);
    return tl;
  }
  gsap.set(q(from, ".scene-bg,.map-world"), {
    willChange: "transform,opacity",
  });
  const sourceIndex = index >= 1 && index <= 4 ? index : 0;
  const targetIndex = target >= 1 && target <= 4 ? target : 0;
  const placeFor = (i: number) => (i >= 1 && i <= 4 ? placeImages[i] : null);
  const makeBloom = (image: string | null, focus: { x: number; y: number }) => {
    if (!image) return null;
    const bloom = document.createElement("div");
    bloom.className = "map-photo-bloom";
    bloom.style.backgroundImage = `url(/assets/${image})`;
    bloom.style.setProperty("--focus-x", `${focus.x}%`);
    bloom.style.setProperty("--focus-y", `${focus.y}%`);
    bloom.style.clipPath = `circle(0% at ${focus.x}% ${focus.y}%)`;
    stage.appendChild(bloom);
    return bloom;
  };
  const sourceId = sourceIndex > 0 ? ["kermek", "denisova", "kostenki", "sungir"][sourceIndex - 1] : undefined;
  const targetId = targetIndex > 0 ? ["kermek", "denisova", "kostenki", "sungir"][targetIndex - 1] : undefined;
  const sourceFocus = getMapFocus(from, sourceId);
  const targetFocus = getMapFocus(to, targetId);
  const sourceBloom = makeBloom(placeFor(sourceIndex), sourceFocus);
  const targetBloom = makeBloom(placeFor(targetIndex), targetFocus);
  tl.to(from.querySelectorAll(".reveal"), { opacity: 0, duration: 0.12 }, 0);
  if (sourceBloom) {
    tl.set(sourceBloom, { opacity: 1 }, 0)
      .to(
        sourceBloom,
        {
          clipPath: `circle(130% at ${sourceFocus.x}% ${sourceFocus.y}%)`,
          scale: 1.12,
          opacity: 1,
          duration: 0.36,
          ease: "power2.inOut",
        },
        0.04,
      )
      .to(sourceBloom, { opacity: 0, duration: 0.16, ease: "power2.out" }, 0.35);
  }
  if (targetBloom) {
    tl.set(targetBloom, { opacity: 0, scale: 0.94, clipPath: `circle(0% at ${targetFocus.x}% ${targetFocus.y}%)` }, 0.18)
      .to(targetBloom, { opacity: 1, duration: 0.18 }, 0.2)
      .to(
        targetBloom,
        {
          clipPath: `circle(145% at ${targetFocus.x}% ${targetFocus.y}%)`,
          scale: 1.12,
          duration: 0.42,
          ease: "power2.inOut",
        },
        0.22,
      );
  }
  tl.to(to, { autoAlpha: 1, duration: 0.18 }, 0.5).call(() => {
    sourceBloom?.remove();
    targetBloom?.remove();
  });
  return tl;
}
