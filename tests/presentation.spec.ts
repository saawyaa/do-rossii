import { test, expect } from "@playwright/test";
const hold = async (page: any) =>
  await expect(page.locator("main")).toHaveAttribute("data-phase", "hold", {
    timeout: 14000,
  });
test("seven scenes, all assets, navigation lock, backward journey, replay, photo route, ending and restart", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#1");
  await hold(page);
  await expect(page.locator("section.slide")).toHaveCount(7);
  await page.screenshot({ path: "qa/01-desktop.png" });
  for (let i = 2; i <= 7; i++) {
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");
    await hold(page);
    await expect(page.locator("main")).toHaveAttribute("data-slide", String(i));
    await page.screenshot({ path: `qa/0${i}-desktop.png` });
  }
  await expect(page.locator(".burial-morph")).toHaveCount(0);
  const broken = await page
    .locator("img")
    .evaluateAll((imgs) =>
      imgs
        .filter(
          (i) =>
            !(i as HTMLImageElement).complete ||
            !(i as HTMLImageElement).naturalWidth,
        )
        .map((i) => (i as HTMLImageElement).src),
    );
  expect(broken).toEqual([]);
  await page.keyboard.press("ArrowLeft");
  await hold(page);
  await expect(page.locator("main")).toHaveAttribute("data-slide", "6");
  await page.keyboard.press("r");
  await expect(page.locator("main")).toHaveAttribute("data-locked", "true");
  await hold(page);
  await page.keyboard.press("ArrowRight");
  await hold(page);
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: "↻ С начала" })).toBeVisible();
  await page.getByRole("button", { name: "↻ С начала" }).click();
  await hold(page);
  await expect(page.locator("main")).toHaveAttribute("data-slide", "1");
  expect(errors).toEqual([]);
});
test("direct URLs, reduced motion, menu, sources focus, no scroll and landscape/portrait scaling", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (let i = 1; i <= 7; i++) {
    await page.goto("/#" + i);
    await hold(page);
    await expect(page.locator("main")).toHaveAttribute("data-slide", String(i));
  }
  await page.getByRole("button", { name: "Меню презентации" }).click();
  await page.getByRole("button", { name: /03.*Кермек/ }).click();
  await hold(page);
  await expect(page).toHaveURL(/#3$/);
  await page.getByRole("button", { name: "Меню презентации" }).click();
  await page.getByRole("button", { name: "Источники и материалы" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("main")).toHaveAttribute("data-slide", "3");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  for (const v of [
    { width: 1280, height: 720 },
    { width: 844, height: 390 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(v);
    await page.screenshot({ path: `qa/responsive-${v.width}.png` });
    const dim = await page.evaluate(() => ({
      w: document.documentElement.scrollWidth,
      h: document.documentElement.scrollHeight,
      iw: innerWidth,
      ih: innerHeight,
    }));
    expect(dim.w).toBe(dim.iw);
    expect(dim.h).toBe(dim.ih);
  }
});
test("focused controls keep arrow shortcuts, artifact enlargement, swipe, wheel and missing-image fallback", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#2");
  await hold(page);
  await page.getByRole("button", { name: "Следующая сцена" }).click();
  await hold(page);
  await page.keyboard.press("ArrowRight");
  await hold(page);
  await expect(page.locator("main")).toHaveAttribute("data-slide", "4");
  await page
    .getByRole("button", { name: "Увеличить: Научный профиль Южной камеры" })
    .click();
  await expect(page.locator("dialog[open]")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("main")).toHaveAttribute("data-slide", "4");
  await page.keyboard.press("Escape");
  await page.mouse.wheel(0, 900);
  await expect(page.locator("main")).toHaveAttribute("data-slide", "4");
  await page.locator(".stage").evaluate((el) => {
    const a = new Touch({
      identifier: 1,
      target: el,
      clientX: 1000,
      clientY: 500,
    });
    const b = new Touch({
      identifier: 1,
      target: el,
      clientX: 800,
      clientY: 505,
    });
    el.dispatchEvent(
      new TouchEvent("touchstart", { bubbles: true, touches: [a] }),
    );
    el.dispatchEvent(
      new TouchEvent("touchend", { bubbles: true, changedTouches: [b] }),
    );
  });
  await hold(page);
  await expect(page.locator("main")).toHaveAttribute("data-slide", "5");
  await page.route("**/kermek-tools.webp", (route) => route.abort());
  await page.goto("/#3");
  await page.reload();
  await hold(page);
  await expect(page.locator(".slide-3 .image-fallback")).toBeVisible();
});
