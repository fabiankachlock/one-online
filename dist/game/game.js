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
exports.Game = void 0;
var uuid_1 = require("uuid");
var state_js_1 = require("./state/state.js");
var options_js_1 = require("./options.js");
var notificationManager_1 = require("./notificationManager");
var gameStoreRef_js_1 = require("../store/gameStoreRef.js");
var index_js_1 = require("../logging/index.js");
var optionDescriptions_1 = require("./optionDescriptions");
var Game = /** @class */ (function () {
    function Game(name, password, host, isPublic, key, options) {
        var _this = this;
        if (key === void 0) { key = uuid_1.v4(); }
        if (options === void 0) { options = options_js_1.GameOptions.default(); }
        this.name = name;
        this.password = password;
        this.host = host;
        this.isPublic = isPublic;
        this.key = key;
        this.options = options;
        this.preparedPlayers = {};
        this.resolveOptions = function (options) {
            _this.options.resolveFromMessage(options);
            var active = _this.options.allActive;
            _this.notificationManager.notifyOptionsChange(active.map(optionDescriptions_1.mapOptionsKeyToDescription));
        };
        this.isReady = function (playerAmount) {
            return _this.metaData.playerCount === playerAmount;
        };
        this.preparePlayer = function (playerId, name, password, token) {
            if (!_this.isPublic &&
                (password !== _this.password || !_this.storeRef.checkPlayer(playerId, name)))
                return false;
            _this.preparedPlayers[token] = playerId;
            _this.storeRef.save();
            return true;
        };
        this.joinPlayer = function (token) {
            var playerId = _this.preparedPlayers[token];
            if (playerId) {
                _this.metaData.players.add(playerId);
                _this.metaData.playerCount = _this.metaData.players.size;
                _this.onPlayerJoined();
                _this.storeRef.save();
            }
        };
        this.joinHost = function () {
            _this.metaData.players.add(_this.host);
            _this.metaData.playerCount = _this.metaData.players.size;
            _this.onPlayerJoined();
            _this.storeRef.save();
        };
        this.onPlayerJoined = function () {
            _this.resolveOptions({}); // send options
            _this.notificationManager.notifyPlayerChange(_this.storeRef.queryPlayers().map(function (p) { return (__assign(__assign({}, p), { name: p.name + " " + (p.id === _this.host ? '(host)' : '') })); }));
        };
        this.leave = function (playerId, name) {
            if (playerId === _this.host) {
                _this.Logger.warn('host left game');
                _this.stop();
                return;
            }
            if (!_this.storeRef.checkPlayer(playerId, name))
                return;
            _this.metaData.players.delete(playerId);
            _this.metaData.playerCount -= 1;
            _this.notificationManager.notifyPlayerChange(_this.storeRef.queryPlayers());
            if (_this.metaData.playerCount <= 0 &&
                !(_this.host in _this.preparedPlayers)) {
                _this.notificationManager.notifyGameStop();
                _this.storeRef.destroy();
                return;
            }
            _this.storeRef.save();
        };
        this.verify = function (playerId) {
            return _this.metaData.players.has(playerId);
        };
        this.prepare = function () {
            _this.constructPlayerLinks();
            if (_this.stateManager) {
                _this.stateManager.clear();
                _this.stateManager = undefined;
            }
            _this.stateManager = new state_js_1.GameStateManager(_this.key, _this.meta, _this.options.all, _this.Logger.withBadge('State'));
            _this.stateManager.prepare();
            _this.stateManager.whenFinished(function (winner) {
                var _a, _b;
                _this.metaData.running = false;
                _this.stateManager = undefined;
                _this.stats = {
                    winner: (_b = (_a = _this.storeRef.queryPlayers().find(function (p) { return p.id === winner; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'noname',
                    playAgain: _this.preparePlayAgain()
                };
                _this.metaData.players.clear();
                _this.metaData.playerCount = 0;
            });
            _this.stats = undefined;
            _this.metaData.running = true;
            _this.storeRef.save();
            _this.Logger.info("[Prepared]");
        };
        this.start = function () {
            var _a;
            _this.notificationManager.notifyGameStart();
            (_a = _this.stateManager) === null || _a === void 0 ? void 0 : _a.start();
            _this.Logger.info("[Started]");
        };
        this.rejoin = function (playerId) {
            if (_this.stateManager) {
                _this.stateManager.hotRejoin(playerId);
            }
        };
        this.stop = function () {
            _this.notificationManager.notifyGameStop();
            _this.storeRef.destroy();
            _this.Logger.info("[Stopped]");
        };
        this.getStats = function (forPlayer) {
            var _a, _b;
            return {
                winner: (_b = (_a = _this.stats) === null || _a === void 0 ? void 0 : _a.winner) !== null && _b !== void 0 ? _b : 'noname',
                url: forPlayer === _this.host ? '../wait_host.html' : '../wait.html'
            };
        };
        this.preparePlayAgain = function () {
            var e_1, _a;
            var _b;
            var playerIdMap = {};
            var playerMeta = Object.entries(_this.preparedPlayers).map(function (_a) {
                var _b = __read(_a, 2), token = _b[0], id = _b[1];
                return ({ token: token, id: id });
            });
            var _loop_1 = function (player) {
                // reuse tokens
                playerIdMap[player] =
                    ((_b = playerMeta.find(function (entry) { return entry.id === player; })) === null || _b === void 0 ? void 0 : _b.token) || '';
            };
            try {
                for (var _c = __values(_this.metaData.players), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var player = _d.value;
                    _loop_1(player);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_1) throw e_1.error; }
            }
            _this.preparedPlayers[_this.host] = _this.key;
            _this.Logger.info("[Prepared] for play again");
            return playerIdMap;
        };
        this.constructPlayerLinks = function () {
            var players = Array.from(_this.metaData.players);
            _this.metaData.playerLinks = {};
            players.forEach(function (p, index) {
                var leftLink;
                if (index < players.length - 1) {
                    leftLink = players[index + 1];
                }
                else {
                    leftLink = players[0];
                }
                var rightLink;
                if (index > 0) {
                    rightLink = players[index - 1];
                }
                else {
                    rightLink = players[players.length - 1];
                }
                _this.metaData.playerLinks[p] = {
                    left: leftLink,
                    right: rightLink
                };
            });
        };
        this.eventHandler = function () { return function (msg) {
            var _a;
            _this.Logger.info("[Event] [Incoming] " + msg);
            (_a = _this.stateManager) === null || _a === void 0 ? void 0 : _a.handleEvent(JSON.parse(msg));
        }; };
        this.metaData = {
            playerCount: 1,
            players: new Set(),
            running: false,
            playerLinks: {}
        };
        this.metaData.players.add(host);
        this.storeRef = gameStoreRef_js_1.createRef(this);
        this.storeRef.save();
        this.notificationManager = new notificationManager_1.GameNotificationManager(this.key);
        this.Logger = index_js_1.Logging.Game.withBadge(this.name.substring(0, 8) + '-' + this.key.substring(0, 8));
    }
    Object.defineProperty(Game.prototype, "meta", {
        get: function () {
            return this.metaData;
        },
        enumerable: false,
        configurable: true
    });
    Game.create = function (name, password, host, isPublic) { return new Game(name, isPublic ? '' : password, host, isPublic); };
    return Game;
}());
exports.Game = Game;
