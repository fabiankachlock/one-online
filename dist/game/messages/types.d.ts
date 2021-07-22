import { Card, Game, Player } from "../type";
export declare const startMessage: (game: Game) => string;
export declare const stopMessage: () => string;
export declare const initGameMessage: (players: Player[], amountOfCards: number, currentPlayer: string, card: Card) => string;
export declare type GameUpdateMessage = {
    currentPlayer: string;
    topCard: Card;
    player: {
        id: string;
        amount: number;
    }[];
    events: {
        type: string;
        players: string[];
    }[];
};
export declare const updateGameMessage: (currentPlayer: string, topCard: Card, player: {
    id: string;
    amount: number;
}[], events: {
    type: string;
    players: string[];
}[]) => string;
