import { shuffle } from '../lib/shuffle';
import { LoggerInterface } from '../logging/interface';

export type GamePlayerMeta = {
  playerCount: number;
  players: Set<string>;
  noHost: boolean;
  playerLinks: {
    [id: string]: {
      left: string;
      right: string;
      order: number;
    };
  };
};

export class GamePlayerManager {
  private metaData: GamePlayerMeta = {
    playerCount: 0,
    playerLinks: {},
    players: new Set(),
    noHost: true
  };

  private preparedPlayers: Record<string, string> = {};

  private Logger: LoggerInterface;

  constructor(
    private host: string,
    private key: string,
    logger: LoggerInterface,
    private forward: {
      checkPassword: (pwd: string) => boolean;
      onPlayerJoin: () => void;
      closeGame: () => void;
      save: () => void;
      hotRejoin: (playerId: string) => void;
    }
  ) {
    // prepare host
    this.preparedPlayers[key] = host;
    this.Logger = logger.withBadge('Players');
  }

  get meta(): GamePlayerMeta {
    return this.metaData;
  }

  public isReady = (playerAmount: number): boolean => {
    return this.metaData.playerCount === playerAmount;
  };

  public registerPlayer = (
    playerId: string,
    password: string,
    token: string
  ): boolean => {
    if (!this.forward.checkPassword(password)) {
      return false;
    }

    this.preparedPlayers[token] = playerId;
    this.forward.save();
    return true;
  };

  public joinPlayer = (token: string) => {
    const playerId = this.preparedPlayers[token];

    if (playerId) {
      this.storePlayer(playerId);
    } else {
      this.Logger.warn(`${playerId} tried joining without being registered`);
    }
  };

  public joinHost = (id: string) => {
    if (id === this.host) {
      this.metaData.noHost = false;
      this.storePlayer(this.host);
    } else {
      this.Logger.warn(`${id} tried joining as host without being the host`);
    }
  };

  private storePlayer = (id: string) => {
    this.metaData.players.add(id);
    this.metaData.playerCount = this.metaData.players.size;
    this.forward.onPlayerJoin();
    this.forward.save();
  };

  public leavePlayer = (playerId: string) => {
    if (playerId === this.host) {
      this.Logger.warn('host left game');
      this.metaData.noHost = true;
    }

    this.metaData.players.delete(playerId);
    this.metaData.playerCount = this.metaData.players.size;
    this.forward.onPlayerJoin();

    if (this.metaData.playerCount === 0 && this.host! in this.preparedPlayers) {
      this.forward.closeGame();
      return;
    }
    this.forward.save();
  };

  public verifyPlayer = (playerId: string) =>
    this.metaData.players.has(playerId);

  public rejoin = (playerId: string) => {
    if (this.metaData.players.has(playerId)) {
      this.forward.hotRejoin(playerId);
    } else {
      this.Logger.warn(`${playerId} tried hot rejoin without being registered`);
    }
  };

  public prepare = () => {
    this.constructPlayerLinks();
  };

  public reset = () => {
    this.metaData.playerLinks = {};
    this.metaData.noHost = true;
    this.preparedPlayers = {};
    this.preparedPlayers[this.key] = this.host;
  };

  public preparePlayAgain = (): Record<string, string> => {
    const playerIdMap: Record<string, string> = {};
    const playerMeta = Object.entries(this.preparedPlayers)
      .map(([token, id]) => ({ token, id }))
      .filter(entry => this.metaData.players.has(entry.id));

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
    const players = shuffle(Array.from(this.metaData.players));
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
        right: rightLink,
        order: index
      };
    });
  };
}
