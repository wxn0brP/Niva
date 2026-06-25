import { log } from "../logger";
import { syncState } from "./state";
import { getActiveWin, getActiveWinIndex, getWinName, idToWin } from "./utils";
import { state } from "./var";
import { setActive, setGeometry, setMinimized } from "../windows";
import { getSettings } from "../settings";

export function render(index: number, newWidth?: number, forceLayout = false, targetXOverride?: number) {
    const array = state.order;

    const current = state.windows.find(w => w.internalId === array[index]);
    if (!current) {
        log("no current window");
        return;
    }

    const isFullyVisibleAndPositioned =
        !forceLayout &&
        !newWidth &&
        current.x + current.width <= state.monitorWidth &&
        current.x >= 0;

    if (isFullyVisibleAndPositioned) {
        log("window already fully visible and positioned, just activating");
        setActive(current.internalId);
        return;
    }

    const sortedWin = array.map(id => idToWin(id));
    const widths = array.map((id, i) => i === index ? newWidth || sortedWin[i].width : sortedWin[i].width);
    const settings = getSettings();
    const halfMonitorWidth = state.monitorWidth / 2;
    const previousActiveIndex = getActiveWinIndex();
    const previousActive = getActiveWin();

    let currentX = 0;
    const rawX = widths.map(width => {
        const pos = currentX;
        currentX += width;
        return pos;
    });

    const offset = rawX[index];
    const activeWidth = widths[index];
    const prevWidth = index > 0 ? widths[index - 1] : undefined;
    const isMovingNext = previousActiveIndex < index;
    const isActiveFullWidth = activeWidth >= state.monitorWidth;

    const isPreviousActiveOnRight =
        previousActive !== undefined &&
        previousActive.x >= halfMonitorWidth &&
        previousActive.x < state.monitorWidth;

    const hasWidePreviousNeighbor =
        prevWidth !== undefined &&
        prevWidth > halfMonitorWidth &&
        prevWidth <= state.monitorWidth + settings.resizeStep;

    let targetX = 0;

    // Default render puts the target window at x=0. The only exception is a
    // next-step from a direct left neighbor, where keeping part of that
    // neighbor visible makes the axis feel like it scrolls by about half a
    // screen instead of hard-snapping each window to the left edge.
    if (isMovingNext && !isActiveFullWidth && prevWidth !== undefined) {
        if (isPreviousActiveOnRight) {
            // The previous focus was already the right-hand pane. Move it to
            // the left so the new target appears immediately to its right.
            targetX = prevWidth;
        } else if (hasWidePreviousNeighbor) {
            // A wide left neighbor should remain partially visible, while the
            // new target is aligned to the right side of the monitor.
            targetX = state.monitorWidth - activeWidth;
        }
    }

    if (targetXOverride !== undefined) {
        targetX = targetXOverride;
    }

    const x = rawX.map(pos => pos - offset + targetX);

    x.forEach((pos, i) => {
        log("[" + i + "] " + getWinName(array[i]) + " x: " + pos + " width: " + widths[i]);

        const width = i === index ? newWidth || sortedWin[i].width : sortedWin[i].width;
        const isOutOfBounds = pos > state.monitorWidth || pos + width <= 0;

        setMinimized(array[i], false);

        setGeometry(array[i], {
            x: pos,
            y: 0,
            height: state.monitorHeight,
            width,
        });

        if (isOutOfBounds) {
            log("[" + i + "] target out of bounds");
        }
    });

    setActive(array[index]);

    log("index: " + getActiveWinIndex());
}

export function rerenderActive() {
    syncState();

    const current = getActiveWin();
    if (!current) {
        log("no current window");
        return;
    }

    const activeIndex = getActiveWinIndex();
    if (activeIndex < 0) {
        log("active window not found in axis");
        return;
    }

    log("rerender active " + getWinName(current.internalId));
    render(activeIndex, current.width, true);
}

export function centerActive() {
    syncState();

    const current = getActiveWin();
    if (!current) {
        log("no current window");
        return;
    }

    const activeIndex = getActiveWinIndex();
    if (activeIndex < 0) {
        log("active window not found in axis");
        return;
    }

    const targetX = (state.monitorWidth - current.width) / 2;
    log("center active " + getWinName(current.internalId) + " at x: " + targetX);
    render(activeIndex, current.width, true, targetX);
}
