import { Card, CARD_TYPE } from "../../cards/type.js";
import { BaseGameRule } from "./baseRule.js";
import { UIEventTypes, UIClientEvent } from "../events/uiEvents.js";
import { GameEvent, GameRulePriority, GameState } from "../../interface.js";
import { drawEvent, internalDrawEvent } from "../events/gameEvents.js";
import { CardDeck } from "../../cards/deck.js";


export class BasicDrawRule extends BaseGameRule {

    private isDraw = (t: CARD_TYPE) => t === CARD_TYPE.draw2 || t === CARD_TYPE.wildDraw2 || t === CARD_TYPE.wildDraw4

    private getDrawAmount = (t: string) => parseInt(t.slice(-1));

    private lastEvent: GameEvent | undefined

    readonly priority = GameRulePriority.low

    isResponsible = (state: GameState, event: UIClientEvent) => event.event === UIEventTypes.draw

    applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        let drawAmount = 1 // standart draw

        if (this.isDraw(state.topCard.type)) {
            drawAmount = this.getDrawAmount(state.topCard.type)
        }

        const cards: Card[] = []
        for (let i = 0; i < drawAmount; i++) {
            cards.push(pile.draw())
        }

        state.decks[event.playerId].push(...cards)

        this.lastEvent = drawEvent(event.playerId, cards)

        return {
            newState: state,
            moveCount: 1
        }
    }

    getEvents = (state: GameState, event: UIClientEvent) => {
        if (this.lastEvent) {
            return [this.lastEvent]
        }

        return []
    }
}