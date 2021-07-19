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
})()
