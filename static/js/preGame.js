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
var gameIdKey = 'game-id';
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
(function () {
    var uri = 'ws://' + window.location.host + '/game/ws/wait?' + localStorage.getItem(gameIdKey);
    var websocket = new WebSocket(uri, 'ws');
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
})();
