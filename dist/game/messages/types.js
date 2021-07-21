"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGameMessage = exports.stopMessage = exports.startMessage = void 0;
var startMessage = function (game) { return JSON.stringify({
    start: true,
    url: '/play/#' + game.hash
}); };
exports.startMessage = startMessage;
var stopMessage = function () { return JSON.stringify({
    stop: true,
}); };
exports.stopMessage = stopMessage;
var initGameMessage = function (players, amountOfCards, currentPlayer, card) { return JSON.stringify({
    event: 'init-game',
    players: players,
    amountOfCards: amountOfCards,
    currentPlayer: currentPlayer,
    topCard: card
}); };
exports.initGameMessage = initGameMessage;