/* Local-only, single-page exports. PDF adds URI annotations over the raster. */
(() => {
  const script = document.currentScript;
  const base = script.dataset.exportAssets;
  const libraries = new Map();
  const load = (name) => {
    if (!libraries.has(name)) {
      libraries.set(
        name,
        new Promise((resolve, reject) => {
          const tag = document.createElement("script");
          tag.src = base + name;
          tag.onload = resolve;
          tag.onerror = () => {
            libraries.delete(name);
            tag.remove();
            reject(new Error("Export library could not load. Please retry."));
          };
          document.head.append(tag);
        })
      );
    }
    return libraries.get(name);
  };
  const buttons = [...document.querySelectorAll("[data-about-export]")];
  const status = document.querySelector(".about-download-status");
  const toolbar = document.querySelector(".about-download");
  const source = document.querySelector(".post");
  if (!source || !toolbar) return;
  let busy = false;
  async function download(format) {
    if (busy) return;
    busy = true;
    buttons.forEach((button) => {
      button.disabled = true;
    });
    status.textContent = "Preparing download…";
    let host;
    let canvas;
    try {
      await Promise.all([load("html2canvas.min.js"), format === "pdf" ? load("pdf-lib.min.js") : Promise.resolve(), document.fonts.ready]);
      const width = Math.ceil(source.getBoundingClientRect().width);
      host = document.createElement("div");
      host.style.cssText = `position:fixed;left:-20000px;top:0;width:${width}px;pointer-events:none;`;
      const clone = source.cloneNode(true);
      clone.classList.add("about-export-copy");
      clone
        .querySelectorAll("script, audio, [data-html2canvas-ignore], .portrait-expand, .portrait-slider, .name-pronunciation, .bibtex")
        .forEach((node) => node.remove());
      clone.querySelectorAll("*").forEach((node) => {
        node.style.animation = "none";
        node.style.transition = "none";
      });
      clone.style.margin = "0";
      clone.style.padding = "24px";
      clone.style.boxSizing = "border-box";
      host.append(clone);
      document.body.append(host);
      await Promise.all([...clone.querySelectorAll("img")].map((img) => img.decode().catch(() => {})));
      const bounds = clone.getBoundingClientRect();
      const links = [...clone.querySelectorAll("a[href]")].flatMap((anchor) => {
        const url = anchor.href;
        if (!/^(https?:|mailto:)/i.test(url)) return [];
        return [...anchor.getClientRects()]
          .filter((rect) => rect.width && rect.height)
          .map((rect) => ({ url, x: rect.left - bounds.left, y: rect.top - bounds.top, width: rect.width, height: rect.height }));
      });
      const height = Math.ceil(clone.scrollHeight);
      // Bound memory and canvas dimensions on mobile; do not silently truncate.
      const scale = Math.min(2, Math.sqrt(16000000 / (width * height)), 16000 / height);
      if (scale < 0.5) throw new Error("This page is too long to export safely on this device.");
      canvas = await window.html2canvas(clone, {
        scale,
        width,
        height,
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        useCORS: true,
        logging: false,
      });
      let blob;
      if (format === "png") {
        blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      } else {
        const { PDFDocument, PDFString } = window.PDFLib;
        const pdf = await PDFDocument.create();
        const unit = Math.min(0.75, 14000 / height, 14000 / width);
        const page = pdf.addPage([width * unit, height * unit]);
        const png = await pdf.embedPng(canvas.toDataURL("image/png"));
        page.drawImage(png, { x: 0, y: 0, width: width * unit, height: height * unit });
        for (const link of links) {
          const annotation = pdf.context.register(
            pdf.context.obj({
              Type: "Annot",
              Subtype: "Link",
              Rect: [link.x * unit, (height - link.y - link.height) * unit, (link.x + link.width) * unit, (height - link.y) * unit],
              Border: [0, 0, 0],
              A: { Type: "Action", S: "URI", URI: PDFString.of(link.url) },
            })
          );
          page.node.addAnnot(annotation);
        }
        pdf.setTitle("Yujian Li — About");
        blob = new Blob([await pdf.save()], { type: "application/pdf" });
      }
      if (!blob) throw new Error("Image export failed. Try PDF instead.");
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `yujian-li-about.${format}`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      status.textContent = "Download ready.";
    } catch (error) {
      status.textContent = error.message || "Export failed. Please retry.";
    } finally {
      host?.remove();
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      busy = false;
      buttons.forEach((button) => {
        button.disabled = false;
      });
    }
  }
  buttons.forEach((button) => button.addEventListener("click", () => download(button.dataset.aboutExport)));
})();
