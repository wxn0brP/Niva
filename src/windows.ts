import type { KWinOutput, KWinRect, KWinWindow } from "./kwin";
import { state } from "./manager/var";
import { getSettings } from "./settings";

export interface WindowInfo {
    window: KWinWindow;
    caption: string;
    resourceClass: string;
    resourceName: string;
    pid: number;
    internalId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    geometry: KWinRect;
    minimized: boolean;
    active: boolean;
    desktop: unknown;
    output: KWinOutput;
}

export interface WindowSnapshot {
    caption: string;
    resourceClass: string;
    resourceName: string;
    pid: number;
    internalId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    minimized: boolean;
    active: boolean;
}

export interface GeometryPatch {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
}

export function listWindows(): KWinWindow[] {
    return workspace.windowList();
}

export function getWindow(windowId: string): KWinWindow | undefined {
    return listWindows().find(w => w.internalId === windowId);
}

export function isNormalWindow(window: KWinWindow): boolean {
    return window.normalWindow === true &&
        window.deleted !== true &&
        window.skipTaskbar !== true &&
        window.skipSwitcher !== true;
}

export function listNormalWindows(): KWinWindow[] {
    return listWindows().filter(isNormalWindow);
}

export function listNormalWindowIds(): string[] {
    return listNormalWindows().map(window => window.internalId);
}

function lower(value: string | undefined): string {
    return String(value || "").toLowerCase();
}

export function isConfiguredWindowAllowed(window: KWinWindow): boolean {
    const settings = getSettings();
    const resourceClass = lower(window.resourceClass);
    const resourceName = lower(window.resourceName);

    return settings.ignoredResourceClasses.indexOf(resourceClass) === -1 &&
        settings.ignoredResourceNames.indexOf(resourceName) === -1;
}

export function listTiledWindows(): KWinWindow[] {
    return listNormalWindows()
        .filter(isConfiguredWindowAllowed)
        .filter(window => state.detachedWindowIds.indexOf(window.internalId) === -1);
}

export function rectToObject(rect: KWinRect): KWinRect {
    return {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height
    };
}

export function normalizeRect(rect: KWinRect): KWinRect {
    return {
        x: Number(rect.x),
        y: Number(rect.y),
        width: Number(rect.width),
        height: Number(rect.height)
    };
}

export function windowInfo(window: KWinWindow): WindowInfo {
    var geometry = rectToObject(window.frameGeometry);

    return {
        window: window,
        caption: window.caption,
        resourceClass: window.resourceClass,
        resourceName: window.resourceName,
        pid: window.pid,
        internalId: window.internalId,
        x: geometry.x,
        y: geometry.y,
        width: geometry.width,
        height: geometry.height,
        geometry: geometry,
        minimized: window.minimized,
        active: window.active,
        desktop: window.desktop,
        output: window.output
    };
}

export function getWindows(): WindowInfo[] {
    return listTiledWindows().map(windowInfo);
}

export function getWindowSnapshots(): WindowSnapshot[] {
    return getWindows().map(function (window) {
        return {
            caption: window.caption,
            resourceClass: window.resourceClass,
            resourceName: window.resourceName,
            pid: window.pid,
            internalId: window.internalId,
            x: window.x,
            y: window.y,
            width: window.width,
            height: window.height,
            minimized: window.minimized,
            active: window.active
        };
    });
}

export function setGeometry(windowId: string, geometry: GeometryPatch) {
    const window = getWindow(windowId);
    const current = rectToObject(window.frameGeometry);
    const next = normalizeRect({
        x: geometry.x === undefined ? current.x : geometry.x,
        y: geometry.y === undefined ? current.y : geometry.y,
        width: geometry.width === undefined ? current.width : geometry.width,
        height: geometry.height === undefined ? current.height : geometry.height
    });

    window.frameGeometry = next;
}

export function setMinimized(windowId: string, minimized: boolean) {
    const window = getWindow(windowId);
    window.minimized = Boolean(minimized);
}

export function setActive(windowId: string) {
    const window = getWindow(windowId);
    workspace.activeWindow = window;
}
