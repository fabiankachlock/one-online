import { CARD_TYPE } from '../../cards/type.js';
import type { UIClientEvent } from '../../../../types/client';
import { UIEventTypes } from '../events/client.js';
import { GameRulePriority, GameState } from '../../interface.js';
import { CardDeck } from '../../cards/deck.js';
import { BasicGameRule } from './basicRule.js';

export class SkipGameRule extends BasicGameRule {
  constructor(private basicGameRule = new BasicGameRule()) {
    super();
  }

  name = 'skip';

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryPlaceCard &&
    event.payload.card.type === CARD_TYPE.skip;

  readonly priority = GameRulePriority.medium;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    // perform basic place card
    const result = this.basicGameRule.applyRule(state, event, pile);

    return {
      ...result,
      moveCount: result.moveCount > 0 ? 2 : 0 // when card could be place, skip next (by moving two times)
    };
  };
}
