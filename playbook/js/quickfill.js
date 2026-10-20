/* "Personalize every prompt" panel: details typed here fill matching placeholders page-wide. */
import { $, $$, showToast } from "./dom.js";
import { state, save } from "./store.js";
import { renderAllPrompts } from "./prompts.js";

export function initQuickFill() {
  const inputs = $$("#quickfill input[data-field]");
  const count = $("#qf-count");
  const renderFillCount = () => {
    const n = inputs.filter((i) => i.value.trim()).length;
    count.textContent = n + " of " + inputs.length + " filled";
  };
  inputs.forEach((inp) => {
    inp.value = state.fill[inp.dataset.field] || "";
    inp.addEventListener("input", () => {
      state.fill[inp.dataset.field] = inp.value;
      save(); renderAllPrompts(); renderFillCount();
    });
  });
  $("#qf-clear").addEventListener("click", () => {
    inputs.forEach((i) => { i.value = ""; });
    state.fill = {};
    save(); renderAllPrompts(); renderFillCount();
    showToast("Your details were cleared");
  });
  renderFillCount();
}
