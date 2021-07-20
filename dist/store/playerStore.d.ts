import { Player } from "../game/type";
export declare type PlayerStoreType = {
    storePlayer: (player: Player) => void;
    getPlayerId: (name: string) => string | undefined;
    getPlayerName: (id: string) => string | undefined;
    changePlayerName: (id: string, newName: string) => void;
    all: () => Player[];
};
