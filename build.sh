#!/bin/sh
# Build js/bundle.min.js from the .jsx sources.
# Needs node/npm on PATH (npx fetches babel + terser on demand).
# Usage: sh build.sh
set -e
cd "$(dirname "$0")"

ORDER="components tweaks-panel data scrollfx fx chrome home-layouts pages-a pages-b pages-c app"

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# IMPORTANT: runtime "classic" — the site loads React as a global UMD, the
# default "automatic" runtime would emit import statements and break the bundle.
cat > "$TMP/babel.config.json" <<'EOF'
{ "presets": [["@babel/preset-react", { "runtime": "classic" }]] }
EOF

# install the toolchain into the temp dir so babel can resolve its preset
# (npx -p puts packages where the config file can't find them)
(cd "$TMP" && npm init -y >/dev/null && npm i --silent --no-audit --no-fund \
  @babel/core@7 @babel/cli@7 @babel/preset-react@7 terser@5)

for name in $ORDER; do
  "$TMP/node_modules/.bin/babel" --config-file "$TMP/babel.config.json" "js/$name.jsx" -o "$TMP/$name.js"
done

# concatenate in order
: > "$TMP/bundle.js"
for name in $ORDER; do
  cat "$TMP/$name.js" >> "$TMP/bundle.js"
  printf '\n;\n' >> "$TMP/bundle.js"
done

"$TMP/node_modules/.bin/terser" "$TMP/bundle.js" --compress --mangle -o js/bundle.min.js
echo "built js/bundle.min.js ($(wc -c < js/bundle.min.js | tr -d ' ') bytes)"
