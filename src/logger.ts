declare const __DEV__: boolean;
const _isDev = __DEV__;

export function log(message: string, force?: boolean): void {
    if (_isDev || force) {
        print("[Niva] " + message);
    }
}
