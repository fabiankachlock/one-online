const gameId = window.location.hash.substring(1)
const playerId = localStorage.getItem('player-id')
let playAgainUrl = ''
let newGameId = ''

const setupPlayAgain = () => {
    const btn = document.getElementById('again')

    btn.onclick = () => {
        localStorage.setItem('game-id', newGameId)
        window.location.href = playAgainUrl
    }
}


(() => {
    document.getElementById('leave').onclick = () => window.location.href = '../'
    window.location.hash = ''
    setupPlayAgain()

    fetch('/game/stats/' + gameId + '/' + playerId).then(res => res.json()).then(res => {
        console.log('response:', res)
        playAgainUrl = res.playAgainUrl
        newGameId = res.gameId
        document.getElementById('winner').innerText = 'Winner: ' + res.winner
    })
})()