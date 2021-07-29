import type * as PostGame from '../../types/postGameMessages';
import type * as PreGame from '../../types/preGameMessages';

const gameId = window.location.hash.substring(1);
const playerId = localStorage.getItem('player-id') ?? '';

let playAgainUrl = '';
let newToken = '';

const setupPlayAgain = () => {
  const btn = <HTMLButtonElement>document.getElementById('again');

  btn.onclick = () => {
    window.location.href = playAgainUrl;
  };
};

const setupLeave = () => {
  const btn = <HTMLButtonElement>document.getElementById('leave');

  btn.onclick = () => {
    window.location.href = '../';
    fetch('/api/v1/leave', {
      method: 'post',
      body: JSON.stringify(<PreGame.LeaveBody>{
        gameId: localStorage.getItem('game-id'),
        token: localStorage.getItem('game-token'),
        playerId: playerId,
        playerName: localStorage.getItem('player-name')
      }),
      headers: {
        'Content-Type': ' application/json'
      }
    });
    delete localStorage['game-id'];
    window.location.href = '../';
  };
};

(() => {
  window.location.hash = '';
  setupPlayAgain();
  setupLeave();

  fetch('/api/v1/game/stats/' + gameId + '/' + playerId)
    .then(
      res =>
        <Promise<PostGame.StatsResponse | PostGame.ErrorResponse>>res.json()
    )
    .then(res => {
      if ('error' in res) {
        alert(res.error);
        window.location.href = '../';
      } else {
        console.log('received stats:', res);
        playAgainUrl = res.url;
        newToken = res.token;

        if (/_host/.test(playAgainUrl)) {
          localStorage.setItem('game-id', newToken);
        } else {
          localStorage.setItem('game-token', newToken);
        }

        (<HTMLParagraphElement>document.getElementById('winner')).innerText =
          'Winner: ' + res.winner;
      }
    });
})();
