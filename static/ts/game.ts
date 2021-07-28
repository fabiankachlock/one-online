import { PlayerMeta, UIEvevntPayload } from "../../types/client.js"
import { DrawEventPayload, GameEventTypes, PlaceCardEventPayload } from "../../types/gameEvents.js"
import { GameFinishMessage, GameInitMessage, GameUpdateMessage } from "../../types/gameMessages.js"
import { Card } from "../../types/index.js"
import { ErrorResponse, VerifyResponse } from "../../types/preGameMessages.js"
import { CARD_COLOR, CARD_TYPE } from "./card.js"
import { displayPlayers, setTopCard, selectPlayer, pushCardToDeck, onGameEvent, changePlayerCardAmount, setUnoCardVisibility, setDeckVisibility, placeCard, shakeCard, setStateDirection } from "./uiEvents.js"

const gameId = window.location.href.split('#')[1]
const playerId = localStorage.getItem('player-id')

type GameState = {
    isCurrent: boolean;
    topCard: Card;
    players: PlayerMeta[],
}

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
        if ((<VerifyResponse>res).ok !== true) {
            alert((<ErrorResponse>res).error)
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

    onGameEvent((type: string, event: UIEvevntPayload) => {
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

const handleMessage = (message: MessageEvent) => {
    const data = JSON.parse(message.data)
    console.log(data)

    if (data.event === 'init-game') {
        initGame(data as GameInitMessage)
    } else if (data.event === 'update') {
        handleGameUpdate(data as GameUpdateMessage)
    } else if (data.event === 'finished') {
        window.location.href = (data as GameFinishMessage).url
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
    setStateDirection(update.direction)

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

    if (event.type === GameEventTypes.card) {
        handlePlaceCardEvent(event.payload as PlaceCardEventPayload)
    } else if (event.type === GameEventTypes.draw) {
        handleDrawCardEvent(event.payload as DrawEventPayload)
    }
}

const handlePlaceCardEvent = (payload: PlaceCardEventPayload) => {
    if (payload.allowed === true) {
        console.log('all fine!, placing: ', payload.card)
        placeCard(payload.card, payload.id)
    } else {
        console.log('not allowed: ', payload.card)
        shakeCard(payload.card, payload.id)
    }
}

const handleDrawCardEvent = (payload: DrawEventPayload) => {
    console.log('drawing cards: ', payload.cards)
    for (let i = 0; i < payload.cards.length; i++) {
        setTimeout(() => {
            pushCardToDeck(payload.cards[i])
        }, i * 300)
    }
}