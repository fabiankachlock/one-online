const gameId = window.location.href.split('#')[1]
const playerId = localStorage.getItem('player-id')
const playerName = localStorage.getItem('player-name')

const state = {
    isCurrent: false,
    drawAmount: 0,
    options: {
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
    },
    players: [],
    topCard: {
        color: 'none',
        type: 'none'
    }
}

const verify = () => {
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
    generateCards(data.amount)
    setTopCard(data.topCard)
    selectPlayer(data.currentPlayer)
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
    }
}

const connect = () => {
    const uri = 'ws://' + window.location.host + '/game/ws/play?' + gameId
    const websocket = new WebSocket(uri, 'ws')

    websocket.onerror = err => {
        window.location.href = '../'
        console.log(err)
        alert('Websocket Error', err)
    }

    websocket.onmessage = handleMessage

    onGameEvent((type, event) => {
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


(() => {
    prepareUi()
    //verify()
    connect()
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            pushCardToDeck(getRandomCard())
        }, 600 * i)
    }
})()