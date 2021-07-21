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

    changePlayerCardAmount(cardAmount, playerId)
    deckElm.style = '--overlap: -' + Math.round(overlap * 100) + 'vw; ' + cardSize
}

// Manage User Name + Crad Amount
let cardAmountElm;
const setupNameBadge = () => {
    document.querySelector('#name').classList.add('id-' + playerId)
    document.querySelector('#name .name').innerText = playerName
    cardAmountElm = document.querySelector('#name .amount');
}

const displayPlayers = (players, amount) => {
    console.log('displayPlayers', players, amount)

    const template = document.getElementById('badgeTemplate').content
    const target = document.getElementById('opponents')
    target.innerHTML = '';

    for (let player of players) {

        if (player.id === playerId) {
            continue
        }

        const node = template.cloneNode(true)
        console.log(node)
        node.querySelector('.name').innerText = player.name
        node.querySelector('.amount').innerText = amount
        node.className = 'badge id-' + player.id
        target.appendChild(node)
    }
}

const changePlayerCardAmount = (amount, id) => {
    console.log('changePlayerCardAmount', id, amount)

    document.querySelector('.badge.id-' + id + ' .amount').innerText = cardAmount
}

const selectPlayer = id => {
    document.querySelectorAll('.badge').forEach(elm => {
        if (elm.classList.contains('id-' + id)) {
            elm.classList.add('active')
        } else if (elm.classList.contains('active')) {
            elm.classList.remove('active')
        }
    })
}

const cardElm = document.getElementById('card')
const setTopCard = card => {
    displayCard(cardElm, card)
}

// InGame Event Drivers
const setupPile = () => {
    const pile = document.getElementById('pile')

    setBackgoundPosition(pile, 13, 3)

    pile.onclick = () => {
        const drawnCard = getRandomCard()
        pushCardToDeck(drawnCard)
        eventHandler('drawn', {
            card: {
                type: card.type,
                color: card.color
            },
            type: state.drawAmount > 0 ? 'normal' : 'penalty'
        })
    }
}


// Forward Events
let eventHandler = () => { }
const playCard = (card, id) => {
    console.log('playing card', id, card)

    eventHandler('card', {
        card: {
            type: card.type,
            color: card.color
        },
        type: state.isCurrent ? 'normal' : 'throwSame'
    })

    setTopCard(card)

    const playedCard = deckElm.querySelector('.id-' + id)
    if (playedCard) {
        playedCard.remove()
        cardAmount -= 1;
        updateDeckLayout()
    }
}

const onGameEvent = handler => {
    eventHandler = handler
}

window.onresize = () => {
    updateDeckLayout()
}

const prepareUi = () => {
    setupNameBadge()
    setupPile()
}