import { Game } from "../game/game.js";

export type GameStoreType = {
    storeGame: (game: Game) => void;
    getGame: (id: string) => Game | undefined;
    remove: (id: string) => void;
    has: (id: string) => boolean;
    getPublicGames: () => { name: string, id: string, player: number }[];
    all: () => Game[];
}
