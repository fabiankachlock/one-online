import { Card } from "../../cards/type.js"
import { GameEvent } from "../../interface.js"

export const emptyEvent = (): GameEvent => ({
    type: 'empty',
    players: [] as string[],
    payload: {},
    priority: -1
})

export const internalDrawEvent = (player: string, amount: number, priority: number): GameEvent => ({
    type: '[i]draw',
    payload: {
        amount,
    },
    players: [player],
    priority
})

export const drawEvent = (player: string, cards: Card[], priority: number): GameEvent => ({
    type: 'draw',
    payload: {
        cards,
    },
    players: [player],
    priority
})

export const placeCardEvent = (player: string, card: Card, cardId: string, allowed: boolean, priority: number): GameEvent => ({
    type: 'place-card',
    payload: {
        card: card,
        id: cardId,
        allowed: allowed
    },
    players: [player],
    priority
})