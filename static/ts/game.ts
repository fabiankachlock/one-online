import type { PlayerMeta, UIEventPayload } from '../../types/client';
import type {
  DrawEventPayload,
  PlaceCardEventPayload
} from '../../types/gameEvents';
import type {
  GameFinishMessage,
  GameInitMessage,
  GameUpdateMessage
} from '../../types/gameMessages';
import type { Card } from '../../types/index';
import type {
  ErrorResponse,
  VerifyResponse
} from '../../types/preGameMessages';
import { CARD_COLOR, CARD_TYPE } from './card.js';
import {
  displayPlayers,
  setTopCard,
  selectPlayer,
  pushCardToDeck,
  onGameEvent,
  changePlayerCardAmount,
  setUnoCardVisibility,
  setDeckVisibility,
  placeCard,
  shakeCard,
  setStateDirection,
  hideUnoCard,
  removePlayer,
  showVersion
} from './uiEvents.js';

let playerId = '';

export enum GameEventTypes {
  draw = 'draw',
  card = 'place-card'
}

type GameState = {
  isCurrent: boolean;
  topCard: Card;
  players: Record<string, PlayerMeta>;
};

const state: GameState = {
  isCurrent: false,
  players: {},
  topCard: {
    color: CARD_COLOR.red,
    type: CARD_TYPE[1]
  }
};

export const verify = async () => {
  const response = await fetch('/api/v1/game/verify').then(res => res.json());
  if ((<VerifyResponse>response).ok !== true) {
    alert((<ErrorResponse>response).error);
    window.location.href = '../';
  }
  playerId = (<VerifyResponse>response).playerId;
  return playerId;
};

export const connect = async () => {
  let protocol = 'wss://';
  if (window.location.host.includes("localhost") || window.location.host.includes("127.0.0.1")) {
    protocol = 'ws://';
  }

  const uri =
    protocol +
    window.location.host +
    (await fetch('/api/v1/game/resolve/play').then(res => res.text()));
  const websocket = new WebSocket(uri, 'ws');

  websocket.onerror = err => {
    window.location.href = '../';
    console.log(err);
    alert('Websocket Error' + err);
  };

  websocket.onmessage = handleMessage;

  onGameEvent((type: string, event: UIEventPayload) => {
    console.log('forward event', type, event);

    websocket.send(
      JSON.stringify({
        event: type,
        playerId,
        eid: Date.now(),
        payload: {
          ...event
        }
      })
    );
  });
};

const handleMessage = (message: MessageEvent) => {
  const data = JSON.parse(message.data);
  console.log(data);

  if (data.event === 'init-game') {
    initGame(data as GameInitMessage);
  } else if (data.event === 'update') {
    handleGameUpdate(data as GameUpdateMessage);
  } else if (data.event === 'finished') {
    window.location.href = (data as GameFinishMessage).url;
  }
};

const initGame = (data: GameInitMessage) => {
  const orderedPlayers = reorderPlayers(playerId, [...data.players]);
  displayPlayers(playerId, orderedPlayers);
  let ownAmount = 0;
  state.players = {};
  showVersion(data.serverVersion);

  data.players.map(p => {
    if (p.id === playerId) {
      ownAmount = p.cardAmount;
    }

    state.players[p.id] = {
      name: p.name,
      id: p.id,
      cardAmount: p.cardAmount
    };
  });

  setTopCard(data.topCard);
  state.topCard = data.topCard;

  selectPlayer(data.currentPlayer);
  state.isCurrent = data.currentPlayer === playerId;
  console.log('starting player', data.currentPlayer);

  for (let i = 0; i < data.deck.length; i++) {
    setTimeout(() => {
      pushCardToDeck(data.deck[i]);
    }, i * 300);
  }

  if (!data.uiOptions.showOneButton) {
    hideUnoCard();
  }

  setDeckVisibility(state.isCurrent);
  setUnoCardVisibility(ownAmount === 1);
  changePlayerCardAmount(playerId, data.deck.length, playerId);
};

const reorderPlayers = (
  id: string,
  players: (PlayerMeta & { order: number })[]
): (PlayerMeta & { order: number })[] => {
  // reorder players so, that they appear to go a circle (own id doesn't matter)
  // example (playerID = 3) [3, 4, 6, 1, 2, 5] [2, 1, 6, 5, 4]
  const sortedPlayers = players.sort((a, b) => a.order - b.order); // sort players by order ascending
  const ownIndex = sortedPlayers.findIndex(p => p.id === id)!;

  const firstHalf = [...sortedPlayers].splice(0, ownIndex);
  const secondHalf = [...sortedPlayers].splice(
    ownIndex + 1,
    sortedPlayers.length - firstHalf.length - 1
  );

  return [...firstHalf.reverse(), ...secondHalf.reverse()];
};

const handleGameUpdate = (update: GameUpdateMessage) => {
  state.topCard = update.topCard;
  setTopCard(state.topCard);
  state.isCurrent = update.currentPlayer === playerId;
  selectPlayer(update.currentPlayer);

  setDeckVisibility(state.isCurrent);
  setStateDirection(update.direction);

  const storedPlayers = Object.keys(state.players);

  if (storedPlayers.length !== update.players.length) {
    for (let i = 0; i < storedPlayers.length; i++) {
      if (!update.players.find(p => p.id === storedPlayers[i])) {
        removePlayer(storedPlayers[i]);
        delete state.players[storedPlayers[i]];
      }
    }
  }

  for (let i = 0; i < update.players.length; i++) {
    const { id, amount } = update.players[i];

    console.log('update for player: ', id);
    changePlayerCardAmount(playerId, amount, id);

    state.players[id].cardAmount = amount;

    if (id === playerId) {
      console.log('is own player');
      console.log('show uno:', amount === 1);
      setUnoCardVisibility(amount === 1);
    }
  }

  for (let evt of update.events) {
    handleGameEvent(evt);
  }
};

const handleGameEvent = (event: { type: string; payload: {} }) => {
  console.log('received event:', event.type, event.payload);

  if (event.type === GameEventTypes.card) {
    handlePlaceCardEvent(event.payload as PlaceCardEventPayload);
  } else if (event.type === GameEventTypes.draw) {
    handleDrawCardEvent(event.payload as DrawEventPayload);
  }
};

const handlePlaceCardEvent = (payload: PlaceCardEventPayload) => {
  if (payload.allowed === true) {
    console.log('all fine!, placing: ', payload.card);
    placeCard(payload.card, payload.id);
  } else {
    console.log('not allowed: ', payload.card);
    shakeCard(payload.card, payload.id);
  }
};

const handleDrawCardEvent = (payload: DrawEventPayload) => {
  console.log('drawing cards: ', payload.cards);
  for (let i = 0; i < payload.cards.length; i++) {
    setTimeout(() => {
      pushCardToDeck(payload.cards[i]);
    }, i * 300);
  }
};
