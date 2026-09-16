import { gsap } from "gsap";
import { locations } from "../data/locations";

export const config = { lowMotion: false };
const query = (el: Element, selector: string) =>
  Array.from(el.querySelectorAll<HTMLElement>(selector));
export const photoPose = (_index: number) => ({ x: 0, y: 0, scale: 1 });

// Each node belongs to exactly one reveal step. No generic + special-case tweens.
function steps(el: HTMLElement, index: number): HTMLElement[] {
  const selectors: Record<number, string[]> = {
    0: [
      "#opening-year",
      ".hero-copy h1",
      ".hero-sub",
      ".reconstruction",
      ".hero-source",
    ],
    1: [
      ".map-copy h1",
      ".map-copy p",
      ".location-kermek",
      ".location-denisova",
      ".location-kostenki",
      ".location-sungir",
      ".time-item",
    ],
    2: [
      ".site-copy .region",
      ".site-copy h1",
      ".date",
      ".thesis",
      ".detail",
      ".kermek-card",
      ".reconstruction",
    ],
    3: [
      ".site-copy h1",
      ".region",
      ".date",
      ".layer-thesis",
      ".museum-column",
      ".museum-column .archival",
      ".reconstruction",
    ],
    4: [
      ".site-copy h1",
      ".region",
      ".date",
      ".period",
      ".thesis",
      ".kostenki-cards .archival",
      ".chronology-note",
      ".reconstruction",
    ],
    5: [
      ".site-copy h1",
      ".region",
      ".date",
      ".beads",
      ".burial-card",
      ".artifact-strip .archival",
      ".sungir-thesis",
      ".reconstruction",
    ],
    6: [
      ".location-sungir",
      ".location-kostenki",
      ".location-denisova",
      ".location-kermek",
      ".final-copy h1",
      ".final-thesis",
      ".sites-list",
      ".final-summary",
      ".callback",
    ],
  };
  if (index !== 1 && index !== 6) selectors[index].unshift(".shade");
  return [
    ...new Set(selectors[index].flatMap((selector) => query(el, selector))),
  ];
}
function overlays(el: HTMLElement) {
  const elements = query(
    el,
    ".shade,.hero-copy,#opening-year,.site-copy,.archival,.museum-column,.reconstruction,.hero-source,.layer-thesis,.chronology-note,.map-copy,.timeline,.final-copy,.callback",
  );
  return elements.filter(
    (node) =>
      !elements.some((parent) => parent !== node && parent.contains(node)),
  );
}
export function resetScene(el: HTMLElement, index: number) {
  const nodes = [...new Set([...steps(el, index), ...overlays(el)])];
  gsap.set(nodes, { clearProps: "transform,opacity,visibility,willChange" });
  gsap.set(el, { autoAlpha: 1 });
  const bg = el.querySelector(".scene-bg");
  if (bg)
    gsap.set(bg, { ...photoPose(index), transformOrigin: "0 0", opacity: 1 });
}
function prepare(el: HTMLElement, index: number) {
  resetScene(el, index);
  gsap.set(steps(el, index), { opacity: 0, y: 10 });
  steps(el, index).forEach((node) => {
    node.dataset.revealCount = "0";
  });
}
function appendReveal(
  tl: gsap.core.Timeline,
  el: HTMLElement,
  index: number,
  reduced: boolean,
  mapReady = false,
) {
  const nodes = steps(el, index).filter(
    (node) => !mapReady || !node.classList.contains("map-location"),
  );
  if (reduced) {
    tl.set(nodes, { opacity: 1, y: 0 });
    return;
  }
  for (const node of nodes) {
    tl.to(node, {
      opacity: 1,
      y: 0,
      duration: node.classList.contains("archival") ? 0.28 : 0.23,
      ease: "power1.out",
      onStart: () => {
        node.dataset.revealCount = String(Number(node.dataset.revealCount) + 1);
      },
    });
  }
}
export function reveal(
  el: HTMLElement,
  index: number,
  reduced: boolean,
  done: () => void,
) {
  prepare(el, index);
  const tl = gsap.timeline({ onComplete: done });
  if (!reduced && index === 0) {
    gsap.set(el.querySelector(".scene-bg"), { opacity: 0 });
    tl.to(el.querySelector(".scene-bg"), { opacity: 1, duration: 0.6 });
  }
  appendReveal(tl, el, index, reduced);
  // Keep completion asynchronous even in reduced motion.
  tl.to({}, { duration: reduced ? 0.01 : 0.04 });
  return tl;
}

function pointInStage(marker: Element, stage: HTMLElement) {
  const m = marker.getBoundingClientRect(),
    s = stage.getBoundingClientRect();
  const scale = s.width / 1920;
  return {
    x: (m.x + m.width / 2 - s.x) / scale,
    y: (m.y + m.height / 2 - s.y) / scale,
    diameter: m.width / scale,
  };
}

