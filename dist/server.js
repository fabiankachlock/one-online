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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express_1 = __importDefault(require("express"));
var game_1 = require("./game/game");
var management_1 = require("./game/management");
var gameStore_1 = require("./store/gameStore");
var userStore_1 = require("./store/userStore");
var PORT = process.env.PORT || 4096;
var server = express_1.default();
server.use(express_1.default.static('static'));
server.use(express_1.default.json());
server.use(function (req, _res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.info('[' + req.method + '] ' + req.url);
        next();
        return [2 /*return*/];
    });
}); });
server.get('/games', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json(gameStore_1.GameStore.getPublics());
        return [2 /*return*/];
    });
}); });
server.post('/player/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, id, newPlayer;
    return __generator(this, function (_a) {
        name = req.body.name;
        id = userStore_1.PlayerStore.getPlayerId(name);
        if (id) {
            res.json({ id: id });
            return [2 /*return*/];
        }
        newPlayer = game_1.NewPlayer(name);
        userStore_1.PlayerStore.storePlayer(newPlayer);
        res.json({ id: newPlayer.id });
        return [2 /*return*/];
    });
}); });
server.post('/player/changeName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name;
    return __generator(this, function (_b) {
        _a = req.body, id = _a.id, name = _a.name;
        userStore_1.PlayerStore.changePlayerName(id, name);
        return [2 /*return*/];
    });
}); });
server.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, password, publicMode, host, id;
    return __generator(this, function (_b) {
        _a = req.body, name = _a.name, password = _a.password, publicMode = _a.publicMode, host = _a.host;
        id = management_1.CreateGame({
            name: name,
            password: password,
            public: publicMode,
            host: host
        });
        if (!id) {
            res.json({ error: 'An Error Occured' });
        }
        else {
            res.json({
                success: true,
                url: '/game.html#' + id,
                id: id
            });
        }
        return [2 /*return*/];
    });
}); });
server.post('/join', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, game, player, password, id;
    return __generator(this, function (_b) {
        _a = req.body, game = _a.game, player = _a.player, password = _a.password;
        id = management_1.JoinGame(game, player, password);
        if (!id) {
            res.json({ error: 'Some Error' });
        }
        else {
            res.json({
                success: true,
                url: '/game.html#' + id,
                id: id
            });
        }
        return [2 /*return*/];
    });
}); });
server.get('/dev/players', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json(userStore_1.PlayerStore.all());
        return [2 /*return*/];
    });
}); });
server.get('/dev/games', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json(gameStore_1.GameStore.all());
        return [2 /*return*/];
    });
}); });
server.listen(PORT);
