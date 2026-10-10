---
name: "spec-to-component"
description: "Turn a design-system component request or ticket into a testable spec, then a plan, then an implementation with a11y and token gates."
---

# Spec to component

Use for any new or changed component in a design system or component library.

## 1. Spec (stop for approval)
Write `specs/<component>.md` with these sections, nothing else:
- **Problem**: one paragraph, who is blocked and why.
- **API**: attributes/props, events, slots, CSS custom properties. Typed (TypeScript). Mark breaking changes.
- **States**: default, hover, focus-visible, active, disabled, loading, error, empty. Include RTL and forced-colors.
- **Tokens**: every color, space, type and motion value as a token reference. No literals.
- **Accessibility**: WCAG 2.2 AA criteria that apply, keyboard map, ARIA pattern (APG link), focus management, live-region needs.
- **Tests**: acceptance criteria as Given/When/Then, one per behavior.
- **Out of scope**.
Ask the user to approve the spec before continuing. If an item is ambiguous, pick a default and mark it `ASSUMPTION`.

## 2. Plan
List files to create or change and the order. Detect the framework from the repo (Web Components, Angular 20 + PrimeNG, React 19, Vue 3) and follow its local conventions over generic ones.

## 3. Implement
- Tests first from the acceptance criteria.
- Standalone, exportable ES module per component; keep files under 300 lines.
- Semantic native elements before ARIA.
- Add Storybook stories for every state in the spec.

## 4. Gates (all must pass before calling it done)
- Lint, typecheck, unit tests.
- axe run against every story with zero violations.
- Grep the diff for hard-coded colors, px spacing and font values; replace with tokens.
- Keyboard walk-through matches the spec's keyboard map.

## 5. Report
Summarize: spec link, files changed, gate results, open ASSUMPTIONs, breaking changes.