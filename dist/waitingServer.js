"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingWebsockets = exports.WaitingServerPath = exports.WaitingServer = void 0;
var ws_1 = require("ws");
var gameStore_1 = require("./store/implementations/gameStore/");
var wsMap = {};
exports.WaitingServer = new ws_1.Server({ noServer: true });
exports.WaitingServerPath = '/game/ws/wait';
exports.WaitingServer.on('connection', function (ws, req) {
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
    console.log('[Websocket] connected - waiting for ' + gameid);
    if (!gameStore_1.GameStore.has(gameid)) {
        ws.close();
    }
    else {
        gameStore_1.GameStore.getGame(gameid).joinedWaiting();
    }
    // WaitingWebsockets.sendMessage(game.key, JSON.stringify({
    //     players: game.meta.player.map(p => PlayerStore.getPlayerName(p))
    // }))
    // ws.on('message', (msg) => { });
    ws.on('close', function () {
        wsMap[gameid] = (wsMap[gameid] || []).filter(function (w) { return w !== ws; });
    });
});
exports.WaitingWebsockets = {
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
