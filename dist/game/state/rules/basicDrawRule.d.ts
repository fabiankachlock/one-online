import { BaseGameRule } from "./baseRule.js";
import { UIClientEvent } from "../../../../types/client.js";
import { GameEvent, GameRulePriority, GameState } from "../../interface.js";
import { CardDeck } from "../../cards/deck.js";
export declare class BasicDrawRule extends BaseGameRule {
    private isDraw;
    private getDrawAmount;
    private lastEvent;
    readonly priority: GameRulePriority;
    isResponsible: (state: GameState, event: UIClientEvent) => boolean;
    applyRule: (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        newState: GameState;
        moveCount: number;
    };
    getEvents: (state: GameState, event: UIClientEvent) => GameEvent[];
}
