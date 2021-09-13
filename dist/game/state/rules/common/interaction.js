"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInteraction = void 0;
var logging_1 = require("../../../../logging");
var card_1 = require("./card");
exports.GameInteraction = {
    hasCard: function (playerId, card, state) {
        return (state.decks[playerId] &&
            state.decks[playerId].find(function (c) {
                if (card_1.CardType.isWild(c.type))
                    return c.type === card.type; // wild cards get the color chosen assigned as their color
                return c.type === card.type && c.color === card.color;
            }) !== undefined);
    },
    canThrowCard: function (playerId, card, state) {
        var top = state.topCard;
        var activatedTop = state.stack[state.stack.length - 1].activatedEvent;
        var fits = card.type === top.type || card.color === top.color; // uno rule: same kind or color
        // can't throw, if the card isn't in the players deck
        if (!exports.GameInteraction.hasCard(playerId, card, state)) {
            logging_1.Logging.Game.warn(playerId + " tried to throw card that isn't the the deck");
            return false;
        }
        // can't throw (by default) if top card is draw (and not already drawn)
        if (card_1.CardType.isDraw(top.type) && !activatedTop) {
            return false;
        }
        // card can be throw, if it fits oder is a wild card
        return fits || card_1.CardType.isWild(card.type);
    },
    placeCard: function (card, playerId, state) {
        // update state
        state.stack.push({
            card: card,
            activatedEvent: false
        });
        state.topCard = card;
        // remove card from players deck
        var cardIndex = state.decks[playerId].findIndex(function (c) {
            if (card_1.CardType.isWild(card.type))
                return c.type === card.type; // wild cards get the color chosen assigned as their color
            return c.type === card.type && c.color === card.color;
        });
        state.decks[playerId].splice(cardIndex, 1);
    }
};