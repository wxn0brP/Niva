import { state } from "./var";

export function getActiveWin() {
    return state.windows.find(w => w.active);
}

export function getActiveWinIndex() {
    const id = getActiveWin()?.internalId;
    return state.order.indexOf(id);
}

export function idToWin(id: string) {
    return state.windows.find(w => w.internalId === id);
}

export function getWinName(id: string) {
    return idToWin(id)?.caption;
}
