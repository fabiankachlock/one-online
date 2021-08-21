"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameNotificationManager = void 0;
var waitingServer_js_1 = require("../waitingServer.js");
var GameNotificationManager = /** @class */ (function () {
    function GameNotificationManager(gameId) {
        var _this = this;
        this.gameId = gameId;
        this.notifyPlayerChange = function (players) {
            waitingServer_js_1.WaitingWebsockets.sendMessage(_this.gameId, JSON.stringify({
                players: players
            }));
            if (players.length <= 0) {
                waitingServer_js_1.WaitingWebsockets.removeConnections(_this.gameId);
            }
        };
        this.notifyOptionsChange = function (options) {
            waitingServer_js_1.WaitingWebsockets.sendMessage(_this.gameId, JSON.stringify({
                options: options.map(function (option) { return ({
                    name: option.name,
                    description: option.description
                }); })
            }));
        };
        this.notifyGameStart = function () {
            waitingServer_js_1.WaitingWebsockets.sendMessage(_this.gameId, JSON.stringify({
                start: true,
                url: '/play/#' + _this.gameId
            }));
            waitingServer_js_1.WaitingWebsockets.removeConnections(_this.gameId);
        };
        this.notifyGameStop = function () {
            waitingServer_js_1.WaitingWebsockets.sendMessage(_this.gameId, JSON.stringify({ stop: true }));
            waitingServer_js_1.WaitingWebsockets.removeConnections(_this.gameId);
        };
    }
    return GameNotificationManager;
}());
exports.GameNotificationManager = GameNotificationManager;
