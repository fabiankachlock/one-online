import { BaseGameRule } from "./gameRule.js";
import { UIClientEvent } from "../events/uiEvents.js";
import { GameState } from "../../interface.js";
export declare class BasicDrawRule extends BaseGameRule {
    private isDraw;
    private getDrawAmount;
    isResponsible: (state: GameState, event: UIClientEvent) => boolean;
    getEvent: (state: GameState, event: UIClientEvent) => import("../../interface.js").GameEvent;
}
