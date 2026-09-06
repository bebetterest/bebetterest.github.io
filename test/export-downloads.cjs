// Run against a local production build: EXPORT_TEST_URL=http://127.0.0.1:4011/ node test/export-downloads.cjs
const { chromium } = require("@playwright/test");
const { PDFDocument, PDFName, PDFDict } = require("pdf-lib");
const { PNG } = require("pngjs");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const assert = require("node:assert/strict");
const base = process.env.EXPORT_TEST_URL || "http://127.0.0.1:4011/";
assert(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Use a local preview.");

(async () => {
  const output = await fs.mkdtemp(path.join(os.tmpdir(), "about-export-"));
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
  });
  try {
    for (const width of [1100, 540, 500, 481, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 800 } });
      if (process.env.SITE_TEST_OFFLINE === "1") {
        await page.route(/^https?:/, (route) => (new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort()));
      }
      // Inspect the actual export clone immediately before the real renderer runs.
      await page.addInitScript(() => {
        let render;
        Object.defineProperty(window, "html2canvas", {
          configurable: true,
          get: () => render,
          set: (renderer) => {
            render = (clone, options) => {
              window.exportLayout = {
                card: clone.querySelector(".profile").getBoundingClientRect().toJSON(),
                intro: clone.querySelector(".profile-intro").getBoundingClientRect().toJSON(),
                icons: [...clone.querySelectorAll(".intro-links a")].map((el) => el.getBoundingClientRect().toJSON()),
                sectionHeights: [...clone.querySelectorAll(".home-section")].map(
                  (section) => section.getBoundingClientRect().height - section.querySelector("summary").getBoundingClientRect().height
                ),
                mbtiPanelHeights: [...clone.querySelectorAll(".mbti-panel")].map((panel) => panel.getBoundingClientRect().height),
                photosLoaded: [...clone.querySelectorAll(".experience-photo img")].map((img) => img.complete && img.naturalWidth > 0),
              };
              return renderer(clone, options);
            };
          },
        });
      });
      await page.goto(base);
      assert.equal(await page.locator(".home-section[open]").count(), 0, "homepage sections should start collapsed");
      assert(await page.locator("#mbti-2025").isChecked(), "the latest MBTI snapshot should be selected initially");
      await page.locator(".mbti-history > summary").click();
      await page.locator('label[for="mbti-2024"]').click();
      assert(await page.locator("#mbti-2024").isChecked(), "the older MBTI snapshot should be selectable");
      // A full-page download must include content the visitor has collapsed.
      const summaries = page.locator(".home-section > summary");
      assert.equal(await summaries.count(), 4);
      for (const summary of await page.locator(".home-section[open] > summary").all()) await summary.click();
      assert.equal(await page.locator(".home-section[open]").count(), 0);
      for (const format of ["pdf", "png"]) {
        const downloading = page.waitForEvent("download", { timeout: 60000 });
        await page.locator(`[data-about-export=${format}]`).click();
        const download = await downloading;
        const target = path.join(output, `${width}.${format}`);
        await download.saveAs(target);
        const layout = await page.evaluate(() => window.exportLayout);
        assert.equal(layout.sectionHeights.length, 4);
        assert(
          layout.sectionHeights.every((height) => height > 50),
          "every collapsed section must have visible content in the export"
        );
        assert.equal(layout.mbtiPanelHeights.length, 2);
        assert(
          layout.mbtiPanelHeights.every((height) => height > 50),
          "both MBTI snapshots must have visible content in the export"
        );
        assert.equal(layout.photosLoaded.length, 2);
        assert(layout.photosLoaded.every(Boolean), "both internship photos must load without opening their live section");
        assert.equal(await page.locator(".home-section[open]").count(), 0, "export must preserve the visitor's collapsed sections");
        assert(await page.locator("#mbti-2024").isChecked(), "export must preserve the visitor's selected MBTI snapshot");
        assert.equal(layout.icons.length, 6);
        for (const icon of layout.icons) {
          assert(
            icon.right <= layout.card.left || icon.left >= layout.card.right || icon.bottom <= layout.card.top || icon.top >= layout.card.bottom,
            `export card overlaps a social icon at ${width}px (${format})`
          );
        }
        if (width <= 540) assert(layout.card.top >= layout.intro.bottom, "narrow export must stack the card below the introduction");
        assert.equal(await page.locator(".about-export-copy").count(), 0, "temporary export clone must be removed");
        const bytes = await fs.readFile(target);
        if (format === "pdf") {
          const pdf = await PDFDocument.load(bytes);
          assert.equal(pdf.getPageCount(), 1);
          const first = pdf.getPage(0);
          assert(first.getHeight() > first.getWidth());
          const links = first.node.Annots();
          assert(links.size() >= 20);
          const urls = [];
          for (let i = 0; i < links.size(); i++) {
            const annotation = links.lookup(i, PDFDict);
            urls.push(annotation.lookup(PDFName.of("A"), PDFDict).get(PDFName.of("URI")).decodeText());
          }
          assert(new Set(urls).has("https://liyujian.cn/"));
          assert(urls.some((url) => new URL(url).hostname === "proceedings.neurips.cc"));
        } else {
          const png = PNG.sync.read(bytes);
          assert(png.height > png.width);
          assert(png.width >= width);
        }
        console.log(`PASS ${width}px ${format.toUpperCase()} export: layout, file contents and cleanup`);
      }
      await page.close();
    }
    console.log(`PASS desktop/mobile PDF links and full-page PNG exports: ${output}`);
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
