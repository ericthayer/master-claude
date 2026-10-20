/* Prompt rendering: [placeholders] in pink, or filled in blue from the reader's details. */
import { $$ } from "./dom.js";
import { state } from "./store.js";

const FIELD_MAP = {
  "name": "name", "your name": "name",
  "x years": "years",
  "your focus areas": "focus", "focus areas": "focus", "areas": "focus",
  "target employers/clients": "target", "type of role": "target", "type of company or role": "target",
  "project names": "projects",
  "tools/methods": "tools",
  "warm/confident/approachable/etc.": "tone",
  "tagline": "tagline",
  "colors": "colors"
};
const TOKEN_RE = /(^|\n)([A-Z][A-Za-z' ]{1,28}:)(?= )|\[([^\]\n]+)\]/g;

let prompts = [];

function renderPrompt(el) {
  const src = el.dataset.src, frag = document.createDocumentFragment();
  let last = 0, m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(src)) !== null) {
    if (m.index > last) frag.appendChild(document.createTextNode(src.slice(last, m.index)));
    const span = document.createElement("span");
    if (m[2]) {
      if (m[1]) frag.appendChild(document.createTextNode(m[1]));
      span.className = "tok-label";
      span.textContent = m[2];
    } else {
      const key = FIELD_MAP[m[3].trim().toLowerCase()];
      const val = key ? String(state.fill[key] || "").trim() : "";
      if (val) {
        span.className = "tok-filled";
        span.textContent = val;
        span.title = "Filled from your details: " + m[0];
      } else {
        span.className = "tok-ph";
        span.textContent = m[0];
      }
    }
    frag.appendChild(span);
    last = m.index + m[0].length;
  }
  if (last < src.length) frag.appendChild(document.createTextNode(src.slice(last)));
  el.replaceChildren(frag);
}

export function renderAllPrompts() { prompts.forEach(renderPrompt); }

export function initPrompts() {
  prompts = $$(".prompt");
  prompts.forEach((el) => { el.dataset.src = el.textContent.trim(); });
  renderAllPrompts();
}
