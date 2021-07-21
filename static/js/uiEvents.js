// Deck
const deckElm = document.querySelector('#deck #content')
let cardAmount = 0;

// Add Card to Deck
const pushCardToDeck = card => {
    console.log('pushing card', card)

    const id = Math.random().toString().substring(2)
    const cardWrapper = document.createElement('div')
    cardWrapper.classList.add('card-wrapper')
    cardWrapper.classList.add('id-' + id)

    const newCard = document.createElement('div')
    newCard.classList.add('card')
    newCard.onclick = () => playCard(card, id)

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

    deckElm.style = '--overlap: -' + Math.round(overlap * 100) + 'vw; ' + cardSize
}

let playCardHandler = () => { }
const playCard = (card, id) => {
    console.log('playing card', id, card)

    playCardHandler(card)
    setTopCard(card)

    const playedCard = deckElm.querySelector('.id-' + id)
    if (playedCard) {
        playedCard.remove()
        cardAmount -= 1;
        updateDeckLayout()
    }
}

const onPlayCard = handler => {
    playCardHandler = handler
}

const showXXXOverlay = () => {

}

const displayPlayers = (players, amount) => {
    console.log('displayPlayers', players, amount)
}

const changePlayerCardAmount = (id, amount) => {
    console.log('changePlayerCardAmount', id, amount)
}

const selectPlayer = id => {

}

const cardElm = document.getElementById('card')
const setTopCard = card => {
    displayCard(cardElm, card)
}

window.onresize = () => {
    updateDeckLayout()
}