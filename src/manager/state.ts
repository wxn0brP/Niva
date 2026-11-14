import { log } from "../logger";
import { getSettings } from "../settings";
import {
	getWindows,
	isFullWidthWindow,
	isHalfWidthWindow,
	listNormalWindowIds,
	setActive,
	setGeometry,
} from "../windows";
import { getActiveWin, getActiveWinIndex, idToWin } from "./utils";
import { state } from "./var";
import { findFallbackActiveWin, updateMonitorFrom } from "./win.util";

export function syncState(activeWindowId?: string) {
	cleanupDetachedWindowIds();

	state.windows = getWindows();

	// Remove windows that no longer exist
	state.order = state.order.filter(id => idToWin(id) !== undefined);

	// Add new windows
	const newWindows = state.windows.filter(
		w => state.order.find(id => id === w.internalId) === undefined,
	);
	newWindows.forEach(window => {
		const screen =
			window.output?.geometry || workspace.virtualScreenGeometry;
		if (
			!screen ||
			screen.width <= 0 ||
			screen.height <= 0
		) {
			return;
		}

		const isFullWidth = isFullWidthWindow(window.window);
		const isHalfWidth = isHalfWidthWindow(window.window);
		const isTallWindow = window.height > screen.height * 0.75;
		if (!isFullWidth && !isHalfWidth && !isTallWindow) {
			return;
		}

		const width = isFullWidth || (!isHalfWidth && isTallWindow)
			? screen.width
			: screen.width / 2;
		window.width = width;
		window.height = screen.height;
		setGeometry(window.internalId, {
			x: screen.x + screen.width,
			y: screen.y,
			width,
			height: screen.height,
		});
	});
	addNewWindows(newWindows.map(w => w.internalId));

	if (activeWindowId !== undefined) {
		if (
			!state.windows.find(window => window.internalId === activeWindowId)
		) {
			return;
		}

		markActiveInSnapshot(activeWindowId);
	}

	let current = getActiveWin();

	if (!current) {
		if (state.order.length === 0) {
			log("no active window and not enough windows for fallback");
			return;
		}

		current = findFallbackActiveWin();

		if (current) {
			log("no active window, focusing fallback " + current.caption);
			const fallbackId = current.internalId;
			setActive(current.internalId);
			state.windows = getWindows();
			current = getActiveWin();

			if (!current) {
				markActiveInSnapshot(fallbackId);
				current = getActiveWin();
			}
		}
	}

	if (current) {
		updateMonitorFrom(current);

		const activeIndex = state.order.indexOf(current.internalId);
		if (activeIndex >= 0) {
			state.lastActiveIndex = activeIndex;
		}
	}
}

function cleanupDetachedWindowIds() {
	const normalWindowIds = listNormalWindowIds();
	state.detachedWindowIds = state.detachedWindowIds.filter(
		id => normalWindowIds.indexOf(id) !== -1,
	);
}

function addNewWindows(windowIds: string[]) {
	if (windowIds.length === 0) {
		return;
	}

	const settings = getSettings();

	if (settings.insertPolicy === "end" || state.order.length === 0) {
		state.order = state.order.concat(windowIds);
		return;
	}

	const activeIndex = getActiveWinIndex();
	const anchorIndex =
		activeIndex >= 0
			? activeIndex
			: Math.min(state.lastActiveIndex, state.order.length - 1);

	state.order.splice(anchorIndex + 1, 0, ...windowIds);
}

function markActiveInSnapshot(windowId: string) {
	state.windows.forEach(window => {
		window.active = window.internalId === windowId;
	});
}
