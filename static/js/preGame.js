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
var _this = this;
var nameKey = 'player-name';
var idKey = 'player-id';
var gameIdKey = 'game-id';
var tokenKey = 'game-token';
var playerContainer = document.getElementById('players');
var displayPlayerList = function (players) {
    var e_1, _a;
    playerContainer.innerHTML = '';
    console.log(players);
    try {
        for (var players_1 = __values(players), players_1_1 = players_1.next(); !players_1_1.done; players_1_1 = players_1.next()) {
            var player = players_1_1.value;
            var node = document.createElement('p');
            node.innerText = player.name;
            playerContainer.appendChild(node);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (players_1_1 && !players_1_1.done && (_a = players_1.return)) _a.call(players_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
var sendOption = function (option, enabled) {
    var _a;
    return fetch('/game/options/' + localStorage.getItem(gameIdKey), {
        method: 'post',
        body: JSON.stringify((_a = {},
            _a[option] = enabled,
            _a)),
        headers: {
            'Content-Type': ' application/json'
        }
    });
};
var leave = function () {
    fetch('/leave', {
        method: 'post',
        body: JSON.stringify({
            gameId: localStorage.getItem(gameIdKey),
            playerId: localStorage.getItem(idKey),
            playerName: localStorage.getItem(nameKey)
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    });
    delete localStorage[gameIdKey];
    window.location.href = '../';
};
var startGame = function () { return fetch('/game/start/' + localStorage.getItem(gameIdKey)); };
var stopGame = function () { return fetch('/game/stop/' + localStorage.getItem(gameIdKey)); };
var initActions = function () {
    var leaveBtn = document.getElementById('leave');
    if (leaveBtn)
        leaveBtn.onclick = leave;
    var startBtn = document.getElementById('start');
    if (startBtn)
        startBtn.onclick = startGame;
    var stopBtn = document.getElementById('stop');
    if (stopBtn)
        stopBtn.onclick = stopGame;
};
var initOptions = function () {
    document.querySelectorAll('#options input[type="checkbox"]').forEach(function (elm) {
        elm.onchange = function () {
            var name = elm.getAttribute('id');
            sendOption(name.substring(0, name.length - 5), elm.checked);
        };
    });
};
var verifyToken = function () { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, fetch('/access', {
                method: 'post',
                body: JSON.stringify({
                    token: localStorage.getItem(tokenKey)
                }),
                headers: {
                    'Content-Type': ' application/json'
                }
            }).then(function (res) { return res.json(); }).then(function (res) {
                if (res.gameId) {
                    localStorage.setItem(gameIdKey, res.gameId);
                }
                else {
                    alert(res.error);
                    window.location.href = '../';
                }
            })];
    });
}); };
(function () { return __awaiter(_this, void 0, void 0, function () {
    var fileName, uri, websocket;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                fileName = window.location.href;
                if (!/wait.html/.test(fileName)) return [3, 2];
                return [4, verifyToken()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                uri = 'ws://' + window.location.host + '/game/ws/wait?' + localStorage.getItem(gameIdKey);
                websocket = new WebSocket(uri, 'ws');
                websocket.onerror = function (err) {
                    window.location.href = '../';
                    console.log(err);
                    alert('Websocket Error');
                };
                websocket.onmessage = function (msg) {
                    var data = JSON.parse(msg.data);
                    if (data.start) {
                        websocket.close();
                        window.location.href = data.url;
                    }
                    else if (data.players) {
                        displayPlayerList(data.players);
                    }
                    else if (data.stop) {
                        websocket.close();
                        window.location.href = '../';
                    }
                };
                initActions();
                initOptions();
                return [2];
        }
    });
}); })();
