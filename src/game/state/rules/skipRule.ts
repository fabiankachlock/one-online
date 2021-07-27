import { CARD_TYPE } from "../../cards/type.js";
import { UIEventTypes, UIClientEvent } from "../events/uiEvents.js";
import { GameRulePriority, GameState } from "../../interface.js";
import { CardDeck } from "../../cards/deck.js";
import { BasicGameRule } from "./basicRule.js";


export class SkipGameRule extends BasicGameRule {

    constructor(
        private supervisor = new BasicGameRule()
    ) {
        super()
    }

    isResponsible = (state: GameState, event: UIClientEvent) => event.event === UIEventTypes.card && event.payload.card.type === CARD_TYPE.skip

    readonly priority = GameRulePriority.medium

    applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
        const result = this.supervisor.applyRule(state, event, pile)

        return {
            ...result,
            moveCount: result.moveCount > 0 ? 2 : 0
        }
    }
}