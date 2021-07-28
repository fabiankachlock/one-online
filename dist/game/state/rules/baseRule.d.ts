import { GameEvent, GameRule, GameRulePriority, GameState } from "../../interface.js";
import { UIClientEvent } from "../../../../types/client.js";
import { CardDeck } from '../../cards/deck';
export declare abstract class BaseGameRule implements GameRule {
    constructor();
    readonly priority: GameRulePriority;
    isResponsible: (state: GameState, event: UIClientEvent) => boolean;
    getEvents: (state: GameState, event: UIClientEvent) => GameEvent[];
    applyRule: (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        newState: GameState;
        moveCount: number;
    };
}
