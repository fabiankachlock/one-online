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
var gameServer_1 = require("./gameServer");
var index_js_1 = require("./logging/index.js");
var memoryWatcher_js_1 = require("./memoryWatcher.js");
var gameStore_1 = require("./store/implementations/gameStore/");
var playerStore_1 = require("./store/implementations/playerStore/");
var waitingServer_1 = require("./waitingServer");
var api_1 = require("./server/api");
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
app.get('/games', function (_req, res) {
    res.json(gameStore_1.GameStore.getGames());
});
app.post('/create', api_1.MenuApiHandler.create);
app.post('/join', api_1.MenuApiHandler.join);
app.post('/leave', api_1.MenuApiHandler.leave);
app.post('/access', api_1.MenuApiHandler.access);
// Player Management
app.post('/player/register', api_1.PlayerApiHandler.register);
app.post('/player/changeName', api_1.PlayerApiHandler.changeName);
// Game Management
app.get('/game/resolve/wait', api_1.GameApiHandler.resolve.wait);
app.get('/game/resolve/play', api_1.GameApiHandler.resolve.play);
app.get('/game/options/list', api_1.GameApiHandler.options.list);
app.post('/game/options', api_1.GameApiHandler.options.change);
app.get('/game/name', api_1.GameApiHandler.name);
app.get('/game/start', api_1.GameApiHandler.start);
app.get('/game/stop', api_1.GameApiHandler.stop);
app.get('/game/stats', api_1.GameApiHandler.stats);
app.get('/game/verify', api_1.GameApiHandler.verify);
// Dev
if (process.env.NODE_ENV === 'development' || true) {
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
