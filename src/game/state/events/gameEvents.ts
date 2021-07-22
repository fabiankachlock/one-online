import { Card } from "../../cards/type.js"
import { GameEvent } from "../../interface.js"

export const emptyEvent = (): GameEvent => ({
    type: 'empty',
    players: [] as string[],
    payload: {}
})

export const drawEvent = (player: string, amount: number): GameEvent => ({
    type: 'draw',
    payload: {
        amount,
    },
    players: [player]
})

export const placeCardEvent = (player: string, card: Card, cardId: string, allowed: boolean): GameEvent => ({
    type: 'place-card',
    payload: {
        card: card,
        id: cardId,
        allowed: allowed
    },
    players: [player]
})