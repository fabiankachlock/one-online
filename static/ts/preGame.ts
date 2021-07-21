// @ts-ignore
const nameKey = 'player-name'
// @ts-ignore
const idKey = 'player-id'
// @ts-ignore
const gameIdKey = 'game-id'

const playerContainer = document.getElementById('players')
const displayPlayerList = players => {
    playerContainer.innerHTML = '';

    for (let player of players) {
        const node = document.createElement('p')
        node.innerText = player
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
            game: localStorage.getItem(gameIdKey),
            player: localStorage.getItem(idKey)
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
    if (stopBtn) stopBtn.onclick = stop
}

const initOptions = () => {
    (document.querySelectorAll('#options input[type="checkbox"]') as NodeListOf<HTMLInputElement>).forEach((elm: HTMLInputElement) => {
        elm.onchange = () => {
            const name = elm.getAttribute('id')
            sendOption(name.substring(0, name.length - 5), elm.checked)
        }
    })
}

(() => {
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
