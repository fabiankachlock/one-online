import type * as PreGame from '../../types/preGameMessages';
import type * as WSMessage from '../../types/websocketMessages';

const nameKey = 'player-name';
const idKey = 'player-id';
const gameIdKey = 'game-id';
const tokenKey = 'game-token';

const playerContainer = <HTMLDivElement>document.getElementById('players');

const displayPlayerList = (players: { name: string; id: string }[]) => {
  playerContainer.innerHTML = '';
  console.log(players);

  for (let player of players) {
    const node = <HTMLParagraphElement>document.createElement('p');
    node.innerText = player.name;
    playerContainer.appendChild(node);
  }
};

const sendOption = (option: string, enabled: boolean) =>
  fetch('/game/options/' + localStorage.getItem(gameIdKey), {
    method: 'post',
    body: JSON.stringify(<PreGame.OptionsChangeBody>{
      [option]: enabled
    }),
    headers: {
      'Content-Type': ' application/json'
    }
  });

const leave = () => {
  fetch('/leave', {
    method: 'post',
    body: JSON.stringify(<PreGame.LeaveBody>{
      gameId: localStorage.getItem(gameIdKey),
      playerId: localStorage.getItem(idKey),
      playerName: localStorage.getItem(nameKey)
    }),
    headers: {
      'Content-Type': ' application/json'
    }
  });
  delete localStorage[gameIdKey];
  window.location.href = '../';
};

const startGame = () => fetch('/game/start/' + localStorage.getItem(gameIdKey));
const stopGame = () => fetch('/game/stop/' + localStorage.getItem(gameIdKey));

const initActions = () => {
  const leaveBtn = <HTMLButtonElement>document.getElementById('leave');
  if (leaveBtn) leaveBtn.onclick = leave;

  const startBtn = <HTMLButtonElement>document.getElementById('start');
  if (startBtn) startBtn.onclick = startGame;

  const stopBtn = <HTMLButtonElement>document.getElementById('stop');
  if (stopBtn) stopBtn.onclick = stopGame;
};

const initOptions = () => {
  (<NodeListOf<HTMLInputElement>>(
    document.querySelectorAll('#options input[type="checkbox"]')
  )).forEach((elm: HTMLInputElement) => {
    elm.onchange = () => {
      const name = elm.getAttribute('id') || '';
      sendOption(name.substring(0, name.length - 5), elm.checked);
    };
  });
};

const verifyToken = async () => {
  return fetch('/access', {
    method: 'post',
    body: JSON.stringify(<PreGame.AccessBody>{
      token: localStorage.getItem(tokenKey)
    }),
    headers: {
      'Content-Type': ' application/json'
    }
  })
    .then(
      res =>
        <Promise<PreGame.GameAccessResponse | PreGame.ErrorResponse>>res.json()
    )
    .then(res => {
      if ('gameId' in res) {
        localStorage.setItem(gameIdKey, res.gameId);
      } else {
        alert(res.error);
        window.location.href = '../';
      }
    });
};

const joinHost = async () => {
  return fetch('/access', {
    method: 'post',
    body: JSON.stringify(<PreGame.AccessBody>{
      gameId: localStorage.getItem(gameIdKey)
    }),
    headers: {
      'Content-Type': ' application/json'
    }
  })
    .then(
      res => <Promise<PreGame.VerifyResponse | PreGame.ErrorResponse>>res.json()
    )
    .then(res => {
      if ('ok' in res) {
        return;
      } else {
        alert(res.error);
        window.location.href = '../';
      }
    });
};

(async () => {
  let fileName = window.location.href;

  if (/wait.html/.test(fileName)) {
    await verifyToken();
  } else {
    await joinHost();
  }

  let protocol = 'wss://';
  if (/localhost/.test(window.location.host)) {
    protocol = 'ws://';
  }

  const uri =
    protocol +
    window.location.host +
    '/game/ws/wait?' +
    localStorage.getItem(gameIdKey);
  const websocket = new WebSocket(uri, 'ws');

  websocket.onerror = err => {
    window.location.href = '../';
    console.log(err);
    alert('Websocket Error');
  };

  websocket.onmessage = msg => {
    const data = <
      | WSMessage.GameStartMessage
      | WSMessage.GameStopMessage
      | WSMessage.PlayerChangeMessage
    >JSON.parse(msg.data);

    if ('start' in data) {
      websocket.close();
      window.location.href = data.url;
    } else if ('players' in data) {
      displayPlayerList(data.players);
    } else if ('stop' in data) {
      websocket.close();
      window.location.href = '../';
    }
  };

  initActions();
  initOptions();
})();
