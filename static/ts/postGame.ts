const gameId = window.location.hash.substring(1)
const playerId = localStorage.getItem('player-id')
let playAgainUrl = ''
let newToken = ''

const setupPlayAgain = () => {
    const btn = document.getElementById('again')

    btn.onclick = () => {
        if (/_host/.test(playAgainUrl)) {
            localStorage.setItem('game-id', newToken)
        } else {
            localStorage.setItem('game-token', newToken)
        }
        window.location.href = playAgainUrl
    }
}


(() => {
    document.getElementById('leave').onclick = () => window.location.href = '../'
    window.location.hash = ''
    setupPlayAgain()

    fetch('/game/stats/' + gameId + '/' + playerId).then(res => res.json()).then(res => {
        console.log('response:', res)
        playAgainUrl = res.url
        newToken = res.token
        document.getElementById('winner').innerText = 'Winner: ' + res.winner
    })
})()