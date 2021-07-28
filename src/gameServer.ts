import Websocket, { Server as WebsocketServer } from 'ws';
import { Logging } from './logging/index.js';
import { GameStore } from './store/implementations/gameStore';

const wsMap: { [id: string]: { [player: string]: Websocket } } = {};

export const GameServer = new WebsocketServer({ noServer: true });
export const GameServerPath = '/game/ws/play';

GameServer.on('connection', (ws, req) => {
  const parts = (req.url ?? '').split('?');
  if (parts?.length < 3) {
    Logging.Websocket.error(
      `[Active] [Refused] invalid url parameter ${ws.url}`
    );
    ws.close();
    return;
  }

  const gameid = parts[1];
  const playerid = parts[2];

  if (!wsMap[gameid]) {
    wsMap[gameid] = {};
  }

  wsMap[gameid][playerid] = ws;

  Logging.Websocket.info(`[Active] [Connected] ${playerid} for game ${gameid}`);

  const game = GameStore.getGame(gameid);

  if (game && game.isReady(Object.keys(wsMap[gameid]).length)) {
    Logging.Websocket.info(`game ready ${gameid}`);

    game.prepare();
    game.start();

    Object.entries(wsMap[gameid]).forEach(([, ws]) => {
      ws.on('message', game.eventHandler());
    });
  } else if (!game) {
    Logging.Websocket.warn(
      `[Active] [Closed] ${ws.url} due to nonexisting game`
    );
    ws.close();
  }

  ws.on('close', () => {
    Logging.Websocket.info(`[Active] [Closed] ${playerid} on ${gameid}`);
    delete wsMap[gameid][playerid];
  });
});

export const GameWebsockets = {
  sendMessage: (gameid: string, message: string) => {
    Logging.Websocket.info(`[Active] [Message] to game ${gameid}`);
    if (wsMap[gameid]) {
      Object.entries(wsMap[gameid]).forEach(([, ws]) => {
        ws.send(message);
      });
    }
  },

  sendIndividual: (gameId: string, playerId: string, message: string) => {
    Logging.Websocket.info(
      `[Active] [Message] to player ${playerId} on game ${gameId}`
    );
    const ws = wsMap[gameId][playerId];
    if (ws) {
      ws.send(message);
    }
  },

  removeConnections: (id: string) => {
    Logging.Websocket.info(`[Active] [Closed] connection for game ${id}`);
    if (wsMap[id]) {
      Object.entries(wsMap[id]).forEach(([, ws]) => {
        ws.close();
      });
    }
    delete wsMap[id];
  }
};
