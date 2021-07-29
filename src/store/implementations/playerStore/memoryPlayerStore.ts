import { Player } from '../../../game/players/player.js';
import { Logging } from '../../../logging/index.js';
import { PlayerStoreType } from '../../playerStore';

const playerMap: { [key: string]: string } = {};
const playerNameMap: { [key: string]: string } = {};

export const MemoryPlayerStore: PlayerStoreType = {
  storePlayer: (player: Player) => {
    playerMap[player.name] = player.id;
    playerNameMap[player.id] = player.name;
    Logging.PlayerStore.log(`stored ${player.id}`);
  },

  getPlayerId: (name: string) => playerMap[name] as string | undefined,
  getPlayerName: (id: string) => playerNameMap[id] as string | undefined,

  changePlayerName: (id: string, newName: string) => {
    const oldName = playerNameMap[id];
    delete playerMap[oldName];
    playerMap[newName] = id;
    playerNameMap[id] = newName;
  },

  all: () => Object.entries(playerMap).map(([name, id]) => ({ name, id }))
};
