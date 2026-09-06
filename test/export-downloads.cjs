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
              };
              return renderer(clone, options);
            };
          },
        });
      });
      await page.goto(base);
      for (const format of ["pdf", "png"]) {
        const downloading = page.waitForEvent("download", { timeout: 60000 });
        await page.locator(`[data-about-export=${format}]`).click();
        const download = await downloading;
        const target = path.join(output, `${width}.${format}`);
        await download.saveAs(target);
        const layout = await page.evaluate(() => window.exportLayout);
        assert.equal(layout.icons.length, 5);
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
