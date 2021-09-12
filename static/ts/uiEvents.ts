import type { PlayerMeta, UIEventPayload } from '../../types/client';
import {
  CARD_COLOR,
  displayCard,
  isWildCard,
  setBackgroundPosition
} from './card.js';
import type { Card } from '../../types/index';

enum UIEventTypes {
  tryPlaceCard = 'card',
  tryDraw = 'draw',
  uno = 'uno'
}

const playerName = localStorage.getItem('player-name') || 'no-name';

const cardsPile = <HTMLDivElement>document.getElementById('pile');
const unoButton = <HTMLDivElement>document.getElementById('unoButton');
const playerDeck = <HTMLDivElement>document.getElementById('content');
const topCard = <HTMLDivElement>document.getElementById('card');
const gameStateIndicator = <HTMLDivElement>(
  document.getElementById('directionState')
);

let cardAmount = 0;
let eventHandler: (type: string, event: UIEventPayload) => void = () => {};

// Add Card to Deck
export const pushCardToDeck = (card: Card) => {
  console.log('pushing card', card);

  const id: string = Math.random().toString().substring(2);
  const cardWrapper = <HTMLDivElement>document.createElement('div');
  cardWrapper.classList.add('card-wrapper');
  cardWrapper.classList.add('id-' + id);

  const newCard = document.createElement('div');
  newCard.classList.add('card');
  newCard.onclick = () => {
    playCard(card, id);
  };

  cardWrapper.appendChild(newCard);
  playerDeck.appendChild(cardWrapper);
  displayCard(newCard, card);

  updateDeckLayout();
};

// Manage Deck Layout
const updateDeckLayout = () => {
  let cardSize = '';
  let CARD_WIDTH = 0.24;
  if (cardAmount > 20) {
    cardSize = '--deck-card-h: 24vh; --deck-card-w: 16vh;';
    CARD_WIDTH = 0.16;
  }

  const overallWidth = window.innerHeight * CARD_WIDTH * cardAmount;
  const percentageOfScreen = overallWidth / window.innerWidth;
  let overlap = 0;

  if (percentageOfScreen > 0.9) {
    overlap = (percentageOfScreen - 1) / cardAmount;
  }

  playerDeck.setAttribute(
    'style',
    '--overlap: -' + Math.round(overlap * 100) + 'vw; ' + cardSize
  );
};

// Manage User Name + Card Amount
const setupNameBadge = (id: string) => {
  document.querySelector('#name')!.classList.add('id-' + id);
  (<HTMLSpanElement>document.querySelector('#name .name')).innerText =
    playerName;
};

export const displayPlayers = (id: string, players: PlayerMeta[]) => {
  console.log('displayPlayers', players);

  const template = (<HTMLTemplateElement>(
    document.getElementById('badgeTemplate')
  )).content;
  const target = <HTMLDivElement>document.getElementById('opponents');
  target.innerHTML = '';

  for (let player of players) {
    if (player.id === id) {
      continue;
    }

    const node = <HTMLDivElement>template.cloneNode(true);
    const badge = <HTMLDivElement>node.querySelector('.badge');

    (<HTMLSpanElement>badge.querySelector('.name')).innerText = player.name;
    (<HTMLSpanElement>badge.querySelector('.amount')).innerText =
      player.cardAmount.toString();
    badge.classList.add('id-' + player.id);

    console.log('init opponent', player.id);
    target.appendChild(badge);
  }
};

export const changePlayerCardAmount = (
  ownId: string,
  amount: number,
  id: string
) => {
  if (id === ownId) {
    cardAmount = amount;
    updateDeckLayout();
  }

  (<HTMLSpanElement>(
    document.querySelector('.badge.id-' + id + ' .amount')
  )).innerText = amount.toString();
};

export const selectPlayer = (id: string) => {
  document.querySelectorAll('.badge').forEach(elm => {
    if (elm.classList.contains('id-' + id)) {
      elm.classList.add('active');
    } else if (elm.classList.contains('active')) {
      elm.classList.remove('active');
    }
  });
};

