"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameApiHandler = void 0;
var name_1 = require("./name");
var options_1 = require("./options");
var resolve_1 = require("./resolve");
var start_1 = require("./start");
var stats_1 = require("./stats");
var stop_1 = require("./stop");
var verify_1 = require("./verify");
exports.GameApiHandler = {
    options: options_1.GameOptionsApiHandler,
    start: start_1.HandleGameStart,
    stop: stop_1.HandleGameStop,
    verify: verify_1.HandleGameVerify,
    stats: stats_1.HandleGameStats,
    name: name_1.HandleGameName,
    resolve: {
        wait: resolve_1.HandleWaitResolve,
        play: resolve_1.HandlePlayResolve
    }
};
