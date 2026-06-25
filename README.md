# Niva

Niva is a KWin script that adds a scrollable, Niri-like window axis to KDE Plasma.
It keeps normal KWin behavior intact and only appears when you use its shortcuts.

## Shortcuts

- `Meta+Num+1` - previous window on the axis
- `Meta+Num+2` - next window on the axis
- `Meta+Num+3` - force rerender around the active window
- `Meta+Num+4` - move active window left in the axis
- `Meta+Num+5` - move active window right in the axis
- `Meta+Num+6` - reset all windows
- `Meta+Num+7` - shrink active window
- `Meta+Num+8` - grow active window
- `Meta+Num+9` - log debug state
- `Meta+F` -     toggle active window width (half or full screen)
- `Meta+C` -     center active window

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
