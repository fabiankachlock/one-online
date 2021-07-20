import { Game, GameOptions, Player } from "./type";
export declare const NewGame: (options: GameOptions) => Game;
export declare const NewPlayer: (name: string) => Player;
export declare const prepareGame: (game: Game) => Game;
