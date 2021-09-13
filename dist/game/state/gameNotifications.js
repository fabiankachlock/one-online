"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateNotificationManager = void 0;
var gameServer_js_1 = require("../../gameServer.js");
var version_js_1 = require("../../version.js");
var GameStateNotificationManager = /** @class */ (function () {
    function GameStateNotificationManager(gameId) {
        var _this = this;
        this.gameId = gameId;
        this.notifyGameUpdate = function (players, currentPlayer, topCard, direction, playerCards, events) {
            var e_1, _a;
            var _loop_1 = function (player) {
                gameServer_js_1.GameWebsockets.sendIndividual(_this.gameId, player.id, JSON.stringify({
                    event: 'update',
                    currentPlayer: currentPlayer,
                    isCurrent: currentPlayer === player.id,
                    topCard: topCard,
                    direction: direction,
                    players: playerCards,
                    events: events
                        .filter(function (e) { return e.players.includes(player.id); })
                        .map(function (e) { return ({ type: e.type, payload: e.payload }); })
                }));
            };
            try {
                for (var players_1 = __values(players), players_1_1 = players_1.next(); !players_1_1.done; players_1_1 = players_1.next()) {
                    var player = players_1_1.value;
                    _loop_1(player);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (players_1_1 && !players_1_1.done && (_a = players_1.return)) _a.call(players_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        this.notifyGameInit = function (players, state, options, targets) {
            var e_2, _a;
            if (targets === void 0) { targets = []; }
            var mapped = players.map(function (p) { return ({
                id: p.id,
                name: p.name,
                cardAmount: state.decks[p.id].length,
                order: p.order
            }); });
            if (targets.length === 0) {
                targets = players.map(function (p) { return p.id; });
            }
            try {
                for (var _b = __values(players.filter(function (p) { return targets.includes(p.id); })), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var player = _c.value;
                    gameServer_js_1.GameWebsockets.sendIndividual(_this.gameId, player.id, JSON.stringify({
                        event: 'init-game',
                        serverVersion: version_js_1.SERVER_VERSION,
                        players: mapped,
                        currentPlayer: state.currentPlayer,
                        isCurrent: state.currentPlayer === player.id,
                        topCard: state.topCard,
                        deck: state.decks[player.id],
                        uiOptions: {
                            showOneButton: options.penaltyCard
                        }
                    }));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_2) throw e_2.error; }
            }
        };
        this.notifyGameFinish = function (url) {
            return gameServer_js_1.GameWebsockets.sendMessage(_this.gameId, JSON.stringify({
                event: 'finished',
                url: url
            }));
        };
    }
    return GameStateNotificationManager;
}());
exports.GameStateNotificationManager = GameStateNotificationManager;
