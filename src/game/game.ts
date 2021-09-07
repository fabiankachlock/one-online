import { v4 as uuid } from 'uuid';
import { GameStateManager } from './state/state.js';
import { GameStoreRef } from './interface.js';
import { GameOptions } from './options.js';
import { GameNotificationManager } from './notificationManager';
import { createRef } from '../store/gameStoreRef.js';
import { createAccessToken } from '../store/accessToken';
import { Logging } from '../logging/index.js';
import { LoggerInterface } from '../logging/interface.js';
import { mapOptionsKeyToDescription } from './optionDescriptions';

export type GameMeta = {
  playerCount: number;
  running: boolean;
  players: Set<string>;
  playerLinks: {
    [id: string]: {
      left: string;
      right: string;
    };
  };
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
  private preparedPlayers: Record<string, string> = {};
  private Logger: LoggerInterface;

  private constructor(
    public readonly name: string,
    private readonly password: string,
    public readonly host: string,
    public readonly isPublic: boolean,
    public readonly key: string = uuid(),
    public readonly options: GameOptions = GameOptions.default()
  ) {
    this.metaData = {
      playerCount: 1,
      players: new Set(),
      running: false,
      playerLinks: {}
    };
    this.metaData.players.add(host);
    this.storeRef = createRef(this);
    this.storeRef.save();
    this.notificationManager = new GameNotificationManager(this.key);
    this.Logger = Logging.Game.withBadge(
      this.name.substring(0, 8) + '-' + this.key.substring(0, 8)
    );
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

  public isReady = (playerAmount: number) =>
    this.metaData.playerCount === playerAmount;

  static create = (
    name: string,
    password: string,
    host: string,
    isPublic: boolean
  ): Game => new Game(name, isPublic ? '' : password, host, isPublic);

  public preparePlayer = (
    playerId: string,
    name: string,
    password: string,
    token: string
  ): boolean => {
    if (
      !this.isPublic &&
      (password !== this.password || !this.storeRef.checkPlayer(playerId, name))
    )
      return false;

    this.preparedPlayers[token] = playerId;

    this.storeRef.save();
    return true;
  };

  public joinPlayer = (token: string) => {
    const playerId = this.preparedPlayers[token];

    if (playerId) {
      this.metaData.players.add(playerId);
      this.metaData.playerCount = this.metaData.players.size;

      this.onPlayerJoined();
      this.storeRef.save();
    }
  };

  public joinHost = () => {
    this.metaData.players.add(this.host);
    this.metaData.playerCount = this.metaData.players.size;

    this.onPlayerJoined();
    this.storeRef.save();
  };

  public onPlayerJoined = () => {
    this.resolveOptions({}); // send options
    this.notificationManager.notifyPlayerChange(
      this.storeRef.queryPlayers().map(p => ({
        ...p,
        name: `${p.name} ${p.id === this.host ? '(host)' : ''}`
      }))
    );
  };

  public leave = (playerId: string, name: string) => {
    if (playerId === this.host) {
      this.Logger.warn('host left game');
      this.stop();
      return;
    }

    if (!this.storeRef.checkPlayer(playerId, name)) return;

    this.metaData.players.delete(playerId);
    this.metaData.playerCount -= 1;

    this.notificationManager.notifyPlayerChange(this.storeRef.queryPlayers());

    if (
      this.metaData.playerCount <= 0 &&
      !(this.host in this.preparedPlayers)
    ) {
      this.notificationManager.notifyGameStop();
      this.storeRef.destroy();
      return;
    }

    this.storeRef.save();
  };

  public verify = (playerId: string): boolean =>
    this.metaData.players.has(playerId);

  public prepare = () => {
    this.constructPlayerLinks();

    if (this.stateManager) {
      this.stateManager.clear();
      this.stateManager = undefined;
    }

    this.stateManager = new GameStateManager(
      this.key,
      this.meta,
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
        playAgain: this.preparePlayAgain()
      };

      this.metaData.players.clear();
      this.metaData.playerCount = 0;
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
      url: forPlayer === this.host ? '../wait_host.html' : '../wait.html'
    };
  };

  private preparePlayAgain = (): Record<string, string> => {
    const playerIdMap: Record<string, string> = {};
    const playerMeta = Object.entries(this.preparedPlayers).map(
      ([token, id]) => ({ token, id })
    );

    for (const player of this.metaData.players) {
      // reuse tokens
      playerIdMap[player] =
        playerMeta.find(entry => entry.id === player)?.token || '';
    }

    this.preparedPlayers[this.host] = this.key;

    this.Logger.info(`[Prepared] for play again`);
    return playerIdMap;
  };

  private constructPlayerLinks = () => {
    const players = Array.from(this.metaData.players);
    this.metaData.playerLinks = {};

    players.forEach((p, index) => {
      let leftLink: string;
      if (index < players.length - 1) {
        leftLink = players[index + 1];
      } else {
        leftLink = players[0];
      }

      let rightLink: string;
      if (index > 0) {
        rightLink = players[index - 1];
      } else {
        rightLink = players[players.length - 1];
      }

      this.metaData.playerLinks[p] = {
        left: leftLink,
        right: rightLink
      };
    });
  };

  public eventHandler = () => (msg: string) => {
    this.Logger.info(`[Event] [Incoming] ${msg}`);
    this.stateManager?.handleEvent(JSON.parse(msg));
  };
}
