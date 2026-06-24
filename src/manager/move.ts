import { log } from "../logger";
import { render } from "./render";
import { syncState } from "./state";
import { getActiveWinIndex } from "./utils";
import { state } from "./var";

export function moveLeft() {
    syncState();

    const activeIndex = getActiveWinIndex();
    if (activeIndex <= 0) {
        log("cannot move left, already first");
        return;
    }

    const activeId = state.order[activeIndex];
    const temp = activeId;
    state.order[activeIndex] = state.order[activeIndex - 1];
    state.order[activeIndex - 1] = temp;

    const newActiveWin = state.windows.find(w => w.internalId === activeId);
    if (newActiveWin) {
        render(activeIndex - 1, newActiveWin.width, true);
    }
}

export function moveRight() {
    syncState();

    const activeIndex = getActiveWinIndex();
    if (activeIndex >= state.order.length - 1) {
        log("cannot move right, already last");
        return;
    }

    const activeId = state.order[activeIndex];
    const temp = activeId;
    state.order[activeIndex] = state.order[activeIndex + 1];
    state.order[activeIndex + 1] = temp;

    const newActiveWin = state.windows.find(w => w.internalId === activeId);
    if (newActiveWin) {
        render(activeIndex + 1, newActiveWin.width, true);
    }
}
