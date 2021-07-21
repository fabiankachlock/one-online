const gameId = window.location.href.split('#')[1]
const playerId = localStorage.getItem('player-id')

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

    onPlayCard((card, event) => {
        websocket.send(JSON.stringify({
            event: 'card',
            playerId,
            eid: Date.now(),
            payload: {
                card: {
                    type: card.type,
                    color: card.color
                },
                event: event
            }
        }))
    })
}


(() => {
    //verify()
    //connect()
    setTimeout(() => {
        setTopCard({
            color: CARD_COLOR.yellow,
            type: CARD_TYPE[1]
        })
        console.log('set')
    }, 100)
})()