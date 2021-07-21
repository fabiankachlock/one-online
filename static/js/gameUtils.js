import { CARD_TYPE, getRandomCard } from "./card.js";
import { state, options } from "./game.js";
export var drawCard = getRandomCard;
export var canPlaceCard = function (card) {
    var isWild = card.type === CARD_TYPE.wild || card.type === CARD_TYPE.wildDraw2 || card.type === CARD_TYPE.wildDraw4;
    var isDraw = card.type === CARD_TYPE.draw2 || card.type === CARD_TYPE.wildDraw2 || card.type === CARD_TYPE.wildDraw4;
    var isCancel = card.type === CARD_TYPE.reverse && state.topCard.type === CARD_TYPE.draw2 || state.topCard.type === CARD_TYPE.wildDraw2 || state.topCard.type === CARD_TYPE.wildDraw4;
    var fits = card.type === state.topCard.type || card.color === state.topCard.color;
    if (!options.addUp) {
        return (fits || isWild) && !isDraw;
    }
    else {
        return fits
            || (options.cancleWithReverse && isCancel)
            || (options.addUp && (fits || isWild));
    }
};
export var createPlaceCardMessage = function (card) { return ({
    card: {
        type: card.type,
        color: card.color
    },
    type: state.isCurrent ? 'normal' : 'throwSame'
}); };
export var createDrawMessage = function (cards) { return ({
    cards: cards,
    type: state.drawAmount > 0 ? 'normal' : 'penalty'
}); };
