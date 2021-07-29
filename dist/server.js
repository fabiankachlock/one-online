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
var game_js_1 = require("./game/game.js");
var gameServer_1 = require("./gameServer");
var index_js_1 = require("./logging/index.js");
var memoryWatcher_js_1 = require("./memoryWatcher.js");
var postGameMessages_js_1 = require("./postGameMessages.js");
var preGameMessages_js_1 = require("./preGameMessages.js");
var accessToken_js_1 = require("./store/accessToken.js");
var index_js_2 = require("./store/implementations/accessToken/index.js");
var gameStore_1 = require("./store/implementations/gameStore/");
var playerStore_1 = require("./store/implementations/playerStore/");
var waitingServer_1 = require("./waitingServer");
var PORT = process.env.PORT || 4096;
var expressServer = express_1.default();
var app = express_1.default.Router();
var server = http_1.default.createServer(expressServer);
index_js_1.Logging.App.info("Started in " + process.env.NODE_ENV + " mode");
expressServer.use(function (req, _res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        index_js_1.Logging.Hit.info("[" + req.method + "]  " + req.url);
        next();
        return [2 /*return*/];
    });
}); });
expressServer.use(express_1.default.static('static'));
expressServer.use(express_1.default.json());
// Menu Endpoints
app.get('/games', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json(gameStore_1.GameStore.getGames());
        return [2 /*return*/];
    });
}); });
app.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, password, publicMode, host, game;
    return __generator(this, function (_b) {
        _a = req.body, name = _a.name, password = _a.password, publicMode = _a.publicMode, host = _a.host;
        if (!name || !password || !host) {
            index_js_1.Logging.Game.info("[Created] call with missing information");
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Please fill in all informations.');
            return [2 /*return*/];
        }
        game = game_js_1.Game.create(name, password, host, publicMode);
        index_js_1.Logging.Game.info("[Created] " + game.key + " " + (game.isPublic ? '(public)' : ''));
        preGameMessages_js_1.PreGameMessages.created(res, game.key);
        return [2 /*return*/];
    });
}); });
app.post('/join', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameId, playerId, playerName, password, game, token, success;
    return __generator(this, function (_b) {
        _a = req.body, gameId = _a.gameId, playerId = _a.playerId, playerName = _a.playerName, password = _a.password;
        if (!gameId || !playerId) {
            index_js_1.Logging.Game.info("[Join] call with missing information");
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Please fill in all informations.');
            return [2 /*return*/];
        }
        game = gameStore_1.GameStore.getGame(gameId);
        if (game) {
            token = accessToken_js_1.createAccessToken(gameId);
            success = game.preparePlayer(playerId, playerName, password, token);
            if (success) {
                index_js_1.Logging.Game.info("[Join] " + playerId + " joined " + gameId);
                preGameMessages_js_1.PreGameMessages.joined(res, token);
            }
            else {
                index_js_1.Logging.Game.warn("[Join] " + playerId + " tried joining with wrong credentials " + gameId);
                index_js_2.TokenStore.deleteToken(token);
                preGameMessages_js_1.PreGameMessages.error(res, "Error: You can't join the game, make sure your password is correct");
            }
            return [2 /*return*/];
        }
        index_js_1.Logging.Game.warn("[Join] " + playerId + " tried joining nonexisting game " + gameId);
        preGameMessages_js_1.PreGameMessages.error(res, "Error: You can't join a game, that doesn't exists.");
        return [2 /*return*/];
    });
}); });
app.post('/leave', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameId, token, playerId, playerName, computedGameId, game;
    return __generator(this, function (_b) {
        _a = req.body, gameId = _a.gameId, token = _a.token, playerId = _a.playerId, playerName = _a.playerName;
        computedGameId = gameId || accessToken_js_1.useAccessToken(token || '') || '';
        game = gameStore_1.GameStore.getGame(computedGameId);
        if (game) {
            game.leave(playerId, playerName);
            index_js_1.Logging.Game.info("[Leave] " + playerId + " leaved " + computedGameId);
            res.send('');
        }
        else {
            index_js_1.Logging.Game.warn("[Leave] " + playerId + " tried leaving nonexisting game " + computedGameId);
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Game cannot be found');
        }
        return [2 /*return*/];
    });
}); });
app.post('/access', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameId, token, game, computedGameId, game;
    return __generator(this, function (_b) {
        _a = req.body, gameId = _a.gameId, token = _a.token;
        if (gameId) {
            game = gameStore_1.GameStore.getGame(gameId);
            if (game) {
                index_js_1.Logging.Game.info("[Access] host accessed " + gameId);
                game.joinHost();
                preGameMessages_js_1.PreGameMessages.verify(res);
            }
            else {
                index_js_1.Logging.Game.warn("[Access] host tried accessing nonexisting game " + gameId);
                preGameMessages_js_1.PreGameMessages.error(res, 'Error: Game cannot be found');
            }
            return [2 /*return*/];
        }
        computedGameId = accessToken_js_1.useAccessToken(token || '');
        if (computedGameId && token) {
            game = gameStore_1.GameStore.getGame(computedGameId);
            if (game) {
                index_js_1.Logging.Game.info("[Access] player accessed " + computedGameId);
                game.joinPlayer(token);
                preGameMessages_js_1.PreGameMessages.tokenResponse(res, computedGameId);
                return [2 /*return*/];
            }
            else {
                index_js_1.Logging.Game.warn("[Access] player tried accessing nonexisting game " + computedGameId);
                preGameMessages_js_1.PreGameMessages.error(res, 'Error: Game cannot be found');
            }
        }
        else {
            index_js_1.Logging.Game.warn("[Access] player tried accessing with wrong token " + computedGameId);
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Token cannot be verified');
        }
        return [2 /*return*/];
    });
}); });
// Player Management
app.post('/player/register', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, id, testName, newPlayer;
    return __generator(this, function (_b) {
        _a = req.body, name = _a.name, id = _a.id;
        testName = playerStore_1.PlayerStore.getPlayerName(id);
        if (testName && testName !== name) {
            index_js_1.Logging.Player.warn("Player registered with dublicate ID " + id + " (stored: " + testName + " | registered: " + name + ")");
            res.json({
                error: 'Error: Dublicate PlayerID, playes reaload Page!'
            });
            return [2 /*return*/];
        }
        newPlayer = {
            id: id,
            name: name
        };
        index_js_1.Logging.Player.info("player " + id + " registered under name " + name);
        playerStore_1.PlayerStore.storePlayer(newPlayer);
        res.json({ ok: true });
        return [2 /*return*/];
    });
}); });
app.post('/player/changeName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, name;
    return __generator(this, function (_b) {
        _a = req.body, id = _a.id, name = _a.name;
        playerStore_1.PlayerStore.changePlayerName(id, name);
        index_js_1.Logging.Player.info("player " + id + " changed name to " + name);
        res.send('');
        return [2 /*return*/];
    });
}); });
// Game Management
app.post('/game/options/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, game;
    return __generator(this, function (_a) {
        id = req.params.id;
        game = gameStore_1.GameStore.getGame(id);
        if (game) {
            game.options.resolveFromMessage(req.body);
            gameStore_1.GameStore.storeGame(game);
            index_js_1.Logging.Game.info("[Options] changed game " + id);
            res.send('');
        }
        else {
            index_js_1.Logging.Game.warn("[Options] tried changing nonexisting game " + id);
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Game cannot be found');
        }
        return [2 /*return*/];
    });
}); });
app.get('/game/start/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, game;
    return __generator(this, function (_a) {
        id = req.params.id;
        game = gameStore_1.GameStore.getGame(id);
        if (game) {
            index_js_1.Logging.Game.info("[Start] " + id);
            game.start();
            res.send('');
        }
        else {
            index_js_1.Logging.Game.warn("[Start] tried starting nonexisting game " + id);
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Game cannot be found');
        }
        return [2 /*return*/];
    });
}); });
app.get('/game/stop/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, game;
    return __generator(this, function (_a) {
        id = req.params.id;
        game = gameStore_1.GameStore.getGame(id);
        if (game) {
            index_js_1.Logging.Game.info("[Stop] " + id);
            game.stop();
            res.send('');
        }
        else {
            index_js_1.Logging.Game.warn("[Stop] tried stopping nonexisting game " + id);
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Game cannot be found');
        }
        return [2 /*return*/];
    });
}); });
app.get('/game/stats/:id/:player', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, player, game, stats;
    return __generator(this, function (_a) {
        id = req.params.id;
        player = req.params.player;
        game = gameStore_1.GameStore.getGame(id);
        if (game) {
            stats = game.getStats(player);
            index_js_1.Logging.Game.info("[Stats] " + player + " fetched stats for " + id);
            postGameMessages_js_1.PostGameMessages.stats(res, stats.winner, stats.token, stats.url);
        }
        else {
            index_js_1.Logging.Game.warn("[Stats] " + player + " tried fetching stats for nonexisting game " + id);
            postGameMessages_js_1.PostGameMessages.error(res, 'Error: Game not found');
        }
        return [2 /*return*/];
    });
}); });
app.get('/game/verify/:id/:player', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, player, game;
    return __generator(this, function (_a) {
        id = req.params.id;
        player = req.params.player;
        game = gameStore_1.GameStore.getGame(id);
        if (game === null || game === void 0 ? void 0 : game.verify(player)) {
            index_js_1.Logging.Game.info("[Verify] " + player + " allowed for " + id);
            preGameMessages_js_1.PreGameMessages.verify(res);
        }
        else {
            index_js_1.Logging.Game.warn("[Verify] tried verifying player " + player + " on nonexisting game " + id);
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Not allowed to access game');
        }
        return [2 /*return*/];
    });
}); });
// Dev
if (process.env.NODE_ENV === 'development') {
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
    index_js_1.Logging.App.info('[Development] activated dev routes');
}
server.on('upgrade', function upgrade(request, socket, head) {
    var url = request.url;
    if (url.startsWith(waitingServer_1.WaitingServerPath)) {
        index_js_1.Logging.Websocket.info('[Waiting] [Upgrade]');
        waitingServer_1.WaitingServer.handleUpgrade(request, socket, head, function done(ws) {
            waitingServer_1.WaitingServer.emit('connection', ws, request);
        });
    }
    else if (url.startsWith(gameServer_1.GameServerPath)) {
        index_js_1.Logging.Websocket.info('[Active] [Upgrade]');
        gameServer_1.GameServer.handleUpgrade(request, socket, head, function done(ws) {
            gameServer_1.GameServer.emit('connection', ws, request);
        });
    }
    else {
        socket.destroy();
    }
});
memoryWatcher_js_1.startMemoryWatcher(process.env.NODE_ENV === 'development');
expressServer.use('/api/v1', app);
server.listen(PORT, function () {
    index_js_1.Logging.App.info('Server running');
    index_js_1.Logging.Server.info('Started!');
    index_js_1.Logging.Server.info("[Port] " + PORT);
});
