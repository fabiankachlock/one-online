import { Card, CARD_TYPE } from "../../cards/type.js";
import { BaseGameRule } from "./gameRule.js";
import { UIEventTypes, UIClientEvent } from "../events/uiEvents.js";
import { GameState } from "../../interface.js";
import { internalDrawEvent } from "../events/gameEvents.js";


export class BasicDrawRule extends BaseGameRule {

    private isDraw = (t: CARD_TYPE) => t === CARD_TYPE.draw2 || t === CARD_TYPE.wildDraw2 || t === CARD_TYPE.wildDraw4

    private getDrawAmount = (t: string) => parseInt(t.slice(-1));

    isResponsible = (state: GameState, event: UIClientEvent) => event.event === UIEventTypes.draw

    getEvent = (state: GameState, event: UIClientEvent) => {
        let drawAmount = 1 // standart draw

        if (this.isDraw(state.topCard.type)) {
            drawAmount = this.getDrawAmount(state.topCard.type)
        }

        return internalDrawEvent(event.playerId, drawAmount, Infinity)
    }
}