export const setTopCard = (card: Card) => {
  displayCard(topCard, card);

  gameStateIndicator.classList.remove('red');
  gameStateIndicator.classList.remove('blue');
  gameStateIndicator.classList.remove('green');
  gameStateIndicator.classList.remove('yellow');
  switch (card.color) {
    case CARD_COLOR.red:
      gameStateIndicator.classList.add('red');
      break;
    case CARD_COLOR.blue:
      gameStateIndicator.classList.add('blue');
      break;
    case CARD_COLOR.green:
      gameStateIndicator.classList.add('green');
      break;
    case CARD_COLOR.yellow:
      gameStateIndicator.classList.add('yellow');
      break;
  }
};

// InGame Event Drivers
const setupPile = () => {
  setBackgroundPosition(cardsPile, 13, 3);

  cardsPile.onclick = () => {
    eventHandler(UIEventTypes.tryDraw, {});
  };
};

const setupUnoButton = () => {
  unoButton.onclick = () => {
    eventHandler(UIEventTypes.uno, {});
    // TODO wait for actual server response
    setTimeout(() => {
      setUnoCardVisibility(false);
    }, 300);
  };
};

// Forward Events
const playCard = async (card: Card, id: string) => {
  console.log('playing card', id, card);

  if (isWildCard(card.type)) {
    card = await selectColor(card);
  }

  eventHandler(UIEventTypes.tryPlaceCard, { card, id });
};

// Handle Incoming UI Events
export const setDeckVisibility = (visible: boolean) => {
  if (visible) {
    playerDeck.classList.remove('disabled');
    cardsPile.classList.remove('disabled');
  } else {
    playerDeck.classList.add('disabled');
    cardsPile.classList.add('disabled');
  }
};

export const setUnoCardVisibility = (visible: boolean) => {
  if (visible) {
    unoButton.classList.remove('disabled');
  } else {
    unoButton.classList.add('disabled');
  }
};

export const hideUnoCard = () => {
  unoButton.classList.add('hidden');
};

export const setStateDirection = (direction: string) => {
  if (direction === 'left') {
    gameStateIndicator.classList.add('left');
  } else {
    gameStateIndicator.classList.remove('left');
  }
};

export const placeCard = (_card: Card, id: string) => {
  const playedCard = playerDeck.querySelector('.id-' + id);
  if (playedCard) {
    playedCard.remove();
    updateDeckLayout();
  }
};

export const shakeCard = (_card: Card, id: string) => {
  const card = <HTMLDivElement>playerDeck.querySelector('.id-' + id);

  if (card) {
    card.classList.add('shake');
    setTimeout(() => {
      card.classList.remove('shake');
    }, 1000);
  }
};

const setupLeaveButton = () => {
  const button: HTMLButtonElement = document.querySelector(
    '#leaveButton button'
  )!;

  button.onclick = () => {
    window.onbeforeunload = function () {
      return true;
    };
    window.location.href += 'leave.html';
  };
};

// Handle Extra events
const selectColor = async (card: Card): Promise<Card> => {
  return new Promise((resolve, _reject) => {
    const overlay = <HTMLDivElement>(
      document.querySelector('#overlays #selectColor')
    );
    overlay.classList.add('active');

    (
      document.querySelectorAll(
        '#selectColor .wrapper div'
      ) as NodeListOf<HTMLElement>
    ).forEach(elm => {
      elm.onclick = () => {
        overlay.classList.remove('active');
        card.color = CARD_COLOR[elm.getAttribute('id') || 'none'];
        resolve(card);
      };
    });
  });
};

export const onGameEvent = (
  handler: (type: string, event: UIEventPayload) => void
) => {
  eventHandler = handler;
};

window.onresize = () => {
  updateDeckLayout();
};

export const prepareUi = (id: string) => {
  setupLeaveButton();
  setupNameBadge(id);
  setupPile();
  setupUnoButton();
};
