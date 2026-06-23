#!/usr/bin/env sh
set -eu

qdbus6 org.kde.KWin /Scripting org.kde.kwin.Scripting.loadScript "$PWD/contents/code/main.js" niva-tiling
qdbus6 org.kde.KWin /Scripting org.kde.kwin.Scripting.start
