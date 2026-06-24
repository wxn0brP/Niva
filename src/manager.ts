import { log } from "./logger";
import { getSettings } from "./settings";
import { getWindows, setActive, setGeometry, setMinimized, WindowInfo } from "./windows";

let windows: WindowInfo[] = [];
let array: string[] = [];
let monitorWidth = 0;
let monitorHeight = 0;
let lastActiveIndex = 0;

function getActiveWin() {
    return windows.find(w => w.active);
}

function getActiveWinIndex() {
    const id = getActiveWin()?.internalId;
    return array.indexOf(id);
}

function updateMonitorFrom(window: WindowInfo) {
    monitorWidth = window.output?.geometry?.width ?? monitorWidth;
    monitorHeight = window.output?.geometry?.height ?? monitorHeight;
}

function windowDistanceToFocus(window: WindowInfo) {
    const focusX = monitorWidth > 0 ? monitorWidth / 2 : 0;
    const windowCenter = window.x + window.width / 2;

    return Math.abs(windowCenter - focusX);
}

function findFallbackActiveWin() {
    const candidates = array
        .map((id, index) => ({
            index,
            window: idToWin(id)
        }))
        .filter(item => item.window !== undefined);

    if (candidates.length === 0) {
        return undefined;
    }

    candidates.sort((a, b) => {
        const distance = windowDistanceToFocus(a.window) - windowDistanceToFocus(b.window);
        if (distance !== 0) {
            return distance;
        }

        return Math.abs(a.index - lastActiveIndex) - Math.abs(b.index - lastActiveIndex);
    });

    return candidates[0].window;
}

function markActiveInSnapshot(windowId: string) {
    windows.forEach(window => {
        window.active = window.internalId === windowId;
    });
}

function syncState() {
    windows = getWindows();

    // Remove windows that no longer exist
    array = array.filter(id => idToWin(id) !== undefined);

    // Add new windows
    const newWindows = windows.filter(w => array.find(id => id === w.internalId) === undefined);
    addNewWindows(newWindows.map(w => w.internalId));

    let current = getActiveWin();

    if (!current) {
        if (array.length == 0) {
            log("no active window and not enough windows for fallback");
            return;
        }

        current = findFallbackActiveWin();

        if (current) {
            log("no active window, focusing fallback " + current.caption);
            const fallbackId = current.internalId;
            setActive(current.internalId);
            windows = getWindows();
            current = getActiveWin();

            if (!current) {
                markActiveInSnapshot(fallbackId);
                current = getActiveWin();
            }
        }
    }

    if (current) {
        updateMonitorFrom(current);

        const activeIndex = array.indexOf(current.internalId);
        if (activeIndex >= 0) {
            lastActiveIndex = activeIndex;
        }
    }
}

function addNewWindows(windowIds: string[]) {
    if (windowIds.length === 0) {
        return;
    }

    const settings = getSettings();

    if (settings.insertPolicy === "end" || array.length === 0) {
        array = array.concat(windowIds);
        return;
    }

    const activeIndex = getActiveWinIndex();
    const anchorIndex = activeIndex >= 0 ? activeIndex : Math.min(lastActiveIndex, array.length - 1);

    array.splice(anchorIndex + 1, 0, ...windowIds);
}

function getWinName(id: string) {
    return idToWin(id)?.caption;
}

function idToWin(id: string) {
    return windows.find(w => w.internalId === id);
}

function render(index: number, newWidth?: number, forceLayout = false) {
    const current = windows.find(w => w.internalId === array[index]);
    if (!current) {
        log("no current window");
        return;
    }

    const isFullyVisibleAndPositioned = !forceLayout && !newWidth && current.x + current.width <= monitorWidth && current.x >= 0;

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
        const isOutOfBounds = pos > monitorWidth || pos + width <= 0;

        setMinimized(array[i], false);

        setGeometry(array[i], {
            x: pos,
            y: 0,
            height: monitorHeight,
            width,
        });

        if (isOutOfBounds) {
            log("[" + i + "] target out of bounds");
        }
    });

    setActive(array[index]);

    log("index: " + getActiveWinIndex());
}

