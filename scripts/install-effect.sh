#!/usr/bin/env sh
set -eu

effect_id="niva-axis-effect"
effect_dir="$HOME/.local/share/kwin/effects/$effect_id"

mkdir -p "$effect_dir"
cp -r effects/niva-axis-effect/metadata.json effects/niva-axis-effect/contents "$effect_dir"

echo "Installed KWin effect: $effect_dir"
echo "Enable it in KDE System Settings -> Window Management -> Desktop Effects -> Niva Axis Animation"
