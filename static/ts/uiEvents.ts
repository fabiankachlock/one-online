import { Card, CARD_COLOR, displayCard, isWildCard, setBackgoundPosition } from "./card.js";
import { playerId, playerName, state } from "./game.js";
import { PlayerMeta, UIEventPayload, UIEventType } from "./gameUtils.js";

// Deck
const deckElm = document.querySelector('#deck #content')
let cardAmount = 0;

// Add Card to Deck
export const pushCardToDeck = card => {
    console.log('pushing card', card)

    const id = Math.random().toString().substring(2)
    const cardWrapper = document.createElement('div')
    cardWrapper.classList.add('card-wrapper')
    cardWrapper.classList.add('id-' + id)

    const newCard = document.createElement('div')
    newCard.classList.add('card')
    newCard.onclick = () => {
        playCard(card, id)
    }

    cardWrapper.appendChild(newCard)
    deckElm.appendChild(cardWrapper)
    displayCard(newCard, card)

    updateDeckLayout()
}

// Manage Deck Layout
const updateDeckLayout = () => {

    let cardSize = ''
    let CARD_WIDTH = 0.24
    if (cardAmount > 20) {
        cardSize = '--deck-card-h: 24vh; --deck-card-w: 16vh;'
        CARD_WIDTH = 0.16
    }

    const overallWidth = window.innerHeight * CARD_WIDTH * cardAmount
    const percentageOfScreen = overallWidth / window.innerWidth
    let overlap = 0;

    if (percentageOfScreen > 0.9) {
        overlap = (percentageOfScreen - 1) / cardAmount
    }

    deckElm.setAttribute('style', '--overlap: -' + Math.round(overlap * 100) + 'vw; ' + cardSize)
}

// Manage User Name + Crad Amount
const setupNameBadge = () => {
    document.querySelector('#name').classList.add('id-' + playerId);
    (document.querySelector('#name .name') as HTMLElement).innerText = playerName
}

export const displayPlayers = (players: PlayerMeta[]) => {
    console.log('displayPlayers', players)

    const template = (document.getElementById('badgeTemplate') as HTMLTemplateElement).content
    const target = document.getElementById('opponents')
    target.innerHTML = '';

    for (let player of players) {

        if (player.id === playerId) {
            continue
        }

        const node = template.cloneNode(true) as HTMLElement
        const badge = node.querySelector('.badge') as HTMLElement;

        (badge.querySelector('.name') as HTMLElement).innerText = player.name;
        (badge.querySelector('.amount') as HTMLElement).innerText = player.cardAmount.toString();
        badge.classList.add('id-' + player.id)

        console.log('init opponent', player.id)
        target.appendChild(badge)
    }
}

export const changePlayerCardAmount = (amount: number, id: string) => {
    console.log('changePlayerCardAmount', id, amount);

    if (id === playerId) {
        cardAmount = amount
        updateDeckLayout()
    }

    (document.querySelector('.badge.id-' + id + ' .amount') as HTMLElement).innerText = amount.toString()
}

export const selectPlayer = id => {
    document.querySelectorAll('.badge').forEach(elm => {
        if (elm.classList.contains('id-' + id)) {
            elm.classList.add('active')
        } else if (elm.classList.contains('active')) {
            elm.classList.remove('active')
        }
    })
}

const cardElm = document.getElementById('card')
export const setTopCard = card => {
    displayCard(cardElm, card)

    stateElm.classList.remove('red')
    stateElm.classList.remove('blue')
    stateElm.classList.remove('green')
    stateElm.classList.remove('yellow')
    switch (card.color) {
        case CARD_COLOR.red:
            stateElm.classList.add('red')
            break;
        case CARD_COLOR.blue:
            stateElm.classList.add('blue')
            break;
        case CARD_COLOR.green:
            stateElm.classList.add('green')
            break;
        case CARD_COLOR.yellow:
            stateElm.classList.add('yellow')
            break;
    }
}


// InGame Event Drivers
const setupPile = () => {
    const pile = document.getElementById('pile')

    setBackgoundPosition(pile, 13, 3)

    pile.onclick = () => {
        eventHandler(UIEventType.tryDraw, {})
    }
}

// Forward Events
let eventHandler: (type: string, event: UIEventPayload) => void = () => { }
const playCard = async (card, id) => {
    console.log('playing card', id, card)

    if (isWildCard(card.type)) {
        card = await selectColor(card)
    }

    eventHandler(UIEventType.tryPlaceCard, { card, id })
}

// Handle Incomming UI Events
export const setDeckVisibility = visible => {
    if (visible) {
        document.getElementById('content').classList.remove('disabled')
        document.getElementById('pile').classList.remove('disabled')
    } else {
        document.getElementById('content').classList.add('disabled')
        document.getElementById('pile').classList.add('disabled')
    }
}

export const setUnoCardVisibility = visible => {
    if (visible) {
        document.getElementById('unoButton').classList.remove('disabled')
    } else {
        document.getElementById('unoButton').classList.add('disabled')
    }
}

const stateElm = document.getElementById('directionState')
export const setStateDirection = (dir: string) => {
    if (dir === 'left') {
        stateElm.classList.add('left')
    } else {
        stateElm.classList.remove('left')
    }
}

export const placeCard = (_card, id) => {
    const playedCard = deckElm.querySelector('.id-' + id)
    if (playedCard) {
        playedCard.remove()
        updateDeckLayout()
    }
}

export const shakeCard = (_card, id) => {
    const card = deckElm.querySelector('.id-' + id)
    card.classList.add('shake')
    setTimeout(() => {
        card.classList.remove('shake')
    }, 1000)
}

// Handle Extra events
const selectColor = async (card: Card): Promise<Card> => {
    return new Promise((resolve, _reject) => {
        const overlay = document.querySelector('#overlays #selectColor')
        overlay.classList.add('active');

        (document.querySelectorAll('#selectColor .wrapper div') as NodeListOf<HTMLElement>).forEach(elm => {
            elm.onclick = () => {
                overlay.classList.remove('active');
                card.color = CARD_COLOR[elm.getAttribute('id')]
                resolve(card)
            }
        })
    })
}

export const onGameEvent = handler => {
    eventHandler = handler
}

window.onresize = () => {
    updateDeckLayout()
}

export const prepareUi = () => {
    setupNameBadge()
    setupPile()
}