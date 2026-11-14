export type InsertPolicy = "afterActive" | "end";

export interface Settings {
	insertPolicy: InsertPolicy;
	resizeStep: number;
	minWindowWidth: number;
	ignoredResourceClasses: string[];
	ignoredResourceNames: string[];
	fullWidthResourceClasses: string[];
	halfWidthResourceClasses: string[];
}

function stringSetting(key: string, defaultValue: string): string {
	return String(readConfig(key, defaultValue));
}

function numberSetting(key: string, defaultValue: number): number {
	const value = Number(readConfig(key, defaultValue));

	return Number.isFinite(value) ? value : defaultValue;
}

function listSetting(key: string, defaultValue = ""): string[] {
	return stringSetting(key, defaultValue)
		.split(",")
		.map(item => item.trim().toLowerCase())
		.filter(item => item.length > 0);
}

function insertPolicySetting(): InsertPolicy {
	const value = stringSetting("InsertPolicy", "afterActive");

	return value === "end" ? "end" : "afterActive";
}

export function getSettings(): Settings {
	return {
		insertPolicy: insertPolicySetting(),
		resizeStep: Math.max(1, numberSetting("ResizeStep", 30)),
		minWindowWidth: Math.max(1, numberSetting("MinWindowWidth", 100)),
		ignoredResourceClasses: listSetting("IgnoredResourceClasses"),
		ignoredResourceNames: listSetting("IgnoredResourceNames"),
		fullWidthResourceClasses: listSetting(
			"FullWidthResourceClasses",
			[
				"firefox",
				"vscodium",
				"chromium",
				"google-chrome",
				"google-chrome-stable",
				"chrome",
				"brave",
				"brave-browser",
				"microsoft-edge",
				"msedge",
				"vivaldi-stable",
				"opera",
				"zen",
				"librewolf",
				"waterfox",
				"floorp",
				"qutebrowser",
				"code",
				"code-oss",
				"code-url-handler",
				"sublime_text",
				"zed",
				"kate",
				"kwrite",
				"geany",
				"gedit",
				"mousepad",
				"notepadqq",
				"jetbrains-idea",
				"jetbrains-pycharm",
				"jetbrains-webstorm",
				"jetbrains-goland",
				"jetbrains-clion",
				"jetbrains-rider",
				"jetbrains-rustrover",
				"jetbrains-fleet",
				"idea",
				"pycharm",
				"webstorm",
				"goland",
				"clion",
				"rider",
				"rustrover",
			].join(","),
		),
		halfWidthResourceClasses: listSetting(
			"HalfWidthResourceClasses",
			[
				"konsole",
				"org.kde.konsole",
				"kitty",
				"alacritty",
				"wezterm",
				"foot",
				"xterm",
				"urxvt",
				"rxvt",
				"gnome-terminal",
				"terminator",
				"tilix",
				"sakura",
				"ptyxis",
				"thunar",
				"org.xfce.thunar",
				"dolphin",
				"org.kde.dolphin",
				"nautilus",
				"org.gnome.nautilus",
				"nemo",
				"caja",
				"pcmanfm",
				"pcmanfm-qt",
				"org.lxqt.pcmanfm-qt",
				"pantheon-files",
				"org.gnome.file-roller",
				"spacefm",
				"doublecmd",
				"doublecmd-qt",
				"krusader",
			].join(","),
		),
	};
}
