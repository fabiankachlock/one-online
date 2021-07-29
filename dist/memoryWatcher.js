"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startMemoryWatcher = void 0;
var node_schedule_1 = __importDefault(require("node-schedule"));
var index_js_1 = require("./logging/index.js");
var index_1 = require("./store/implementations/gameStore/index");
var index_2 = require("./store/implementations/playerStore/index");
var index_3 = require("./store/implementations/accessToken/index");
var startMemoryWatcher = function (isDev) {
    var cronJob = isDev ? '*/30 * * * * *' : '* */5 * * * *';
    if (isDev) {
        index_js_1.Logging.Watcher.addBadge('DEV');
    }
    var watcher = node_schedule_1.default.scheduleJob(cronJob, function () {
        index_js_1.Logging.Watcher.info('--- BEGIN REPORT ---');
        var games = index_1.GameStore.all();
        var players = index_2.PlayerStore.all();
        var tokens = index_3.TokenStore.all();
        index_js_1.Logging.Watcher.info(games.length + " Games stored - " + games.filter(function (g) { return g.meta.running; }).length + " running");
        index_js_1.Logging.Watcher.info(players.length + " Players stored");
        index_js_1.Logging.Watcher.info(tokens.length + " active Tokens stored");
        index_js_1.Logging.Watcher.info('--- END REPORT ---');
    });
};
exports.startMemoryWatcher = startMemoryWatcher;
