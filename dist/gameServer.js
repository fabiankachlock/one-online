"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameWebsockets = exports.GameServerPath = exports.GameServer = void 0;
var ws_1 = require("ws");
var handler_1 = require("./game/messages/handler");
var wsMap = {};
exports.GameServer = new ws_1.Server({ noServer: true });
exports.GameServerPath = '/game/ws/active';
exports.GameServer.on('connection', function (ws, req) {
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
    console.log('[Websocket] connected - game: ' + gameid);
    ws.on('message', function (msg) {
        handler_1.handleGameMessage(msg.toString());
    });
    ws.on('close', function () {
        wsMap[gameid] = wsMap[gameid].filter(function (w) { return w !== ws; });
    });
});
exports.GameWebsockets = {
    sendMessage: function (gameid, message) {
        wsMap[gameid].forEach(function (ws) {
            ws.send(message);
        });
    }
};
