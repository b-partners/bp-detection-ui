#!/usr/bin/env bash
# Diffs two versions of @bpartners/roof-analyser: the published typings, README, dependencies, CSS, and the
# library's own sources (recovered from the source maps).
#
# Usage: diff-lib.sh [old-version] [new-version]
#   old-version defaults to the version locked in HEAD's package-lock.json
#   new-version defaults to the version installed in node_modules
# Prints the work directory; everything lands under it:
#   old/ new/            the unpacked packages
#   src-old/ src-new/    the library sources extracted from dist/index.js.map
#   typings.diff readme.diff deps.diff css.diff sources.diff
set -euo pipefail

PKG='@bpartners/roof-analyser'
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

OLD="${1:-$(git show HEAD:package-lock.json | jq -r '.packages["node_modules/@bpartners/roof-analyser"].version')}"
NEW="${2:-$(jq -r .version "node_modules/$PKG/package.json")}"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/roofer-lib-update.XXXXXX")"

echo "old=$OLD new=$NEW work=$WORK"
[ "$OLD" = "$NEW" ] && echo "WARNING: old and new versions are identical — pass the previous version explicitly."

fetch() { # version dir
  mkdir -p "$2"
  if [ "$1" = "$(jq -r .version "node_modules/$PKG/package.json")" ]; then
    cp -R "node_modules/$PKG/." "$2/"
  else
    (cd "$WORK" && npm pack "$PKG@$1" --silent --userconfig "$ROOT/.npmrc" >/dev/null 2>&1 || npm pack "$PKG@$1" --silent >/dev/null)
    tar xzf "$WORK"/bpartners-roof-analyser-"$1".tgz -C "$2" --strip-components=1
  fi
}
fetch "$OLD" "$WORK/old"
fetch "$NEW" "$WORK/new"

extract() { # package-dir out-dir
  node -e '
    const fs = require("fs"), path = require("path");
    const [dir, out] = process.argv.slice(1);
    const map = JSON.parse(fs.readFileSync(path.join(dir, "dist/index.js.map"), "utf8"));
    map.sources.forEach((s, i) => {
      const c = map.sourcesContent?.[i];
      if (!c || s.includes("node_modules")) return;
      const p = path.join(out, s.replace(/^(\.\.\/)+/, ""));
      fs.mkdirSync(path.dirname(p), { recursive: true });
      fs.writeFileSync(p, c);
    });' "$1" "$2"
}
extract "$WORK/old" "$WORK/src-old"
extract "$WORK/new" "$WORK/src-new"

diff -r -x '*.map' -x 'index.js' -x 'index.cjs' -x '*.css' "$WORK/old/dist" "$WORK/new/dist" > "$WORK/typings.diff" || true
diff "$WORK/old/README.md" "$WORK/new/README.md" > "$WORK/readme.diff" || true
diff <(jq '{peerDependencies, dependencies}' "$WORK/old/package.json") <(jq '{peerDependencies, dependencies}' "$WORK/new/package.json") > "$WORK/deps.diff" || true
diff "$WORK/old/dist/roof-analyser.css" "$WORK/new/dist/roof-analyser.css" > "$WORK/css.diff" 2>/dev/null || true
diff -ru "$WORK/src-old" "$WORK/src-new" > "$WORK/sources.diff" || true

wc -l "$WORK"/*.diff
echo "$WORK"
