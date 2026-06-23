declare const __DEV__: boolean;

interface KWinRect {
    x: number;
    y: number;
    width: number;
    height: number;
}

type KWinSignalCallback = (...args: unknown[]) => void;

interface KWinEffectWindow {
    caption?: string;
    deleted?: boolean;
    minimized?: boolean;
    normalWindow?: boolean;
    skipSwitcher?: boolean;
    geometry?: KWinRect;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    windowFrameGeometryChanged?: KWinSignal<KWinSignalCallback>;
    windowGeometryShapeChanged?: KWinSignal<KWinSignalCallback>;
    geometryChanged?: KWinSignal<KWinSignalCallback>;
}

interface KWinSignal<T extends KWinSignalCallback> {
    connect(callback: T): void;
}

interface KWinEffects {
    stackingOrder?: KWinEffectWindow[] | Record<string, unknown>;
    windowAdded?: KWinSignal<(window: KWinEffectWindow) => void>;
    windowFrameGeometryChanged?: KWinSignal<(window: KWinEffectWindow, oldGeometry: KWinRect) => void>;
    windowGeometryShapeChanged?: KWinSignal<(window: KWinEffectWindow, oldGeometry: KWinRect) => void>;
    animationsSupported?: boolean;
}

interface KWinAnimationPoint {
    value1: number;
    value2: number;
}

interface KWinAnimation {
    type: number;
    from: KWinAnimationPoint;
    to: KWinAnimationPoint;
}

interface KWinAnimationOptions {
    window: KWinEffectWindow;
    duration: number;
    curve?: number;
    animations: KWinAnimation[];
}

declare const effects: KWinEffects;
declare const Effect: {
    Translation: number;
    Size: number;
};
declare const QEasingCurve: {
    OutCubic?: number;
};
declare function animate(options: KWinAnimationOptions): number[] | number;
declare function cancel(animationIds: number[] | number): boolean;
declare function animationTime(duration: number): number;
declare function print(message: string): void;

const BASE_DURATION_MS = 220;
const MIN_DELTA_PX = 2;

const connectedWindows: KWinEffectWindow[] = [];
const lastGeometry: Array<{ window: KWinEffectWindow; geometry: KWinRect }> = [];
const activeAnimations: Array<{ window: KWinEffectWindow; ids: number[] }> = [];

function log(message: string) {
    if (__DEV__) {
        print("[Niva Axis Effect] " + message);
    }
}

function describeValue(value: unknown): string {
    if (value === undefined) {
        return "undefined";
    }

    if (value === null) {
        return "null";
    }

    if (Array.isArray(value)) {
        return "array(" + value.length + ")";
    }

    return typeof value;
}

function valueLength(value: unknown): number | undefined {
    if (!value || typeof value !== "object") {
        return undefined;
    }

    const length = (value as { length?: unknown }).length;

    return typeof length === "number" ? length : undefined;
}

function isRect(value: unknown): value is KWinRect {
    if (!value || typeof value !== "object") {
        return false;
    }

    const rect = value as Partial<KWinRect>;

    return typeof rect.x === "number" &&
        typeof rect.y === "number" &&
        typeof rect.width === "number" &&
        typeof rect.height === "number";
}

function currentGeometry(window: KWinEffectWindow): KWinRect | undefined {
    if (isRect(window.geometry)) {
        return {
            x: window.geometry.x,
            y: window.geometry.y,
            width: window.geometry.width,
            height: window.geometry.height
        };
    }

    if (
        typeof window.x === "number" &&
        typeof window.y === "number" &&
        typeof window.width === "number" &&
        typeof window.height === "number"
    ) {
        return {
            x: window.x,
            y: window.y,
            width: window.width,
            height: window.height
        };
    }

    return undefined;
}

function setLastGeometry(window: KWinEffectWindow, geometry: KWinRect) {
    const existing = lastGeometry.find(item => item.window === window);

    if (existing) {
        existing.geometry = geometry;
        return;
    }

    lastGeometry.push({
        window,
        geometry
    });
}

function getLastGeometry(window: KWinEffectWindow): KWinRect | undefined {
    return lastGeometry.find(item => item.window === window)?.geometry;
}

function rectChanged(from: KWinRect, to: KWinRect): boolean {
    return Math.abs(from.x - to.x) >= MIN_DELTA_PX ||
        Math.abs(from.y - to.y) >= MIN_DELTA_PX ||
        Math.abs(from.width - to.width) >= MIN_DELTA_PX ||
        Math.abs(from.height - to.height) >= MIN_DELTA_PX;
}

function shouldAnimate(window: KWinEffectWindow, oldGeometry: KWinRect, geometry: KWinRect): boolean {
    return window.normalWindow === true &&
        window.deleted !== true &&
        window.minimized !== true &&
        window.skipSwitcher !== true &&
        rectChanged(oldGeometry, geometry);
}

