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
    return fetch('/api/v1/game/options', {
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
    fetch('/api/v1/leave', {
        method: 'post',
        headers: {
            'Content-Type': ' application/json'
        }
    });
    window.location.href = '../';
};
var startGame = function () { return fetch('/api/v1/game/start'); };
var stopGame = function () { return fetch('/api/v1/game/stop'); };
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
    (document.querySelectorAll('#options input[type="checkbox"]')).forEach(function (elm) {
        elm.onchange = function () {
            var name = elm.getAttribute('id') || '';
            sendOption(name, elm.checked);
        };
    });
};
var verifyToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, fetch('/api/v1/access', {
                method: 'post',
                headers: {
                    'Content-Type': ' application/json'
                }
            })
                .then(function (res) { return res.json(); })
                .then(function (res) {
                if ('error' in res) {
                    alert(res.error);
                    window.location.href = '../';
                }
            })];
    });
}); };
var joinHost = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, fetch('/api/v1/access', {
                method: 'post',
                headers: {
                    'Content-Type': ' application/json'
                }
            })
                .then(function (res) { return res.json(); })
                .then(function (res) {
                if ('ok' in res) {
                    return;
                }
                else {
                    alert(res.error);
                    window.location.href = '../';
                }
            })];
    });
}); };
var loadOptions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var options, fields, template, options_1, options_1_1, option, newNode, wrapper, label, input, info;
    var e_2, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, fetch('/api/v1/game/options/list').then(function (res) { return res.json(); })];
            case 1:
                options = _b.sent();
                fields = document.getElementById('options');
                template = (document.getElementById('optionTemplate'));
                try {
                    for (options_1 = __values(options), options_1_1 = options_1.next(); !options_1_1.done; options_1_1 = options_1.next()) {
                        option = options_1_1.value;
                        if (option.name.length === 0)
                            continue;
                        newNode = template.content.cloneNode(true);
                        wrapper = newNode.querySelector('div');
                        label = newNode.querySelector('label');
                        input = newNode.querySelector('input');
                        info = newNode.querySelector('p');
                        label.innerText = option.name;
                        label.setAttribute('for', option.id);
                        input.setAttribute('name', option.id);
                        input.setAttribute('id', option.id);
                        input.checked = option.defaultOn;
                        info.innerText = option.description;
                        if (!option.implemented) {
                            wrapper.classList.add('not-implemented');
                        }
                        fields.appendChild(newNode);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (options_1_1 && !options_1_1.done && (_a = options_1.return)) _a.call(options_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                return [2];
        }
    });
}); };
var activeOptionsList = document.getElementById('options');
var activeOptionTemplate = (document.getElementById('optionTemplate'));
var displayOptions = function (options) {
    var e_3, _a;
    activeOptionsList.innerHTML = '';
    console.log(options);
    try {
        for (var options_2 = __values(options), options_2_1 = options_2.next(); !options_2_1.done; options_2_1 = options_2.next()) {
            var option = options_2_1.value;
            if (option.name.length === 0)
                continue;
            var newNode = (activeOptionTemplate.content.cloneNode(true));
            var name_1 = newNode.querySelector('.name');
            var info = newNode.querySelector('.info');
            name_1.innerText = option.name;
            info.innerText = option.description;
            activeOptionsList.appendChild(newNode);
        }
    }
    catch (e_3_1) { e_3 = { error: e_3_1 }; }
    finally {
        try {
            if (options_2_1 && !options_2_1.done && (_a = options_2.return)) _a.call(options_2);
        }
        finally { if (e_3) throw e_3.error; }
    }
    if (options.length === 0) {
        activeOptionsList.innerHTML = '<p class="name">only default ones</p>';
    }
};
var getName = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, fetch('/api/v1/game/name').then(function (res) { return res.text(); })];
    });
}); };
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, isHost, protocol, uri, _a, websocket, gameName;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                fileName = window.location.href;
                isHost = false;
                if (!/wait\.html/.test(fileName)) return [3, 2];
                return [4, verifyToken()];
            case 1:
                _b.sent();
                return [3, 5];
            case 2:
                isHost = true;
                return [4, joinHost()];
            case 3:
                _b.sent();
                return [4, loadOptions()];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                protocol = 'wss://';
                if (/localhost/.test(window.location.host)) {
                    protocol = 'ws://';
                }
                _a = protocol +
                    window.location.host;
                return [4, fetch('/api/v1/game/resolve/wait').then(function (res) { return res.text(); })];
            case 6:
                uri = _a +
                    (_b.sent());
                websocket = new WebSocket(uri, 'ws');
                websocket.onerror = function (err) {
                    window.location.href = '../';
                    console.log(err);
                    alert('Websocket Error');
                };
                websocket.onmessage = function (msg) {
                    var data = JSON.parse(msg.data);
                    if ('start' in data) {
                        websocket.close();
                        window.location.href = data.url;
                    }
                    else if ('players' in data) {
                        displayPlayerList(data.players);
                    }
                    else if ('options' in data && !isHost) {
                        displayOptions(data.options);
                    }
                    else if ('stop' in data) {
                        websocket.close();
                        window.location.href = '../';
                    }
                };
                initActions();
                initOptions();
                return [4, getName()];
            case 7:
                gameName = _b.sent();
                document.getElementById('name').innerText = gameName;
                return [2];
        }
    });
}); })();
export {};
