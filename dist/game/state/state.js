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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStateManager = void 0;
var index_js_1 = require("../../store/implementations/playerStore/index.js");
var deck_js_1 = require("../cards/deck.js");
var eventUtil_js_1 = require("./events/eventUtil.js");
var gameEvents_js_1 = require("./events/gameEvents.js");
var uiEvents_js_1 = require("./events/uiEvents.js");
var gameNotifications_js_1 = require("./gameNotifications.js");
var basicDrawRule_js_1 = require("./rules/basicDrawRule.js");
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
            new basicRule_1.BasicGameRule(),
            new basicDrawRule_js_1.BasicDrawRule()
        ];
        this.prepare = function () {
            console.log('[Game]', _this.gameId, 'preparing state');
            Array.from(_this.metaData.players).map(function (pid) {
                _this.state.decks[pid] = [];
                for (var i = 0; i < _this.options.options.numberOfCards; i++) {
                    _this.state.decks[pid].push(_this.pile.draw());
                }
            });
        };
        this.start = function () {
            console.log('[Game]', _this.gameId, 'init game');
            _this.notificationManager.notifyGameInit(_this.players, _this.state);
        };
        this.clear = function () {
        };
        this.handleEvent = function (event) {
            if (event.event === uiEvents_js_1.UIEventTypes.card) {
                _this.handlePlaceCard(event);
            }
            else if (event.event === uiEvents_js_1.UIEventTypes.draw) {
                _this.handleDrawCard(event);
            }
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
            console.log('generated events: allowed', allowedEvents, 'not allowed', notAllowedEvents);
            // place Card if allowed
            if (allowed) {
                _this.state.stack.push(_this.state.topCard);
                _this.state.topCard = event.payload.card;
                var cardIndex = _this.state.decks[event.playerId].findIndex(function (c) { return c.type === event.payload.card.type && c.color === event.payload.card.color; });
                _this.state.decks[event.playerId].splice(cardIndex, 1);
                _this.state.currentPlayer = _this.metaData.playerLinks[event.playerId][_this.state.direction];
            }
            _this.notificationManager.notifyGameUpdate(_this.players, _this.state.currentPlayer, _this.state.topCard, Object.entries(_this.state.decks).map(function (_a) {
                var _b = __read(_a, 2), id = _b[0], cards = _b[1];
                return ({ id: id, amount: cards.length });
            }), allowed ? allowedEvents : notAllowedEvents);
        };
        this.handleDrawCard = function (event) {
            var e_2, _a, _b;
            var events = [];
            var allowed = true;
            try {
                for (var _c = __values(_this.rules), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var rule = _d.value;
                    if (rule.isResponsible(_this.state, event)) {
                        if (!rule.isAllowedToDraw(_this.state, event)) {
                            allowed = false;
                        }
                        events.push(rule.getEvent(_this.state, event));
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            console.log('generated events: allowed', events);
            var prioritisedEvent = eventUtil_js_1.getPrioritisedEvent(events);
            var finalEvent = prioritisedEvent;
            // draw cards
            if (allowed && prioritisedEvent) {
                if (prioritisedEvent.type.startsWith('[i]')) {
                    var cards = [];
                    for (var i = 0; i < prioritisedEvent.payload.amount; i++) {
                        cards.push(_this.pile.draw());
                    }
                    finalEvent = gameEvents_js_1.drawEvent(prioritisedEvent.players.pop() || 'noname', cards, 1);
                }
                (_b = _this.state.decks[event.playerId]).push.apply(_b, __spreadArray([], __read((finalEvent === null || finalEvent === void 0 ? void 0 : finalEvent.payload).cards)));
                _this.state.currentPlayer = _this.metaData.playerLinks[event.playerId][_this.state.direction];
            }
            _this.notificationManager.notifyGameUpdate(_this.players, _this.state.currentPlayer, _this.state.topCard, Object.entries(_this.state.decks).map(function (_a) {
                var _b = __read(_a, 2), id = _b[0], cards = _b[1];
                return ({ id: id, amount: cards.length });
            }), finalEvent ? [finalEvent] : []);
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
