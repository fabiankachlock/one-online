var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
import { CARD_COLOR, CARD_TYPE } from "./card.js";
import { displayPlayers, setTopCard, selectPlayer, onGameEvent, changePlayerCardAmount, setUnoCardVisibility, setDeckVisibility } from "./uiEvents.js";
export var gameId = window.location.href.split('#')[1];
export var playerId = localStorage.getItem('player-id');
export var playerName = localStorage.getItem('player-name');
export var state = {
    isCurrent: false,
    players: [],
    topCard: {
        color: CARD_COLOR.red,
        type: CARD_TYPE[1]
    }
};
export var verify = function () {
    if (gameId === localStorage.getItem('game-id')) {
        window.location.hash = '';
        localStorage.removeItem('game-id');
    }
    else {
        window.location.href = '../';
    }
    fetch('/game/verify/' + gameId + '/' + playerId).then(function (res) { return res.json(); }).then(function (res) {
        if (res.ok !== true) {
            alert(res.error);
            window.location.href = '../';
        }
    });
};
var initGame = function (data) {
    displayPlayers(data.players);
    var ownAmount = 0;
    state.players = data.players.map(function (p) {
        if (p.id === playerId) {
            ownAmount = p.cardAmount;
        }
        return {
            name: p.name,
            id: p.id,
            cardAmount: p.cardAmount
        };
    });
    setTopCard(data.topCard);
    state.topCard = data.topCard;
    selectPlayer(data.currentPlayer);
    state.isCurrent = data.currentPlayer === playerId;
    console.log('starting player', data.currentPlayer);
    setDeckVisibility(state.isCurrent);
    setUnoCardVisibility(ownAmount === 1);
};
var handleMessage = function (message) {
    var data = JSON.parse(message.data);
    console.log(data);
    if (data.event === 'init-game') {
        initGame(data);
    }
    else if (data.event === 'update') {
        handleGameUpdate(data);
    }
};
var handleGameUpdate = function (update) {
    var e_1, _a;
    state.topCard = update.topCard;
    setTopCard(state.topCard);
    state.isCurrent = update.currentPlayer === playerId;
    selectPlayer(update.currentPlayer);
    setDeckVisibility(state.isCurrent);
    for (var i = 0; i < state.players.length; i++) {
        changePlayerCardAmount(update.players[i].amount, update.players[i].id);
        state.players[i].cardAmount = update.players[i].amount;
        if (update.players[i].id) {
            setUnoCardVisibility(update.players[i].amount === 1);
        }
    }
    try {
        for (var _b = __values(update.events), _c = _b.next(); !_c.done; _c = _b.next()) {
            var evt = _c.value;
            handleGameEvent(evt);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
};
export var handleGameEvent = function (event) {
    console.log('event: ', event.type, event.players);
};
export var connect = function () {
    var uri = 'ws://' + window.location.host + '/game/ws/play?' + gameId;
    var websocket = new WebSocket(uri, 'ws');
    websocket.onerror = function (err) {
        window.location.href = '../';
        console.log(err);
        alert('Websocket Error' + err);
    };
    websocket.onmessage = handleMessage;
    onGameEvent(function (type, event) {
        console.log('received event', type, event);
        websocket.send(JSON.stringify({
            event: type,
            playerId: playerId,
            eid: Date.now(),
            payload: __assign({}, event)
        }));
    });
};
