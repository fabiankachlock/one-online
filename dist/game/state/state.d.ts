import { CardDeck } from "../cards/deck.js";
import { GameMeta } from "../game.js";
import { GameOptionsType } from "../options.js";
import { UIClientEvent } from "../../../types/client.js";
export declare class GameStateManager {
    private gameId;
    private metaData;
    private options;
    private readonly pile;
    private state;
    private notificationManager;
    private players;
    private readonly rules;
    constructor(gameId: string, metaData: GameMeta, options: GameOptionsType, pile?: CardDeck);
    prepare: () => void;
    start: () => void;
    clear: () => void;
    private finishHandler;
    whenFinished: (handler: (winner: string) => void) => void;
    handleEvent: (event: UIClientEvent) => void;
    private gameFinished;
    private finishGame;
    private getResponsibleRules;
    private getProritiesedRules;
}
