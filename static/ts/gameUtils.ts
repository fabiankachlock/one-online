import { Card, CARD_TYPE, getRandomCard } from "./card.js"
import { state, options } from "./game.js"

export type UIEvent = {
    event: string;
    playerId: string;
    eid: number;
    playload: {};
}

export type UIEventPayload = {}

export const drawCard = getRandomCard

export const canPlaceCard = card => {
    const isWild = card.type === CARD_TYPE.wild || card.type === CARD_TYPE.wildDraw2 || card.type === CARD_TYPE.wildDraw4
    const isDraw = card.type === CARD_TYPE.draw2 || card.type === CARD_TYPE.wildDraw2 || card.type === CARD_TYPE.wildDraw4
    const isCancel = card.type === CARD_TYPE.reverse && state.topCard.type === CARD_TYPE.draw2 || state.topCard.type === CARD_TYPE.wildDraw2 || state.topCard.type === CARD_TYPE.wildDraw4
    const fits = card.type === state.topCard.type || card.color === state.topCard.color

    if (!options.addUp) {
        return (fits || isWild) && !isDraw
    } else {
        return fits
            || (options.cancleWithReverse && isCancel)
            || (options.addUp && (fits || isWild))
    }
}

export const createPlaceCardMessage = (card: Card): UIEventPayload => ({
    card: {
        type: card.type,
        color: card.color
    },
    type: state.isCurrent ? 'normal' : 'throwSame'
})

export const createDrawMessage = (cards: Card[]): UIEventPayload => ({
    cards,
    type: state.drawAmount > 0 ? 'normal' : 'penalty'
})