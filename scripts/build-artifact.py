#!/usr/bin/env python3
"""Bundle a playbook edition into one file for publishing as a claude.ai artifact.

The repo serves each edition as HTML plus shared /playbook/css and /playbook/js
(native ES modules). An artifact is a single page that claude.ai wraps in its own
skeleton, so this inlines the CSS, flattens the modules into one script, drops the
document skeleton, and rewrites site-relative links to absolute URLs.

    python3 scripts/build-artifact.py playbook/condensed/index.html out.html \
        --link /playbook/=https://claude.ai/artifact/BADbt1Tm6tmfVFh4rm6nzQ
"""
import argparse
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent.parent
VIEWER_BASE = "/* Base rules the claude.ai artifact viewer supplied"
IMPORT_RE = re.compile(r'^import \{[^}]*\} from "(\./[\w-]+\.js)";\n', re.M)


def local(href: str) -> pathlib.Path:
    return ROOT / href.lstrip("/")


def css_bundle(hrefs: list[str]) -> str:
    out = []
    for href in hrefs:
        css = local(href).read_text()
        if css.startswith(VIEWER_BASE):  # the artifact skeleton already supplies these rules
            css = css.split("\n\n", 1)[1]
        out.append(css.rstrip())
    return "\n".join(out)


def js_bundle(entry: pathlib.Path) -> str:
    order: list[pathlib.Path] = []

    def visit(path: pathlib.Path) -> None:
        if path in order:
            return
        for dep in IMPORT_RE.findall(path.read_text()):
            visit((path.parent / dep).resolve())
        order.append(path)

    visit(entry.resolve())
    parts = []
    for path in order:
        src = IMPORT_RE.sub("", path.read_text())
        src = re.sub(r"^export ", "", src, flags=re.M)
        parts.append(f"/* {path.name} */\n{src.strip()}")
    return '(() => {\n"use strict";\n' + "\n\n".join(parts) + "\n})();"


def build(src: pathlib.Path, links: dict[str, str]) -> str:
    html = src.read_text()
    head, body = html.split("<body>", 1)
    body = body.split("</body>", 1)[0]

    title = re.search(r"<title>.*?</title>", head).group(0)
    keep = re.findall(r'<meta name="description"[^>]*>|<link rel="preconnect"[^>]*>|<link rel="stylesheet" href="https://fonts\.googleapis\.com[^>]*>', head)
    css = css_bundle(re.findall(r'<link rel="stylesheet" href="(/[^"]+\.css)">', head))

    module = re.search(r'<script type="module" src="(/[^"]+)"></script>\n?', body)
    body = body.replace(module.group(0), "")
    for old, new in links.items():
        body = body.replace(f'href="{old}"', f'href="{new}"')

    return "\n".join([
        title,
        '<meta name="claude:viewport-fit-sides" content="cover">',
        *keep,
        f"<style>\n{css}\n</style>",
        body.strip(),
        f"<script>\n{js_bundle(local(module.group(1)))}\n</script>",
    ]) + "\n"


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("src", type=pathlib.Path, help="edition HTML, e.g. playbook/condensed/index.html")
    ap.add_argument("out", type=pathlib.Path)
    ap.add_argument("--link", action="append", default=[], metavar="FROM=TO", help="rewrite href FROM to TO")
    args = ap.parse_args()
    args.out.write_text(build(args.src, dict(pair.split("=", 1) for pair in args.link)))
