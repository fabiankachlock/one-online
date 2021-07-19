const nameKey = 'player-name'
const idKey = 'player-id'
const gameIdKey = 'game-id'

const container = document.getElementById('players')
const displayPlayers = players => {
    container.innerHTML = '';

    for (let player of players) {
        const node = document.createElement('p')
        node.innerText = player
        container.appendChild(node)
    }
}

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

const start = () => { }
const stop = () => { }

const initActions = () => {
    const leaveBtn = document.getElementById('leave')
    if (leaveBtn) leaveBtn.onclick = leave

    const startBtn = document.getElementById('start')
    if (startBtn) startBtn.onclick = start

    const stopBtn = document.getElementById('stop')
    if (stopBtn) stopBtn.onclick = stop
}

(() => {
    const uri = 'ws://' + window.location.host + '/game/ws/wait?' + localStorage.getItem(gameIdKey)
    const websocket = new WebSocket(uri, 'ws')

    websocket.onerror = () => {
        window.location.href = '../'
        alert('Websocket Error')
    }

    websocket.onmessage = msg => {
        const data = JSON.parse(msg.data)

        if (data.start) {
            // start
        } else if (data.players) {
            displayPlayers(data.players)
        }
    }

    initActions()
})()
