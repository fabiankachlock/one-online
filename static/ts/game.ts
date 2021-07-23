import { CARD_COLOR, CARD_TYPE } from "./card.js"
import { DrawCardPayload, GameEventType, GameInitMessage, GameState, GameUpdateMessage, PlaceCardPayload, UIEventPayload } from "./gameUtils.js"
import { displayPlayers, setTopCard, selectPlayer, pushCardToDeck, onGameEvent, changePlayerCardAmount, setUnoCardVisibility, setDeckVisibility, placeCard, shakeCard } from "./uiEvents.js"

export const gameId = window.location.href.split('#')[1]
export const playerId = localStorage.getItem('player-id')
export const playerName = localStorage.getItem('player-name')

export const state: GameState = {
    isCurrent: false,
    players: [],
    topCard: {
        color: CARD_COLOR.red,
        type: CARD_TYPE[1]
    }
}

export const verify = () => {
    if (gameId === localStorage.getItem('game-id')) {
        window.location.hash = ''
        localStorage.removeItem('game-id')
    } else {
        window.location.href = '../'
    }

    fetch('/game/verify/' + gameId + '/' + playerId).then(res => res.json()).then(res => {
        if (res.ok !== true) {
            alert(res.error)
            window.location.href = '../'
        }
    })
}

export const connect = () => {
    const uri = 'ws://' + window.location.host + '/game/ws/play?' + gameId + '?' + playerId
    const websocket = new WebSocket(uri, 'ws')

    websocket.onerror = err => {
        window.location.href = '../'
        console.log(err)
        alert('Websocket Error' + err)
    }

    websocket.onmessage = handleMessage

    onGameEvent((type: string, event: UIEventPayload) => {
        console.log('forward event', type, event)

        websocket.send(JSON.stringify({
            event: type,
            playerId,
            eid: Date.now(),
            payload: {
                ...event
            }
        }))
    })
}

const handleMessage = message => {
    const data = JSON.parse(message.data)
    console.log(data)

    if (data.event === 'init-game') {
        initGame(data as GameInitMessage)
    } else if (data.event === 'update') {
        handleGameUpdate(data as GameUpdateMessage)
    }
}

const initGame = (data: GameInitMessage) => {

    displayPlayers(data.players)
    let ownAmount = 0
    state.players = data.players.map(p => {
        if (p.id === playerId) {
            ownAmount = p.cardAmount
        }

        return {
            name: p.name,
            id: p.id,
            cardAmount: p.cardAmount
        }
    })

    setTopCard(data.topCard)
    state.topCard = data.topCard

    selectPlayer(data.currentPlayer)
    state.isCurrent = data.currentPlayer === playerId
    console.log('starting player', data.currentPlayer)

    for (let i = 0; i < data.deck.length; i++) {
        setTimeout(() => {
            pushCardToDeck(data.deck[i])
        }, i * 300)
    }

    setDeckVisibility(state.isCurrent)
    setUnoCardVisibility(ownAmount === 1)
}

const handleGameUpdate = (update: GameUpdateMessage) => {
    state.topCard = update.topCard
    setTopCard(state.topCard)
    state.isCurrent = update.currentPlayer === playerId
    selectPlayer(update.currentPlayer)

    setDeckVisibility(state.isCurrent)

    for (let i = 0; i < state.players.length; i++) {
        changePlayerCardAmount(update.players[i].amount, update.players[i].id)
        state.players[i].cardAmount = update.players[i].amount

        if (update.players[i].id === playerId) {
            setUnoCardVisibility(update.players[i].amount === 1)
        }
    }

    for (let evt of update.events) {
        handleGameEvent(evt)
    }

}

const handleGameEvent = (event: {
    type: string;
    payload: {}
}) => {
    console.log('received event:', event.type, event.payload)

    if (event.type === GameEventType.placeCard) {
        handlePlaceCardEvent(event.payload as PlaceCardPayload)
    } else if (event.type === GameEventType.drawCard) {
        handleDrawCardEvent(event.payload as DrawCardPayload)
    }
}

const handlePlaceCardEvent = (payload: PlaceCardPayload) => {
    if (payload.allowed === true) {
        console.log('all fine!, placing: ', payload.card)
        placeCard(payload.card, payload.id)
    } else {
        console.log('not allowed: ', payload.card)
        shakeCard(payload.card, payload.id)
    }
}

const handleDrawCardEvent = (payload: DrawCardPayload) => {
    console.log('drawing cards: ', payload.cards)
    for (let i = 0; i < payload.cards.length; i++) {
        setTimeout(() => {
            pushCardToDeck(payload.cards[i])
        }, i * 300)
    }
}