import Websocket, { Server as WebsocketServer } from 'ws';
import { Logging } from './logging/index.js';
import { GameStore } from './store/implementations/gameStore';

const wsMap: { [id: string]: { [player: string]: Websocket } } = {};

export const GameServer = new WebsocketServer({ noServer: true });
export const GameServerPath = '/api/v1/game/ws/play';

const Logger = Logging.Websocket.withBadge('Active');

GameServer.on('connection', (ws, req) => {
  const parts = (req.url ?? '').split('?');
  if (parts?.length < 3) {
    Logger.error(`[Refused] invalid url parameter ${ws.url}`);
    ws.close();
    return;
  }

  const gameId = parts[1];
  const playerId = parts[2];

  if (!wsMap[gameId]) {
    wsMap[gameId] = {};
  }

  wsMap[gameId][playerId] = ws;

  Logger.log(`[Connected] ${playerId} for game ${gameId}`);

  const game = GameStore.getGame(gameId);

  if (game && game.meta.running) {
    // game already running
    game.rejoin(playerId);

    ws.on('message', game.eventHandler());

    return;
  }

  if (game && game.isReady(Object.keys(wsMap[gameId]).length)) {
    Logger.log(`game ready ${gameId}`);

    game.prepare();
    game.start();

    Object.entries(wsMap[gameId]).forEach(([, ws]) => {
      ws.on('message', game.eventHandler());
    });
  } else if (!game) {
    Logger.warn(`[Closed] ${ws.url} due to nonexisting game`);
    ws.close();
  }

  ws.on('close', () => {
    Logger.log(`[Closed] ${playerId} on ${gameId}`);
    delete wsMap[gameId][playerId];

    if (Object.keys(wsMap[gameId]).length === 0 && game && game.meta.running) {
      Logger.log(`no more players on ${gameId}`);
      GameStore.remove(gameId);
    }
  });
});

export const GameWebsockets = {
  sendMessage: (gameId: string, message: string) => {
    Logger.log(`[Message] to game ${gameId}`);
    if (wsMap[gameId]) {
      Object.entries(wsMap[gameId]).forEach(([, ws]) => {
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
