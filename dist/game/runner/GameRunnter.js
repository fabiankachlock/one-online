"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRunner = void 0;
var events_1 = require("../messages/events");
var gameServer_js_1 = require("../../gameServer.js");
var types_js_1 = require("../messages/types.js");
var GameRunner = /** @class */ (function () {
    function GameRunner(game) {
        var _this = this;
        this.game = game;
        this.handle = function (event) {
            if (event.event === events_1.UIEventTypes.card) {
                _this.game.state.topCard = event.payload.card;
                _this.game.state.cardAmounts[_this.game.state.player] -= 1;
                _this.game.state.player = _this.game.state.playerLinks[_this.game.state.player][_this.game.state.direction];
                _this.game.state.stack.push(event.payload.card);
                gameServer_js_1.GameWebsockets.sendMessage(_this.game.hash, types_js_1.updateGameMessage(_this.game.state.player, _this.game.state.topCard, Object.entries(_this.game.state.cardAmounts).map(function (_a) {
                    var id = _a[0], amount = _a[1];
                    return ({ id: id, amount: amount });
                }), []));
            }
        };
    }
    return GameRunner;
}());
exports.GameRunner = GameRunner;
