import "./manager/var";

import { log } from "./logger";
import { register } from "./shortcuts";

declare const __VERSION__: string;
declare const __DEV_BUILD__: number;
const devBuild = __DEV_BUILD__;

register();

log("loaded " + __VERSION__ + (devBuild > 0 ? "." + devBuild : ""), true);
