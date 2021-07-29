import { Logger } from './logger.js';

export const Logging = {
  Server: new Logger('Server'),
  Hit: new Logger('Hit'),
  Game: new Logger('Game'),
  Player: new Logger('Player'),
  Websocket: new Logger('Websockets'),
  App: new Logger(''),
  PlayerStore: new Logger('Store', 'Player'),
  GamesStore: new Logger('Store', 'Games'),
  TokenStore: new Logger('Store', 'Token'),
  Watcher: new Logger('Watcher')
};
