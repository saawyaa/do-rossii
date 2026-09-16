import { test, expect } from "@playwright/test";
const hold = async (page: any) =>
  expect(page.locator("main")).toHaveAttribute("data-phase", "hold", {
    timeout: 15000,
  });
test("forward and reverse routes use the correct photos and a map between sites", async ({
  page,
}) => {
  await page.goto("/#3");
  await hold(page);
  await page.evaluate(() => {
    (window as any).phases = [];
    new MutationObserver(() => {
      const el = document.querySelector(".stage")!;
      const phase = el.getAttribute("data-travel-phase");
      const place = el.getAttribute("data-travel-place");
      const events = (window as any).phases;
      const value = `${phase}:${place}`;
      if (events.at(-1) !== value) events.push(value);
    }).observe(document.querySelector(".stage")!, {
      attributes: true,
      attributeFilter: ["data-travel-phase", "data-travel-place"],
    });
  });
  for (const [key, from, to, n] of [
    ["ArrowRight", "kermek", "denisova", 4],
    ["ArrowRight", "denisova", "kostenki", 5],
    ["ArrowRight", "kostenki", "sungir", 6],
    ["ArrowLeft", "sungir", "kostenki", 5],
    ["ArrowLeft", "kostenki", "denisova", 4],
    ["ArrowLeft", "denisova", "kermek", 3],
  ] as const) {
    await page.evaluate(() => {
      (window as any).phases = [];
    });
    await page.keyboard.press(key);
    await hold(page);
    await expect(page.locator("main")).toHaveAttribute("data-slide", String(n));
    const events = await page.evaluate(
      () => (window as any).phases as string[],
    );
    expect(events).toContain(`out-to-map:${from}`);
    expect(events).toContain(`map:${from}`);
    expect(events).toContain(`camera-in:${to}`);
    expect(events).toContain(`open-aperture:${to}`);
    expect(events.indexOf(`map:${from}`)).toBeLessThan(
      events.indexOf(`camera-in:${to}`),
    );
    const counts = await page
      .locator(`.slide-${n} [data-reveal-count]`)
      .evaluateAll((nodes) =>
        nodes.map((n) => Number((n as HTMLElement).dataset.revealCount)),
      );
    expect(counts.length).toBeGreaterThan(5);
    expect(counts.every((c) => c === 1)).toBeTruthy();
  }
});
test("reveals are sequential and monotonic; backgrounds fill the entire stage", async ({
  page,
}) => {
  await page.goto("/#6");
  await hold(page);
  await page.evaluate(() => {
    const nodes = Array.from(
      document.querySelectorAll(".slide-6 [data-reveal-count]"),
    );
    const last = new Map<Element, number>();
    (window as any).motion = { maxConcurrent: 0, regressions: 0, frames: [] };
    let lastTime = performance.now();
    const sample = (now: number) => {
      const stats = (window as any).motion;
      stats.frames.push(now - lastTime);
      lastTime = now;
      const phase = document.querySelector("main")?.getAttribute("data-phase");
      if (phase === "reveal") {
        let moving = 0;
        for (const el of nodes) {
          const o = Number(getComputedStyle(el).opacity);
          if (o > 0.015 && o < 0.985) moving++;
          if (last.has(el) && o < last.get(el)! - 0.04) stats.regressions++;
          last.set(el, o);
        }
        stats.maxConcurrent = Math.max(stats.maxConcurrent, moving);
      } else last.clear();
      if (!(window as any).stopSampling) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await page.keyboard.press("r");
  await hold(page);
  const stats = await page.evaluate(() => {
    (window as any).stopSampling = true;
    return (window as any).motion;
  });
  expect(stats.maxConcurrent).toBe(1);
  expect(stats.regressions).toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1920, 1280])
    for (const slide of [3, 5]) {
      await page.setViewportSize({ width, height: (width * 9) / 16 });
      await page.goto("/#" + slide);
      await hold(page);
      const bounds = await page.locator(`.slide-${slide}`).evaluate((el) => {
        const p = el.querySelector(".scene-bg")!.getBoundingClientRect();
        const stage = el.getBoundingClientRect();
        return [p.x-stage.x, p.y-stage.y, p.width-stage.width, p.height-stage.height];
      });
      expect(Math.max(...bounds.map(Math.abs))).toBeLessThan(1);
    }
});

test("camera approaches the point before the aperture opens over a stationary photo", async ({page}) => {
  await page.goto('/#3'); await hold(page);
  await page.evaluate(() => {
    (window as any).cameraSamples=[];
    function sample(){
      const stage=document.querySelector('.stage') as HTMLElement;
      const phase=stage.dataset.travelPhase;
      if(['camera-in','open-aperture','close-aperture'].includes(phase || '')){
        const s=stage.getBoundingClientRect();
        const scale=s.width/1920;
        const photo=stage.querySelector('.aperture-content')!.getBoundingClientRect();
        const aperture=stage.querySelector('.travel-aperture')!;
        const marker=stage.querySelector(`#marker-${stage.dataset.travelPlace}-travel`)!.getBoundingClientRect();
        const camera=stage.querySelector('.travel-camera')!;
        (window as any).cameraSamples.push({phase,
          photoError:Math.max(Math.abs(photo.x-s.x),Math.abs(photo.y-s.y),Math.abs(photo.width-s.width),Math.abs(photo.height-s.height))/scale,
          markerError:Math.hypot(marker.x+marker.width/2-s.x-s.width/2,marker.y+marker.height/2-s.y-s.height/2)/scale,
          cameraScale:new DOMMatrix(getComputedStyle(camera).transform).a,
          opacity:Number(getComputedStyle(aperture).opacity),
          radius:aperture.getBoundingClientRect().width/scale/2,
        });
      }
      if(!(window as any).stopCamera)requestAnimationFrame(sample);
    }requestAnimationFrame(sample);
  });
  await page.keyboard.press('ArrowRight'); await hold(page);
  await page.keyboard.press('ArrowLeft'); await hold(page);
  const samples=await page.evaluate(()=>{(window as any).stopCamera=true;return (window as any).cameraSamples;});
  const incoming=samples.filter((s:any)=>s.phase==='camera-in');
  const opening=samples.filter((s:any)=>s.phase==='open-aperture');
  const closing=samples.filter((s:any)=>s.phase==='close-aperture');
  expect(incoming.length).toBeGreaterThan(20);
  expect(Math.max(...incoming.map((s:any)=>s.opacity))).toBe(0);
  expect(Math.min(...incoming.map((s:any)=>s.cameraScale))).toBeLessThan(1.2);
  expect(Math.max(...incoming.map((s:any)=>s.cameraScale))).toBeGreaterThan(4.4);
  for(const frames of [opening,closing]){
    expect(frames.length).toBeGreaterThan(20);
    expect(Math.max(...frames.map((s:any)=>s.photoError))).toBeLessThan(1);
    expect(Math.max(...frames.map((s:any)=>s.markerError))).toBeLessThan(3);
    expect(Math.min(...frames.map((s:any)=>s.radius))).toBeLessThan(150);
    expect(Math.max(...frames.map((s:any)=>s.radius))).toBeGreaterThan(1090);
  }
});
