#!/usr/bin/env sh
set -eu

if ! command -v kwriteconfig6 >/dev/null 2>&1; then
	echo "kwriteconfig6 is required (KDE Frameworks 6)." >&2
	exit 1
fi

config_dir="${XDG_CONFIG_HOME:-$HOME/.config}"
config_file="$config_dir/kglobalshortcutsrc"

printf 'Apply the recommended Niva and KDE shortcuts to %s? [y/N] ' "$config_file"
read -r answer
case "$answer" in
	y|Y|yes|YES|Yes) ;;
	*)
		echo "Shortcut changes cancelled."
		exit 0
		;;
esac

mkdir -p "$config_dir"
if [ -f "$config_file" ]; then
	backup_file="$config_file.backup.$(date +%Y%m%d%H%M%S)"
	cp -- "$config_file" "$backup_file"
	printf 'Saved shortcut backup to %s\n' "$backup_file"
fi

set_shortcut() {
	kwriteconfig6 --file "$config_file" --group kwin --key "$1" "$2,none,$3"
}

set_shortcut "Niva Previous Window" "Meta+Left" "Niva: Previous window"
set_shortcut "Niva Next Window" "Meta+Right" "Niva: Next window"
set_shortcut "Niva Move Left Window" "Meta+Ctrl+Left" "Niva: Move left window"
set_shortcut "Niva Move Right Window" "Meta+Ctrl+Right" "Niva: Move right window"
set_shortcut "Niva Resize Window Smaller" "Meta+Down" "Niva: Resize focused window smaller"
set_shortcut "Niva Resize Window Bigger" "Meta+Up" "Niva: Resize focused window bigger"
set_shortcut "Niva Toggle Window Size" "Meta+F" "Niva: Cycle focused window width"
set_shortcut "Niva Center Active Window" "Meta+C" "Niva: Center focused window"

set_shortcut "Window Quick Tile Left" "Meta+Shift+Left" "Quick Tile Window to the Left"
set_shortcut "Window Quick Tile Right" "Meta+Shift+Right" "Quick Tile Window to the Right"
set_shortcut "Window Quick Tile Top" "Meta+Shift+Up" "Quick Tile Window to the Top"
set_shortcut "Window Quick Tile Bottom" "Meta+Shift+Down" "Quick Tile Window to the Bottom"
set_shortcut "Switch One Desktop to the Left" "Meta+Ctrl+Alt+Left" "Switch One Desktop to the Left"
set_shortcut "Switch One Desktop to the Right" "Meta+Ctrl+Alt+Right" "Switch One Desktop to the Right"
set_shortcut "Switch One Desktop Up" "Meta+Ctrl+Alt+Up" "Switch One Desktop Up"
set_shortcut "Switch One Desktop Down" "Meta+Ctrl+Alt+Down" "Switch One Desktop Down"
set_shortcut "Window to Next Screen" "Meta+Ctrl+Alt+Shift+Right" "Move Window to Next Screen"
set_shortcut "Window to Previous Screen" "Meta+Ctrl+Alt+Shift+Left" "Move Window to Previous Screen"
set_shortcut "Switch Window Left" "Meta+Alt+Left" "Switch to Window to the Left"
set_shortcut "Switch Window Right" "Meta+Alt+Right" "Switch to Window to the Right"
set_shortcut "Switch Window Up" "Meta+Alt+Up" "Switch to Window Above"
set_shortcut "Switch Window Down" "Meta+Alt+Down" "Switch to Window Below"
set_shortcut "Cube" "Meta+Alt+C" "Toggle Cube"

if command -v qdbus6 >/dev/null 2>&1; then
	qdbus6 org.kde.KWin /KWin org.kde.KWin.reconfigure >/dev/null 2>&1 || true
fi

echo "Recommended shortcuts written to $config_file. Log out and back in if KDE does not apply them immediately."
