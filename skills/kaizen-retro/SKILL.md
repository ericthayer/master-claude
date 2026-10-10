---
name: "kaizen-retro"
description: "Run a weekly kaizen retro on Claude workflows: find repeated prompts, blind approvals and slow steps, log metrics, and set next week's hypothesis."
---

# Kaizen retro

Runs one PDCA check for the week. Keep it under 20 minutes of the user's time.

## 1. Gather
Ask for, or read from `ledger/` if present: this week's hypothesis, lead time from spec to merged PR, rework turns (times a result had to be corrected), and a11y defects caught before PR.

## 2. Ask three questions, one at a time
- What did you type to Claude more than once this week? (candidate skill)
- What did you approve without reading? (candidate hook or permission rule)
- Which step took longest while you waited? (candidate subagent, routine or parallel run)

## 3. Decide
For each candidate pick exactly one: promote to the `ds-ops` plugin, try for one more week, or delete. A candidate only gets promoted after it proved useful in two cycles.

## 4. Write the ledger entry
Create `ledger/<ISO year>-W<week>.md` with: hypothesis, result (the three numbers vs last week), decisions, and next week's single hypothesis written as "If I <change>, then <metric> will <move> because <reason>."

## 5. Close
One line to the user: the metric that moved most and next week's hypothesis.