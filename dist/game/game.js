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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var uuid_1 = require("uuid");
var state_js_1 = require("./state/state.js");
var options_js_1 = require("./options.js");
var notificationManager_1 = require("./notificationManager");
var gameStoreRef_js_1 = require("../store/gameStoreRef.js");
var index_js_1 = require("../logging/index.js");
var optionDescriptions_1 = require("./optionDescriptions");
var playerManager_js_1 = require("./playerManager.js");
var Game = /** @class */ (function () {
    function Game(name, password, host, isPublic, key, options) {
        var _this = this;
        if (key === void 0) { key = uuid_1.v4(); }
        if (options === void 0) { options = options_js_1.GameOptions.default(); }
        this.key = key;
        this.options = options;
        this.resolveOptions = function (options) {
            _this.options.resolveFromMessage(options);
            var active = _this.options.allActive;
            _this.notificationManager.notifyOptionsChange(active.map(optionDescriptions_1.mapOptionsKeyToDescription));
        };
        this.onPlayerJoined = function () {
            _this.resolveOptions({}); // send options
            _this.notificationManager.notifyPlayerChange(_this.storeRef.queryPlayers().map(function (p) { return (__assign(__assign({}, p), { name: p.name + " " + (p.id === _this.metaData.host ? '(host)' : '') })); }));
        };
        this.prepare = function () {
            _this.playerManager.prepare();
            if (_this.stateManager) {
                _this.stateManager.clear();
                _this.stateManager = undefined;
            }
            _this.stateManager = new state_js_1.GameStateManager(_this.key, _this.playerManager.meta, _this.options.all, _this.Logger.withBadge('State'));
            _this.stateManager.prepare();
            _this.stateManager.whenFinished(function (winner) {
                var _a, _b;
                _this.metaData.running = false;
                _this.stateManager = undefined;
                _this.stats = {
                    winner: (_b = (_a = _this.storeRef.queryPlayers().find(function (p) { return p.id === winner; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'noname',
                    playAgain: _this.playerManager.preparePlayAgain()
                };
                _this.playerManager.reset();
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
        this.stop = function () {
            var _a;
            (_a = _this.stateManager) === null || _a === void 0 ? void 0 : _a.stop();
            _this.notificationManager.notifyGameStop();
            _this.storeRef.destroy();
            _this.Logger.info("[Stopped]");
        };
        this.getStats = function (forPlayer) {
            var _a, _b;
            return {
                winner: (_b = (_a = _this.stats) === null || _a === void 0 ? void 0 : _a.winner) !== null && _b !== void 0 ? _b : 'noname',
                url: forPlayer === _this.metaData.host ? '../wait_host.html' : '../wait.html'
            };
        };
        this.eventHandler = function () { return function (msg) {
            var _a;
            _this.Logger.info("[Event] [Incoming] " + msg);
            (_a = _this.stateManager) === null || _a === void 0 ? void 0 : _a.scheduleEvent(JSON.parse(msg));
        }; };
        this.metaData = {
            running: false,
            name: name,
            host: host,
            isPublic: isPublic
        };
        this.storeRef = gameStoreRef_js_1.createRef(this);
        this.storeRef.save();
        this.notificationManager = new notificationManager_1.GameNotificationManager(this.key);
        this.Logger = index_js_1.Logging.Game.withBadge(this.metaData.name.substring(0, 8) + '-' + this.key.substring(0, 8));
        this.playerManager = new playerManager_js_1.GamePlayerManager(host, key, this.Logger, {
            checkPassword: function (pwd) { return pwd === password; },
            closeGame: function () {
                _this.notificationManager.notifyGameStop();
                _this.storeRef.destroy();
            },
            onPlayerJoin: this.onPlayerJoined,
            save: this.storeRef.save,
            hotRejoin: function (playerId) {
                if (_this.stateManager) {
                    _this.stateManager.hotRejoin(playerId);
                }
                else {
                    _this.Logger.warn("tried hot rejoin " + playerId + " to undefined stateManager");
                }
            }
        });
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
