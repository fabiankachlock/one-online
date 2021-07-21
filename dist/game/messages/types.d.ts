import { Card, Game, Player } from "../type";
export declare const startMessage: (game: Game) => string;
export declare const stopMessage: () => string;
export declare const initGameMessage: (players: Player[], amountOfCards: number, currentPlayer: string, card: Card) => string;
