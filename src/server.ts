require('dotenv').config();

import express from 'express';
import http from 'http';
import session from 'express-session';
import { v4 as uuid } from 'uuid';
import type * as PreGame from '../types/preGameMessages';
import { Game } from './game/game.js';
import { Player } from './game/players/player.js';
import { GameServer, GameServerPath } from './gameServer';
import { Logging } from './logging/index.js';
import { startMemoryWatcher } from './memoryWatcher.js';
import { PostGameMessages } from './postGameMessages.js';
import { PreGameMessages } from './preGameMessages.js';
import {
  createAccessToken,
  readAccessToken,
  useAccessToken
} from './store/accessToken.js';
import { TokenStore } from './store/implementations/accessToken/index.js';
import { GameStore } from './store/implementations/gameStore/';
import { PlayerStore } from './store/implementations/playerStore/';
import { WaitingServer, WaitingServerPath } from './waitingServer';
import {
  requireActiveGame,
  requireAuthToken,
  requireGameInfo,
  requireLogin
} from './helper';

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
app.get('/games', async (_req, res) => {
  res.json(<PreGame.GamesResponse>GameStore.getGames());
});

app.post('/create', async (req, res) => {
  const { name, password, publicMode } = <PreGame.CreateBody>req.body;

  if (requireLogin(req, res)) return;

  if (!name || !password) {
    Logging.Game.info(`[Created] call with missing information`);
    PreGameMessages.error(res, 'Error: Please fill in all information.');
    return;
  }

  const game = Game.create(name, password, req.session.userId, publicMode);
  Logging.Game.info(`[Created] ${game.key} ${game.isPublic ? '(public)' : ''}`);

  // set session
  req.session.gameId = game.key;

  PreGameMessages.created(res);
});

app.post('/join', async (req, res) => {
  const { gameId, password } = <PreGame.JoinBody>req.body;

  if (requireLogin(req, res)) return;

  if (!gameId) {
    Logging.Game.info(`[Join] call with missing information`);
    PreGameMessages.error(res, 'Error: Please fill in all information.');
    return;
  }

  const game = GameStore.getGame(gameId);

  if (game) {
    const token = createAccessToken(gameId);
    const success = game.preparePlayer(
      req.session.userId,
      req.session.userName,
      password,
      token
    );

    if (success) {
      Logging.Game.info(`[Join] ${req.session.userId} joined ${gameId}`);
      // set session
      req.session.gameId = game.key;
      req.session.activeToken = token;
      PreGameMessages.joined(res);
    } else {
      Logging.Game.warn(
        `[Join] ${req.session.userId} tried joining with wrong credentials ${gameId}`
      );
      TokenStore.deleteToken(token);

      // reset session
      req.session.gameId = '';
      req.session.activeToken = '';

      PreGameMessages.error(
        res,
        "Error: You can't join the game, make sure your password is correct"
      );
    }
    return;
  }

  Logging.Game.warn(
    `[Join] ${req.session.userId} tried joining nonexisting game ${gameId}`
  );
  PreGameMessages.error(
    res,
    "Error: You can't join a game, that doesn't exists."
  );
});

app.post('/leave', async (req, res) => {
  if (requireLogin(req, res) || requireGameInfo(req, res)) return;

  const computedGameId =
    useAccessToken(req.session.activeToken || '') || req.session.gameId || '';

  const game = GameStore.getGame(computedGameId);

  if (game) {
    game.leave(req.session.userId, req.session.userName);
    Logging.Game.info(`[Leave] ${req.session.userId} leaved ${computedGameId}`);

    // reset session
    req.session.gameId = '';
    req.session.activeToken = '';

    res.send('');
  } else {
    Logging.Game.warn(
      `[Leave] ${req.session.userId} tried leaving nonexisting game ${computedGameId}`
    );

    // reset session
    req.session.gameId = '';
    req.session.activeToken = '';

    PreGameMessages.error(res, 'Error: Game cannot be found');
  }
});

app.post('/access', async (req, res) => {
  if (requireActiveGame(req, res)) return;

  if (req.session.gameId && !req.session.activeToken) {
    const game = GameStore.getGame(req.session.gameId);
    if (game) {
      Logging.Game.info(`[Access] host accessed ${req.session.gameId}`);
      game.joinHost();
      PreGameMessages.verify(res, req.session.userId);
    } else {
      Logging.Game.warn(
        `[Access] host tried accessing nonexisting game ${req.session.gameId}`
      );
      PreGameMessages.error(res, 'Error: Game cannot be found');
    }
    return;
  }

  if (requireAuthToken(req, res)) return;

  const computedGameId = readAccessToken(req.session.activeToken || '');

  if (computedGameId && req.session.activeToken) {
    const game = GameStore.getGame(computedGameId);
    if (game) {
      Logging.Game.info(`[Access] player accessed ${computedGameId}`);
      game.joinPlayer(req.session.activeToken);
      PreGameMessages.verify(res, req.session.userId);
      return;
    } else {
      Logging.Game.warn(
        `[Access] player tried accessing nonexisting game ${computedGameId}`
      );
      PreGameMessages.error(res, 'Error: Game cannot be found');
    }
  } else {
    Logging.Game.warn(
      `[Access] player tried accessing with wrong token ${computedGameId}`
    );
    PreGameMessages.error(res, 'Error: Token cannot be verified');
  }
});

