import { Card, CARD_COLOR, CARD_TYPE } from "./type.js"

export const isColorCard = (type: CARD_TYPE) => /\/\d$|pause$|take2$|changeDirections$/.test(type)

export const ALL_CARDS: Card[] = [
    ...Object.entries(CARD_TYPE).map(([, t]) => {

        if (isColorCard(t)) {
            return Object.entries(CARD_COLOR).map(([, c]) => ({
                color: c,
                type: t
            }))
        } else {
            return {
                color: CARD_COLOR.none,
                type: t
            }
        }

    }).flat()
]

export const CARD_DECK: Card[] = [
    ...ALL_CARDS,
    ...ALL_CARDS.filter(c => c.type !== CARD_TYPE.n0),

    ...[CARD_TYPE.wild, CARD_TYPE.wildDraw2, CARD_TYPE.wildDraw4].map(t => ([
        {
            color: CARD_COLOR.none,
            type: t
        },
        {
            color: CARD_COLOR.none,
            type: t
        }
    ])).flat()
]

export const shuffle = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}