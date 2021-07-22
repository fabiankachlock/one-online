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
import { displayCard, setBackgoundPosition } from "./card.js";
import { playerId, playerName } from "./game.js";
import { UIEventType } from "./gameUtils.js";
var deckElm = document.querySelector('#deck #content');
var cardAmount = 0;
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
    deckElm.appendChild(cardWrapper);
    displayCard(newCard, card);
    cardAmount += 1;
    changePlayerCardAmount(cardAmount, playerId);
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
    deckElm.setAttribute('style', '--overlap: -' + Math.round(overlap * 100) + 'vw; ' + cardSize);
};
var cardAmountElm;
var setupNameBadge = function () {
    document.querySelector('#name').classList.add('id-' + playerId);
    document.querySelector('#name .name').innerText = playerName;
    cardAmountElm = document.querySelector('#name .amount');
};
export var displayPlayers = function (players) {
    var e_1, _a;
    console.log('displayPlayers', players);
    var template = document.getElementById('badgeTemplate').content;
    var target = document.getElementById('opponents');
    target.innerHTML = '';
    try {
        for (var players_1 = __values(players), players_1_1 = players_1.next(); !players_1_1.done; players_1_1 = players_1.next()) {
            var player = players_1_1.value;
            if (player.id === playerId) {
                continue;
            }
            var node = template.cloneNode(true);
            var badge = node.querySelector('.badge');
            badge.querySelector('.name').innerText = player.name;
            badge.querySelector('.amount').innerText = player.cardAmount.toString();
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
export var changePlayerCardAmount = function (amount, id) {
    console.log('changePlayerCardAmount', id, amount);
    if (id === playerId) {
        cardAmount = amount;
        updateDeckLayout();
    }
    document.querySelector('.badge.id-' + id + ' .amount').innerText = amount.toString();
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
var cardElm = document.getElementById('card');
export var setTopCard = function (card) {
    displayCard(cardElm, card);
};
var setupPile = function () {
    var pile = document.getElementById('pile');
    setBackgoundPosition(pile, 13, 3);
    pile.onclick = function () {
        eventHandler(UIEventType.tryDraw, {});
    };
};
var eventHandler = function () { };
var playCard = function (card, id) {
    console.log('playing card', id, card);
    eventHandler(UIEventType.tryPlaceCard, { card: card, id: id });
};
export var setDeckVisibility = function (visible) {
    if (visible) {
        document.getElementById('content').classList.remove('disabled');
    }
    else {
        document.getElementById('content').classList.add('disabled');
    }
};
export var setUnoCardVisibility = function (visible) {
    if (visible) {
        document.getElementById('unoButton').classList.remove('disabled');
    }
    else {
        document.getElementById('unoButton').classList.add('disabled');
    }
};
export var onGameEvent = function (handler) {
    eventHandler = handler;
};
window.onresize = function () {
    updateDeckLayout();
};
export var prepareUi = function () {
    setupNameBadge();
    setupPile();
};