export function transition(
  from: HTMLElement, to: HTMLElement, index: number, target: number,
  stage: HTMLElement, reduced: boolean, done: () => void,
  onReveal: () => void = () => {}, immediate = false,
) {
  prepare(to, target);
  gsap.set(to, {autoAlpha:0,zIndex:2});
  gsap.set(from,{zIndex:3});
  const travel=stage.querySelector<HTMLElement>(".travel-layer")!;
  const camera=travel.querySelector<HTMLElement>(".travel-camera")!;
  const aperture=travel.querySelector<HTMLElement>(".travel-aperture")!;
  const photo=travel.querySelector<HTMLElement>(".aperture-content")!;
  const source=locations.find(place=>place.slide===index);
  const destination=locations.find(place=>place.slide===target);
  const zoom=4.6, fullRadius=Math.hypot(960,540)+3;
  const iris={radius:fullRadius};
  // Scale a fixed circular clip, counter-scale its contents. The photo itself stays
  // exactly 1920×1080 at (0,0); only the aperture grows. No animated clip-path paint.
  const drawIris=()=>{
    const scale=iris.radius/960;
    aperture.style.transform=`scale3d(${scale},${scale},1)`;
    photo.style.transform=`scale3d(${1/scale},${1/scale},1)`;
  };
  const phase=(name:string)=>{stage.dataset.travelPhase=name;};
  const cleanup=()=>{
    gsap.set(travel,{autoAlpha:0});
    gsap.set([camera,aperture,photo],{clearProps:"transform,opacity,willChange"});
    phase("hold");
  };
  const tl=gsap.timeline({onComplete:()=>{cleanup();done();},onInterrupt:cleanup});
  if(reduced||immediate||index===target){
    if(immediate)resetScene(to,target);
    tl.to(from,{opacity:0,duration:.18}).set(from,{visibility:"hidden"})
      .to(to,{autoAlpha:1,duration:.18}).call(onReveal);
    if(!immediate)appendReveal(tl,to,target,reduced);
    tl.to({},{duration:.01});return tl;
  }
  gsap.set(travel,{autoAlpha:0,zIndex:10});
  gsap.set(camera,{x:0,y:0,scale:1,transformOrigin:"0 0",willChange:"transform",force3D:true});
  gsap.set(aperture,{opacity:0,transformOrigin:"50% 50%",willChange:"transform,opacity",force3D:true});
  gsap.set(photo,{transformOrigin:"50% 50%",willChange:"transform",force3D:true});
  drawIris();
  const images=query(photo,"img");gsap.set(images,{opacity:0});
  const usePhoto=(id:string)=>{gsap.set(images,{opacity:0});gsap.set(photo.querySelector(`[data-place="${id}"]`),{opacity:1});stage.dataset.travelPlace=id;};
  // Read every canonical point before applying any camera transform.
  const points=new Map(locations.map(place=>[place.id,pointInStage(travel.querySelector(`#marker-${place.id}-travel`)!,stage)]));
  phase("exit-content");
  tl.to(overlays(from),{opacity:0,duration:.28,ease:"power1.out"});
  if(source){
    const p=points.get(source.id)!;
    usePhoto(source.id);
    gsap.set(camera,{transformOrigin:`${p.x}px ${p.y}px`,x:960-p.x,y:540-p.y,scale:zoom});
    gsap.set(aperture,{opacity:1});
    tl.set(travel,{autoAlpha:1}).set(from,{autoAlpha:0})
      .call(()=>phase("close-aperture"))
      .to(iris,{radius:p.diameter/2*zoom,duration:.75,ease:"power2.inOut",onUpdate:drawIris})
      .to(aperture,{opacity:0,duration:.18})
      .call(()=>phase("out-to-map"))
      .to(camera,{x:0,y:0,scale:1,duration:.9,ease:"power2.inOut"});
  }else if(index===1){
    tl.set(travel,{autoAlpha:1}).set(from,{autoAlpha:0});
  }else{
    tl.to(from,{opacity:0,duration:.25}).set(from,{visibility:"hidden"}).to(travel,{autoAlpha:1,duration:.2});
  }
  tl.call(()=>phase("map")).to({},{duration:.12});
  if(destination){
    const p=points.get(destination.id)!;
    tl.call(()=>{usePhoto(destination.id);phase("camera-in");})
      .set(camera,{x:0,y:0,scale:1,transformOrigin:`${p.x}px ${p.y}px`})
      .to(camera,{x:960-p.x,y:540-p.y,scale:zoom,duration:.95,ease:"power2.inOut"})
      .call(()=>{iris.radius=p.diameter/2*zoom;drawIris();phase("open-aperture");})
      .to(aperture,{opacity:1,duration:.18})
      .to(iris,{radius:fullRadius,duration:.85,ease:"power2.inOut",onUpdate:drawIris})
      .call(()=>phase("photo-fullscreen"));
  }
  if(!destination)tl.set(query(to,".map-location"),{opacity:1,y:0});
  tl.set(to,{autoAlpha:1});
  if(target===6)tl.to(travel,{autoAlpha:0,duration:.35});
  else tl.set(travel,{autoAlpha:0});
  tl.call(()=>{phase("reveal");onReveal();});
  appendReveal(tl,to,target,false,!destination);
  tl.to({},{duration:.04});
  return tl;
}
