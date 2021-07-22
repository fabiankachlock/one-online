import { CardDeck } from "../cards/deck.js";
import { GameMeta } from "../game.js";
import { GameOptionsType } from "../options.js";
import { UIClientEvent } from "./events/uiEvents.js";
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
    handleEvent: (event: UIClientEvent) => void;
    private handlePlaceCard;
}
