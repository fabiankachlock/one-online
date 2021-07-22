import { Card } from "../../cards/type.js";
import { BaseGameRule } from "./gameRule.js";
import { UIClientEvent } from "../events/uiEvents.js";
import { GameState } from "../../interface.js";
export declare class BasicGameRule extends BaseGameRule {
    private isWild;
    private isDraw;
    isResponsible: (state: GameState, event: UIClientEvent) => boolean;
    canThrowCard: (card: Card, top: Card) => boolean;
    getEvent: (state: GameState, event: UIClientEvent) => import("../../interface.js").GameEvent;
}
