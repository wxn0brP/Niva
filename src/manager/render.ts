import { log } from "../logger";
import { syncState } from "./state";
import { getActiveWin, getActiveWinIndex, getWinName, idToWin } from "./utils";
import { state } from "./var";
import { setActive, setGeometry, setMinimized } from "../windows";

export function render(index: number, newWidth?: number, forceLayout = false) {
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

    let currentX = 0;
    const rawX = widths.map(width => {
        const pos = currentX;
        currentX += width;
        return pos;
    });

    const offset = rawX[index];
    const x = rawX.map(pos => pos - offset);

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

