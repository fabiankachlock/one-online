"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingWebsockets = exports.WaitingServerPath = exports.WaitingServer = void 0;
var ws_1 = require("ws");
var index_js_1 = require("./logging/index.js");
var gameStore_1 = require("./store/implementations/gameStore/");
var wsMap = {};
exports.WaitingServer = new ws_1.Server({ noServer: true });
exports.WaitingServerPath = '/game/ws/wait';
exports.WaitingServer.on('connection', function (ws, req) {
    var _a;
    var parts = ((_a = req.url) !== null && _a !== void 0 ? _a : '').split('?');
    if ((parts === null || parts === void 0 ? void 0 : parts.length) < 2) {
        index_js_1.Logging.Websocket.error("[Waiting] [Refused] invalid url parameter " + ws.url);
        ws.close();
        return;
    }
    var gameid = parts[1];
    if (gameid in wsMap) {
        wsMap[gameid].push(ws);
    }
    else {
        wsMap[gameid] = [ws];
    }
    var game = gameStore_1.GameStore.getGame(gameid);
    if (!game) {
        index_js_1.Logging.Websocket.warn("[Waiting] [Closed] " + ws.url + " due to nonexisting game");
        ws.close();
    }
    else {
        index_js_1.Logging.Websocket.info("[Waiting] [Connected] waiting for game " + gameid);
        game.onPlayerJoined();
    }
    ws.on('close', function () {
        index_js_1.Logging.Websocket.info("[Waiting] [Closed] on " + gameid);
        wsMap[gameid] = (wsMap[gameid] || []).filter(function (w) { return w !== ws; });
    });
});
exports.WaitingWebsockets = {
    sendMessage: function (gameid, message) {
        index_js_1.Logging.Websocket.info("[Waiting] [Message] to game " + gameid);
        if (wsMap[gameid] && wsMap[gameid].length > 0) {
            wsMap[gameid].forEach(function (ws) {
                ws.send(message);
            });
        }
    },
    removeConnections: function (id) {
        index_js_1.Logging.Websocket.info("[Waiting] [Closed] connection for game " + id);
        if (wsMap[id] && wsMap[id].length > 0) {
            wsMap[id].forEach(function (ws) {
                ws.close();
            });
        }
        delete wsMap[id];
    }
};
