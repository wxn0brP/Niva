import { log } from "./logger";
import { debugState } from "./manager/debug";
import { moveLeft, moveRight } from "./manager/move";
import { next, previous } from "./manager/nav";
import { resizeByStep, toggleFull } from "./manager/resize";
import { rerenderActive } from "./manager/render";

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

    registerShortcut("Niva Toggle Window Size", "Niva: Toggle focused window size", "Meta+F", function () {
        log("toggle");
        toggleFull();
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
