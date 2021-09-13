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
import { CLIENT_VERSION } from './version.js';
var nameKey = 'player-name';
var createGame = function (name, password, isPublic) {
    if (name.length < 3 || (password.length < 3 && !isPublic)) {
        alert('Name and Password have to be at least 3 characters long');
        return;
    }
    fetch('/api/v1/create', {
        method: 'post',
        body: JSON.stringify({
            name: name,
            password: isPublic ? 'open' : password,
            publicMode: isPublic
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    })
        .then(function (res) {
        return res.json();
    })
        .then(function (res) {
        if ('error' in res) {
            alert(res.error);
        }
        else if (res.success) {
            window.location.href = res.url;
        }
    });
};
var setupCreate = function () {
    var nameInput = document.getElementById('nameInput');
    var passwordInput = document.getElementById('passInput');
    var publicInput = document.getElementById('publicInput');
    var passwordDiv = document.getElementById('passBox');
    publicInput.onchange = function () {
        if (publicInput.checked) {
            passwordDiv.classList.add('hidden');
        }
        else {
            passwordDiv.classList.remove('hidden');
        }
    };
    document.getElementById('create').onclick = function () {
        return createGame(nameInput.value, passwordInput.value, publicInput.checked);
    };
};
var joinGame = function (gameId, password) {
    fetch('/api/v1/join', {
        method: 'post',
        body: JSON.stringify({
            gameId: gameId,
            password: password
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    })
        .then(function (res) { return res.json(); })
        .then(function (res) {
        if ('error' in res) {
            alert(res.error);
        }
        else if (res.success) {
            window.location.href = res.url;
        }
    });
};
var setupJoin = function () {
    var container = document.getElementById('games');
    fetch('/api/v1/games')
        .then(function (res) { return res.json(); })
        .then(function (res) {
        var e_1, _a;
        container.innerHTML = '';
        var _loop_1 = function (game) {
            var node = document.createElement('p');
            node.innerText = game.name + ' (' + game.player + ' player)';
            if (game.public === true) {
                node.innerText += ' (public)';
                node.onclick = function () { return joinGame(game.id, ''); };
            }
            else {
                node.onclick = function () {
                    return (window.location.href = '/verify.html#' + game.id);
                };
            }
            container.appendChild(node);
        };
        try {
            for (var res_1 = __values(res), res_1_1 = res_1.next(); !res_1_1.done; res_1_1 = res_1.next()) {
                var game = res_1_1.value;
                _loop_1(game);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (res_1_1 && !res_1_1.done && (_a = res_1.return)) _a.call(res_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
};
var setupVerify = function () {
    var input = document.getElementById('passInput');
    document.getElementById('gameName').innerText =
        'Enter Password for "' + window.location.hash.substr(1) + '":';
    document.getElementById('join').onclick = function () {
        joinGame(window.location.hash.substr(1), input.value);
    };
};
var checkUserName = function () { return __awaiter(void 0, void 0, void 0, function () {
    var name, statusResponse, registrationName, registrationResponse;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                name = localStorage.getItem(nameKey);
                return [4, fetch('/api/v1/player/register', {
                        method: 'post',
                        body: '',
                        headers: {
                            'Content-Type': ' application/json'
                        }
                    }).then(function (res) { return res.json(); })];
            case 1:
                statusResponse = (_a.sent());
                if (!('error' in statusResponse)) return [3, 3];
                registrationName = '';
                if (name && name.length > 0) {
                    registrationName = name;
                }
                else {
                    registrationName = 'user' + Math.random().toString().substr(3, 9);
                }
                return [4, fetch('/api/v1/player/register', {
                        method: 'post',
                        body: JSON.stringify({
                            name: registrationName
                        }),
                        headers: {
                            'Content-Type': ' application/json'
                        }
                    }).then(function (res) { return res.json(); })];
            case 2:
                registrationResponse = (_a.sent());
                if ('name' in registrationResponse) {
                    localStorage.setItem(nameKey, registrationResponse.name);
                }
                else {
                    alert(registrationResponse.error);
                }
                return [3, 4];
            case 3:
                if ('name' in statusResponse) {
                    localStorage.setItem(nameKey, statusResponse.name);
                }
                _a.label = 4;
            case 4: return [2];
        }
    });
}); };
var setupIndex = function () {
    var input = document.getElementById('nameInput');
    var name = localStorage.getItem(nameKey) || '';
    input.value = name;
    input.onchange = function () {
        name = input.value;
        localStorage.setItem(nameKey, name);
        fetch('/api/v1/player/changeName', {
            method: 'post',
            body: JSON.stringify({
                name: name
            }),
            headers: {
                'Content-Type': ' application/json'
            }
        });
    };
};
var showVersion = function () {
    var div = document.createElement('div');
    div.className = '__version';
    div.innerHTML = 'v' + CLIENT_VERSION;
    document.body.appendChild(div);
};
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var fileName, backButton;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                showVersion();
                return [4, checkUserName()];
            case 1:
                _b.sent();
                fileName = window.location.href;
                if (!fileName)
                    return [2];
                else if (((_a = fileName.split('/').pop()) !== null && _a !== void 0 ? _a : '').length === 0 ||
                    /index.html/.test(fileName))
                    setupIndex();
                else if (/create.html/.test(fileName))
                    setupCreate();
                else if (/join.html/.test(fileName))
                    setupJoin();
                else if (/verify.html/.test(fileName))
                    setupVerify();
                backButton = document.getElementById('back');
                if (backButton)
                    backButton.onclick = function () { return (window.location.href = '../'); };
                return [2];
        }
    });
}); })();
