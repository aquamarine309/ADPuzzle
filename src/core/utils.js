// Stuff to be loaded into global before anything else

import "./polyfill.js";
import "./extensions.js";

import "./crash.js";
import "./timespan.js";
import "./format.js";
// math.js will load constant.js
import "./math.js";
import "./async-utils.js";
import "./event-hub.js";

export * from "./game-mechanics/index.js";
