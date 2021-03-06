import schedule from 'node-schedule';
import { Logging } from './logging/index.js';
import { GameStore } from './store/implementations/gameStore/index';
import { PlayerStore } from './store/implementations/playerStore/index';
import { TokenStore } from './store/implementations/accessToken/index';

export const startMemoryWatcher = (isDev: boolean) => {
  if (isDev) {
    Logging.Watcher.addBadge('DEV');
  } else {
    return;
  }

  const watcher = schedule.scheduleJob('*/30 * * * * *', function () {
    Logging.Watcher.info('--- BEGIN REPORT ---');

    const games = GameStore.all();
    const players = PlayerStore.all();
    const tokens = TokenStore.all();

    Logging.Watcher.info(
      `${games.length} Games stored - ${
        games.filter(g => g.meta.running).length
      } running`
    );
    Logging.Watcher.info(`${players.length} Players stored`);
    Logging.Watcher.info(`${tokens.length} active Tokens stored`);
    Logging.Watcher.info('--- END REPORT ---');
  });
};
