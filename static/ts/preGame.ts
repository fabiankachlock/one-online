import type * as PreGame from '../../types/preGameMessages';
import type * as WSMessage from '../../types/websocketMessages';

// Actions
const leave = () => {
  fetch('/api/v1/leave', {
    method: 'post',
    headers: {
      'Content-Type': ' application/json'
    }
  });
  window.location.href = '../';
};

const startGame = () => fetch('/api/v1/game/start');
const stopGame = () => fetch('/api/v1/game/stop');

const initActions = () => {
  const leaveBtn = <HTMLButtonElement>document.getElementById('leave');
  if (leaveBtn) leaveBtn.onclick = leave;

  const startBtn = <HTMLButtonElement>document.getElementById('start');
  if (startBtn) startBtn.onclick = startGame;

  const stopBtn = <HTMLButtonElement>document.getElementById('stop');
  if (stopBtn) stopBtn.onclick = stopGame;
};

const verifyToken = async () => {
  return fetch('/api/v1/access', {
    method: 'post',
    headers: {
      'Content-Type': ' application/json'
    }
  })
    .then(res => <Promise<PreGame.ErrorResponse>>res.json())
    .then(res => {
      if ('error' in res) {
        alert(res.error);
        window.location.href = '../';
      }
    });
};

const joinHost = async () => {
  return fetch('/api/v1/access', {
    method: 'post',
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

// display players
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

// options
const initOptions = () => {
  (<NodeListOf<HTMLInputElement>>(
    document.querySelectorAll('#options input[type="checkbox"]')
  )).forEach((elm: HTMLInputElement) => {
    elm.onchange = () => {
      const name = elm.getAttribute('id') || '';
      sendOption(name, elm.checked);
    };
  });
};

const sendOption = (option: string, enabled: boolean) =>
  fetch('/api/v1/game/options', {
    method: 'post',
    body: JSON.stringify(<PreGame.OptionsChangeBody>{
      [option]: enabled
    }),
    headers: {
      'Content-Type': ' application/json'
    }
  });

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

const activeOptionsList = document.getElementById('options')!;
const activeOptionTemplate = <HTMLTemplateElement>(
  document.getElementById('optionTemplate')!
);

const displayOptions = (options: WSMessage.OptionsChangeMessage['options']) => {
  activeOptionsList.innerHTML = '';
  console.log(options);

  for (const option of options) {
    if (option.name.length === 0) continue;

    const newNode = <HTMLDivElement>(
      activeOptionTemplate.content.cloneNode(true)
    );
    const name = <HTMLParagraphElement>newNode.querySelector('.name')!;
    const info = <HTMLParagraphElement>newNode.querySelector('.info')!;

    name.innerText = option.name;
    info.innerText = option.description;

    activeOptionsList.appendChild(newNode);
  }

  if (options.length === 0) {
    activeOptionsList.innerHTML = '<p class="name">only default ones</p>';
  }
};

const getName = async (): Promise<string> => {
  return fetch('/api/v1/game/name').then(res => res.text());
};

const setupWebsocket = async (isHost: boolean) => {
  let protocol = 'wss://';
  if (/localhost/.test(window.location.host)) {
    protocol = 'ws://';
  }

  const uri =
    protocol +
    window.location.host +
    (await fetch('/api/v1/game/resolve/wait').then(res => res.text()));
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
      | WSMessage.OptionsChangeMessage
    >JSON.parse(msg.data);

    if ('start' in data) {
      websocket.close();
      window.location.href = data.url;
    } else if ('players' in data) {
      displayPlayerList(data.players);
    } else if ('options' in data && !isHost) {
      // display options only, if it isn't the host
      displayOptions(data.options);
    } else if ('stop' in data) {
      websocket.close();
      window.location.href = '../';
    }
  };
};

(async () => {
  let fileName = window.location.href;
  let isHost = false;

  if (/wait\.html/.test(fileName)) {
    await verifyToken();
  } else {
    isHost = true;
    await joinHost();
    await loadOptions();
  }

  setupWebsocket(isHost);
  initActions();
  initOptions();

  const gameName = await getName();
  (<HTMLHeadingElement>document.getElementById('name')).innerText = gameName;
})();
