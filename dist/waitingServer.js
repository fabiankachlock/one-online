"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WaitingWebsockets = exports.WaitingServerPath = exports.WaitingServer = void 0;
var ws_1 = require("ws");
var gameStore_1 = require("./store/implementations/gameStore/");
var playerStore_1 = require("./store/implementations/playerStore/");
var wsMap = {};
exports.WaitingServer = new ws_1.Server({ noServer: true });
exports.WaitingServerPath = '/game/ws/wait';
exports.WaitingServer.on('connection', function (ws, req) {
    var _a;
    var parts = ((_a = req.url) !== null && _a !== void 0 ? _a : '').split('?');
    if ((parts === null || parts === void 0 ? void 0 : parts.length) < 2) {
        ws.close();
    }
    var gameid = parts[1];
    if (gameid in wsMap) {
        wsMap[gameid].push(ws);
    }
    else {
        wsMap[gameid] = [ws];
    }
    console.log('[Websocket] connected - waiting for ' + gameid);
    var game = gameStore_1.GameStore.getGame(gameid);
    if (game) {
        exports.WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
            players: game.meta.player.map(function (p) { return playerStore_1.PlayerStore.getPlayerName(p); })
        }));
    }
    else {
        ws.close();
    }
    // ws.on('message', (msg) => { });
    ws.on('close', function () {
        wsMap[gameid] = wsMap[gameid].filter(function (w) { return w !== ws; });
    });
});
exports.WaitingWebsockets = {
    sendMessage: function (gameid, message) {
        wsMap[gameid].forEach(function (ws) {
            ws.send(message);
        });
    }
};
