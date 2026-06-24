export type InsertPolicy = "afterActive" | "end";

export interface Settings {
    insertPolicy: InsertPolicy;
    resizeStep: number;
    minWindowWidth: number;
    ignoredResourceClasses: string[];
    ignoredResourceNames: string[];
}

function stringSetting(key: string, defaultValue: string): string {
    return String(readConfig(key, defaultValue));
}

function numberSetting(key: string, defaultValue: number): number {
    const value = Number(readConfig(key, defaultValue));

    return Number.isFinite(value) ? value : defaultValue;
}

function listSetting(key: string): string[] {
    return stringSetting(key, "")
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
    };
}
