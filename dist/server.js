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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var express_session_1 = __importDefault(require("express-session"));
var uuid_1 = require("uuid");
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
var helper_1 = require("./helper");
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
expressServer.use(express_session_1.default({
    secret: (_a = process.env.SESSION_SECRET) !== null && _a !== void 0 ? _a : 'very-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7776000 /* 90 Days */ }
}));
// Menu Endpoints
app.get('/games', function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.json(gameStore_1.GameStore.getGames());
        return [2 /*return*/];
    });
}); });
app.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, password, publicMode, game;
    return __generator(this, function (_b) {
        _a = req.body, name = _a.name, password = _a.password, publicMode = _a.publicMode;
        if (helper_1.requireLogin(req, res))
            return [2 /*return*/];
        if (!name || !password) {
            index_js_1.Logging.Game.info("[Created] call with missing information");
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Please fill in all information.');
            return [2 /*return*/];
        }
        game = game_js_1.Game.create(name, password, req.session.userId, publicMode);
        index_js_1.Logging.Game.info("[Created] " + game.key + " " + (game.isPublic ? '(public)' : ''));
        // set session
        req.session.gameId = game.key;
        preGameMessages_js_1.PreGameMessages.created(res);
        return [2 /*return*/];
    });
}); });
app.post('/join', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, gameId, password, game, token, success;
    return __generator(this, function (_b) {
        _a = req.body, gameId = _a.gameId, password = _a.password;
        if (helper_1.requireLogin(req, res))
            return [2 /*return*/];
        if (!gameId) {
            index_js_1.Logging.Game.info("[Join] call with missing information");
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Please fill in all information.');
            return [2 /*return*/];
        }
        game = gameStore_1.GameStore.getGame(gameId);
        if (game) {
            token = accessToken_js_1.createAccessToken(gameId);
            success = game.preparePlayer(req.session.userId, req.session.userName, password, token);
            if (success) {
                index_js_1.Logging.Game.info("[Join] " + req.session.userId + " joined " + gameId);
                // set session
                req.session.gameId = game.key;
                req.session.activeToken = token;
                preGameMessages_js_1.PreGameMessages.joined(res);
            }
            else {
                index_js_1.Logging.Game.warn("[Join] " + req.session.userId + " tried joining with wrong credentials " + gameId);
                index_js_2.TokenStore.deleteToken(token);
                // reset session
                req.session.gameId = '';
                req.session.activeToken = '';
                preGameMessages_js_1.PreGameMessages.error(res, "Error: You can't join the game, make sure your password is correct");
            }
            return [2 /*return*/];
        }
        index_js_1.Logging.Game.warn("[Join] " + req.session.userId + " tried joining nonexisting game " + gameId);
        preGameMessages_js_1.PreGameMessages.error(res, "Error: You can't join a game, that doesn't exists.");
        return [2 /*return*/];
    });
}); });
app.post('/leave', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var computedGameId, game;
    return __generator(this, function (_a) {
        if (helper_1.requireLogin(req, res) || helper_1.requireGameInfo(req, res))
            return [2 /*return*/];
        computedGameId = accessToken_js_1.useAccessToken(req.session.activeToken || '') || req.session.gameId || '';
        game = gameStore_1.GameStore.getGame(computedGameId);
        if (game) {
            game.leave(req.session.userId, req.session.userName);
            index_js_1.Logging.Game.info("[Leave] " + req.session.userId + " leaved " + computedGameId);
            // reset session
            req.session.gameId = '';
            req.session.activeToken = '';
            res.send('');
        }
        else {
            index_js_1.Logging.Game.warn("[Leave] " + req.session.userId + " tried leaving nonexisting game " + computedGameId);
            // reset session
            req.session.gameId = '';
            req.session.activeToken = '';
            preGameMessages_js_1.PreGameMessages.error(res, 'Error: Game cannot be found');
        }
        return [2 /*return*/];
    });
}); });
app.post('/access', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var game, computedGameId, game;
    return __generator(this, function (_a) {
        if (helper_1.requireActiveGame(req, res))
            return [2 /*return*/];
        if (req.session.gameId && !req.session.activeToken) {
            game = gameStore_1.GameStore.getGame(req.session.gameId);
            if (game) {
                index_js_1.Logging.Game.info("[Access] host accessed " + req.session.gameId);
                game.joinHost();
                preGameMessages_js_1.PreGameMessages.verify(res);
            }
            else {
                index_js_1.Logging.Game.warn("[Access] host tried accessing nonexisting game " + req.session.gameId);
                preGameMessages_js_1.PreGameMessages.error(res, 'Error: Game cannot be found');
            }
            return [2 /*return*/];
        }
        if (helper_1.requireAuthToken(req, res))
            return [2 /*return*/];
        computedGameId = accessToken_js_1.readAccessToken(req.session.activeToken || '');
        if (computedGameId && req.session.activeToken) {
            game = gameStore_1.GameStore.getGame(computedGameId);
            if (game) {
                index_js_1.Logging.Game.info("[Access] player accessed " + computedGameId);
                game.joinPlayer(req.session.activeToken);
                preGameMessages_js_1.PreGameMessages.verify(res);
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
    var sessionUserId, name, userName, storedName, userName_1, id, newId, newPlayer;
    return __generator(this, function (_a) {
        sessionUserId = req.session.userId;
        name = req.body.name;
        // Case 1: player already logged in
        if (sessionUserId) {
            userName = req.session.userName;
            // Case 1.1: all data already in session
            if (userName) {
                storedName = playerStore_1.PlayerStore.getPlayerName(sessionUserId);
                if (storedName === userName) {
                    return [2 /*return*/, res.json({ ok: true })];
                }
                else {
                    return [2 /*return*/, res.json({ name: storedName })];
                }
            }
            else {
                userName_1 = playerStore_1.PlayerStore.getPlayerName(sessionUserId);
                if (userName_1) {
                    // set session
                    req.session.userName = userName_1;
                    return [2 /*return*/, res.json({ name: userName_1 })];
                }
            }
        }
        id = playerStore_1.PlayerStore.getPlayerId(name);
        if (id) {
            // set session
            req.session.userId = id;
            req.session.userName = name;
            return [2 /*return*/, res.json({ name: name })];
        }
        // Case 3: not registered
        if (name) {
            newId = uuid_1.v4();
            newPlayer = {
                id: newId,
                name: name
            };
            index_js_1.Logging.Player.info("player " + newId + " registered under name " + name);
            playerStore_1.PlayerStore.storePlayer(newPlayer);
            // set session
            req.session.userId = newId;
            req.session.userName = name;
            return [2 /*return*/, res.json({ name: name })];
        }
        // Case 4: no registered and no information
        res.json({
            error: 'Not enough information provided for register'
        });
        return [2 /*return*/];
    });
}); });
app.post('/player/changeName', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var name, id;
    return __generator(this, function (_a) {
        name = req.body.name;
        id = req.session.userId;
        playerStore_1.PlayerStore.changePlayerName(id, name);
        index_js_1.Logging.Player.info("player " + id + " changed name to " + name);
        res.send({ name: name });
        return [2 /*return*/];
    });
}); });
// Game Management
app.get('/game/resolve/wait', function (req, res) {
    if (helper_1.requireActiveGame(req, res))
        return;
    res.send('/api/v1/game/ws/wait?' + req.session.gameId);
});
app.get('/game/options/list', function (_req, res) {
    preGameMessages_js_1.PreGameMessages.optionsList(res);
});
app.post('/game/options', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, game;
    return __generator(this, function (_a) {
        if (helper_1.requireActiveGame(req, res))
            return [2 /*return*/];
        id = req.session.gameId;
        game = gameStore_1.GameStore.getGame(id);
        if (game) {
            game.resolveOptions(req.body);
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
app.get('/game/start', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, game;
    return __generator(this, function (_a) {
        if (helper_1.requireActiveGame(req, res))
            return [2 /*return*/];
        id = req.session.gameId;
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
app.get('/game/stop', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, game;
    return __generator(this, function (_a) {
        if (helper_1.requireActiveGame(req, res))
            return [2 /*return*/];
        id = req.session.gameId;
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
app.get('/game/stats', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, player, game, stats;
    return __generator(this, function (_a) {
        if (helper_1.requireLogin(req, res) || helper_1.requireActiveGame(req, res))
            return [2 /*return*/];
        id = req.session.gameId;
        player = req.session.userId;
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
app.get('/game/verify', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, player, game;
    return __generator(this, function (_a) {
        if (helper_1.requireLogin(req, res) || helper_1.requireActiveGame(req, res))
            return [2 /*return*/];
        id = req.session.gameId;
        player = req.session.userId;
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
