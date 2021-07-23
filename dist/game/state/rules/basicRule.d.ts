import { BaseGameRule } from "./baseRule.js";
import { UIClientEvent } from "../events/uiEvents.js";
import { GameRulePriority, GameState } from "../../interface.js";
import { CardDeck } from "../../cards/deck.js";
export declare class BasicGameRule extends BaseGameRule {
    private isWild;
    private isDraw;
    isResponsible: (state: GameState, event: UIClientEvent) => boolean;
    readonly priority: GameRulePriority;
    private canThrowCard;
    applyRule: (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        newState: GameState;
        moveCount: number;
    };
    getEvents: (state: GameState, event: UIClientEvent) => import("../../interface.js").GameEvent[];
}
