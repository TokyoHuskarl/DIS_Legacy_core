// this script is to test javascript DIS API on console qjs.
import * as std from "std";

const jsdirpath = "./source/js/"

// libraries
std.loadScript("./source/js/jslib/CryptoJS/aes.js")
std.loadScript("./source/js/jslib/noisejs/perlin.js")

std.loadScript(jsdirpath + "DIS_js_system_main.js")
std.loadScript(jsdirpath + "DIS_mapgenerator.js")
