import { GameOptions } from './options.js';
export declare type GameMeta = {
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
export declare type GameStats = {
    winner: string;
};
export declare class Game {
    readonly name: string;
    private readonly password;
    readonly host: string;
    readonly isPublic: boolean;
    readonly key: string;
    readonly options: GameOptions;
    private metaData;
    private storeRef;
    private notificationManager;
    private stateManager;
    private stats;
    private preparedPlayers;
    private constructor();
    get meta(): GameMeta;
    isReady: (playerAmount: number) => boolean;
    static create: (name: string, password: string, host: string, isPublic: boolean) => Game;
    preparePlayer: (playerId: string, name: string, password: string, token: string) => boolean;
    playerJoined: (token: string) => void;
    joinedWaiting: () => void;
    leave: (playerId: string, name: string) => void;
    verify: (playerId: string) => boolean;
    prepare: () => void;
    start: () => void;
    stop: () => void;
    getStats: (forPlayer: string) => {
        winner: string;
        playAgainUrl: string;
    };
    private constructPlayerLinks;
    eventHandler: () => (msg: string) => void;
}
