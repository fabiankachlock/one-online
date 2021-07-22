import { Player } from "./players/player.js";

export interface GameRule {

}

export interface GameStoreRef {
    save(): void;
    checkPlayer(id: string, name: string): boolean;
    queryPlayers(): Player[];
    destroy(): void;
}