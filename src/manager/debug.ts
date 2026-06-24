import { log } from "../logger";
import { syncState } from "./state";
import { getActiveWin, getActiveWinIndex, idToWin } from "./utils";
import { state } from "./var";

export function debugState() {
    syncState();

    const active = getActiveWin();
    const activeIndex = getActiveWinIndex();

    log("active: " + (active ? active.caption + " id=" + active.internalId : "none"), true);
    log("active index: " + activeIndex, true);
    log("monitor: " + state.monitorWidth + "x" + state.monitorHeight, true);
    log("axis length: " + state.order.length, true);

    state.order.forEach((id, index) => {
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
