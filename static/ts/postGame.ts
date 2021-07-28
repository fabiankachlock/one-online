import * as PostGame from '../../types/postGameMessages'

const gameId = window.location.hash.substring(1)
const playerId = localStorage.getItem('player-id') ?? ''

let playAgainUrl = ''
let newToken = ''

const setupPlayAgain = () => {
    const btn = <HTMLButtonElement>document.getElementById('again')

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
    (<HTMLButtonElement>document.getElementById('leave')).onclick = () => window.location.href = '../'

    window.location.hash = ''
    setupPlayAgain()

    fetch('/game/stats/' + gameId + '/' + playerId).then(res => <Promise<PostGame.StatsResponse | PostGame.ErrorResponse>>res.json()).then(res => {
        if ('error' in res) {
            alert(res.error)
            window.location.href = '../'
        } else {
            console.log('received stats:', res)
            playAgainUrl = res.url
            newToken = res.token;
            (<HTMLParagraphElement>document.getElementById('winner')).innerText = 'Winner: ' + res.winner
        }
    })
})()