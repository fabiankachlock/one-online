import type * as PreGame from '../../types/preGameMessages';
import { displayCard } from './card';
import { CLIENT_VERSION } from './version.js';

const nameKey = 'player-name';

const createGame = (name: string, password: string, isPublic: boolean) => {
  if (name.length < 3 || (password.length < 3 && !isPublic)) {
    alert('Name and Password have to be at least 3 characters long');
    return;
  }

  fetch('/api/v1/create', {
    method: 'post',
    body: JSON.stringify(<PreGame.CreateBody>{
      name: name,
      password: isPublic ? 'open' : password,
      publicMode: isPublic
    }),
    headers: {
      'Content-Type': ' application/json'
    }
  })
    .then(
      res =>
        <Promise<PreGame.CreatedResponse | PreGame.ErrorResponse>>res.json()
    )
    .then(res => {
      if ('error' in res) {
        alert(res.error);
      } else if (res.success) {
        window.location.href = res.url;
      }
    });
};

const setupCreate = () => {
  const nameInput = <HTMLInputElement>document.getElementById('nameInput');
  const passwordInput = <HTMLInputElement>document.getElementById('passInput');
  const publicInput = <HTMLInputElement>document.getElementById('publicInput');
  const passwordDiv = <HTMLInputElement>document.getElementById('passBox');

  publicInput.onchange = () => {
    if (publicInput.checked) {
      passwordDiv.classList.add('hidden');
    } else {
      passwordDiv.classList.remove('hidden');
    }
  };

  document.getElementById('create')!.onclick = () =>
    createGame(nameInput.value, passwordInput.value, publicInput.checked);
};

const joinGame = (gameId: string, password: string) => {
  fetch('/api/v1/join', {
    method: 'post',
    body: JSON.stringify(<PreGame.JoinBody>{
      gameId: gameId,
      password: password
    }),
    headers: {
      'Content-Type': ' application/json'
    }
  })
    .then(
      res => <Promise<PreGame.JoinedResponse | PreGame.ErrorResponse>>res.json()
    )
    .then(res => {
      if ('error' in res) {
        alert(res.error);
      } else if (res.success) {
        window.location.href = res.url;
      }
    });
};

const setupJoin = () => {
  const container = <HTMLDivElement>document.getElementById('games');

  fetch('/api/v1/games')
    .then(res => <Promise<PreGame.GamesResponse>>res.json())
    .then(res => {
      container.innerHTML = '';
      for (let game of res) {
        const node = <HTMLParagraphElement>document.createElement('p');
        node.innerText = game.name + ' (' + game.player + ' player)';

        if (game.public === true) {
          node.innerText += ' (public)';
          node.onclick = () => joinGame(game.id, '');
        } else {
          node.onclick = () =>
            (window.location.href = '/verify.html#' + game.id);
        }

        container.appendChild(node);
      }
    });
};

const setupVerify = () => {
  const input = <HTMLInputElement>document.getElementById('passInput');

  document.getElementById('gameName')!.innerText =
    'Enter Password for "' + window.location.hash.substr(1) + '":';
  document.getElementById('join')!.onclick = () => {
    joinGame(window.location.hash.substr(1), input.value);
  };
};

const checkUserName = async () => {
  let name = localStorage.getItem(nameKey);

  // 1. fetch status
  const statusResponse = (await fetch('/api/v1/player/register', {
    method: 'post',
    body: '',
    headers: {
      'Content-Type': ' application/json'
    }
  }).then(res => res.json())) as
    | PreGame.ErrorResponse
    | PreGame.PlayerRegisterResponse
    | PreGame.VerifyResponse;

  if ('error' in statusResponse) {
    // no registered with no information
    let registrationName = '';
    if (name && name.length > 0) {
      registrationName = name;
    } else {
      registrationName = 'user' + Math.random().toString().substr(3, 9);
    }

    // register player
    const registrationResponse = (await fetch('/api/v1/player/register', {
      method: 'post',
      body: JSON.stringify(<PreGame.PlayerRegisterBody>{
        name: registrationName
      }),
      headers: {
        'Content-Type': ' application/json'
      }
    }).then(res => res.json())) as
      | PreGame.ErrorResponse
      | PreGame.PlayerRegisterResponse;

    if ('name' in registrationResponse) {
      localStorage.setItem(nameKey, registrationResponse.name);
    } else {
      alert(registrationResponse.error);
    }
  } else if ('name' in statusResponse) {
    localStorage.setItem(nameKey, statusResponse.name);
  }
};

const setupIndex = () => {
  const input = <HTMLInputElement>document.getElementById('nameInput');
  let name = localStorage.getItem(nameKey) || '';
  input.value = name;

  input.onchange = () => {
    name = input.value;
    localStorage.setItem(nameKey, name);
    fetch('/api/v1/player/changeName', {
      method: 'post',
      body: JSON.stringify({
        name
      }),
      headers: {
        'Content-Type': ' application/json'
      }
    });
  };

  fetch('/api/v1/user/reset');
};

const showVersion = () => {
  const div = document.createElement('div');
  div.className = '__version';
  div.innerHTML = 'v' + CLIENT_VERSION;
  document.body.appendChild(div);
};

(async () => {
  showVersion();
  await checkUserName();

  let fileName = window.location.href;

  if (!fileName) return;
  else if (
    (fileName.split('/').pop() ?? '').length === 0 ||
    /index.html/.test(fileName)
  )
    setupIndex();
  else if (/create.html/.test(fileName)) setupCreate();
  else if (/join.html/.test(fileName)) setupJoin();
  else if (/verify.html/.test(fileName)) setupVerify();

  const backButton = <HTMLButtonElement>document.getElementById('back');
  if (backButton) backButton.onclick = () => (window.location.href = '../');
})();
