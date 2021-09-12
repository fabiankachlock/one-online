"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDrawInteraction = void 0;
var gameEvents_1 = require("../../events/gameEvents");
var card_1 = require("./card");
exports.GameDrawInteraction = {
    getDrawAmount: function (cardType) { return parseInt(cardType.slice(-1)); },
    getRecursiveDrawAmount: function (stack) {
        stack = __spreadArray([], __read(stack)); // copy stack to be save
        var amount = 0;
        var top = stack.pop();
        while (top && card_1.CardType.isDraw(top.card.type) && !top.activatedEvent) {
            amount += parseInt(top.card.type.slice(-1));
            top = stack.pop();
        }
        return amount;
    },
    performDraw: function (state, event, pile, amount) {
        var _a;
        var alreadyActivated = state.stack[state.stack.length - 1].activatedEvent;
        // only draw, if the top card is draw card and not already drawn
        if (card_1.CardType.isDraw(state.topCard.type) && !alreadyActivated) {
            // mark card as activated
            state.stack[state.stack.length - 1].activatedEvent = true;
        }
        // draw only one card, if it isn't enforced by a card
        var drawAmount = 1;
        if (card_1.CardType.isDraw(state.topCard.type)) {
            drawAmount = amount;
        }
        // draw cards
        var cards = [];
        for (var i = 0; i < drawAmount; i++) {
            cards.push(pile.draw());
        }
        // give cards to player
        if (event.playerId in state.decks) {
            (_a = state.decks[event.playerId]).push.apply(_a, __spreadArray([], __read(cards)));
        }
        // store event
        return gameEvents_1.drawEvent(event.playerId, cards);
    }
};
