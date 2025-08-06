#!/usr/bin/env bash
function ansi() {
    code=$1
    shift
    echo -e "\033[${code}m$@\033[0m"
}

function error() {
    echo -e "$(ansi "1;31" "Error")$(ansi 2 :) $(ansi 1 $@)"
    exit 1
}