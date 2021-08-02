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
var nameKey = 'player-name';
var idKey = 'player-id';
var tokenKey = 'game-token';
var gameIdKey = 'game-id';
var resetGameData = function () {
    localStorage.setItem(gameIdKey, '');
    localStorage.setItem(tokenKey, '');
};
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
            publicMode: isPublic,
            host: localStorage.getItem(idKey)
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
            localStorage.setItem(gameIdKey, res.id);
            window.location.href = res.url;
        }
    });
};
var setupCreate = function () {
    resetGameData();
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
            password: password,
            playerId: localStorage.getItem(idKey),
            playerName: localStorage.getItem(nameKey)
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
            localStorage.setItem(tokenKey, res.token);
            window.location.href = res.url;
        }
    });
};
var setupJoin = function () {
    resetGameData();
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
                node.onclick = function () { return (window.location.href = '/verify.html#' + game); };
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
var checkUserName = function () {
    var name = localStorage.getItem(nameKey);
    var id = localStorage.getItem(idKey);
    if (!id || id.length === 0) {
        id = (function () {
            var id = '';
            for (var i = 0; i < 4; i++) {
                id += Math.random().toString(16).toLowerCase().substring(2, 8);
                id += '-';
            }
            return id.substring(0, id.length - 2);
        })();
        localStorage.setItem(idKey, id !== null && id !== void 0 ? id : '');
    }
    if (!name) {
        var num = Math.random().toString();
        name = 'user' + num.substr(3, 9);
        localStorage.setItem(nameKey, name);
    }
    fetch('/api/v1/player/register', {
        method: 'post',
        body: JSON.stringify({
            name: name,
            id: id
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
        else if (!res.ok) {
            alert('Something went wrong...');
        }
    });
};
var setupIndex = function () {
    resetGameData();
    var input = document.getElementById('nameInput');
    var name = localStorage.getItem(nameKey) || '';
    input.value = name;
    input.onchange = function () {
        name = input.value;
        localStorage.setItem(nameKey, name);
        fetch('/api/v1/player/changeName', {
            method: 'post',
            body: JSON.stringify({
                id: localStorage.getItem(idKey),
                name: name
            }),
            headers: {
                'Content-Type': ' application/json'
            }
        });
    };
};
(function () {
    var _a;
    checkUserName();
    var fileName = window.location.href;
    if (!fileName)
        return;
    else if (((_a = fileName.split('/').pop()) !== null && _a !== void 0 ? _a : '').length === 0 ||
        /index.html/.test(fileName))
        setupIndex();
    else if (/create.html/.test(fileName))
        setupCreate();
    else if (/join.html/.test(fileName))
        setupJoin();
    else if (/verify.html/.test(fileName))
        setupVerify();
    var backButton = document.getElementById('back');
    if (backButton)
        backButton.onclick = function () { return (window.location.href = '../'); };
})();
export {};
