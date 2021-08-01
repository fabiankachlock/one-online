import { BaseGameRule } from './baseRule.js';
import type { UIClientEvent } from '../../../../types/client';
import { GameRulePriority, GameState } from '../../interface.js';
import { CardDeck } from '../../cards/deck.js';
import { UIEventTypes } from '../events/client.js';

export class UnoButtonRule extends BaseGameRule {
  name = 'uno-button-press';

  readonly priority = GameRulePriority.low;

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.uno;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    // setup Interrupt
    return {
      newState: state,
      moveCount: 0
    };
  };

  getEvents = (state: GameState, event: UIClientEvent) => [];
}
