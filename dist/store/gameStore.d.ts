import { Game } from "../game/type";
export declare const GameStore: {
    storeGame: (game: Game) => void;
    getGame: (id: string) => Game | undefined;
    getGameByName: (name: string) => Game | undefined;
    getPublics: () => {
        name: string;
        player: number;
    }[];
    all: () => Game[];
};
