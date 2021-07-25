import { Card } from "../cards/type.js";
import { GameState } from "../interface.js";
import { Player } from "../players/player.js";
export declare class GameStateNotificationManager {
    gameId: string;
    constructor(gameId: string);
    notifyGameUpdate: (players: Player[], currentPlayer: string, topCard: Card, direction: 'left' | 'right', playerCards: {
        id: string;
        amount: number;
    }[], events: {
        type: string;
        payload: {};
        players: string[];
    }[]) => void;
    notifyGameInit: (players: Player[], state: GameState) => void;
}
