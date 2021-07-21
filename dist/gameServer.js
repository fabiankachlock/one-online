"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameWebsockets = exports.GameServerPath = exports.GameServer = void 0;
var ws_1 = require("ws");
var game_1 = require("./game/game");
var handler_1 = require("./game/messages/handler");
var gameStore_1 = require("./store/implementations/gameStore");
var waitingServer_1 = require("./waitingServer");
var wsMap = {};
exports.GameServer = new ws_1.Server({ noServer: true });
exports.GameServerPath = '/game/ws/play';
exports.GameServer.on('connection', function (ws, req) {
    var _a;
    var parts = ((_a = req.url) !== null && _a !== void 0 ? _a : '').split('?');
    if ((parts === null || parts === void 0 ? void 0 : parts.length) < 2) {
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
    console.log('[Websocket] connected - game: ' + gameid);
    if (game_1.isGameReady(gameid, Object.keys(wsMap[gameid]).length)) {
        var game = gameStore_1.GameStore.getGame(gameid);
        if (game) {
            console.log('[Websocket] starting game: ' + gameid);
            game_1.startGame(game);
            waitingServer_1.WaitingWebsockets.removeConnections(gameid);
        }
    }
    ws.on('message', function (msg) {
        handler_1.handleGameMessage(msg.toString());
    });
    ws.on('close', function () {
        wsMap[gameid] = wsMap[gameid].filter(function (w) { return w !== ws; });
    });
});
exports.GameWebsockets = {
    sendMessage: function (gameid, message) {
        if (wsMap[gameid] && wsMap[gameid].length > 0) {
            wsMap[gameid].forEach(function (ws) {
                ws.send(message);
            });
        }
    },
    removeConnections: function (id) {
        if (wsMap[id] && wsMap[id].length > 0) {
            wsMap[id].forEach(function (ws) {
                ws.close();
            });
        }
        delete wsMap[id];
    }
};
