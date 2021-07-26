"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
var uuid_1 = require("uuid");
var state_js_1 = require("./state/state.js");
var options_js_1 = require("./options.js");
var notificationManager_1 = require("./notificationManager");
var gameStoreRef_js_1 = require("../store/gameStoreRef.js");
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
        this.isReady = function (playerAmount) { return _this.metaData.playerCount === playerAmount; };
        this.join = function (playerId, name, password) {
            if (!_this.isPublic && (password !== _this.password || !_this.storeRef.checkPlayer(playerId, name)))
                return false;
            _this.metaData.playerCount += 1;
            _this.metaData.players.add(playerId);
            _this.notificationManager.notifyPlayerChange(_this.storeRef.queryPlayers());
            _this.storeRef.save();
            return true;
        };
        this.joinedWaiting = function () {
            _this.notificationManager.notifyPlayerChange(_this.storeRef.queryPlayers());
        };
        this.leave = function (playerId, name) {
            if (!_this.storeRef.checkPlayer(playerId, name))
                return;
            _this.metaData.players.delete(playerId);
            _this.metaData.playerCount -= 1;
            _this.notificationManager.notifyPlayerChange(_this.storeRef.queryPlayers());
            if (_this.metaData.playerCount <= 0) {
                _this.notificationManager.notifyGameStop();
                _this.storeRef.destroy();
                return;
            }
            _this.storeRef.save();
        };
        this.verify = function (playerId) { return _this.metaData.players.has(playerId); };
        this.prepare = function () {
            _this.constructPlayerLinks();
            if (_this.stateManager) {
                _this.stateManager.clear();
                _this.stateManager = undefined;
            }
            _this.stateManager = new state_js_1.GameStateManager(_this.key, _this.meta, _this.options.all);
            _this.stateManager.prepare();
            _this.stateManager.whenFinished(function (winner) {
                var _a, _b;
                _this.meta.running = false;
                _this.stateManager = undefined;
                _this.stats = {
                    winner: (_b = (_a = _this.storeRef.queryPlayers().find(function (p) { return p.id === winner; })) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'noname'
                };
                _this.metaData.players.clear();
                _this.metaData.playerCount = 0;
            });
            _this.stats = undefined;
            _this.metaData.running = true;
            _this.storeRef.save();
        };
        this.start = function () {
            var _a;
            _this.notificationManager.notifyGameStart();
            (_a = _this.stateManager) === null || _a === void 0 ? void 0 : _a.start();
        };
        this.stop = function () {
            _this.notificationManager.notifyGameStop();
            _this.storeRef.destroy();
        };
        this.getStats = function (forPlayer) {
            var _a, _b;
            return {
                winner: (_b = (_a = _this.stats) === null || _a === void 0 ? void 0 : _a.winner) !== null && _b !== void 0 ? _b : 'noname',
                playAgainUrl: forPlayer === _this.host ? '../wait_host.html' : '../wait.html'
            };
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
            console.log('[Game]', _this.key, ' incoming event: ', msg);
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
