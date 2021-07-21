
const pushCardToDeck = card => {
    console.log('pushing card', card)
}

const playCard = card => {
    console.log('playing card', card)
}

const onPlayCard = handler => {
    //...
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