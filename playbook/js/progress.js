/* Progress: "Mark complete" per frame, the top-bar meter, and per-step checklists. */
import { $, $$, showToast } from "./dom.js";
import { FRAMES, state, save } from "./store.js";

function pop(el) {
  if (!el) return;
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
  setTimeout(() => el.classList.remove("pop"), 500);
}

const doneCount = () => FRAMES.filter((f) => state.done[f]).length;

export function initProgress() {
  const count = $("#progress-count"), fill = $("#progress-fill"), meter = $("#progress");
  const completeBtns = $$(".complete-btn"), frameRows = $$("[data-frame-row]");
  const stepGroups = $$("[data-step-group]"), stepBoxes = $$("input[data-step]");

  function renderProgress() {
    const n = doneCount();
    count.textContent = n + " of 5";
    fill.style.width = (n / 5 * 100) + "%";
    meter.setAttribute("aria-valuenow", String(n));
    completeBtns.forEach((b) => {
      const on = !!state.done[b.dataset.frame];
      b.setAttribute("aria-pressed", on ? "true" : "false");
      const num = b.dataset.frame.replace("f", "0");
      b.querySelector(".complete-label").textContent = on ? "Frame " + num + " complete" : "Mark Frame " + num + " complete";
    });
    frameRows.forEach((row) => {
      const on = !!state.done[row.dataset.frameRow];
      row.classList.toggle("is-done", on);
      const st = row.querySelector(".layer-status");
      if (st) st.textContent = on ? "(complete)" : "";
    });
  }

  function renderSteps() {
    stepGroups.forEach((g) => {
      const id = g.dataset.stepGroup;
      const boxes = $$("input[data-step]", g);
      const n = boxes.filter((b) => b.checked).length;
      const out = $('[data-step-count="' + id + '"]');
      if (out) out.textContent = n + " of " + boxes.length + " done";
      const bar = $('[data-step-bar="' + id + '"]');
      if (bar) bar.style.width = (boxes.length ? n / boxes.length * 100 : 0) + "%";
      boxes.forEach((b) => { b.closest(".step").classList.toggle("is-done", b.checked); });
    });
  }

  completeBtns.forEach((b) => {
    b.addEventListener("click", () => {
      const f = b.dataset.frame;
      state.done[f] = !state.done[f];
      save(); renderProgress();
      if (state.done[f]) {
        pop(b);
        frameRows.filter((row) => row.dataset.frameRow === f).forEach(pop);
        const n = doneCount();
        showToast(n === 5 ? "All five frames complete. Nice work!" : "Frame complete. " + n + " of 5 done.");
      }
    });
  });
  stepBoxes.forEach((cb) => {
    cb.checked = !!state.steps[cb.dataset.step];
    cb.addEventListener("change", () => {
      state.steps[cb.dataset.step] = cb.checked;
      save(); renderSteps();
    });
  });
  renderProgress();
  renderSteps();
}
