import Websocket, { Server as WebsocketServer } from 'ws';
import { Logging } from './logging/index.js';
import { GameStore } from './store/implementations/gameStore';

const wsMap: { [id: string]: { [player: string]: Websocket } } = {};

export const GameServer = new WebsocketServer({ noServer: true });
export const GameServerPath = '/game/ws/play';

const Logger = Logging.Websocket.withBadge('Active');

GameServer.on('connection', (ws, req) => {
  const parts = (req.url ?? '').split('?');
  if (parts?.length < 3) {
    Logger.error(`[Refused] invalid url parameter ${ws.url}`);
    ws.close();
    return;
  }

  const gameid = parts[1];
  const playerid = parts[2];

  if (!wsMap[gameid]) {
    wsMap[gameid] = {};
  }

  wsMap[gameid][playerid] = ws;

  Logger.log(`[Connected] ${playerid} for game ${gameid}`);

  const game = GameStore.getGame(gameid);

  if (game && game.isReady(Object.keys(wsMap[gameid]).length)) {
    Logger.log(`game ready ${gameid}`);

    game.prepare();
    game.start();

    Object.entries(wsMap[gameid]).forEach(([, ws]) => {
      ws.on('message', game.eventHandler());
    });
  } else if (!game) {
    Logger.warn(`[Closed] ${ws.url} due to nonexisting game`);
    ws.close();
  }

  ws.on('close', () => {
    Logger.log(`[Closed] ${playerid} on ${gameid}`);
    delete wsMap[gameid][playerid];

    if (Object.keys(wsMap[gameid]).length === 0 && game && game.meta.running) {
      Logger.log(`no more players on ${gameid}`);
      GameStore.remove(gameid);
    }
  });
});

export const GameWebsockets = {
  sendMessage: (gameid: string, message: string) => {
    Logger.log(`[Message] to game ${gameid}`);
    if (wsMap[gameid]) {
      Object.entries(wsMap[gameid]).forEach(([, ws]) => {
        ws.send(message);
      });
    }
  },

  sendIndividual: (gameId: string, playerId: string, message: string) => {
    Logger.log(`[Message] to player ${playerId} on game ${gameId}`);
    const ws = wsMap[gameId][playerId];
    if (ws) {
      ws.send(message);
    }
  },

  removeConnections: (id: string) => {
    Logger.log(`[Closed] connection for game ${id}`);
    if (wsMap[id]) {
      Object.entries(wsMap[id]).forEach(([, ws]) => {
        ws.close();
      });
    }
    delete wsMap[id];
  }
};
