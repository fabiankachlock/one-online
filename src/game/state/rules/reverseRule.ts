import { Card, CARD_TYPE } from "../../cards/type.js";
import { BaseGameRule } from "./baseRule.js";
import { UIEventTypes, UIClientEvent } from "../events/uiEvents.js";
import { GameRulePriority, GameState } from "../../interface.js";
import { placeCardEvent } from "../events/gameEvents.js";
import { CardDeck } from "../../cards/deck.js";
import { BasicGameRule } from "./basicRule.js";


export class ReverseGameRule extends BasicGameRule {

    constructor(
        private supervisor = new BasicGameRule()
    ) {
        super()
    }

    isResponsible = (state: GameState, event: UIClientEvent) => event.event === UIEventTypes.card && event.payload.card.type === CARD_TYPE.reverse

    readonly priority = GameRulePriority.medium

    applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        console.log('REVERSE')

        const result = this.supervisor.applyRule(state, event, pile)

        // reverse
        state.direction = state.direction === 'left' ? 'right' : 'left'

        return result
    }
}