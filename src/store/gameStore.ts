import { Game } from "../game/type";

export type GameStoreType = {
    storeGame: (game: Game) => void;
    getGame: (id: string) => Game | undefined;
    getGameByName: (name: string) => Game | undefined;
    remove: (id: string) => void;
    getPublicGames: () => { name: string, player: number }[];
    all: () => Game[];
}
