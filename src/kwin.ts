export interface KWinRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface KWinOutput {
	geometry?: KWinRect;
}

export interface KWinWindow {
	frameGeometry: KWinRect;
	caption: string;
	resourceClass: string;
	resourceName: string;
	pid: number;
	internalId: string;
	minimized: boolean;
	active: boolean;
	desktop: unknown;
	output?: KWinOutput;
	normalWindow: boolean;
	popupWindow?: boolean;
	transient?: boolean;
	modal?: boolean;
	dialog?: boolean;
	dropdownMenu?: boolean;
	popupMenu?: boolean;
	comboBox?: boolean;
	tooltip?: boolean;
	notification?: boolean;
	deleted?: boolean;
	skipTaskbar?: boolean;
	skipSwitcher?: boolean;
}

export interface KWinWorkspace {
	activeWindow?: KWinWindow;
	virtualScreenGeometry?: KWinRect;
	windowActivated?: KWinSignal<(window: KWinWindow | null) => void>;

	windowList(): KWinWindow[];
}

export interface KWinSignal<T> {
	connect(callback: T): void;
}

declare global {
	const workspace: KWinWorkspace;

	function print(message: string): void;

	function readConfig(key: string, defaultValue: unknown): unknown;

	function registerShortcut(
		id: string,
		description: string,
		defaultKeySequence: string,
		callback: () => void,
	): void;
}
