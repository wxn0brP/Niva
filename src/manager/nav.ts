import { log } from "../logger";
import { render, rerenderActive } from "./render";
import { setMinimized } from "../windows";
import { syncState } from "./state";
import { getActiveWin, getActiveWinIndex } from "./utils";
import { state } from "./var";

export function previous() {
    syncState();

    if (state.order.length === 0) {
        log("no windows");
        return;
    }

    if (state.order.length === 1) {
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

    setMinimized(state.order[prevWinIndex], false);
    render(prevWinIndex);
}

export function next() {
    syncState();

    if (state.order.length === 0) {
        log("no windows");
        return;
    }

    if (state.order.length === 1) {
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

    if (nextWinIndex >= state.order.length) {
        log("next window does not exists");
        return;
    }

    setMinimized(state.order[nextWinIndex], false);
    render(nextWinIndex);
}
