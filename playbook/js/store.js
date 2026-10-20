/* Reader progress and quick-fill details, kept in this browser only. */

const KEY = "ux-claude-playbook:v1";

export const FRAMES = ["f1", "f2", "f3", "f4", "f5"];
export const state = { done: {}, steps: {}, fill: {} };

try {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const s = JSON.parse(raw);
    if (s && typeof s === "object") {
      state.done = s.done || {};
      state.steps = s.steps || {};
      state.fill = s.fill || {};
    }
  }
} catch (e) {}

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
}
