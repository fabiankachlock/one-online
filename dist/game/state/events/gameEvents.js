"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeCardEvent = exports.drawEvent = exports.emptyEvent = void 0;
var emptyEvent = function () { return ({
    type: 'empty',
    players: [],
    payload: {}
}); };
exports.emptyEvent = emptyEvent;
var drawEvent = function (player, cards) { return ({
    type: 'draw',
    payload: {
        cards: cards
    },
    players: [player]
}); };
exports.drawEvent = drawEvent;
var placeCardEvent = function (player, card, cardId, allowed) { return ({
    type: 'place-card',
    payload: {
        card: card,
        id: cardId,
        allowed: allowed
    },
    players: [player]
}); };
exports.placeCardEvent = placeCardEvent;
