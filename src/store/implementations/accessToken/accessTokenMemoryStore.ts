import { Logging } from '../../../logging/index.js';
import { AccessTokenStore } from '../../accessTokenStore';

const map: Record<string, string> = {};

export const AccessTokenMemoryStore: AccessTokenStore = {
  storeToken: (token, gameId) => {
    map[token] = gameId;
    Logging.TokenStore.log(`stored token ${token}`);
  },
  deleteToken: token => delete map[token],
  deleteTokensForGame: gameId =>
    Object.entries(map)
      .filter(([, id]) => gameId === id)
      .forEach(([token]) => AccessTokenMemoryStore.deleteToken(token)),
  useToken: token => {
    const gameId = map[token];
    AccessTokenMemoryStore.deleteToken(token);
    Logging.TokenStore.log(`used token ${token}`);
    return gameId || '';
  },
  all: () => Object.entries(map).map(o => ({ token: o[0], gameId: o[1] }))
};
