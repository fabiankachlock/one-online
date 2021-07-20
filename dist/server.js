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
var http_1 = __importDefault(require("http"));
var game_1 = require("./game/game");
var management_1 = require("./game/management");
var options_1 = require("./game/options");
var gameStore_1 = require("./store/implementations/gameStore/");
var playerStore_1 = require("./store/implementations/playerStore/");
var waitingServer_1 = require("./waitingServer");
var PORT = process.env.PORT || 4096;
var app = express_1.default();
var server = http_1.default.createServer(app);
app.use(function (req, _res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.info('[' + req.method + '] ' + req.url);
        next();
        return [2 /*return*/];
    });
}); });
app.use(express_1.default.static('static'));
app.use(express_1.default.json());
// Menu Endpoints
app.get('/games', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json(gameStore_1.GameStore.getPublicGames());
        return [2 /*return*/];
    });
}); });
app.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, password, publicMode, host, id;
    return __generator(this, function (_b) {
        _a = req.body, name = _a.name, password = _a.password, publicMode = _a.publicMode, host = _a.host;
        if (!name || !password || !host) {
            res.json({ error: 'Error: Please fill in all informations.' });
            return [2 /*return*/];
        }
        id = management_1.CreateGame({
            name: name,
            password: password,
            public: publicMode,
            host: host
        });
        if (!id) {
            res.json({ error: 'Error: Game can\'t be created. You might need to choose an onther name.' });
        }
        else {
            res.json({
                success: true,
                url: '/wait_host.html',
                id: id
            });
        }
        return [2 /*return*/];
    });
}); });
app.post('/join', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, game, player, password, id;
    return __generator(this, function (_b) {
        _a = req.body, game = _a.game, player = _a.player, password = _a.password;
        if (!game || !player || !password) {
            res.json({ error: 'Error: Please fill in all informations.' });
            return [2 /*return*/];
        }
        id = management_1.JoinGame(game, player, password);
        if (!id) {
            res.json({ error: 'Error: you can\'t join the game, make sure your password is correct and the game exists.' });
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
app.post('/leave', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, game, player;
    return __generator(this, function (_b) {
        _a = req.body, game = _a.game, player = _a.player;
        management_1.LeaveGame(game, player);
        res.send('');
        return [2 /*return*/];
    });
}); });
// Player Management
app.post('/player/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, id, newPlayer;
    return __generator(this, function (_a) {
        name = req.body.name;
        id = playerStore_1.PlayerStore.getPlayerId(name);
        if (id) {
            res.json({ id: id });
            return [2 /*return*/];
        }
        newPlayer = game_1.NewPlayer(name);
        playerStore_1.PlayerStore.storePlayer(newPlayer);
        res.json({ id: newPlayer.id });
        return [2 /*return*/];
    });
}); });
app.post('/player/changeName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name;
    return __generator(this, function (_b) {
        _a = req.body, id = _a.id, name = _a.name;
        playerStore_1.PlayerStore.changePlayerName(id, name);
        return [2 /*return*/];
    });
}); });
// Game Management
app.get('/game/status/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, game;
    return __generator(this, function (_a) {
        id = req.params.id;
        game = gameStore_1.GameStore.getGame(id);
        res.json(game === null || game === void 0 ? void 0 : game.meta);
        return [2 /*return*/];
    });
}); });
app.post('/game/options/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, game, newGame;
    return __generator(this, function (_a) {
        id = req.params.id;
        game = gameStore_1.GameStore.getGame(id);
        if (game) {
            newGame = options_1.resolveOptions(game, req.body);
            gameStore_1.GameStore.storeGame(newGame);
        }
        return [2 /*return*/];
    });
}); });
// Dev
app.get('/dev/players', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json(playerStore_1.PlayerStore.all());
        return [2 /*return*/];
    });
}); });
app.get('/dev/games', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json(gameStore_1.GameStore.all());
        return [2 /*return*/];
    });
}); });
waitingServer_1.initWaitingServer(server);
server.listen(PORT, function () {
    console.log('[Info] Server running');
});
