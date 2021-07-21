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
import { options, playerId, playerName, state } from "./game.js";
import { canPlaceCard, createDrawMessage, createPlaceCardMessage, drawCard } from "./gameUtils.js";
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
        if (!state.isCurrent && !options.throwSame)
            return;
        if (!canPlaceCard(card))
            return;
        playCard(card, id);
    };
    cardWrapper.appendChild(newCard);
    deckElm.appendChild(cardWrapper);
    displayCard(newCard, card);
    cardAmount += 1;
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
    changePlayerCardAmount(cardAmount, playerId);
    deckElm.setAttribute('style', '--overlap: -' + Math.round(overlap * 100) + 'vw; ' + cardSize);
};
var cardAmountElm;
var setupNameBadge = function () {
    document.querySelector('#name').classList.add('id-' + playerId);
    document.querySelector('#name .name').innerText = playerName;
    cardAmountElm = document.querySelector('#name .amount');
};
export var displayPlayers = function (players, amount) {
    var e_1, _a;
    console.log('displayPlayers', players, amount);
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
            console.log(node);
            node.querySelector('.name').innerText = player.name;
            node.querySelector('.amount').innerText = amount;
            node.className = 'badge id-' + player.id;
            target.appendChild(node);
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
    document.querySelector('.badge.id-' + id + ' .amount').innerText = cardAmount.toString();
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
        if (!state.isCurrent)
            return;
        var isFinished = false;
        var cards = [];
        while (!isFinished) {
            var drawnCard = drawCard();
            pushCardToDeck(drawnCard);
            cards.push(drawnCard);
            isFinished = !options.takeUntilFit || canPlaceCard(drawnCard);
        }
        eventHandler('draw', createDrawMessage(cards));
    };
};
var eventHandler = function () { };
var playCard = function (card, id) {
    console.log('playing card', id, card);
    eventHandler('card', createPlaceCardMessage(card));
    var playedCard = deckElm.querySelector('.id-' + id);
    if (playedCard) {
        playedCard.remove();
        cardAmount -= 1;
        updateDeckLayout();
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
