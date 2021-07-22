import { Player } from "./players/player.js";
export declare class GameNotificationManager {
    gameId: string;
    constructor(gameId: string);
    notifyPlayerChange: (players: Player[]) => void;
    notifyGameStart: () => void;
    notifyGameStop: () => void;
}
