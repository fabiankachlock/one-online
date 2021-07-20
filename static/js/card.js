
const CARD_COLOR = {
    green: 'cc/green',
    red: 'cc/red',
    blue: 'cc/blue',
    yellow: 'cc/yellow',
}

const CARD_TYPE = {
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
    wildDraw2: 'ct/wildDraw2'
}

const isColorCard = type => /\/\d$|pause$|take2$|changeDirections$/.test(type)

/*
Type CARD: {
    color: CARD_COLOR;
    type: CARD_TYPE;
}
*/

/*
1 Deck:
2x 1-9 take4 pause changeDirections in all colors
1x 0 in all colors
4x selectColor selectColorTake4 
*/

const ALL_CARDS = [
    ...Object.entries(CARD_TYPE).map(([, t]) => {
        if (isColorCard(t)) {
            return Object.entries(CARD_COLOR).map(([, c]) => ({
                color: c,
                type: t
            }))
        } else {
            return {
                color: 'none',
                type: t
            }
        }
    }).flat()
]

const CARD_DECK = [
    ...ALL_CARDS,
    ...ALL_CARDS.filter(c => c.type !== CARD_TYPE[0]),
    ...[CARD_TYPE.wild, CARD_TYPE.wildDraw2, CARD_TYPE.wildDraw4].map(t => ([
        {
            color: 'none',
            type: t
        },
        {
            color: 'none',
            type: t
        }
    ])).flat()
]

const getRandomCard = () => CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)]

const setBackgoundPosition = (elm, x, y) => {
    elm.style.backgroundPositionX = '-' + (x * 500 - 10) + `px`
    elm.style.backgroundPositionY = '-' + (y * 740 - 10) + `px`
}

const CARD_X_OFFSET = {
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

const CARD_Y_OFFSET = {
    [CARD_COLOR.red]: 0,
    [CARD_COLOR.yellow]: 1,
    [CARD_COLOR.green]: 2,
    [CARD_COLOR.blue]: 3,
    [CARD_TYPE.wild]: 0,
    [CARD_TYPE.wildDraw4]: 1,
    [CARD_TYPE.wildDraw2]: 2
}

const displayCard = (elm, card) => {
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
//     if (i < ALL_CARDS.length) {
//         i += 1
//         setTimeout(nextCard, 400)
//     }
// }

// nextCard()