import { WindowInfo } from "../windows";
import { idToWin } from "./utils";
import { state } from "./var";

export function updateMonitorFrom(window: WindowInfo) {
    state.monitorWidth = window.output?.geometry?.width ?? state.monitorWidth;
    state.monitorHeight = window.output?.geometry?.height ?? state.monitorHeight;
}

function windowDistanceToFocus(window: WindowInfo) {
    const focusX = state.monitorWidth > 0 ? state.monitorWidth / 2 : 0;
    const windowCenter = window.x + window.width / 2;

    return Math.abs(windowCenter - focusX);
}

export function findFallbackActiveWin() {
    const candidates = state.order
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

        return Math.abs(a.index - state.lastActiveIndex) - Math.abs(b.index - state.lastActiveIndex);
    });

    return candidates[0].window;
}