function point(value1: number, value2: number): KWinAnimationPoint {
    return {
        value1,
        value2
    };
}

function animationDuration(): number {
    if (typeof animationTime === "function") {
        return animationTime(BASE_DURATION_MS);
    }

    return BASE_DURATION_MS;
}

function animationIds(value: number[] | number): number[] {
    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

function cancelWindowAnimations(window: KWinEffectWindow) {
    const index = activeAnimations.findIndex(item => item.window === window);

    if (index === -1) {
        return;
    }

    cancel(activeAnimations[index].ids);
    activeAnimations.splice(index, 1);
}

function rememberWindowAnimations(window: KWinEffectWindow, ids: number[]) {
    activeAnimations.push({
        window,
        ids
    });
}

function runGeometryAnimation(window: KWinEffectWindow, oldGeometry?: KWinRect) {
    const geometry = currentGeometry(window);

    if (!geometry) {
        return;
    }

    const fromGeometry = oldGeometry || getLastGeometry(window);

    setLastGeometry(window, geometry);

    if (!fromGeometry) {
        return;
    }

    if (!shouldAnimate(window, fromGeometry, geometry)) {
        return;
    }

    cancelWindowAnimations(window);

    const animations: KWinAnimation[] = [
        {
            type: Effect.Translation,
            from: point(fromGeometry.x - geometry.x, fromGeometry.y - geometry.y),
            to: point(0, 0)
        }
    ];

    if (fromGeometry.width !== geometry.width || fromGeometry.height !== geometry.height) {
        animations.push({
            type: Effect.Size,
            from: point(fromGeometry.width, fromGeometry.height),
            to: point(geometry.width, geometry.height)
        });
    }

    const ids = animate({
        window,
        duration: animationDuration(),
        curve: QEasingCurve.OutCubic,
        animations
    });

    rememberWindowAnimations(window, animationIds(ids));

    log("animated " + (window.caption || "window"));
}

function rectFromSignalArgs(args: IArguments): KWinRect | undefined {
    for (let i = args.length - 1; i >= 0; i -= 1) {
        const value = args[i];

        if (isRect(value)) {
            return value;
        }
    }

    return undefined;
}

function geometrySignal(window: KWinEffectWindow): KWinSignal<KWinSignalCallback> | undefined {
    return window.windowFrameGeometryChanged ||
        window.windowGeometryShapeChanged ||
        window.geometryChanged;
}

function connectWindow(window: KWinEffectWindow) {
    if (connectedWindows.indexOf(window) !== -1) {
        return;
    }

    const geometry = currentGeometry(window);
    const signal = geometrySignal(window);

    if (geometry) {
        setLastGeometry(window, geometry);
    }

    if (!signal) {
        log("no geometry signal for " + (window.caption || "window"));
        return;
    }

    connectedWindows.push(window);

    signal.connect(function () {
        runGeometryAnimation(window, rectFromSignalArgs(arguments));
    });
}

function connectExistingWindows() {
    if (!effects.stackingOrder) {
        log("no stackingOrder");
        return;
    }

    const length = valueLength(effects.stackingOrder);

    if (length === undefined) {
        log("stackingOrder has no length");
        return;
    }

    for (let i = 0; i < length; i += 1) {
        const window = (effects.stackingOrder as Record<string, unknown>)[String(i)];

        if (window && typeof window === "object") {
            connectWindow(window as KWinEffectWindow);
        }
    }
}

log("api windowAdded=" + describeValue(effects.windowAdded) +
    " frameChanged=" + describeValue(effects.windowFrameGeometryChanged) +
    " geometryShapeChanged=" + describeValue(effects.windowGeometryShapeChanged) +
    " stackingOrder=" + describeValue(effects.stackingOrder) +
    " stackingOrder.length=" + String(valueLength(effects.stackingOrder)));

const hasGlobalGeometrySignal = Boolean(effects.windowFrameGeometryChanged || effects.windowGeometryShapeChanged);

if (effects.windowFrameGeometryChanged) {
    effects.windowFrameGeometryChanged.connect(function (window: KWinEffectWindow, oldGeometry: KWinRect) {
        runGeometryAnimation(window, oldGeometry);
    });
} else if (effects.windowGeometryShapeChanged) {
    effects.windowGeometryShapeChanged.connect(function (window: KWinEffectWindow, oldGeometry: KWinRect) {
        runGeometryAnimation(window, oldGeometry);
    });
}

if (!hasGlobalGeometrySignal && effects.windowAdded) {
    effects.windowAdded.connect(connectWindow);
}

if (!hasGlobalGeometrySignal) {
    connectExistingWindows();
}

log("loaded");
