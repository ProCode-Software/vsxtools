#!/usr/bin/env bash
array=()

WATCH=false

for arg in "$@"; do case $arg in
    -w | --watch) WATCH=true ;;
    -*) ;;
    *) array+=("$arg") ;;
esac done


input=${array[0]}
output=${array[1]}

VSXTOOLS_SRC_PATH="$input" \
VSXTOOLS_OUT_PATH="$output" \
VSXTOOLS_WATCH="$WATCH" \
bun run "$ROOT/scripts/build-grammar.ts"

exit $?