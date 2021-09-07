require('dotenv').config();

import express from 'express';
import http from 'http';
import session from 'express-session';
import type * as PreGame from '../types/preGameMessages';
import { GameServer, GameServerPath } from './gameServer';
import { Logging } from './logging/index.js';
import { startMemoryWatcher } from './memoryWatcher.js';
import { GameStore } from './store/implementations/gameStore/';
import { PlayerStore } from './store/implementations/playerStore/';
import { WaitingServer, WaitingServerPath } from './waitingServer';
import { MenuApiHandler, PlayerApiHandler, GameApiHandler } from './server/api';

const PORT = process.env.PORT || 4096;
const expressServer = express();
const app = express.Router();
const server = http.createServer(expressServer);

Logging.App.info(`Started in ${process.env.NODE_ENV} mode`);

expressServer.use(async (req, _res, next) => {
  Logging.Hit.info(`[${req.method}]  ${req.url}`);
  next();
});

expressServer.use(express.static('static'));
expressServer.use(express.json());

expressServer.use(
  session({
    secret: process.env.SESSION_SECRET ?? 'very-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7776000 /* 90 Days */ }
  })
);

// Menu Endpoints
app.get('/games', (_req, res) => {
  res.json(<PreGame.GamesResponse>GameStore.getGames());
});

app.post('/create', MenuApiHandler.create);
app.post('/join', MenuApiHandler.join);
app.post('/leave', MenuApiHandler.leave);
app.post('/access', MenuApiHandler.access);

// Player Management
app.post('/player/register', PlayerApiHandler.register);
app.post('/player/changeName', PlayerApiHandler.changeName);

// Game Management
app.get('/game/resolve/wait', GameApiHandler.resolve.wait);
app.get('/game/resolve/play', GameApiHandler.resolve.play);

app.get('/game/options/list', GameApiHandler.options.list);
app.post('/game/options', GameApiHandler.options.change);

app.get('/game/start', GameApiHandler.start);
app.get('/game/stop', GameApiHandler.stop);
app.get('/game/stats', GameApiHandler.stats);
app.get('/game/verify', GameApiHandler.verify);

// Dev
if (process.env.NODE_ENV === 'development') {
  app.get('/dev/players', async (_req, res) => {
    res.json(PlayerStore.all());
  });

  app.get('/dev/games', async (_req, res) => {
    res.json(GameStore.all());
  });
  Logging.App.info('[Development] activated dev routes');
}

server.on('upgrade', function upgrade(request, socket, head) {
  const url = <string>request.url;

  if (url.startsWith(WaitingServerPath)) {
    Logging.Websocket.info('[Waiting] [Upgrade]');
    WaitingServer.handleUpgrade(request, socket, head, function done(ws) {
      WaitingServer.emit('connection', ws, request);
    });
  } else if (url.startsWith(GameServerPath)) {
    Logging.Websocket.info('[Active] [Upgrade]');
    GameServer.handleUpgrade(request, socket, head, function done(ws) {
      GameServer.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

startMemoryWatcher(process.env.NODE_ENV === 'development');

expressServer.use('/api/v1', app);

server.listen(PORT, () => {
  Logging.App.info('Server running');
  Logging.Server.info('Started!');
  Logging.Server.info(`[Port] ${PORT}`);
});
