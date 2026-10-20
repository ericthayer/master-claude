/* Layers panel: scrollspy on desktop, an off-canvas drawer at 960px and below. */
import { $, $$ } from "./dom.js";

export function initLayers() {
  const layers = $("#layers"), scrim = $("#scrim"), openBtn = $("#open-layers"), closeBtn = $("#close-layers");
  const links = $$(".layer[data-target]");
  const targets = links.map((a) => document.getElementById(a.dataset.target));
  let activeLink = null, ticking = false;

  function keepVisible(link) {
    const top = link.offsetTop, bottom = top + link.offsetHeight;
    if (top < layers.scrollTop + 48) layers.scrollTop = top - 48;
    else if (bottom > layers.scrollTop + layers.clientHeight - 48) layers.scrollTop = bottom - layers.clientHeight + 48;
  }
  function spy() {
    ticking = false;
    const line = 140;
    let current = 0;
    for (let i = 0; i < targets.length; i++) {
      if (targets[i] && targets[i].getBoundingClientRect().top - line <= 0) current = i;
    }
    const link = links[current];
    if (link === activeLink) return;
    if (activeLink) { activeLink.classList.remove("is-active"); activeLink.removeAttribute("aria-current"); }
    link.classList.add("is-active");
    link.setAttribute("aria-current", "location");
    activeLink = link;
    if (!layers.classList.contains("open")) keepVisible(link);
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });
  spy();

  const mq = window.matchMedia("(max-width: 960px)");
  function openDrawer() {
    layers.classList.add("open"); scrim.hidden = false;
    openBtn.setAttribute("aria-expanded", "true");
    closeBtn.focus();
  }
  function closeDrawer(returnFocus) {
    layers.classList.remove("open"); scrim.hidden = true;
    openBtn.setAttribute("aria-expanded", "false");
    if (returnFocus) openBtn.focus();
  }
  openBtn.addEventListener("click", openDrawer);
  closeBtn.addEventListener("click", () => closeDrawer(true));
  scrim.addEventListener("click", () => closeDrawer(true));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && layers.classList.contains("open")) closeDrawer(true);
  });
  links.forEach((a) => {
    a.addEventListener("click", () => { if (mq.matches) closeDrawer(false); });
  });
}
