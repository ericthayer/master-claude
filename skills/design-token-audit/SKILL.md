---
name: "design-token-audit"
description: "Audit a codebase or diff for design-token drift: hard-coded values, unused or duplicate tokens, theme gaps and contrast failures."
---

# Design token audit

## Inputs
- Token source (JSON/DTCG, CSS custom properties, SCSS, or a token MCP server if one is configured).
- Scope: whole repo, a package, or the current diff (default: current diff if there is one).

## Steps
1. Load the token set. Build a map of value -> token names per category (color, space, radius, type, shadow, motion).
2. Scan the scope for literals in styles and templates: hex/rgb/hsl/oklch colors, px/rem spacing, font sizes and weights, durations. Ignore token definition files and tests.
3. For each literal, suggest the exact token whose value matches; if none matches, suggest the nearest and flag it as a possible missing token.
4. Find tokens defined but never referenced, and tokens with identical values under different names.
5. For every theme (light, dark, high-contrast), confirm each semantic token is defined. List gaps.
6. Compute contrast for text/background semantic pairs in every theme against WCAG 2.2 AA (4.5:1 text, 3:1 large text and UI components).

## Output
One table per finding type, sorted by severity: contrast failures, theme gaps, literals with exact token matches (auto-fixable), literals needing a decision, unused, duplicates. End with counts and offer to apply the auto-fixable replacements as one change.