#!/usr/bin/env sh
set -eu

qdbus6 org.kde.KWin /Scripting org.kde.kwin.Scripting.unloadScript niva-tiling || true
scripts/load.sh
