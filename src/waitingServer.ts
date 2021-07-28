import Websocket, { Server as WebsocketServer } from 'ws';
import { Logging } from './logging/index.js';
import { GameStore } from './store/implementations/gameStore/';

const wsMap: { [id: string]: Websocket[] } = {};

export const WaitingServer = new WebsocketServer({ noServer: true });
export const WaitingServerPath = '/game/ws/wait';

WaitingServer.on('connection', (ws, req) => {
  const parts = (req.url ?? '').split('?');
  if (parts?.length < 2) {
    Logging.Websocket.error(
      `[Waiting] [Refused] invalid url parameter ${ws.url}`
    );
    ws.close();
    return;
  }

  const gameid = parts[1];

  if (gameid in wsMap) {
    wsMap[gameid].push(ws);
  } else {
    wsMap[gameid] = [ws];
  }

  const game = GameStore.getGame(gameid);

  if (!game) {
    Logging.Websocket.warn(
      `[Waiting] [Closed] ${ws.url} due to nonexisting game`
    );
    ws.close();
  } else {
    Logging.Websocket.info(`[Waiting] [Connected] waiting for game ${gameid}`);
    game.onPlayerJoined();
  }

  ws.on('close', () => {
    Logging.Websocket.info(`[Waiting] [Closed] on ${gameid}`);
    wsMap[gameid] = (wsMap[gameid] || []).filter(w => w !== ws);
  });
});

export const WaitingWebsockets = {
  sendMessage: (gameid: string, message: string) => {
    Logging.Websocket.info(`[Waiting] [Message] to game ${gameid}`);
    if (wsMap[gameid] && wsMap[gameid].length > 0) {
      wsMap[gameid].forEach(ws => {
        ws.send(message);
      });
    }
  },

  removeConnections: (id: string) => {
    Logging.Websocket.info(`[Waiting] [Closed] connection for game ${id}`);
    if (wsMap[id] && wsMap[id].length > 0) {
      wsMap[id].forEach(ws => {
        ws.close();
      });
    }
    delete wsMap[id];
  }
};
