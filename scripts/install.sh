#!/usr/bin/env sh
set -eu

mode="${1:-prod}"
script_id="niva-tiling"
effect_id="niva-axis-effect"
script_dir="$HOME/.local/share/kwin/scripts/$script_id"
effect_dir="$HOME/.local/share/kwin/effects/$effect_id"

scripts/build.sh "$mode"

mkdir -p "$script_dir" "$effect_dir"
cp -r metadata.json contents "$script_dir"
cp -r effects/niva-axis-effect/metadata.json effects/niva-axis-effect/contents "$effect_dir"

echo "Installed Niva packages:"
echo "  KWin script: $script_dir"
echo "  KWin effect: $effect_dir"
echo
echo "Enable them in KDE System Settings:"
echo "  1. System Settings -> Window Management -> KWin Scripts -> enable Niva Tiling"
echo "  2. System Settings -> Window Management -> Desktop Effects -> enable Niva Axis Animation"
