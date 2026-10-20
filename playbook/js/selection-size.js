/* Hero selection box: a live "W × H" readout, like a design tool's size badge. */
import { $ } from "./dom.js";

export function initSelectionSize() {
  const sel = $("#hero-sel"), size = $("#sel-size");
  if (!sel || !size || !("ResizeObserver" in window)) return;
  new ResizeObserver(() => {
    const r = sel.getBoundingClientRect();
    size.textContent = Math.round(r.width) + " × " + Math.round(r.height);
  }).observe(sel);
}
