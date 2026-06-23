#!/usr/bin/env sh
set -eu

effect_id="niva-axis-effect"

qdbus6 org.kde.KWin /Effects org.kde.kwin.Effects.unloadEffect "$effect_id" || true
rm -rf "$HOME/.local/share/kwin/effects/$effect_id"
