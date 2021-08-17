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
  fetch('/api/v1/game/options/' + localStorage.getItem(gameIdKey), {
    method: 'post',
    body: JSON.stringify(<PreGame.OptionsChangeBody>{
      [option]: enabled
    }),
    headers: {
      'Content-Type': ' application/json'
    }
  });

const leave = () => {
  fetch('/api/v1/leave', {
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

const startGame = () =>
  fetch('/api/v1/game/start/' + localStorage.getItem(gameIdKey));
const stopGame = () =>
  fetch('/api/v1/game/stop/' + localStorage.getItem(gameIdKey));

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
  return fetch('/api/v1/access', {
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
  return fetch('/api/v1/access', {
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

const loadOptions = async () => {
  const options: PreGame.GameOptionsList = await fetch(
    '/api/v1/game/options/list'
  ).then(res => res.json());
  const fields = document.getElementById('options')!;
  const template = <HTMLTemplateElement>(
    document.getElementById('optionTemplate')!
  );

  for (const option of options) {
    if (option.name.length === 0) continue;

    const newNode = <HTMLDivElement>template.content.cloneNode(true);
    const wrapper = newNode.querySelector('div')!;
    const label = newNode.querySelector('label')!;
    const input = newNode.querySelector('input')!;
    const info = newNode.querySelector('p')!;

    label.innerText = option.name;
    label.setAttribute('for', option.id);

    input.setAttribute('name', option.id);
    input.setAttribute('id', option.id);
    input.checked = option.defaultOn;

    info.innerText = option.description;

    if (!option.implemented) {
      wrapper.classList.add('not-implemented');
    }

    fields.appendChild(newNode);
  }
};

(async () => {
  let fileName = window.location.href;

  if (/wait.html/.test(fileName)) {
    await verifyToken();
  } else {
    await joinHost();
    await loadOptions();
  }

  let protocol = 'wss://';
  if (/localhost/.test(window.location.host)) {
    protocol = 'ws://';
  }

  const uri =
    protocol +
    window.location.host +
    '/api/v1/game/ws/wait?' +
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
