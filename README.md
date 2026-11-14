# Niva

Niva is a KWin script that adds a scrollable, Niri-like window axis to KDE Plasma.
It keeps normal KWin behavior intact and only appears when you use its shortcuts.

## Default shortcuts

These are the default shortcuts registered in `src/shortcuts.ts`. They avoid conflicts with KDE's default shortcuts.

| Shortcut | Action |
| --- | --- |
| `Meta+Num+1` | Focus the previous window on the axis |
| `Meta+Num+2` | Focus the next window on the axis |
| `Meta+Num+3` | Rerender around the active window |
| `Meta+Num+4` | Move the active window left on the axis |
| `Meta+Num+5` | Move the active window right on the axis |
| `Meta+Num+6` | Reset all windows |
| `Meta+Num+7` | Shrink the active window |
| `Meta+Num+8` | Grow the active window |
| `Meta+Num+9` | Log debug state |
| `Meta+F` | Cycle the active window width |
| `Meta+C` | Center the active window |
| `Meta+Shift+V` | Toggle tiling for the active window |

## Recommended bindings

These are the bindings configured in KDE for this setup. KWin stores them in its shortcut settings, so they override the defaults registered by the script.

### Niva

| Shortcut | Action |
| --- | --- |
| `Meta+Left` | Focus the previous window on the axis |
| `Meta+Right` | Focus the next window on the axis |
| `Meta+Ctrl+Left` | Move the active window left on the axis |
| `Meta+Ctrl+Right` | Move the active window right on the axis |
| `Meta+Down` | Shrink the active window |
| `Meta+Up` | Grow the active window |
| `Meta+F` | Cycle width: 1/2, full width, 2/3, 1/3 |
| `Meta+C` | Center the active window |

### KDE fallback shortcuts

| Shortcut | KDE action |
| --- | --- |
| `Meta+Shift+Left/Right/Up/Down` | Quick tile the active window in that direction |
| `Meta+Ctrl+Alt+Left/Right/Up/Down` | Switch virtual desktops in that direction |
| `Meta+Ctrl+Alt+Shift+Right` | Move the active window to the next screen |
| `Meta+Ctrl+Alt+Shift+Left` | Move the active window to the previous screen |
| `Meta+Alt+Left/Right/Up/Down` | Focus a KDE window in that direction |
| `Meta+Alt+C` | Toggle the KWin Cube effect |

## Configure shortcuts

To apply the recommended bindings automatically on KDE Plasma 6, run:

```sh
./scripts/apply-shortcuts.sh
```

The script backs up `kglobalshortcutsrc` before changing it. To set up the same bindings manually:

1. Open `System Settings -> Keyboard -> Shortcuts`.
2. Search for each `Niva:` action and assign the shortcuts from the table above.
3. Search for `Quick Tile Window`, `Switch One Desktop`, and `Move Window to Next/Previous Screen`. Assign the KDE fallback shortcuts shown above.
4. Search for `Toggle Cube` and assign `Meta+Alt+C`.
5. Accept KDE's prompt to replace any conflicting shortcut, then apply the changes.

The Niva action names are `Previous window`, `Next window`, `Move left window`, `Move right window`, `Resize focused window smaller`, `Resize focused window bigger`, `Cycle focused window width`, and `Center focused window`.

## Prerequisites

- KWin/KDE 6
- Bun

## Install

Build and copy the KWin script and animation effect into your local KDE data directory:

```sh
./scripts/install.sh
```

Then enable both parts in KDE System Settings:

- `System Settings -> Window Management -> KWin Scripts -> Niva Tiling`
- `System Settings -> Window Management -> Desktop Effects -> Niva Axis Animation`

## Backstory

I liked Niri's scrollable tiling, but I missed KDE too much to replace it.
Niva keeps KDE as the main desktop and adds that axis workflow only when it is useful.

## License

MIT.
