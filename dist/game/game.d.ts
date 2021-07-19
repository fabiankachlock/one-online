import { Game, Player } from "./type";
export declare const NewGame: (name: string, password: string, publicMode: boolean, hostId: string) => Game;
export declare const NewPlayer: (name: string) => Player;
