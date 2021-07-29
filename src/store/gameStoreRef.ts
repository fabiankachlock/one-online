import { Game } from '../game/game.js';
import { GameStoreRef } from '../game/interface.js';
import { TokenStore } from './implementations/accessToken/index.js';
import { GameStore } from './implementations/gameStore/index.js';
import { PlayerStore } from './implementations/playerStore/index.js';

export const createRef = (game: Game): GameStoreRef => ({
  save: () => GameStore.storeGame(game),
  queryPlayers: () =>
    Array.from(game.meta.players).map(id => ({
      id,
      name: PlayerStore.getPlayerName(id) || 'noname'
    })),
  checkPlayer: (id: string, name: string): boolean => {
    const storedId = PlayerStore.getPlayerId(name);
    const storedName = PlayerStore.getPlayerName(id);

    return id === storedId && storedName === name;
  },
  destroy: () => {
    GameStore.remove(game.key);
    TokenStore.deleteTokensForGame(game.key);
  }
});
