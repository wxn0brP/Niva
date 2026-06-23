#!/usr/bin/env sh
set -eu

mode="${1:-prod}"

case "$mode" in
    dev)
        dev_define="true"
        ;;
    prod)
        dev_define="false"
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
    --define "__DEV__:${dev_define}"

bun build effects/niva-axis-effect/src/index.ts \
    --outfile effects/niva-axis-effect/contents/code/main.js \
    --target browser \
    --format iife \
    --define "__DEV__:${dev_define}"
