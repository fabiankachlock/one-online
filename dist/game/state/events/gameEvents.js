"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeCardEvent = exports.drawEvent = exports.internalDrawEvent = exports.emptyEvent = void 0;
var emptyEvent = function () { return ({
    type: 'empty',
    players: [],
    payload: {},
    priority: -1
}); };
exports.emptyEvent = emptyEvent;
var internalDrawEvent = function (player, amount, priority) { return ({
    type: '[i]draw',
    payload: {
        amount: amount,
    },
    players: [player],
    priority: priority
}); };
exports.internalDrawEvent = internalDrawEvent;
var drawEvent = function (player, cards, priority) { return ({
    type: 'draw',
    payload: {
        cards: cards,
    },
    players: [player],
    priority: priority
}); };
exports.drawEvent = drawEvent;
var placeCardEvent = function (player, card, cardId, allowed, priority) { return ({
    type: 'place-card',
    payload: {
        card: card,
        id: cardId,
        allowed: allowed
    },
    players: [player],
    priority: priority
}); };
exports.placeCardEvent = placeCardEvent;
