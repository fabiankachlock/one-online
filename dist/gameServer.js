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
exports.GameServerPath = '/api/v1/game/ws/play';
var Logger = index_js_1.Logging.Websocket.withBadge('Active');
exports.GameServer.on('connection', function (ws, req) {
    var _a;
    var parts = ((_a = req.url) !== null && _a !== void 0 ? _a : '').split('?');
    if ((parts === null || parts === void 0 ? void 0 : parts.length) < 3) {
        Logger.error("[Refused] invalid url parameter " + ws.url);
        ws.close();
        return;
    }
    var gameid = parts[1];
    var playerid = parts[2];
    if (!wsMap[gameid]) {
        wsMap[gameid] = {};
    }
    wsMap[gameid][playerid] = ws;
    Logger.log("[Connected] " + playerid + " for game " + gameid);
    var game = gameStore_1.GameStore.getGame(gameid);
    if (game && game.isReady(Object.keys(wsMap[gameid]).length)) {
        Logger.log("game ready " + gameid);
        game.prepare();
        game.start();
        Object.entries(wsMap[gameid]).forEach(function (_a) {
            var _b = __read(_a, 2), ws = _b[1];
            ws.on('message', game.eventHandler());
        });
    }
    else if (!game) {
        Logger.warn("[Closed] " + ws.url + " due to nonexisting game");
        ws.close();
    }
    ws.on('close', function () {
        Logger.log("[Closed] " + playerid + " on " + gameid);
        delete wsMap[gameid][playerid];
        if (Object.keys(wsMap[gameid]).length === 0 && game && game.meta.running) {
            Logger.log("no more players on " + gameid);
            gameStore_1.GameStore.remove(gameid);
        }
    });
});
exports.GameWebsockets = {
    sendMessage: function (gameid, message) {
        Logger.log("[Message] to game " + gameid);
        if (wsMap[gameid]) {
            Object.entries(wsMap[gameid]).forEach(function (_a) {
                var _b = __read(_a, 2), ws = _b[1];
                ws.send(message);
            });
        }
    },
    sendIndividual: function (gameId, playerId, message) {
        Logger.log("[Message] to player " + playerId + " on game " + gameId);
        var ws = wsMap[gameId][playerId];
        if (ws) {
            ws.send(message);
        }
    },
    removeConnections: function (id) {
        Logger.log("[Closed] connection for game " + id);
        if (wsMap[id]) {
            Object.entries(wsMap[id]).forEach(function (_a) {
                var _b = __read(_a, 2), ws = _b[1];
                ws.close();
            });
        }
        delete wsMap[id];
    }
};
