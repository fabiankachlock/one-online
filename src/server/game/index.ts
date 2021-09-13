import { HandleGameName } from './name';
import { GameOptionsApiHandler } from './options';
import { HandlePlayResolve, HandleWaitResolve } from './resolve';
import { HandleGameStart } from './start';
import { HandleGameStats } from './stats';
import { HandleGameStop } from './stop';
import { HandleGameVerify } from './verify';

export const GameApiHandler = {
  options: GameOptionsApiHandler,
  start: HandleGameStart,
  stop: HandleGameStop,
  verify: HandleGameVerify,
  stats: HandleGameStats,
  name: HandleGameName,
  resolve: {
    wait: HandleWaitResolve,
    play: HandlePlayResolve
  }
};
