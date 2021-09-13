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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
var async_queue_js_1 = require("../../lib/async-queue.js");
var GameStateManager = /** @class */ (function () {
    function GameStateManager(gameId, metaData, options, Logger) {
        var _this = this;
        this.gameId = gameId;
        this.metaData = metaData;
        this.options = options;
        this.Logger = Logger;
        // handler for listening to game finish from outside
        this.finishHandler = function () { };
        this.whenFinished = function (handler) {
            _this.finishHandler = handler;
        };
        this.leavePlayer = function (playerId) { return __awaiter(_this, void 0, void 0, function () {
            var restart, playerIndex, _a, left, right;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        restart = this.channel.pauseReceiver();
                        return [4 /*yield*/, new Promise(function (res) { return setTimeout(function () { return res({}); }, 100); })];
                    case 1:
                        _b.sent(); // threshold for ongoing computation
                        if (this.state.currentPlayer === playerId) {
                            // select next player, if leaving player is current
                            this.state.currentPlayer =
                                this.metaData.playerLinks[this.state.currentPlayer][this.state.direction];
                        }
                        // remove deck
                        delete this.state.decks[playerId];
                        playerIndex = this.players.findIndex(function (p) { return p.id === playerId; });
                        if (playerIndex) {
                            // remove from receivers
                            this.players.splice(playerIndex, 1);
                            // fix metadata
                            this.metaData.playerCount -= 1;
                            this.metaData.players.delete(playerId);
                            _a = this.metaData.playerLinks[playerId], left = _a.left, right = _a.right;
                            this.metaData.playerLinks[left].right = right;
                            this.metaData.playerLinks[right].left = left;
                        }
                        restart();
                        return [2 /*return*/];
                }
            });
        }); };
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
            _this.Logger.info("[Prepared] " + _this.gameId);
        };
        this.start = function () {
            _this.Logger.info("[Started] " + _this.gameId);
            _this.notificationManager.notifyGameInit(_this.players.map(function (p) { return (__assign(__assign({}, p), { order: _this.metaData.playerLinks[p.id].order })); }), _this.state, _this.options);
            // start listening to events from channel
            _this.handleEvents();
        };
        this.hotRejoin = function (playerId) {
            _this.notificationManager.notifyGameInit(_this.players.map(function (p) { return (__assign(__assign({}, p), { order: _this.metaData.playerLinks[p.id].order })); }), _this.state, _this.options, [playerId]);
        };
        this.clear = function () {
            _this.Logger.info("[Cleared] " + _this.gameId);
            _this.finishHandler('');
        };
        // send a new ClientEvent into the channel
        this.scheduleEvent = function (event) {
            _this.channel.send(event);
        };
        // send a new interrupt into the channel
        this.scheduleInterrupt = function (interrupt) {
            _this.channel.send(interrupt);
        };
        // channels listener for sequential event / interrupt processing
        this.handleEvents = function () { return __awaiter(_this, void 0, void 0, function () {
            var event_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!true) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.channel.receive()];
                    case 1:
                        event_1 = _a.sent();
                        if (event_1.value && 'reason' in event_1.value) {
                            this.interruptGame(event_1.value);
                        }
                        else if (event_1.value && 'eid' in event_1.value) {
                            this.processEvent(event_1.value);
                        }
                        if (!event_1.ok) {
                            return [3 /*break*/, 2];
                        }
                        return [3 /*break*/, 0];
                    case 2: return [2 /*return*/];
                }
            });
        }); };
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
        this.processEvent = function (event) {
            var responsibleRules = _this.rulesManager.getResponsibleRules(event, _this.state);
            var rule = _this.rulesManager.getPrioritizedRules(responsibleRules);
            if (!rule) {
                _this.Logger.warn(_this.gameId + " no responsible rule found");
                return;
            }
            _this.Logger.info(_this.gameId + " - responsible rule: " + rule.name);
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
                _this.Logger.info(_this.gameId + " finisher found");
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
            _this.stop();
        };
        this.stop = function () {
            _this.channel.close();
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
        this.channel = new async_queue_js_1.AsyncQueue(32);
        this.rulesManager = new ruleManager_js_1.RuleManager(options, this.scheduleInterrupt);
        this.Logger.info("Initialized with rules: " + JSON.stringify(this.rulesManager.all.map(function (r) { return r.name; })));
    }
    return GameStateManager;
}());
exports.GameStateManager = GameStateManager;
