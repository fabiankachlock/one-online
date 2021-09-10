"use strict";
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
exports.GamePlayerManager = void 0;
var shuffle_1 = require("../lib/shuffle");
var GamePlayerManager = /** @class */ (function () {
    function GamePlayerManager(host, key, logger, forward) {
        var _this = this;
        this.host = host;
        this.key = key;
        this.forward = forward;
        this.metaData = {
            playerCount: 0,
            playerLinks: {},
            players: new Set(),
            noHost: true
        };
        this.preparedPlayers = {};
        this.isReady = function (playerAmount) {
            return _this.metaData.playerCount === playerAmount;
        };
        this.registerPlayer = function (playerId, password, token) {
            if (!_this.forward.checkPassword(password)) {
                return false;
            }
            _this.preparedPlayers[token] = playerId;
            _this.forward.save();
            return true;
        };
        this.joinPlayer = function (token) {
            var playerId = _this.preparedPlayers[token];
            if (playerId) {
                _this.storePlayer(playerId);
            }
            else {
                _this.Logger.warn(playerId + " tried joining without being registered");
            }
        };
        this.joinHost = function (id) {
            if (id === _this.host) {
                _this.metaData.noHost = false;
                _this.storePlayer(_this.host);
            }
            else {
                _this.Logger.warn(id + " tried joining as host without being the host");
            }
        };
        this.storePlayer = function (id) {
            _this.metaData.players.add(id);
            _this.metaData.playerCount = _this.metaData.players.size;
            _this.forward.onPlayerJoin();
            _this.forward.save();
        };
        this.leavePlayer = function (playerId) {
            if (playerId === _this.host) {
                _this.Logger.warn('host left game');
                _this.metaData.noHost = true;
            }
            _this.metaData.players.delete(playerId);
            _this.metaData.playerCount = _this.metaData.players.size;
            _this.forward.onPlayerJoin();
            if (_this.metaData.playerCount === 0 && _this.host in _this.preparedPlayers) {
                _this.forward.closeGame();
                return;
            }
            _this.forward.save();
        };
        this.verifyPlayer = function (playerId) {
            return _this.metaData.players.has(playerId);
        };
        this.rejoin = function (playerId) {
            if (_this.metaData.players.has(playerId)) {
                _this.forward.hotRejoin(playerId);
            }
            else {
                _this.Logger.warn(playerId + " tried hot rejoin without being registered");
            }
        };
        this.prepare = function () {
            _this.constructPlayerLinks();
        };
        this.reset = function () {
            _this.metaData.playerLinks = {};
            _this.metaData.noHost = true;
            _this.preparedPlayers = {};
            _this.preparedPlayers[_this.key] = _this.host;
            _this.metaData.players.clear();
        };
        this.preparePlayAgain = function () {
            var e_1, _a;
            var _b;
            var playerIdMap = {};
            var playerMeta = Object.entries(_this.preparedPlayers)
                .map(function (_a) {
                var _b = __read(_a, 2), token = _b[0], id = _b[1];
                return ({ token: token, id: id });
            })
                .filter(function (entry) { return _this.metaData.players.has(entry.id); });
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
            var players = shuffle_1.shuffle(Array.from(_this.metaData.players));
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
                    right: rightLink,
                    order: index
                };
            });
        };
        // prepare host
        this.preparedPlayers[key] = host;
        this.Logger = logger.withBadge('Players');
    }
    Object.defineProperty(GamePlayerManager.prototype, "meta", {
        get: function () {
            return this.metaData;
        },
        enumerable: false,
        configurable: true
    });
    return GamePlayerManager;
}());
exports.GamePlayerManager = GamePlayerManager;
