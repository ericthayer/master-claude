/* Prompt Starter Kit: copy all 15 prompts, or download them as Markdown. */
import { $, $$, showToast } from "./dom.js";
import { copyText } from "./copy.js";

const FILENAME = "prompt-starter-kit.md";

function kitMarkdown() {
  let md = "# Prompt Starter Kit for UX Designers\n\nFrom the UX Designer's Claude Playbook. Replace anything in [BRACKETS] with your own details.\n\n";
  $$("#kit-list .kit-item").forEach((item, i) => {
    const title = item.querySelector(".kit-title").textContent;
    const tag = item.querySelector(".chip").textContent;
    md += "## " + (i + 1) + ". " + title + " (" + tag + ")\n\n" + item.querySelector("code").textContent + "\n\n";
  });
  return md.trim() + "\n";
}

function saveWithLink(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/markdown;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function initDownloads(btn) {
  const claude = window.claude;
  if (!claude || typeof claude.use !== "function") {
    // Hosted outside claude.ai: no artifact runtime, so download through a Blob link.
    btn.hidden = false;
    btn.addEventListener("click", () => {
      saveWithLink(FILENAME, kitMarkdown());
      showToast("Downloaded " + FILENAME);
    });
    return;
  }
  claude.use("downloads").then((dl) => {
    if (!dl) return;
    btn.hidden = false;
    btn.addEventListener("click", () => {
      dl.save({ filename: FILENAME, data: kitMarkdown() }).then(() => {
        showToast("Saved " + FILENAME);
      }, (err) => {
        const code = err && err.code;
        if (code === "declined") return;
        if (code === "rate_limited") { showToast("A save prompt is already open."); return; }
        btn.hidden = true;
        showToast("Downloads aren't available here. Use Copy all instead.");
      });
    });
  }, () => {});
}

export function initKit() {
  const kitCopy = $("#kit-copy"), kitFallback = $("#kit-fallback"), kitLabel = $(".kit-copy-label");
  if (!kitCopy) return;
  const label = kitLabel.textContent, count = $$("#kit-list .kit-item").length;
  kitCopy.addEventListener("click", () => {
    const md = kitMarkdown();
    copyText(md, null, () => {
      kitFallback.value = md; kitFallback.hidden = false;
      kitFallback.focus(); kitFallback.select();
    }, () => {
      kitLabel.textContent = "Copied all " + count;
      setTimeout(() => { kitLabel.textContent = label; }, 1800);
    });
  });
  initDownloads($("#kit-download"));
}
