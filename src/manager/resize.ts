import { log } from "../logger";
import { render } from "./render";
import { getSettings } from "../settings";
import { syncState } from "./state";
import { getActiveWin, getWinName } from "./utils";
import { state } from "./var";

const WIDTH_PROFILES = [
	1 / 2,
	1,
	2 / 3,
	1 / 3,
];
let lastWidthProfileWindowId: string | undefined;
let widthProfileCounter = 0;

function profileWidth(profile: number, minWindowWidth: number): number {
	return Math.max(minWindowWidth, Math.round(state.monitorWidth * profile));
}

function nextWidthProfile(
	windowId: string,
	minWindowWidth: number,
): number {
	if (lastWidthProfileWindowId !== windowId) {
		lastWidthProfileWindowId = windowId;
		widthProfileCounter = 0;
	}

	const profile = WIDTH_PROFILES[widthProfileCounter];
	widthProfileCounter = (widthProfileCounter + 1) % WIDTH_PROFILES.length;
	return profileWidth(profile, minWindowWidth);
}

export function toggleWidthProfile() {
	syncState();

	const current = getActiveWin();
	if (!current) {
		log("no current window");
		return;
	}

	const settings = getSettings();
	const newWidth = nextWidthProfile(
		current.internalId,
		settings.minWindowWidth,
	);
	log(
		"toggle width profile " +
			getWinName(current.internalId) +
			" to " +
			newWidth,
	);

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
