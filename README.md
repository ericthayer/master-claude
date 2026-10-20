# master-claude

Home for Claude skills, specs, guides and the weekly kaizen ledger.

| Path | Contents |
|---|---|
| `skills/` | Saved Claude skills: `spec-to-component`, `design-token-audit`, `kaizen-retro` |
| `specs/_template.md` | Component spec template used by `spec-to-component` |
| `ledger/` | Weekly retro entries written by `kaizen-retro` |
| `playbook/` | UX Designer's Claude Playbook, served at `/playbook/` ([artifact](https://claude.ai/artifact/BADbt1Tm6tmfVFh4rm6nzQ)) |
| `playbook/condensed/` | Claude Playbook Quick Start, the condensed edition, served at `/playbook/condensed/`. Shares the playbook's CSS and JS. |

## Preview locally

The playbook loads native ES modules and root-relative assets, so serve the repo root over HTTP rather than opening the file directly:

```sh
npx serve .
# then open http://localhost:3000/playbook/
```

## Publish an edition as an artifact

`scripts/build-artifact.py` turns an edition into the single file claude.ai expects (CSS inlined, modules flattened, site links made absolute):

```sh
python3 scripts/build-artifact.py playbook/condensed/index.html quick-start.html \
  --link /playbook/=https://claude.ai/artifact/BADbt1Tm6tmfVFh4rm6nzQ
```

Published copies: [full playbook](https://claude.ai/artifact/BADbt1Tm6tmfVFh4rm6nzQ), [Quick Start](https://claude.ai/artifact/5NEy79kZWPk9Wq748YpUP1).
