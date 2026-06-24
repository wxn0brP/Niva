#!/usr/bin/env sh
set -eu

mode="${1:-prod}"
dev_build_file="scripts/.dev-build"
version=$(jq -r '.version' package.json)

case "$mode" in
    dev)
        dev_define="true"
        build_num=$(cat "$dev_build_file" 2>/dev/null || echo "0")
        build_num=$((build_num + 1))
        echo "$build_num" > "$dev_build_file"
        build_define="${build_num}"
        echo "Build number: $build_define"
        ;;
    prod)
        dev_define="false"
        build_define="0"
        ;;
    *)
        echo "Usage: scripts/build.sh [dev|prod]" >&2
        exit 1
        ;;
esac

bun build src/index.ts \
    --outfile contents/code/main.js \
    --target browser \
    --format iife \
    --define "__DEV__:${dev_define}" \
    --define "__VERSION__:\"${version}\"" \
    --define "__DEV_BUILD__:${build_define}"

bun build effects/niva-axis-effect/src/index.ts \
    --outfile effects/niva-axis-effect/contents/code/main.js \
    --target browser \
    --format iife \
    --define "__DEV__:${dev_define}"
