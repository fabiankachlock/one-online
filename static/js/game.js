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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
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
import { CARD_COLOR, CARD_TYPE } from './card.js';
import { displayPlayers, setTopCard, selectPlayer, pushCardToDeck, onGameEvent, changePlayerCardAmount, setUnoCardVisibility, setDeckVisibility, placeCard, shakeCard, setStateDirection, hideUnoCard } from './uiEvents.js';
var playerId = '';
export var GameEventTypes;
(function (GameEventTypes) {
    GameEventTypes["draw"] = "draw";
    GameEventTypes["card"] = "place-card";
})(GameEventTypes || (GameEventTypes = {}));
export var state = {
    isCurrent: false,
    players: [],
    topCard: {
        color: CARD_COLOR.red,
        type: CARD_TYPE[1]
    }
};
export var verify = function () { return __awaiter(void 0, void 0, void 0, function () {
    var response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, fetch('/api/v1/game/verify').then(function (res) { return res.json(); })];
            case 1:
                response = _a.sent();
                if (response.ok !== true) {
                    alert(response.error);
                    window.location.href = '../';
                }
                playerId = response.playerId;
                return [2, playerId];
        }
    });
}); };
export var connect = function () { return __awaiter(void 0, void 0, void 0, function () {
    var protocol, uri, _a, websocket;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                protocol = 'wss://';
                if (/localhost/.test(window.location.host)) {
                    protocol = 'ws://';
                }
                _a = protocol +
                    window.location.host;
                return [4, fetch('/api/v1/game/resolve/play').then(function (res) { return res.text(); })];
            case 1:
                uri = _a +
                    (_b.sent());
                websocket = new WebSocket(uri, 'ws');
                websocket.onerror = function (err) {
                    window.location.href = '../';
                    console.log(err);
                    alert('Websocket Error' + err);
                };
                websocket.onmessage = handleMessage;
                onGameEvent(function (type, event) {
                    console.log('forward event', type, event);
                    websocket.send(JSON.stringify({
                        event: type,
                        playerId: playerId,
                        eid: Date.now(),
                        payload: __assign({}, event)
                    }));
                });
                return [2];
        }
    });
}); };
var handleMessage = function (message) {
    var data = JSON.parse(message.data);
    console.log(data);
    if (data.event === 'init-game') {
        initGame(data);
    }
    else if (data.event === 'update') {
        handleGameUpdate(data);
    }
    else if (data.event === 'finished') {
        window.location.href = data.url;
    }
};
var initGame = function (data) {
    var orderedPlayers = reorderPlayers(playerId, __spreadArray([], __read(data.players)));
    displayPlayers(playerId, orderedPlayers);
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
    var _loop_1 = function (i) {
        setTimeout(function () {
            pushCardToDeck(data.deck[i]);
        }, i * 300);
    };
    for (var i = 0; i < data.deck.length; i++) {
        _loop_1(i);
    }
    if (!data.uiOptions.showOneButton) {
        hideUnoCard();
    }
    setDeckVisibility(state.isCurrent);
    setUnoCardVisibility(ownAmount === 1);
    changePlayerCardAmount(playerId, data.deck.length, playerId);
};
var reorderPlayers = function (id, players) {
    var sortedPlayers = players.sort(function (a, b) { return a.order - b.order; });
    var ownIndex = sortedPlayers.findIndex(function (p) { return p.id === id; });
    var firstHalf = __spreadArray([], __read(sortedPlayers)).splice(0, ownIndex);
    var secondHalf = __spreadArray([], __read(sortedPlayers)).splice(ownIndex + 1, sortedPlayers.length - firstHalf.length - 1);
    return __spreadArray(__spreadArray([], __read(firstHalf.reverse())), __read(secondHalf.reverse()));
};
var handleGameUpdate = function (update) {
    var e_1, _a;
    state.topCard = update.topCard;
    setTopCard(state.topCard);
    state.isCurrent = update.currentPlayer === playerId;
    selectPlayer(update.currentPlayer);
    setDeckVisibility(state.isCurrent);
    setStateDirection(update.direction);
    for (var i = 0; i < update.players.length; i++) {
        console.log('update for player: ', update.players[i].id);
        changePlayerCardAmount(playerId, update.players[i].amount, update.players[i].id);
        state.players[i].cardAmount = update.players[i].amount;
        if (update.players[i].id === playerId) {
            console.log('is own player');
            console.log('show uno:', update.players[i].amount === 1);
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
var handleGameEvent = function (event) {
    console.log('received event:', event.type, event.payload);
    if (event.type === GameEventTypes.card) {
        handlePlaceCardEvent(event.payload);
    }
    else if (event.type === GameEventTypes.draw) {
        handleDrawCardEvent(event.payload);
    }
};
var handlePlaceCardEvent = function (payload) {
    if (payload.allowed === true) {
        console.log('all fine!, placing: ', payload.card);
        placeCard(payload.card, payload.id);
    }
    else {
        console.log('not allowed: ', payload.card);
        shakeCard(payload.card, payload.id);
    }
};
var handleDrawCardEvent = function (payload) {
    console.log('drawing cards: ', payload.cards);
    var _loop_2 = function (i) {
        setTimeout(function () {
            pushCardToDeck(payload.cards[i]);
        }, i * 300);
    };
    for (var i = 0; i < payload.cards.length; i++) {
        _loop_2(i);
    }
};
