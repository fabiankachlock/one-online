import { Player } from "../game/type";
export declare const PlayerStore: {
    storePlayer: (player: Player) => void;
    getPlayerId: (name: string) => string | undefined;
    getPlayerName: (id: string) => string | undefined;
    changePlayerName: (id: string, newName: string) => void;
    all: () => [string, string][];
};
