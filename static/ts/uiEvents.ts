import { displayCard, setBackgoundPosition } from "./card.js";
import { options, playerId, playerName, state } from "./game.js";
import { canPlaceCard, createDrawMessage, createPlaceCardMessage, drawCard, UIEventPayload } from "./gameUtils.js";

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

        if (!state.isCurrent && !options.throwSame) return
        if (!canPlaceCard(card)) return

        playCard(card, id)
    }

    cardWrapper.appendChild(newCard)
    deckElm.appendChild(cardWrapper)
    displayCard(newCard, card)

    cardAmount += 1;
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

    changePlayerCardAmount(cardAmount, playerId)
    deckElm.setAttribute('style', '--overlap: -' + Math.round(overlap * 100) + 'vw; ' + cardSize)
}

// Manage User Name + Crad Amount
let cardAmountElm;
const setupNameBadge = () => {
    document.querySelector('#name').classList.add('id-' + playerId);
    (document.querySelector('#name .name') as HTMLElement).innerText = playerName
    cardAmountElm = document.querySelector('#name .amount');
}

export const displayPlayers = (players, amount) => {
    console.log('displayPlayers', players, amount)

    const template = (document.getElementById('badgeTemplate') as HTMLTemplateElement).content
    const target = document.getElementById('opponents')
    target.innerHTML = '';

    for (let player of players) {

        if (player.id === playerId) {
            continue
        }

        const node = template.cloneNode(true) as HTMLElement
        console.log(node);
        (node.querySelector('.name') as HTMLElement).innerText = player.name;
        (node.querySelector('.amount') as HTMLElement).innerText = amount;
        node.className = 'badge id-' + player.id
        target.appendChild(node)
    }
}

export const changePlayerCardAmount = (amount: number, id: string) => {
    console.log('changePlayerCardAmount', id, amount);

    (document.querySelector('.badge.id-' + id + ' .amount') as HTMLElement).innerText = cardAmount.toString()
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
}

// InGame Event Drivers
const setupPile = () => {
    const pile = document.getElementById('pile')

    setBackgoundPosition(pile, 13, 3)

    pile.onclick = () => {

        if (!state.isCurrent) return
        let isFinished = false
        let cards = []

        while (!isFinished) {
            const drawnCard = drawCard()
            pushCardToDeck(drawnCard)
            cards.push(drawnCard)
            isFinished = !options.takeUntilFit || canPlaceCard(drawnCard)
        }

        eventHandler('drawn', createDrawMessage(cards))
    }
}


// Forward Events
let eventHandler: (type: string, event: UIEventPayload) => void = () => { }
const playCard = (card, id) => {
    console.log('playing card', id, card)

    eventHandler('card', createPlaceCardMessage(card))

    state.topCard = card
    setTopCard(card)

    const playedCard = deckElm.querySelector('.id-' + id)
    if (playedCard) {
        playedCard.remove()
        cardAmount -= 1;
        updateDeckLayout()
    }
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