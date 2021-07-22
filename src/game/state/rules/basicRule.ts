import { Card, CARD_TYPE } from "../../cards/type.js";
import { BaseGameRule } from "./gameRule.js";
import { UIEventTypes, UIClientEvent } from "../events/uiEvents.js";
import { GameState } from "../../interface.js";
import { placeCardEvent } from "../events/gameEvents.js";


export class BasicGameRule extends BaseGameRule {

    private isWild = (t: CARD_TYPE) => t === CARD_TYPE.wild || t === CARD_TYPE.wildDraw2 || t === CARD_TYPE.wildDraw4
    private isDraw = (t: CARD_TYPE) => t === CARD_TYPE.draw2 || t === CARD_TYPE.wildDraw2 || t === CARD_TYPE.wildDraw4

    isResponsible = (state: GameState, event: UIClientEvent) => event.event === UIEventTypes.card

    canThrowCard = (card: Card, top: Card): boolean => {
        const fits = card.type === top.type || card.color === top.color

        if (this.isDraw(top.type)) {
            return false;
        }

        return fits || this.isWild(card.type)
    }

    getEvent = (state: GameState, event: UIClientEvent) => placeCardEvent(
        event.playerId,
        event.payload.card,
        event.payload.id,
        this.canThrowCard(event.payload.card, state.topCard)
    )
}