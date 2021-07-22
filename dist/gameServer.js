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
var gameStore_1 = require("./store/implementations/gameStore");
var wsMap = {};
exports.GameServer = new ws_1.Server({ noServer: true });
exports.GameServerPath = '/game/ws/play';
exports.GameServer.on('connection', function (ws, req) {
    var _a;
    var parts = ((_a = req.url) !== null && _a !== void 0 ? _a : '').split('?');
    if ((parts === null || parts === void 0 ? void 0 : parts.length) < 3) {
        ws.close();
        return;
    }
    var gameid = parts[1];
    var playerid = parts[2];
    wsMap[gameid][playerid] = ws;
    console.log('[Websocket] connected - game: ' + gameid);
    var game = gameStore_1.GameStore.getGame(gameid);
    if (game && game.isReady(Object.keys(wsMap[gameid]).length)) {
        var game_1 = gameStore_1.GameStore.getGame(gameid);
        if (game_1) {
            console.log('[Websocket] starting game: ' + gameid);
            game_1.start();
            Object.entries(wsMap[gameid]).forEach(function (_a) {
                var _b = __read(_a, 2), ws = _b[1];
                ws.on('message', game_1.eventHandler);
            });
        }
    }
    ws.on('close', function () {
        delete wsMap[gameid][playerid];
    });
});
exports.GameWebsockets = {
    sendMessage: function (gameid, message) {
        if (wsMap[gameid]) {
            Object.entries(wsMap[gameid]).forEach(function (_a) {
                var _b = __read(_a, 2), ws = _b[1];
                ws.send(message);
            });
        }
    },
    sendIndividual: function (gameId, playerId, message) {
        var ws = wsMap[gameId][playerId];
        if (ws) {
            ws.send(message);
        }
    },
    removeConnections: function (id) {
        if (wsMap[id]) {
            Object.entries(wsMap[id]).forEach(function (_a) {
                var _b = __read(_a, 2), ws = _b[1];
                ws.close();
            });
        }
        delete wsMap[id];
    }
};
