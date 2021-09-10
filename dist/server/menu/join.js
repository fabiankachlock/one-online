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
exports.HandleJoinGame = void 0;
var helper_1 = require("../../helper");
var logging_1 = require("../../logging");
var preGameMessages_1 = require("../../preGameMessages");
var accessToken_1 = require("../../store/accessToken");
var accessToken_2 = require("../../store/implementations/accessToken");
var gameStore_1 = require("../../store/implementations/gameStore");
var HandleJoinGame = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameId, password, game, token, success;
    return __generator(this, function (_b) {
        _a = req.body, gameId = _a.gameId, password = _a.password;
        if (helper_1.requireLogin(req, res))
            return [2 /*return*/];
        if (!gameId) {
            logging_1.Logging.Game.info("[Join] call with missing information");
            preGameMessages_1.PreGameMessages.error(res, 'Error: Please fill in all information.');
            return [2 /*return*/];
        }
        game = gameStore_1.GameStore.getGame(gameId);
        if (game) {
            token = accessToken_1.createAccessToken(gameId);
            success = game.playerManager.registerPlayer(req.session.userId, password, token);
            if (success) {
                logging_1.Logging.Game.info("[Join] " + req.session.userId + " joined " + gameId);
                // set session
                req.session.gameId = game.key;
                req.session.activeToken = token;
                preGameMessages_1.PreGameMessages.joined(res);
            }
            else {
                logging_1.Logging.Game.warn("[Join] " + req.session.userId + " tried joining with wrong credentials " + gameId);
                accessToken_2.TokenStore.deleteToken(token);
                // reset session
                req.session.gameId = '';
                req.session.activeToken = '';
                preGameMessages_1.PreGameMessages.error(res, "Error: You can't join the game, make sure your password is correct");
            }
            return [2 /*return*/];
        }
        logging_1.Logging.Game.warn("[Join] " + req.session.userId + " tried joining nonexisting game " + gameId);
        preGameMessages_1.PreGameMessages.error(res, "Error: You can't join a game, that doesn't exists.");
        return [2 /*return*/];
    });
}); };
exports.HandleJoinGame = HandleJoinGame;
