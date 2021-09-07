import type * as PostGame from '../../types/postGameMessages';
import type * as PreGame from '../../types/preGameMessages';

let playAgainUrl = '';

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
      headers: {
        'Content-Type': ' application/json'
      }
    });
    window.location.href = '../';
  };
};

(() => {
  window.location.hash = '';
  setupPlayAgain();
  setupLeave();

  fetch('/api/v1/game/stats')
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

        (<HTMLParagraphElement>document.getElementById('winner')).innerText =
          'Winner: ' + res.winner;
      }
    });
})();
