declare const __DEV__: boolean;

export function log(message: string, force?: boolean): void {
    if (__DEV__ || force) {
        print("[Niva] " + message);
    }
}
