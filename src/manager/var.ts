import { WindowInfo } from "../windows";

export const state = {
    windows: [] as WindowInfo[],
    order: [] as string[],
    detachedWindowIds: [] as string[],
    monitorWidth: 0,
    monitorHeight: 0,
    lastActiveIndex: 0,
}
