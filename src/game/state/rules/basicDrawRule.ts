import { BaseGameRule } from './baseRule.js';
import type { UIClientEvent } from '../../../../types/client';
import { GameEvent, GameRulePriority, GameState } from '../../interface.js';
import { CardDeck } from '../../cards/deck.js';
import { UIEventTypes } from '../events/client.js';
import { GameDrawInteraction } from './common/draw.js';

export class BasicDrawRule extends BaseGameRule {
  name = 'basic-draw';

  private lastEvent: GameEvent | undefined;

  readonly priority = GameRulePriority.low;

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryDraw;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    this.lastEvent = GameDrawInteraction.performDraw(
      state,
      event,
      pile,
      GameDrawInteraction.getDrawAmount(state.topCard.type)
    );

    return {
      newState: state,
      moveCount: 1
    };
  };

  getEvents = (state: GameState, event: UIClientEvent) => {
    if (this.lastEvent) {
      return [this.lastEvent];
    }

    return [];
  };
}
