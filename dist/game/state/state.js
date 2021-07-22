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
exports.GameStateManager = void 0;
var index_js_1 = require("../../store/implementations/playerStore/index.js");
var deck_js_1 = require("../cards/deck.js");
var gameNotifications_js_1 = require("./gameNotifications.js");
var basicRule_1 = require("./rules/basicRule");
var GameStateManager = /** @class */ (function () {
    function GameStateManager(gameId, metaData, options, pile) {
        var _this = this;
        if (pile === void 0) { pile = new deck_js_1.CardDeck(10, [], true); }
        this.gameId = gameId;
        this.metaData = metaData;
        this.options = options;
        this.pile = pile;
        this.rules = [
            new basicRule_1.BasicGameRule()
        ];
        this.prepare = function () {
            Array.from(_this.metaData.players).map(function (pid) {
                _this.state.decks[pid] = [];
                for (var i = 0; i < _this.options.options.numberOfCards; i++) {
                    _this.state.decks[pid].push(_this.pile.draw());
                }
            });
        };
        this.start = function () {
            _this.notificationManager.notifyGameInit(_this.players, _this.state);
        };
        this.clear = function () {
        };
        this.handleEvent = function (event) {
        };
        this.handlePlaceCard = function (event) {
            var e_1, _a;
            var allowedEvents = [];
            var notAllowedEvents = [];
            var allowed = true;
            try {
                for (var _b = __values(_this.rules), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var rule = _c.value;
                    if (rule.isResponsible(_this.state, event)) {
                        if (!rule.canThrowCard(event.payload.card, _this.state.topCard)) {
                            allowed = false;
                            notAllowedEvents.push(rule.getEvent(_this.state, event));
                        }
                        else {
                            allowedEvents.push(rule.getEvent(_this.state, event));
                        }
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            // place Card
            _this.state.stack.push(_this.state.topCard);
            _this.state.topCard = event.payload.card;
            var cardIndex = _this.state.decks[event.playerId].findIndex(function (c) { return c.type === event.payload.card.type && c.color === event.payload.card.color; });
            _this.state.decks[event.playerId].splice(cardIndex, 1);
            _this.state.currentPlayer = _this.metaData.playerLinks[event.playerId][_this.state.direction];
            _this.notificationManager.notifyGameUpdate(_this.players, _this.state.currentPlayer, _this.state.topCard, Object.entries(_this.state.decks).map(function (_a) {
                var _b = __read(_a, 2), id = _b[0], cards = _b[1];
                return ({ id: id, amount: cards.length });
            }), allowed ? allowedEvents : notAllowedEvents);
        };
        this.state = {
            direction: 'left',
            currentPlayer: Array.from(metaData.players)[Math.floor(Math.random() * this.metaData.playerCount)],
            topCard: pile.draw(),
            stack: [],
            decks: {}
        };
        this.notificationManager = new gameNotifications_js_1.GameStateNotificationManager(this.gameId);
        this.players = Array.from(metaData.players).map(function (id) { return ({
            id: id,
            name: index_js_1.PlayerStore.getPlayerName(id) || 'noname'
        }); });
    }
    return GameStateManager;
}());
exports.GameStateManager = GameStateManager;
/*
            GameWebsockets.sendMessage(this.game.hash, updateGameMessage(
                this.game.state.player,
                this.game.state.topCard,
                Object.entries(this.game.state.cardAmounts).map(([id, amount]) => ({ id, amount })),
                []
            ))
    */ 
