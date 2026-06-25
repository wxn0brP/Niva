import { log } from "./logger";
import { debugState } from "./manager/debug";
import { toggleActiveTiling } from "./manager/detach";
import { moveLeft, moveRight } from "./manager/move";
import { next, previous } from "./manager/nav";
import { centerActive, rerenderActive } from "./manager/render";
import { resizeByStep, toggleFull } from "./manager/resize";
import { state } from "./manager/var";
import { setGeometry } from "./windows";

export function register() {
    registerShortcut("Niva Previous Window", "Niva: Previous window", "Meta+Num+1", function () {
        log("previous");
        previous();
    });

    registerShortcut("Niva Next Window", "Niva: Next window", "Meta+Num+2", function () {
        log("next");
        next();
    });

    registerShortcut("Niva Rerender Active Window", "Niva: Rerender active window", "Meta+Num+3", function () {
        log("rerender active");
        rerenderActive();
    });

    registerShortcut("Niva Move Left Window", "Niva: Move left window", "Meta+Num+4", function () {
        log("move left");
        moveLeft();
    });

    registerShortcut("Niva Move Right Window", "Niva: Move right window", "Meta+Num+5", function () {
        log("move right");
        moveRight();
    });

    registerShortcut("Niva Reset Windows", "Niva: Reset all windows", "Meta+Num+6", function () {
        log("reset all windows");
        state.windows.forEach(w => {
            setGeometry(w.internalId, {
                x: 0,
            });
        })
    });

    registerShortcut("Niva Toggle Window Size", "Niva: Toggle focused window size", "Meta+F", function () {
        log("toggle");
        toggleFull();
    });

    registerShortcut("Niva Center Active Window", "Niva: Center focused window", "Meta+C", function () {
        log("center");
        centerActive();
    });

    registerShortcut("Niva Toggle Active Window Tiling", "Niva: Toggle focused window tiling", "Meta+Shift+V", function () {
        log("toggle tiling");
        toggleActiveTiling();
    });

    registerShortcut("Niva Resize Window Smaller", "Niva: Resize focused window smaller", "Meta+Num+7", function () {
        log("resize smaller");
        resizeByStep(-1);
    });

    registerShortcut("Niva Resize Window Bigger", "Niva: Resize focused window bigger", "Meta+Num+8", function () {
        log("resize bigger");
        resizeByStep(1);
    });

    registerShortcut("Niva Debug State", "Niva: Debug state", "Meta+Num+9", function () {
        log("debug");
        debugState();
    });
}