// Player Management
app.post('/player/register', async (req, res) => {
  const sessionUserId = req.session.userId;
  const { name } = <PreGame.PlayerRegisterBody>req.body;

  // Case 1: player already logged in
  if (sessionUserId) {
    const userName = req.session.userName;

    // Case 1.1: all data already in session
    if (userName) {
      // verify credentials
      const storedName = PlayerStore.getPlayerName(sessionUserId);
      if (storedName === userName) {
        return res.json(<PreGame.PlayerRegisterVerifiedResponse>{ ok: true });
      } else {
        return res.json(<PreGame.PlayerRegisterResponse>{ name: storedName });
      }
    } else {
      // Case 1.2: missing user name, but registered
      const userName = PlayerStore.getPlayerName(sessionUserId);

      if (userName) {
        // set session
        req.session.userName = userName;

        return res.json(<PreGame.PlayerRegisterResponse>{ name: userName });
      }
    }
  }

  // Case 2: registered, not logged in
  const id = PlayerStore.getPlayerId(name);
  if (id) {
    // set session
    req.session.userId = id;
    req.session.userName = name;

    return res.json(<PreGame.PlayerRegisterResponse>{ name: name });
  }

  // Case 3: not registered
  if (name) {
    const newId = uuid();
    const newPlayer: Player = {
      id: newId,
      name
    };

    Logging.Player.info(`player ${newId} registered under name ${name}`);
    PlayerStore.storePlayer(newPlayer);

    // set session
    req.session.userId = newId;
    req.session.userName = name;

    return res.json(<PreGame.PlayerRegisterResponse>{ name: name });
  }

  // Case 4: no registered and no information
  res.json(<PreGame.ErrorResponse>{
    error: 'Not enough information provided for register'
  });
});

app.post('/player/changeName', async (req, res) => {
  const { name } = <PreGame.PlayerRegisterBody>req.body;
  const id = req.session.userId;

  PlayerStore.changePlayerName(id, name);
  Logging.Player.info(`player ${id} changed name to ${name}`);

  res.send(<PreGame.PlayerRegisterResponse>{ name: name });
});

// Game Management
app.get('/game/resolve/wait', (req, res) => {
  if (requireActiveGame(req, res)) return;

  res.send('/api/v1/game/ws/wait?' + req.session.gameId);
});

app.get('/game/resolve/play', (req, res) => {
  if (requireActiveGame(req, res) || requireLogin(req, res)) return;

  res.send(
    '/api/v1/game/ws/play?' + req.session.gameId + '?' + req.session.userId
  );
});

app.get('/game/options/list', (_req, res) => {
  PreGameMessages.optionsList(res);
});

app.post('/game/options', async (req, res) => {
  if (requireActiveGame(req, res)) return;
  const id = req.session.gameId;
  const game = GameStore.getGame(id);

  if (game) {
    game.resolveOptions(<PreGame.OptionsChangeBody>req.body);
    GameStore.storeGame(game);
    Logging.Game.info(`[Options] changed game ${id}`);
    res.send('');
  } else {
    Logging.Game.warn(`[Options] tried changing nonexisting game ${id}`);
    PreGameMessages.error(res, 'Error: Game cannot be found');
  }
});

app.get('/game/start', async (req, res) => {
  if (requireActiveGame(req, res)) return;

  const id = req.session.gameId;
  const game = GameStore.getGame(id);

  if (game) {
    Logging.Game.info(`[Start] ${id}`);
    game.start();
    res.send('');
  } else {
    Logging.Game.warn(`[Start] tried starting nonexisting game ${id}`);
    PreGameMessages.error(res, 'Error: Game cannot be found');
  }
});

app.get('/game/stop', async (req, res) => {
  if (requireActiveGame(req, res)) return;

  const id = req.session.gameId;
  const game = GameStore.getGame(id);

  if (game) {
    Logging.Game.info(`[Stop] ${id}`);
    game.stop();
    res.send('');
  } else {
    Logging.Game.warn(`[Stop] tried stopping nonexisting game ${id}`);
    PreGameMessages.error(res, 'Error: Game cannot be found');
  }
});

app.get('/game/stats', async (req, res) => {
  if (requireLogin(req, res) || requireActiveGame(req, res)) return;

  const id = req.session.gameId;
  const player = req.session.userId;
  const game = GameStore.getGame(id);

  if (game) {
    const stats = game.getStats(player);
    Logging.Game.info(`[Stats] ${player} fetched stats for ${id}`);
    PostGameMessages.stats(res, stats.winner, stats.url);
  } else {
    Logging.Game.warn(
      `[Stats] ${player} tried fetching stats for nonexisting game ${id}`
    );
    PostGameMessages.error(res, 'Error: Game not found');
  }
});

app.get('/game/verify', async (req, res) => {
  if (requireLogin(req, res) || requireActiveGame(req, res)) return;

  const id = req.session.gameId;
  const player = req.session.userId;
  const game = GameStore.getGame(id);

  if (game?.verify(player)) {
    Logging.Game.info(`[Verify] ${player} allowed for ${id}`);
    PreGameMessages.verify(res, req.session.userId);
  } else {
    Logging.Game.warn(
      `[Verify] tried verifying player ${player} on nonexisting game ${id}`
    );
    PreGameMessages.error(res, 'Error: Not allowed to access game');
  }
});

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
