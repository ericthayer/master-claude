/* Entry point. Order matters: prompts render before copy buttons read their text. */
import { initPrompts } from "./prompts.js";
import { initCopyButtons } from "./copy.js";
import { initQuickFill } from "./quickfill.js";
import { initProgress } from "./progress.js";
import { initLayers } from "./layers.js";
import { initSelectionSize } from "./selection-size.js";
import { initKit } from "./kit.js";

initPrompts();
initCopyButtons();
initQuickFill();
initProgress();
initLayers();
initSelectionSize();
initKit();
