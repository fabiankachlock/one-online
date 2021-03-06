import { CARD_TYPE } from '../../cards/type.js';
import type { UIClientEvent } from '../../../../types/client';
import { UIEventTypes } from '../events/client.js';
import { GameRulePriority, GameState } from '../../interface.js';
import { CardDeck } from '../../cards/deck.js';
import { BasicGameRule } from './basicRule.js';

export class ReverseGameRule extends BasicGameRule {
  constructor(private basicGameRule = new BasicGameRule()) {
    super();
  }

  name = 'reverse';

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryPlaceCard &&
    event.payload.card.type === CARD_TYPE.reverse;

  readonly priority = GameRulePriority.medium;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    // perform basic place card
    const result = this.basicGameRule.applyRule(state, event, pile);

    // if allowed -> reverse game direction
    if (result.moveCount > 0) {
      state.direction = state.direction === 'left' ? 'right' : 'left';
    }

    return {
      ...result,
      moveCount:
        result.moveCount > 0
          ? Object.keys(state.decks).length === 2
            ? 0 // only two players -> stay at the current
            : 1 // more than two players -> move to the next
          : 0
    };
  };
}
