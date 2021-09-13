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
import { CARD_COLOR, displayCard, isWildCard, setBackgroundPosition } from './card.js';
var UIEventTypes;
(function (UIEventTypes) {
    UIEventTypes["tryPlaceCard"] = "card";
    UIEventTypes["tryDraw"] = "draw";
    UIEventTypes["uno"] = "uno";
})(UIEventTypes || (UIEventTypes = {}));
var playerName = localStorage.getItem('player-name') || 'no-name';
var cardsPile = document.getElementById('pile');
var unoButton = document.getElementById('unoButton');
var playerDeck = document.getElementById('content');
var topCard = document.getElementById('card');
var gameStateIndicator = (document.getElementById('directionState'));
var cardAmount = 0;
var eventHandler = function () { };
export var pushCardToDeck = function (card) {
    console.log('pushing card', card);
    var id = Math.random().toString().substring(2);
    var cardWrapper = document.createElement('div');
    cardWrapper.classList.add('card-wrapper');
    cardWrapper.classList.add('id-' + id);
    var newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.onclick = function () {
        playCard(card, id);
    };
    cardWrapper.appendChild(newCard);
    playerDeck.appendChild(cardWrapper);
    displayCard(newCard, card);
    updateDeckLayout();
};
var updateDeckLayout = function () {
    var cardSize = '';
    var CARD_WIDTH = 0.24;
    if (cardAmount > 20) {
        cardSize = '--deck-card-h: 24vh; --deck-card-w: 16vh;';
        CARD_WIDTH = 0.16;
    }
    var overallWidth = window.innerHeight * CARD_WIDTH * cardAmount;
    var percentageOfScreen = overallWidth / window.innerWidth;
    var overlap = 0;
    if (percentageOfScreen > 0.9) {
        overlap = (percentageOfScreen - 1) / cardAmount;
    }
    playerDeck.setAttribute('style', '--overlap: -' + Math.round(overlap * 100) + 'vw; ' + cardSize);
};
var setupNameBadge = function (id) {
    document.querySelector('#name').classList.add('id-' + id);
    document.querySelector('#name .name').innerText =
        playerName;
};
export var displayPlayers = function (id, players) {
    var e_1, _a;
    console.log('displayPlayers', players);
    var template = (document.getElementById('badgeTemplate')).content;
    var target = document.getElementById('opponents');
    target.innerHTML = '';
    try {
        for (var players_1 = __values(players), players_1_1 = players_1.next(); !players_1_1.done; players_1_1 = players_1.next()) {
            var player = players_1_1.value;
            if (player.id === id) {
                continue;
            }
            var node = template.cloneNode(true);
            var badge = node.querySelector('.badge');
            badge.querySelector('.name').innerText = player.name;
            badge.querySelector('.amount').innerText =
                player.cardAmount.toString();
            badge.classList.add('id-' + player.id);
            console.log('init opponent', player.id);
            target.appendChild(badge);
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
export var changePlayerCardAmount = function (ownId, amount, id) {
    if (id === ownId) {
        cardAmount = amount;
        updateDeckLayout();
    }
    (document.querySelector('.badge.id-' + id + ' .amount')).innerText = amount.toString();
};
export var removePlayer = function (id) {
    var el = document.querySelector('.badge.id-' + id);
    if (el) {
        el.remove();
    }
};
export var selectPlayer = function (id) {
    document.querySelectorAll('.badge').forEach(function (elm) {
        if (elm.classList.contains('id-' + id)) {
            elm.classList.add('active');
        }
        else if (elm.classList.contains('active')) {
            elm.classList.remove('active');
        }
    });
};
export var setTopCard = function (card) {
    displayCard(topCard, card);
    gameStateIndicator.classList.remove('red');
    gameStateIndicator.classList.remove('blue');
    gameStateIndicator.classList.remove('green');
    gameStateIndicator.classList.remove('yellow');
    switch (card.color) {
        case CARD_COLOR.red:
            gameStateIndicator.classList.add('red');
            break;
        case CARD_COLOR.blue:
            gameStateIndicator.classList.add('blue');
            break;
        case CARD_COLOR.green:
            gameStateIndicator.classList.add('green');
            break;
        case CARD_COLOR.yellow:
            gameStateIndicator.classList.add('yellow');
            break;
    }
};
var setupPile = function () {
    setBackgroundPosition(cardsPile, 13, 3);
    cardsPile.onclick = function () {
        eventHandler(UIEventTypes.tryDraw, {});
    };
};
var setupUnoButton = function () {
    unoButton.onclick = function () {
        eventHandler(UIEventTypes.uno, {});
        setTimeout(function () {
            setUnoCardVisibility(false);
        }, 300);
    };
};
var playCard = function (card, id) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('playing card', id, card);
                if (!isWildCard(card.type)) return [3, 2];
                return [4, selectColor(card)];
            case 1:
                card = _a.sent();
                _a.label = 2;
            case 2:
                eventHandler(UIEventTypes.tryPlaceCard, { card: card, id: id });
                return [2];
        }
    });
}); };
export var setDeckVisibility = function (visible) {
    if (visible) {
        playerDeck.classList.remove('disabled');
        cardsPile.classList.remove('disabled');
    }
    else {
        playerDeck.classList.add('disabled');
        cardsPile.classList.add('disabled');
    }
};
export var setUnoCardVisibility = function (visible) {
    if (visible) {
        unoButton.classList.remove('disabled');
    }
    else {
        unoButton.classList.add('disabled');
    }
};
export var hideUnoCard = function () {
    unoButton.classList.add('hidden');
};
export var setStateDirection = function (direction) {
    if (direction === 'left') {
        gameStateIndicator.classList.add('left');
    }
    else {
        gameStateIndicator.classList.remove('left');
    }
};
export var placeCard = function (_card, id) {
    var playedCard = playerDeck.querySelector('.id-' + id);
    if (playedCard) {
        playedCard.remove();
        updateDeckLayout();
    }
};
export var shakeCard = function (_card, id) {
    var card = playerDeck.querySelector('.id-' + id);
    if (card) {
        card.classList.add('shake');
        setTimeout(function () {
            card.classList.remove('shake');
        }, 1000);
    }
};
var setupLeaveButton = function () {
    var button = document.querySelector('#leaveButton button');
    button.onclick = function () {
        window.onbeforeunload = function () {
            return true;
        };
        window.location.href += 'leave.html';
    };
};
var selectColor = function (card) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2, new Promise(function (resolve, _reject) {
                var overlay = (document.querySelector('#overlays #selectColor'));
                overlay.classList.add('active');
                document.querySelectorAll('#selectColor .wrapper div').forEach(function (elm) {
                    elm.onclick = function () {
                        overlay.classList.remove('active');
                        card.color = CARD_COLOR[elm.getAttribute('id') || 'none'];
                        resolve(card);
                    };
                });
            })];
    });
}); };
export var onGameEvent = function (handler) {
    eventHandler = handler;
};
window.onresize = function () {
    updateDeckLayout();
};
export var prepareUi = function (id) {
    setupLeaveButton();
    setupNameBadge(id);
    setupPile();
    setupUnoButton();
};
