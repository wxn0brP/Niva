import { log } from "../logger";
import { render } from "./render";
import { getSettings } from "../settings";
import { syncState } from "./state";
import { getActiveWin, getWinName } from "./utils";
import { state } from "./var";

const WIDTH_PROFILES = [1 / 3, 1 / 2, 2 / 3, 1];
const WIDTH_EPSILON = 1;

function profileWidth(profile: number, minWindowWidth: number): number {
    return Math.max(minWindowWidth, Math.round(state.monitorWidth * profile));
}

function nextWidthProfile(currentWidth: number, minWindowWidth: number): number {
    const widths = WIDTH_PROFILES.map(profile => profileWidth(profile, minWindowWidth));
    const nextWidth = widths.find(width => width > currentWidth + WIDTH_EPSILON);

    return nextWidth === undefined ? widths[0] : nextWidth;
}

export function toggleWidthProfile() {
    syncState();

    const current = getActiveWin();
    if (!current) {
        log("no current window");
        return;
    }

    const settings = getSettings();
    const newWidth = nextWidthProfile(current.width, settings.minWindowWidth);
    log("toggle width profile " + getWinName(current.internalId) + " to " + newWidth);

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
