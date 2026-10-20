/* Copy buttons on every code, prompt and follow-up block, with a select-to-copy fallback. */
import { $$, showToast } from "./dom.js";

const COPY_ICON = '<svg class="ico" aria-hidden="true"><use href="#i-copy"/></svg>';
const flashTimers = new WeakMap();

export function selectNode(el) {
  try {
    const r = document.createRange(); r.selectNodeContents(el);
    const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
  } catch (e) {}
}

function flash(btn, text) {
  const label = btn.querySelector(".copy-label");
  if (!label) return;
  const original = label.dataset.original || label.textContent;
  label.dataset.original = original;
  label.textContent = text;
  btn.classList.add("is-copied");
  clearTimeout(flashTimers.get(btn));
  flashTimers.set(btn, setTimeout(() => { label.textContent = original; btn.classList.remove("is-copied"); }, 1800));
}

export function copyText(text, btn, fallback, onDone) {
  const done = () => { if (btn) flash(btn, "Copied"); if (onDone) onDone(); showToast("Copied to clipboard"); };
  const fail = () => {
    if (fallback) fallback();
    showToast("Text selected. Press Ctrl+C (or Cmd+C on a Mac) to copy.");
  };
  try {
    navigator.clipboard.writeText(text).then(done, fail);
  } catch (e) { fail(); }
}

function makeCopyButton(ariaLabel) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-btn";
  btn.setAttribute("aria-label", ariaLabel);
  btn.innerHTML = COPY_ICON + '<span class="copy-label">Copy</span>';
  return btn;
}

function figureText(fig) {
  if (fig.dataset.copy === "rows") {
    return $$("dd.prompt", fig).map((dd) => dd.dataset.label + ": " + dd.textContent).join("\n");
  }
  return fig.querySelector("code").textContent;
}

export function initCopyButtons() {
  $$("figure.code").forEach((fig) => {
    const head = fig.querySelector(".code-head");
    const body = fig.querySelector("code") || fig.querySelector(".brief-rows");
    if (!head || !body) return;
    const titleEl = fig.querySelector(".code-title");
    const title = titleEl ? titleEl.textContent : "code";
    const isPrompt = fig.dataset.kind === "prompt";
    const btn = makeCopyButton("Copy " + (isPrompt ? "prompt: " : "") + title);
    btn.addEventListener("click", () => {
      copyText(figureText(fig), btn, () => selectNode(body));
    });
    head.appendChild(btn);
  });
  $$(".followups li").forEach((li) => {
    const p = li.querySelector(".prompt");
    if (!p) return;
    const btn = makeCopyButton("Copy follow-up prompt");
    btn.addEventListener("click", () => {
      copyText(p.textContent, btn, () => selectNode(p));
    });
    li.appendChild(btn);
  });
}
