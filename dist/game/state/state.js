"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var gameNotifications_js_1 = require("./gameNotifications.js");
var ruleManager_js_1 = require("./ruleManager.js");
var GameStateManager = /** @class */ (function () {
    function GameStateManager(gameId, metaData, options, Logger) {
        var _this = this;
        this.gameId = gameId;
        this.metaData = metaData;
        this.options = options;
        this.Logger = Logger;
        this.prepare = function () {
            // setup players
            Array.from(_this.metaData.players).map(function (pid) {
                _this.state.decks[pid] = [];
                for (var i = 0; i < _this.options.presets.numberOfCards; i++) {
                    _this.state.decks[pid].push(_this.pile.draw());
                }
            });
            // allow just 'normal' (digit) cards as top card
            while (!/^ct\/\d$/.test(_this.state.topCard.type)) {
                _this.state.topCard = _this.pile.draw();
            }
            // setup stack
            _this.state.stack = [
                {
                    card: _this.state.topCard,
                    activatedEvent: false
                }
            ];
            _this.Logger.info("[State] [Prepared] " + _this.gameId);
        };
        this.start = function () {
            _this.Logger.info("[State] [Started] " + _this.gameId);
            _this.notificationManager.notifyGameInit(_this.players.map(function (p) { return (__assign(__assign({}, p), { order: _this.metaData.playerLinks[p.id].order })); }), _this.state, _this.options);
        };
        this.hotRejoin = function (playerId) {
            _this.notificationManager.notifyGameInit(_this.players.map(function (p) { return (__assign(__assign({}, p), { order: _this.metaData.playerLinks[p.id].order })); }), _this.state, _this.options, [playerId]);
        };
        this.clear = function () {
            _this.Logger.info("[State] [Cleared] " + _this.gameId);
            _this.finishHandler('');
        };
        this.finishHandler = function () { };
        this.whenFinished = function (handler) {
            _this.finishHandler = handler;
        };
        this.interruptGame = function (interrupt) {
            var e_1, _a;
            _this.Logger.info("[Interrupt] " + interrupt.reason);
            var responsibleRules = _this.rulesManager.getResponsibleRulesForInterrupt(interrupt);
            var events = [];
            try {
                for (var _b = __values(responsibleRules.sort(function (a, b) { return b.priority - a.priority; })), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var rule = _c.value;
                    var copy = JSON.parse(JSON.stringify(_this.state));
                    var result = rule.onInterrupt(interrupt, copy, _this.pile);
                    _this.state = result.newState;
                    events.push.apply(events, __spreadArray([], __read(result.events)));
                    _this.nextPlayer(result.moveCount);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            _this.handleGameUpdate(events);
        };
        this.handleEvent = function (event) {
            var responsibleRules = _this.rulesManager.getResponsibleRules(event, _this.state);
            var rule = _this.rulesManager.getPrioritizedRules(responsibleRules);
            if (!rule) {
                _this.Logger.warn("[State] " + _this.gameId + " no responsible rule found");
                return;
            }
            _this.Logger.info("[State] " + _this.gameId + " - responsible rule: " + rule.name);
            var copy = JSON.parse(JSON.stringify(_this.state));
            var result = rule.applyRule(copy, event, _this.pile);
            _this.state = result.newState;
            _this.nextPlayer(result.moveCount);
            _this.handleGameUpdate(result.events);
        };
        this.handleGameUpdate = function (events) {
            var e_2, _a;
            _this.Logger.info("[Event] [Outgoing] " + _this.gameId + " " + JSON.stringify(events));
            if (_this.gameFinished()) {
                _this.Logger.info("[State] " + _this.gameId + " finisher found");
                _this.finishGame();
                return;
            }
            _this.notificationManager.notifyGameUpdate(_this.players, _this.state.currentPlayer, _this.state.topCard, _this.state.direction, Object.entries(_this.state.decks).map(function (_a) {
                var _b = __read(_a, 2), id = _b[0], cards = _b[1];
                return ({
                    id: id,
                    amount: cards.length
                });
            }), events);
            var copyState = JSON.parse(JSON.stringify(_this.state));
            try {
                for (var _b = __values(_this.rulesManager.all), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var rule = _c.value;
                    rule.onGameUpdate(copyState, events);
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
        this.nextPlayer = function (times) {
            for (var i = times; i > 0; i--) {
                _this.state.currentPlayer =
                    _this.metaData.playerLinks[_this.state.currentPlayer][_this.state.direction];
            }
        };
        this.gameFinished = function () {
            return (Object.values(_this.state.decks).find(function (deck) { return deck.length === 0; }) !==
                undefined);
        };
        this.finishGame = function () {
            var winner = Object.entries(_this.state.decks).find(function (_a) {
                var _b = __read(_a, 2), deck = _b[1];
                return deck.length === 0;
            });
            if (winner) {
                _this.finishHandler(winner[0]);
                _this.notificationManager.notifyGameFinish('./summary.html');
            }
        };
        this.pile = new deck_js_1.CardDeck(10, [], options.realisticDraw);
        this.state = {
            direction: 'left',
            currentPlayer: Array.from(metaData.players)[0],
            topCard: this.pile.draw(),
            stack: [],
            decks: {}
        };
        this.notificationManager = new gameNotifications_js_1.GameStateNotificationManager(this.gameId);
        this.players = Array.from(metaData.players).map(function (id) { return ({
            id: id,
            name: index_js_1.PlayerStore.getPlayerName(id) || 'noname'
        }); });
        this.rulesManager = new ruleManager_js_1.RuleManager(options, this.interruptGame);
        this.Logger.info("[State] Initialized with rules: " + JSON.stringify(this.rulesManager.all.map(function (r) { return r.name; })));
    }
    return GameStateManager;
}());
exports.GameStateManager = GameStateManager;
