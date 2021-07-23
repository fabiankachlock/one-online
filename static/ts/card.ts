
export const CARD_COLOR = {
    green: 'cc/green',
    red: 'cc/red',
    blue: 'cc/blue',
    yellow: 'cc/yellow',
    none: 'none'
}

export const CARD_TYPE = {
    '1': 'ct/1',
    '2': 'ct/2',
    '3': 'ct/3',
    '4': 'ct/4',
    '5': 'ct/5',
    '6': 'ct/6',
    '7': 'ct/7',
    '8': 'ct/8',
    '9': 'ct/9',
    '0': 'ct/0',
    skip: 'ct/skip',
    draw2: 'ct/draw2',
    reverse: 'ct/reverse',
    wild: 'ct/wild',
    wildDraw4: 'ct/wildDraw4',
    wildDraw2: 'ct/wildDraw2',
    none: 'none'
}

export type Card = {
    color: string;
    type: string;
}

export const CARD_X_OFFSET = {
    [CARD_TYPE['0']]: 0,
    [CARD_TYPE['1']]: 1,
    [CARD_TYPE['2']]: 2,
    [CARD_TYPE['3']]: 3,
    [CARD_TYPE['4']]: 4,
    [CARD_TYPE['5']]: 5,
    [CARD_TYPE['6']]: 6,
    [CARD_TYPE['7']]: 7,
    [CARD_TYPE['8']]: 8,
    [CARD_TYPE['9']]: 9,
    [CARD_TYPE.skip]: 10,
    [CARD_TYPE.reverse]: 11,
    [CARD_TYPE.draw2]: 12,
    [CARD_TYPE.wild]: 13,
    [CARD_TYPE.wildDraw4]: 13,
    [CARD_TYPE.wildDraw2]: 13
}

export const CARD_Y_OFFSET = {
    [CARD_COLOR.red]: 0,
    [CARD_COLOR.yellow]: 1,
    [CARD_COLOR.green]: 2,
    [CARD_COLOR.blue]: 3,
    [CARD_TYPE.wild]: 0,
    [CARD_TYPE.wildDraw4]: 1,
    [CARD_TYPE.wildDraw2]: 2
}

export const isColorCard = (type: string) => /\/\d$|pause$|take2$|changeDirections$/.test(type)
export const isWildCard = (type: string) => /wild$|wildDraw2$|wildDraw4$/.test(type)

export const setBackgoundPosition = (elm: HTMLElement, x: number, y: number) => {
    elm.setAttribute('style', '--x: ' + x + '; --y: ' + y + ';')
}

export const displayCard = (elm: HTMLElement, card: Card) => {
    if (isColorCard(card.type)) {
        setBackgoundPosition(elm, CARD_X_OFFSET[card.type], CARD_Y_OFFSET[card.color])
    } else {
        setBackgoundPosition(elm, CARD_X_OFFSET[card.type], CARD_Y_OFFSET[card.type])
    }
}

// let i = 0;
// const e = document.getElementById('card')

// const nextCard = () => {
//     console.log(i)
//     displayCard(e, ALL_CARDS[i])
//     if (i < ALL_CARDS.length - 1) {
//         i += 1
//         setTimeout(nextCard, 1000)
//     } else {
//         i = 0
//         setTimeout(nextCard, 400)
//     }
// }

// nextCard()