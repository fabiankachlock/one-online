"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameWebsockets = exports.GameServerPath = exports.GameServer = void 0;
var ws_1 = require("ws");
var index_js_1 = require("./logging/index.js");
var gameStore_1 = require("./store/implementations/gameStore");
var wsMap = {};
exports.GameServer = new ws_1.Server({ noServer: true });
exports.GameServerPath = '/game/ws/play';
exports.GameServer.on('connection', function (ws, req) {
    var _a;
    var parts = ((_a = req.url) !== null && _a !== void 0 ? _a : '').split('?');
    if ((parts === null || parts === void 0 ? void 0 : parts.length) < 3) {
        index_js_1.Logging.Websocket.error("[Active] [Refused] invalid url parameter " + ws.url);
        ws.close();
        return;
    }
    var gameid = parts[1];
    var playerid = parts[2];
    if (!wsMap[gameid]) {
        wsMap[gameid] = {};
    }
    wsMap[gameid][playerid] = ws;
    index_js_1.Logging.Websocket.info("[Active] [Connected] " + playerid + " for game " + gameid);
    var game = gameStore_1.GameStore.getGame(gameid);
    if (game && game.isReady(Object.keys(wsMap[gameid]).length)) {
        index_js_1.Logging.Websocket.info("game ready " + gameid);
        game.prepare();
        game.start();
        Object.entries(wsMap[gameid]).forEach(function (_a) {
            var _b = __read(_a, 2), ws = _b[1];
            ws.on('message', game.eventHandler());
        });
    }
    else if (!game) {
        index_js_1.Logging.Websocket.warn("[Active] [Closed] " + ws.url + " due to nonexisting game");
        ws.close();
    }
    ws.on('close', function () {
        index_js_1.Logging.Websocket.info("[Active] [Closed] " + playerid + " on " + gameid);
        delete wsMap[gameid][playerid];
    });
});
exports.GameWebsockets = {
    sendMessage: function (gameid, message) {
        index_js_1.Logging.Websocket.info("[Active] [Message] to game " + gameid);
        if (wsMap[gameid]) {
            Object.entries(wsMap[gameid]).forEach(function (_a) {
                var _b = __read(_a, 2), ws = _b[1];
                ws.send(message);
            });
        }
    },
    sendIndividual: function (gameId, playerId, message) {
        index_js_1.Logging.Websocket.info("[Active] [Message] to player " + playerId + " on game " + gameId);
        var ws = wsMap[gameId][playerId];
        if (ws) {
            ws.send(message);
        }
    },
    removeConnections: function (id) {
        index_js_1.Logging.Websocket.info("[Active] [Closed] connection for game " + id);
        if (wsMap[id]) {
            Object.entries(wsMap[id]).forEach(function (_a) {
                var _b = __read(_a, 2), ws = _b[1];
                ws.close();
            });
        }
        delete wsMap[id];
    }
};
