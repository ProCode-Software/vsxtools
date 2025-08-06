PRETTIER_FILE="$ROOT/assets/prettierrc"

if [[ -z $1 ]]; then
    DIR=$(pwd)
else
    DIR=$1
fi

path="$DIR/.prettierrc"
cp "$PRETTIER_FILE" "$path"

if [[ $? -ne 0 ]]; then
    exit $?
fi

ansi "1;32" "Prettier config file created at $path"
