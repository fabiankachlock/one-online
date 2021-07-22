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
    private constructor();
    get meta(): GameMeta;
    isReady: (playerAmount: number) => boolean;
    static create: (name: string, password: string, host: string, isPublic: boolean) => Game;
    join: (playerId: string, name: string, password: string) => boolean;
    joinedWaiting: () => void;
    leave: (playerId: string, name: string) => void;
    verify: (playerId: string) => boolean;
    prepare: () => void;
    start: () => void;
    stop: () => void;
    private constructPlayerLinks;
    eventHandler: () => (msg: string) => void;
}
