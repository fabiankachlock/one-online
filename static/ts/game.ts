import { Card, CARD_COLOR, CARD_TYPE, getRandomCard } from "./card.js"
import { UIEventPayload } from "./gameUtils.js"
import { displayPlayers, setTopCard, selectPlayer, pushCardToDeck, onGameEvent, prepareUi, changePlayerCardAmount } from "./uiEvents.js"

export const gameId = window.location.href.split('#')[1]
export const playerId = localStorage.getItem('player-id')
export const playerName = localStorage.getItem('player-name')

export type PlayerMeta = {
    name: string;
    id: string;
    cards: number;
}

export type GameState = {
    isCurrent: boolean;
    drawAmount: number;
    players: {
        name: string;
        id: string;
        cards: number;
    }[],
    topCard: Card;
}

export type GameOptions = {
    penaltyCard: boolean;
    timeMode: boolean;
    strictMode: boolean;
    addUp: boolean;
    cancleWithReverse: boolean;
    placeDirect: boolean;
    takeUntilFit: boolean;
    throwSame: boolean;
    exchange: boolean;
    globalExchange: boolean;
}

export const state: GameState = {
    isCurrent: false,
    drawAmount: 0,
    players: [],
    topCard: {
        color: CARD_COLOR.red,
        type: CARD_TYPE[1]
    }
}

export const options: GameOptions = {
    penaltyCard: true,
    timeMode: false,
    strictMode: false,
    addUp: true,
    cancleWithReverse: false,
    placeDirect: false,
    takeUntilFit: false,
    throwSame: false,
    exchange: false,
    globalExchange: false,
}

export type GameUpdateMessage = {
    currentPlayer: string;
    topCard: Card;
    player: {
        id: string;
        amount: number;
    }[]
    events: {
        type: string;
        players: string[];
    }[];
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

const initGame = data => {
    displayPlayers(data.players, data.amountOfCards)
    state.players = data.players.map(p => ({
        name: p.name,
        id: p.id,
        cards: data.amount
    }))
    generateCards(data.amount)
    setTopCard(data.topCard)
    state.topCard = data.topCard
    selectPlayer(data.currentPlayer)
    state.isCurrent = data.currentPlayer === playerId
}

const generateCards = amount => {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            pushCardToDeck(getRandomCard())
        }, (i + 5) * 300)
    }
}

const handleMessage = message => {
    const data = JSON.parse(message.data)
    console.log(data)

    if (data.event === 'init-game') {
        initGame(data)
    } else if (data.event === 'update') {
        handleGameUpdate(data as GameUpdateMessage)
    }
}

const handleGameUpdate = (update: GameUpdateMessage) => {
    state.topCard = update.topCard
    setTopCard(state.topCard)
    state.isCurrent = update.currentPlayer === playerId
    selectPlayer(update.currentPlayer)

    for (let i = 0; i < state.players.length; i++) {
        changePlayerCardAmount(update.player[i].amount, update.player[i].id)
        state.players[i].cards = update.player[i].amount
    }

    for (let evt of update.events) {
        handleGameEvent(evt)
    }
}

export const handleGameEvent = (event: {
    type: string;
    players: string[];
}) => {
    console.log('event: ', event.type, event.players)
}

export const connect = () => {
    const uri = 'ws://' + window.location.host + '/game/ws/play?' + gameId
    const websocket = new WebSocket(uri, 'ws')

    websocket.onerror = err => {
        window.location.href = '../'
        console.log(err)
        alert('Websocket Error' + err)
    }

    websocket.onmessage = handleMessage

    onGameEvent((type: string, event: UIEventPayload) => {
        console.log('received event', type, event)

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
