import { Card, CARD_TYPE } from "../../cards/type.js";
import { BaseGameRule } from "./baseRule.js";
import { UIEventTypes, UIClientEvent } from "../../../../types/client.js";
import { GameRulePriority, GameState } from "../../interface.js";
import { placeCardEvent } from "../events/gameEvents.js";
import { CardDeck } from "../../cards/deck.js";


export class BasicGameRule extends BaseGameRule {

    private static isWild = (t: CARD_TYPE) => t === CARD_TYPE.wild || t === CARD_TYPE.wildDraw2 || t === CARD_TYPE.wildDraw4
    private static isDraw = (t: CARD_TYPE) => t === CARD_TYPE.draw2 || t === CARD_TYPE.wildDraw2 || t === CARD_TYPE.wildDraw4

    isResponsible = (state: GameState, event: UIClientEvent) => event.event === UIEventTypes.card

    readonly priority = GameRulePriority.low

    public static readonly canThrowCard = (card: Card, top: Card, activatedTop: boolean): boolean => {
        const fits = card.type === top.type || card.color === top.color

        if (BasicGameRule.isDraw(top.type) && !activatedTop) {
            return false;
        }

        return fits || BasicGameRule.isWild(card.type)
    }

    public applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        const allowed = BasicGameRule.canThrowCard(<Card>event.payload.card, state.topCard, state.stack[state.stack.length - 1].activatedEvent)

        if (allowed) {

            state.stack.push({
                card: <Card>event.payload.card,
                activatedEvent: false
            })
            state.topCard = <Card>event.payload.card

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
        <Card>event.payload.card,
        event.payload.id,
        BasicGameRule.canThrowCard(<Card>event.payload.card, state.topCard, state.stack[state.stack.length - 1].activatedEvent)
    )]
}