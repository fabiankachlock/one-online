import Websocket, { Server as WebsocketServer } from 'ws';
import { Logging } from './logging/index.js';
import { GameStore } from './store/implementations/gameStore/';

const wsMap: { [id: string]: Websocket[] } = {};

export const WaitingServer = new WebsocketServer({ noServer: true });
export const WaitingServerPath = '/api/v1/game/ws/wait';

const Logger = Logging.Websocket.withBadge('Waiting');

WaitingServer.on('connection', (ws, req) => {
  const parts = (req.url ?? '').split('?');
  if (parts?.length < 2) {
    Logging.Websocket.error(
      `[Waiting] [Refused] invalid url parameter ${ws.url}`
    );
    ws.close();
    return;
  }

  const gameId = parts[1];

  if (gameId in wsMap) {
    wsMap[gameId].push(ws);
  } else {
    wsMap[gameId] = [ws];
  }

  const game = GameStore.getGame(gameId);

  if (!game) {
    Logger.warn(`[Closed] ${ws.url} due to nonexisting game`);
    ws.close();
  } else {
    Logger.log(`[Connected] waiting for game ${gameId}`);
    game.sendPlayerUpdate();
  }

  ws.on('close', () => {
    Logger.log(`[Closed] on ${gameId}`);
    wsMap[gameId] = (wsMap[gameId] || []).filter(w => w !== ws);
  });
});

export const WaitingWebsockets = {
  sendMessage: (gameId: string, message: string) => {
    Logger.log(`[Message] to game ${gameId}`);
    if (wsMap[gameId] && wsMap[gameId].length > 0) {
      wsMap[gameId].forEach(ws => {
        ws.send(message);
      });
    }
  },

  removeConnections: (id: string) => {
    Logger.log(`[Closed] connection for game ${id}`);
    if (wsMap[id] && wsMap[id].length > 0) {
      wsMap[id].forEach(ws => {
        ws.close();
      });
    }
    delete wsMap[id];
  }
};
