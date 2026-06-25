import type { KWinRect, KWinWindow } from "../kwin";
import { log } from "../logger";
import { isConfiguredWindowAllowed, isNormalWindow, setGeometry } from "../windows";
import { render } from "./render";
import { syncState } from "./state";
import { state } from "./var";

const FULL_WIDTH_RATIO = 0.8;

function isDetached(windowId: string) {
    return state.detachedWindowIds.indexOf(windowId) !== -1;
}

function getScreenGeometry(window: KWinWindow): KWinRect {
    return window.output?.geometry ||
        workspace.virtualScreenGeometry || {
            x: 0,
            y: 0,
            width: state.monitorWidth,
            height: state.monitorHeight
        };
}

function resizeDetachedWindow(window: KWinWindow) {
    const screen = getScreenGeometry(window);
    if (screen.width <= 0 || screen.height <= 0) {
        log("cannot resize detached window, unknown screen geometry");
        return;
    }

    if (window.frameGeometry.width > screen.width * FULL_WIDTH_RATIO) {
        return;
    }

    const width = screen.width / 2;
    const height = screen.height / 2;

    setGeometry(window.internalId, {
        x: screen.x + (screen.width - width) / 2,
        y: screen.y + (screen.height - height) / 2,
        width,
        height
    });
}

function detachWindow(window: KWinWindow) {
    const windowId = window.internalId;

    if (!isDetached(windowId)) {
        state.detachedWindowIds.push(windowId);
    }

    resizeDetachedWindow(window);
    state.order = state.order.filter(id => id !== windowId);
    state.windows = state.windows.filter(window => window.internalId !== windowId);
    log("detached " + window.caption);
}

function attachWindow(windowId: string, caption: string, width: number) {
    state.detachedWindowIds = state.detachedWindowIds.filter(id => id !== windowId);
    syncState();

    const activeIndex = state.order.indexOf(windowId);
    if (activeIndex < 0) {
        log("attached window not found in axis");
        return;
    }

    log("attached " + caption);
    render(activeIndex, width, true);
}

export function toggleActiveTiling() {
    const window = workspace.activeWindow;
    if (!window) {
        log("no active window");
        return;
    }

    if (!isNormalWindow(window) || !isConfiguredWindowAllowed(window)) {
        log("active window cannot be tiled");
        return;
    }

    const windowId = window.internalId;
    const caption = window.caption;

    if (isDetached(windowId)) {
        attachWindow(windowId, caption, window.frameGeometry.width);
        return;
    }

    detachWindow(window);
}
