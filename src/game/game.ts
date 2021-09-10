import { v4 as uuid } from 'uuid';
import { GameStateManager } from './state/state.js';
import { GameStoreRef } from './interface.js';
import { GameOptions } from './options.js';
import { GameNotificationManager } from './notificationManager';
import { createRef } from '../store/gameStoreRef.js';
import { Logging } from '../logging/index.js';
import { LoggerInterface } from '../logging/interface.js';
import { mapOptionsKeyToDescription } from './optionDescriptions';
import { GamePlayerManager } from './playerManager.js';

export type GameMeta = {
  running: boolean;
  host: string;
  name: string;
  isPublic: boolean;
};

export type GameStats = {
  winner: string;
  playAgain: Record<string, string>;
};

export class Game {
  private metaData: GameMeta;
  private storeRef: GameStoreRef;
  private notificationManager: GameNotificationManager;
  private stateManager: GameStateManager | undefined;
  private stats: GameStats | undefined;
  private Logger: LoggerInterface;
  public playerManager: GamePlayerManager;

  private constructor(
    name: string,
    password: string,
    host: string,
    isPublic: boolean,
    public readonly key: string = uuid(),
    public readonly options: GameOptions = GameOptions.default()
  ) {
    this.metaData = {
      running: false,
      name,
      host,
      isPublic
    };
    this.storeRef = createRef(this);
    this.storeRef.save();
    this.notificationManager = new GameNotificationManager(this.key);
    this.Logger = Logging.Game.withBadge(
      this.metaData.name.substring(0, 8) + '-' + this.key.substring(0, 8)
    );
    this.playerManager = new GamePlayerManager(host, key, this.Logger, {
      checkPassword: pwd => pwd === password,
      closeGame: () => {
        this.notificationManager.notifyGameStop();
        this.storeRef.destroy();
      },
      onPlayerJoin: this.onPlayerJoined,
      save: this.storeRef.save,
      hotRejoin: playerId => {
        if (this.stateManager) {
          this.stateManager.hotRejoin(playerId);
        } else {
          this.Logger.warn(
            `tried hot rejoin ${playerId} to undefined stateManager`
          );
        }
      }
    });
  }

  get meta() {
    return this.metaData;
  }

  public resolveOptions = (options: Record<string, any>) => {
    this.options.resolveFromMessage(options);

    const active = this.options.allActive;
    this.notificationManager.notifyOptionsChange(
      active.map(mapOptionsKeyToDescription)
    );
  };

  static create = (
    name: string,
    password: string,
    host: string,
    isPublic: boolean
  ): Game => new Game(name, isPublic ? '' : password, host, isPublic);

  public onPlayerJoined = () => {
    this.resolveOptions({}); // send options
    this.notificationManager.notifyPlayerChange(
      this.storeRef.queryPlayers().map(p => ({
        ...p,
        name: `${p.name} ${p.id === this.metaData.host ? '(host)' : ''}`
      }))
    );
  };

  public prepare = () => {
    this.playerManager.prepare();

    if (this.stateManager) {
      this.stateManager.clear();
      this.stateManager = undefined;
    }

    this.stateManager = new GameStateManager(
      this.key,
      this.playerManager.meta,
      this.options.all,
      this.Logger.withBadge('State')
    );
    this.stateManager.prepare();
    this.stateManager.whenFinished(winner => {
      this.metaData.running = false;
      this.stateManager = undefined;

      this.stats = {
        winner:
          this.storeRef.queryPlayers().find(p => p.id === winner)?.name ??
          'noname',
        playAgain: this.playerManager.preparePlayAgain()
      };

      this.playerManager.reset();
    });

    this.stats = undefined;

    this.metaData.running = true;
    this.storeRef.save();

    this.Logger.info(`[Prepared]`);
  };

  public start = () => {
    this.notificationManager.notifyGameStart();
    this.stateManager?.start();

    this.Logger.info(`[Started]`);
  };

  public stop = () => {
    this.notificationManager.notifyGameStop();
    this.storeRef.destroy();

    this.Logger.info(`[Stopped]`);
  };

  public getStats = (forPlayer: string) => {
    return {
      winner: this.stats?.winner ?? 'noname',
      url:
        forPlayer === this.metaData.host ? '../wait_host.html' : '../wait.html'
    };
  };

  public eventHandler = () => (msg: string) => {
    this.Logger.info(`[Event] [Incoming] ${msg}`);
    this.stateManager?.handleEvent(JSON.parse(msg));
  };
}
