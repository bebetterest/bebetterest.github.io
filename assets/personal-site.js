/* Native disclosure buttons keep closed citations out of keyboard/AT navigation. */
(() => {
  document.querySelectorAll("[data-bib-toggle]").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    if (!panel) return;
    const sync = () => {
      const open = panel.classList.contains("open");
      if (!open && panel.contains(document.activeElement)) button.focus();
      panel.hidden = !open;
      panel.inert = !open;
      panel.setAttribute("aria-hidden", String(!open));
      button.setAttribute("aria-expanded", String(open));
    };
    button.addEventListener("click", () => {
      panel.classList.toggle("open");
      sync();
    });
    panel.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      panel.classList.remove("open");
      sync();
      button.focus();
    });
    // Also synchronize if al-folio closes a citation when opening another panel.
    new MutationObserver(sync).observe(panel, { attributes: true, attributeFilter: ["class"] });
    sync();
  });
})();