export function previous() {
    syncState();

    if (array.length === 0) {
        log("no windows");
        return;
    }

    if (array.length === 1) {
        log("only one window");
        rerenderActive();
        return;
    }

    const current = getActiveWin();
    if (!current) {
        log("no current window");
        return;
    }

    const active = getActiveWinIndex();
    const prevWinIndex = active - 1;

    if (prevWinIndex < 0) {
        log("previous window does not exists");
        return;
    }

    setMinimized(array[prevWinIndex], false);
    render(prevWinIndex);
}

export function next() {
    syncState();

    if (array.length === 0) {
        log("no windows");
        return;
    }

    if (array.length === 1) {
        log("only one window");
        rerenderActive();
        return;
    }

    const current = getActiveWin();
    if (!current) {
        log("no current window");
        return;
    }

    const active = getActiveWinIndex();
    const nextWinIndex = active + 1;

    if (nextWinIndex >= array.length) {
        log("next window does not exists");
        return;
    }

    setMinimized(array[nextWinIndex], false);
    render(nextWinIndex);
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

export function debugState() {
    syncState();

    const active = getActiveWin();
    const activeIndex = getActiveWinIndex();

    log("active: " + (active ? active.caption + " id=" + active.internalId : "none"), true);
    log("active index: " + activeIndex, true);
    log("monitor: " + monitorWidth + "x" + monitorHeight, true);
    log("axis length: " + array.length, true);

    array.forEach((id, index) => {
        const win = idToWin(id);

        if (!win) {
            log("[" + index + "] missing id=" + id, true);
            return;
        }

        log("[" + index + "] " + win.caption +
            " id=" + win.internalId +
            " active=" + win.active +
            " minimized=" + win.minimized +
            " x=" + win.x +
            " y=" + win.y +
            " width=" + win.width +
            " height=" + win.height,
            true
        );
    });
}

export function toggleFull() {
    syncState();

    const current = getActiveWin();
    if (!current) {
        log("no current window");
        return;
    }

    const newWidth = current.width === monitorWidth ? monitorWidth / 2 : monitorWidth;
    log("toggle " + getWinName(current.internalId) + " to " + newWidth);

    syncState();
    render(array.indexOf(current.internalId), newWidth);
}

export function resizeBy(delta: number) {
    syncState();

    const current = getActiveWin();
    if (!current) {
        log("no current window");
        return;
    }

    const settings = getSettings();
    const newWidth = Math.max(settings.minWindowWidth, current.width + delta);

    log("resized to: " + newWidth);
    syncState();
    render(array.indexOf(current.internalId), newWidth);
}

export function resizeByStep(direction: -1 | 1) {
    const settings = getSettings();
    resizeBy(settings.resizeStep * direction);
}

export function moveLeft() {
    syncState();

    const activeIndex = getActiveWinIndex();
    if (activeIndex <= 0) {
        log("cannot move left, already first");
        return;
    }

    const activeId = array[activeIndex];
    const temp = activeId;
    array[activeIndex] = array[activeIndex - 1];
    array[activeIndex - 1] = temp;

    const newActiveWin = windows.find(w => w.internalId === activeId);
    if (newActiveWin) {
        render(activeIndex - 1, newActiveWin.width, true);
    }
}

export function moveRight() {
    syncState();

    const activeIndex = getActiveWinIndex();
    if (activeIndex >= array.length - 1) {
        log("cannot move right, already last");
        return;
    }

    const activeId = array[activeIndex];
    const temp = activeId;
    array[activeIndex] = array[activeIndex + 1];
    array[activeIndex + 1] = temp;

    const newActiveWin = windows.find(w => w.internalId === activeId);
    if (newActiveWin) {
        render(activeIndex + 1, newActiveWin.width, true);
    }
}
