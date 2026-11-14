import "./manager/var";

import type { KWinWindow } from "./kwin";
import { log } from "./logger";
import { revealWindow } from "./manager/render";
import { state } from "./manager/var";
import { register } from "./shortcuts";
import {
	consumeProgrammaticActivation,
	isConfiguredWindowAllowed,
	isNormalWindow,
} from "./windows";

declare const __VERSION__: string;
declare const __DEV_BUILD__: number;
const devBuild = __DEV_BUILD__;

workspace.windowActivated?.connect((window: KWinWindow | null) => {
	if (consumeProgrammaticActivation(window?.internalId)) {
		return;
	}

	if (
		!window ||
		workspace.activeWindow?.internalId !== window.internalId ||
		!isNormalWindow(window) ||
		!isConfiguredWindowAllowed(window) ||
		state.detachedWindowIds.indexOf(window.internalId) !== -1
	) {
		return;
	}

	revealWindow(window.internalId);
});

register();

log("loaded " + __VERSION__ + (devBuild > 0 ? "." + devBuild : ""), true);
