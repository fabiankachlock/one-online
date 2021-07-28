import { Card } from "../../cards/type.js";
import { BaseGameRule } from "./baseRule.js";
import { UIClientEvent } from "../../../../types/client.js";
import { GameRulePriority, GameState } from "../../interface.js";
import { CardDeck } from "../../cards/deck.js";
export declare class BasicGameRule extends BaseGameRule {
    private static isWild;
    private static isDraw;
    isResponsible: (state: GameState, event: UIClientEvent) => boolean;
    readonly priority: GameRulePriority;
    static readonly canThrowCard: (card: Card, top: Card, activatedTop: boolean) => boolean;
    applyRule: (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        newState: GameState;
        moveCount: number;
    };
    getEvents: (state: GameState, event: UIClientEvent) => import("../../interface.js").GameEvent[];
}
