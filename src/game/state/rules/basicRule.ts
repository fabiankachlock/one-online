import { Card, CARD_TYPE } from "../../cards/type.js";
import { BaseGameRule } from "./baseRule.js";
import { UIEventTypes, UIClientEvent } from "../events/uiEvents.js";
import { GameRulePriority, GameState } from "../../interface.js";
import { placeCardEvent } from "../events/gameEvents.js";
import { CardDeck } from "../../cards/deck.js";


export class BasicGameRule extends BaseGameRule {

    private isWild = (t: CARD_TYPE) => t === CARD_TYPE.wild || t === CARD_TYPE.wildDraw2 || t === CARD_TYPE.wildDraw4
    private isDraw = (t: CARD_TYPE) => t === CARD_TYPE.draw2 || t === CARD_TYPE.wildDraw2 || t === CARD_TYPE.wildDraw4

    isResponsible = (state: GameState, event: UIClientEvent) => event.event === UIEventTypes.card

    readonly priority = GameRulePriority.low

    private canThrowCard = (card: Card, top: Card): boolean => {
        const fits = card.type === top.type || card.color === top.color

        if (this.isDraw(top.type)) {
            return false;
        }

        return fits || this.isWild(card.type)
    }

    applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        const allowed = this.canThrowCard(event.payload.card, state.topCard)
        if (allowed) {
            state.stack.push(state.topCard)
            state.topCard = event.payload.card

            const cardIndex = state.decks[event.playerId].findIndex(c => c.type === event.payload.card.type && c.color === event.payload.card.color)
            state.decks[event.playerId].splice(cardIndex, 1)
        }

        return {
            newState: state,
            moveCount: allowed ? 1 : 0
        }
    }

    getEvents = (state: GameState, event: UIClientEvent) => [placeCardEvent(
        event.playerId,
        event.payload.card,
        event.payload.id,
        this.canThrowCard(event.payload.card, state.topCard)
    )]
}