"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleAccessGame = void 0;
var helper_1 = require("../../helper");
var logging_1 = require("../../logging");
var preGameMessages_1 = require("../../preGameMessages");
var accessToken_1 = require("../../store/accessToken");
var gameStore_1 = require("../../store/implementations/gameStore");
var helper_2 = require("../../helper");
var accessByGameId = function (req, res) {
    var _a = req.session, gameId = _a.gameId, userId = _a.userId;
    var game = gameStore_1.GameStore.getGame(gameId);
    if (!game)
        return false;
    if (game.meta.host === userId) {
        logging_1.Logging.Game.info("[Access] host accessed " + gameId + " direct");
        game.playerManager.joinHost(userId);
        preGameMessages_1.PreGameMessages.verify(res, userId);
        return true;
    }
    return false;
};
var accessByToken = function (req, res) {
    var _a = req.session, gameId = _a.gameId, activeToken = _a.activeToken, userId = _a.userId;
    var computedGameId = accessToken_1.readAccessToken(activeToken || '');
    var game = gameStore_1.GameStore.getGame(computedGameId || '');
    if (computedGameId && game) {
        if (userId === game.meta.host) {
            logging_1.Logging.Game.warn("[Access] host accessed " + gameId + " via token");
            game.playerManager.joinHost(userId);
            preGameMessages_1.PreGameMessages.verify(res, userId);
            return true;
        }
        else {
            logging_1.Logging.Game.info("[Access] player accessed " + computedGameId);
            game.playerManager.joinPlayer(req.session.activeToken);
            preGameMessages_1.PreGameMessages.verify(res, req.session.userId);
            return true;
        }
    }
    return false;
};
var HandleAccessGame = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameId, activeToken, computedGameId;
    return __generator(this, function (_b) {
        if (helper_2.requireLogin(req, res))
            return [2 /*return*/];
        if (helper_1.requireActiveGame(req, res))
            return [2 /*return*/];
        _a = req.session, gameId = _a.gameId, activeToken = _a.activeToken;
        // when a game id is given it should be the host, so try joining as host
        if (gameId && accessByGameId(req, res)) {
            return [2 /*return*/];
        }
        else if (gameId) {
            logging_1.Logging.Game.warn("[Access] tried accessing game with gameId " + req.session.gameId);
        }
        if (helper_1.requireAuthToken(req, res))
            return [2 /*return*/];
        // try joining as player
        if (accessByToken(req, res)) {
            return [2 /*return*/];
        }
        computedGameId = accessToken_1.readAccessToken(activeToken || '');
        // test is the game exists for better error message
        if (computedGameId) {
            logging_1.Logging.Game.warn("[Access] player tried accessing with wrong token " + computedGameId);
            preGameMessages_1.PreGameMessages.error(res, 'Error: Token cannot be verified');
            return [2 /*return*/];
        }
        logging_1.Logging.Game.warn("[Access] player tried accessing nonexisting game " + computedGameId);
        preGameMessages_1.PreGameMessages.error(res, 'Error: Game cannot be found');
        return [2 /*return*/];
    });
}); };
exports.HandleAccessGame = HandleAccessGame;
