import { Game } from "../type";
import { UIEvent } from '../messages/events';
export declare class GameRunner {
    private game;
    constructor(game: Game);
    handle: (event: UIEvent) => void;
}
