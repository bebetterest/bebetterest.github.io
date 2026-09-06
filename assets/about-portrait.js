/* Progressive interaction for the already-rendered, data-driven portrait card. */
(() => {
  const pronunciation = document.querySelector(".name-pronunciation");
  const audio = document.querySelector("#name-pronunciation-audio");
  pronunciation?.addEventListener("click", () => {
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });

  const profile = document.querySelector("[data-portrait-card]");
  if (!profile) return;
  const panels = [...profile.querySelectorAll(".portrait-panel")];
  if (!panels.length) return;
  const frame = profile.querySelector(".portrait-frame");
  const rail = profile.querySelector(".portrait-rail");
  const slider = profile.querySelector(".portrait-slider");
  const toggle = profile.querySelector(".portrait-toggle");
  const caption = profile.querySelector(".portrait-caption");
  const expand = profile.querySelector(".portrait-expand");
  const stops = [...profile.querySelectorAll(".portrait-stop")];
  let dragging = false;

  function loadImage(index) {
    const img = panels[index]?.querySelector("img[data-src]");
    if (!img) return;
    img.src = img.dataset.src;
    img.removeAttribute("data-src");
  }
  function loadNeighbors() {
    const index = Math.round(Number(toggle.value));
    [index - 1, index, index + 1].forEach(loadImage);
  }
  function renderPosition(value) {
    const last = Math.max(1, panels.length - 1);
    const fraction = value / last;
    const index = Math.round(value);
    [Math.floor(value), Math.ceil(value)].forEach(loadImage);
    rail.style.setProperty("--portrait-index", String(value));
    panels.forEach((panel, i) => {
      const distance = Math.min(1, Math.abs(i - value));
      panel.style.opacity = String(dragging ? 1 - distance * 0.7 : i === index ? 1 : 0);
      panel.style.transform = `translateY(${dragging ? -4 : 0}px) scale(${1 - distance * 0.1 - (dragging ? 0.035 : 0)})`;
      panel.setAttribute("aria-hidden", String(i !== index));
    });
    slider.style.setProperty("--fraction", String(fraction));
    slider.style.setProperty("--position", `${fraction * 100}%`);
    const hue = 212 + fraction * 55;
    slider.style.setProperty("--accent", value ? `hsl(${hue} 80% 65%)` : "#aaaab2");
    profile.style.setProperty("--portrait-accent", value ? `hsl(${hue} 65% 72%)` : "#c5c5d0");
    slider.style.setProperty("--portrait-start", value ? `hsl(${hue - 25} 90% 72%)` : "#a5a9b5");
    slider.style.setProperty("--portrait-end", value ? `hsl(${hue} 85% 59%)` : "#c5c5ce");
    stops.forEach((dot, i) => dot.classList.toggle("is-selected", i === index));
    caption.textContent = panels[index].dataset.label;
    toggle.setAttribute("aria-valuetext", panels[index].dataset.label);
    // Display derivatives never replace the full-resolution download target.
    expand.href = panels[index].dataset.original;
  }
  function settle() {
    dragging = false;
    frame.classList.remove("is-dragging");
    slider.classList.remove("is-dragging");
    toggle.value = String(Math.round(Number(toggle.value)));
    renderPosition(Number(toggle.value));
  }
  // Load only the current image initially, then its neighbors when intent is clear.
  profile.addEventListener("pointerenter", loadNeighbors);
  toggle.addEventListener("focus", loadNeighbors);
  toggle.addEventListener("input", () => renderPosition(Number(toggle.value)));
  toggle.addEventListener("change", settle);
  toggle.addEventListener("keydown", (event) => {
    const moves = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
    if (!(event.key in moves) && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    toggle.value = String(
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? panels.length - 1
          : Math.max(0, Math.min(panels.length - 1, Math.round(Number(toggle.value)) + moves[event.key]))
    );
    settle();
    loadNeighbors();
  });
  toggle.addEventListener("pointerdown", (event) => {
    dragging = true;
    loadNeighbors();
    toggle.setPointerCapture(event.pointerId);
    slider.classList.add("is-dragging");
    frame.classList.add("is-dragging");
    renderPosition(Number(toggle.value));
  });
  ["pointerup", "pointercancel", "blur"].forEach((event) => toggle.addEventListener(event, settle));
})();
