import { Card } from "../../cards/type.js";
import { GameRule, GameState } from "../../interface.js";
import { UIClientEvent } from "../events/uiEvents.js";
export declare abstract class BaseGameRule implements GameRule {
    constructor();
    isAllowedToDraw: (state: GameState, event: UIClientEvent) => boolean;
    isResponsible: (state: GameState, event: UIClientEvent) => boolean;
    canThrowCard: (card: Card, top: Card) => boolean;
    getEvent: (state: GameState, event: UIClientEvent) => import("../../interface.js").GameEvent;
}
