// Local-only regression checks for the personal homepage; no publishing.
const { chromium } = require("@playwright/test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const base = process.env.SITE_TEST_URL || "http://127.0.0.1:4011/";
assert(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Use a local preview.");
// Optional deterministic local-asset run when third-party font/CDN requests are unavailable.
const localAssetsOnly = async (page) => {
  if (process.env.SITE_TEST_OFFLINE !== "1") return;
  await page.route(/^https?:/, (route) => (new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort()));
};

const contrast = (foreground, background) => {
  const luminance = (rgb) => {
    const channels = rgb
      .match(/[\d.]+/g)
      .slice(0, 3)
      .map(Number)
      .map((n) => {
        const c = n / 255;
        return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
      });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};

(async () => {
  const output = await fs.mkdtemp(path.join(os.tmpdir(), "site-optimization-"));
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  try {
    for (const width of [1100, 541, 540, 520, 500, 481, 480, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 844 }, colorScheme: "light" });
      await localAssetsOnly(page);
      const requests = [];
      const errors = [];
      page.on("request", (request) => requests.push(request.url()));
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(base);
      await page.evaluate(() => document.fonts.ready);
      const photos = page.locator(".portrait-panel img");
      assert.equal(await photos.count(), Number(await page.locator(".portrait-toggle").getAttribute("max")) + 1);
      assert.equal(await page.locator(".portrait-panel img[src]").count(), 1);
      assert(!requests.some((url) => /prof_pic\.jpg|prof_pic_gpt_image|mathjax|medium-zoom|academicons|scholar-icons/.test(url)));
      const layout = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        socialRows: [...new Set([...document.querySelectorAll(".intro-links a")].map((el) => el.getBoundingClientRect().top))].length,
        imageWidth: document.querySelector(".portrait-panel img").getBoundingClientRect().width,
        dateRows: [...document.querySelectorAll(".experience-entry-header")].every(
          (row) => row.querySelector(".experience-meta").getBoundingClientRect().top >= row.querySelector("h3").getBoundingClientRect().bottom
        ),
        secondary: getComputedStyle(document.querySelector(".experience-meta")).color,
        background: getComputedStyle(document.body).backgroundColor,
        download: document.querySelector("[data-about-export]").getBoundingClientRect().toJSON(),
      }));
      assert(!layout.overflow, `horizontal overflow at ${width}px`);
      assert.equal(layout.socialRows, 1, `social icons must stay on one row at ${width}px`);
      assert(contrast(layout.secondary, layout.background) >= 4.5);
      assert(layout.download.height >= 32 && layout.download.width < 65);
      if (width <= 480) {
        assert(layout.dateRows, "mobile dates must be below the institution");
        assert(layout.imageWidth > 80, "mobile portrait should fill more of the card");
      }
      await page.screenshot({ path: path.join(output, `about-${width}.png`), fullPage: true });
      const toggle = page.locator(".portrait-toggle");
      await toggle.press("End");
      await page.locator('.portrait-panel[data-label="GPT Image"] img').evaluate((img) => img.decode());
      assert((await page.locator(".portrait-expand").getAttribute("href")).endsWith("/prof_pic_gpt_image.png"));
      assert((await photos.nth(2).getAttribute("src")).endsWith("-preview.jpg"));
      assert.equal(await toggle.getAttribute("aria-valuetext"), "GPT Image");
      await toggle.press("Home");
      assert.equal(await toggle.getAttribute("aria-valuetext"), "GPT-6 Astra Light");
      await toggle.press("ArrowRight");
      assert.equal(await toggle.getAttribute("aria-valuetext"), "Natural");

      // Pointer drag exposes neighboring panels only while the pointer is held.
      const slider = await toggle.boundingBox();
      await page.mouse.move(slider.x + slider.width / 2, slider.y + slider.height / 2);
      await page.mouse.down();
      await page.mouse.move(slider.x + slider.width * 0.65, slider.y + slider.height / 2, { steps: 5 });
      assert(await page.locator(".portrait-frame").evaluate((el) => el.classList.contains("is-dragging")));
      await page.mouse.up();
      assert(!(await page.locator(".portrait-frame").evaluate((el) => el.classList.contains("is-dragging"))));
      assert(await page.locator('.portrait-panel[aria-hidden="true"]').evaluateAll((panels) => panels.every((panel) => panel.style.opacity === "0")));

      const bib = page.locator("[data-bib-toggle]").first();
      const panel = page.locator("#" + (await bib.getAttribute("aria-controls")));
      assert(await panel.evaluate((el) => el.hidden && el.inert && el.getAttribute("aria-hidden") === "true"));
      await bib.focus();
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "HTML");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "PDF");
      await page.keyboard.press("Tab");
      assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), "Bib");
      await bib.click();
      assert.equal(await bib.getAttribute("aria-expanded"), "true");
      assert(await panel.isVisible());
      assert(await panel.evaluate((el) => !el.hidden && !el.inert));
      await panel.locator("pre").focus();
      await page.keyboard.press("Escape");
      assert.equal(await bib.getAttribute("aria-expanded"), "false");
      assert(await bib.evaluate((el) => el === document.activeElement));
      await page.keyboard.press("Space");
      assert.equal(await bib.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Space");
      assert.equal(await bib.getAttribute("aria-expanded"), "false");
      assert.deepEqual(errors, []);
      await page.close();
      console.log(`PASS homepage layout and interactions at ${width}px`);
    }

    const staticPage = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 1100, height: 844 } });
    await localAssetsOnly(staticPage);
    await staticPage.goto(base);
    assert(await staticPage.locator(".profile-header [data-portrait-card]").isVisible());
    assert(await staticPage.locator("#navbar .about-download").isVisible());
    assert.equal(await staticPage.locator(".profile-header .post-title").count(), 1);
    await staticPage.screenshot({ path: path.join(output, "without-javascript.png") });
    await staticPage.close();

    const dark = await browser.newPage({ colorScheme: "dark", viewport: { width: 390, height: 844 } });
    await localAssetsOnly(dark);
    await dark.goto(base);
    const colors = await dark.evaluate(() => ({
      foreground: getComputedStyle(document.querySelector(".experience-meta")).color,
      background: getComputedStyle(document.body).backgroundColor,
    }));
    assert(contrast(colors.foreground, colors.background) >= 4.5, "dark secondary-text contrast");
    await dark.screenshot({ path: path.join(output, "about-dark.png"), fullPage: true });
    await dark.goto(new URL("blog/", base).href);
    assert.equal((await dark.locator(".blog-empty").textContent()).trim(), "No posts yet. Notes will appear here.");
    await dark.screenshot({ path: path.join(output, "blog-dark.png") });
    await dark.close();
    console.log(
      `PASS: static layout, deferred images, desktop/mobile layout, light/dark contrast, drag/keyboard interactions and Bib accessibility. Screenshots: ${output}`
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
