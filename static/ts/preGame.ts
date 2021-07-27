// @ts-ignore
const nameKey = 'player-name'
// @ts-ignore
const idKey = 'player-id'
// @ts-ignore
const gameIdKey = 'game-id'
// @ts-ignore
const tokenKey = 'game-token'

const playerContainer = document.getElementById('players')
const displayPlayerList = players => {
    playerContainer.innerHTML = '';
    console.log(players)
    for (let player of players) {
        const node = document.createElement('p')
        node.innerText = player.name
        playerContainer.appendChild(node)
    }
}

const sendOption = (option, enabled) => fetch('/game/options/' + localStorage.getItem(gameIdKey), {
    method: 'post',
    body: JSON.stringify({
        [option]: enabled
    }),
    headers: {
        'Content-Type': ' application/json'
    }
})

const leave = () => {
    fetch('/leave', {
        method: 'post',
        body: JSON.stringify({
            gameId: localStorage.getItem(gameIdKey),
            playerId: localStorage.getItem(idKey),
            playerName: localStorage.getItem(nameKey)
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    })
    delete localStorage[gameIdKey]
    window.location.href = '../'
}

const startGame = () => fetch('/game/start/' + localStorage.getItem(gameIdKey))
const stopGame = () => fetch('/game/stop/' + localStorage.getItem(gameIdKey))


const initActions = () => {
    const leaveBtn = document.getElementById('leave')
    if (leaveBtn) leaveBtn.onclick = leave

    const startBtn = document.getElementById('start')
    if (startBtn) startBtn.onclick = startGame

    const stopBtn = document.getElementById('stop')
    if (stopBtn) stopBtn.onclick = stopGame
}

const initOptions = () => {
    (document.querySelectorAll('#options input[type="checkbox"]') as NodeListOf<HTMLInputElement>).forEach((elm: HTMLInputElement) => {
        elm.onchange = () => {
            const name = elm.getAttribute('id')
            sendOption(name.substring(0, name.length - 5), elm.checked)
        }
    })
}

const verifyToken = async () => {
    return fetch('/access', {
        method: 'post',
        body: JSON.stringify({
            token: localStorage.getItem(tokenKey)
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    }).then(res => res.json()).then(res => {
        if (res.gameId) {
            localStorage.setItem(gameIdKey, res.gameId)
        } else {
            alert(res.error)
            window.location.href = '../'
        }
    })
}

const joinHost = async () => {
    return fetch('/access', {
        method: 'post',
        body: JSON.stringify({
            gameId: localStorage.getItem(gameIdKey)
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    }).then(res => res.json()).then(res => {
        if (res.ok) {
            return
        } else {
            alert(res.error)
            window.location.href = '../'
        }
    })
}

(async () => {

    let fileName = window.location.href

    if (/wait.html/.test(fileName)) {
        await verifyToken();
    } else {
        await joinHost();
    }

    const uri = 'ws://' + window.location.host + '/game/ws/wait?' + localStorage.getItem(gameIdKey)
    const websocket = new WebSocket(uri, 'ws')

    websocket.onerror = err => {
        window.location.href = '../'
        console.log(err)
        alert('Websocket Error')
    }

    websocket.onmessage = msg => {
        const data = JSON.parse(msg.data)

        if (data.start) {
            websocket.close()
            window.location.href = data.url
        } else if (data.players) {
            displayPlayerList(data.players)
        } else if (data.stop) {
            websocket.close()
            window.location.href = '../'
        }
    }

    initActions()
    initOptions()
})()
