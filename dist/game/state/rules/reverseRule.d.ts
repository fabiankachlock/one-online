import { UIClientEvent } from "../../../../types/client.js";
import { GameRulePriority, GameState } from "../../interface.js";
import { CardDeck } from "../../cards/deck.js";
import { BasicGameRule } from "./basicRule.js";
export declare class ReverseGameRule extends BasicGameRule {
    private supervisor;
    constructor(supervisor?: BasicGameRule);
    isResponsible: (state: GameState, event: UIClientEvent) => boolean;
    readonly priority: GameRulePriority;
    applyRule: (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        moveCount: number;
        newState: GameState;
    };
}
