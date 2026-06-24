import { log } from "../logger";
import { render } from "./render";
import { getSettings } from "../settings";
import { syncState } from "./state";
import { getActiveWin, getWinName } from "./utils";
import { state } from "./var";

export function toggleFull() {
    syncState();

    const current = getActiveWin();
    if (!current) {
        log("no current window");
        return;
    }

    const newWidth = current.width === state.monitorWidth ? state.monitorWidth / 2 : state.monitorWidth;
    log("toggle " + getWinName(current.internalId) + " to " + newWidth);

    syncState();
    render(state.order.indexOf(current.internalId), newWidth);
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
    render(state.order.indexOf(current.internalId), newWidth);
}

export function resizeByStep(direction: -1 | 1) {
    const settings = getSettings();
    resizeBy(settings.resizeStep * direction);
}
