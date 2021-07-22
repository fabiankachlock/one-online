import { Card } from "../../cards/type.js";
import { GameRule, GameState } from "../../interface.js";
import { emptyEvent } from "../events/gameEvents.js";
import { UIClientEvent } from "../events/uiEvents.js";


export abstract class BaseGameRule implements GameRule {
    constructor() { }

    isAllowedToDraw = (state: GameState, event: UIClientEvent) => true;
    isResponsible = (state: GameState, event: UIClientEvent) => false;
    canThrowCard = (card: Card, top: Card) => true;
    getEvent = (state: GameState, event: UIClientEvent) => emptyEvent();
}