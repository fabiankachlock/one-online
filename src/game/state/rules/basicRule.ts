import { Card, CARD_TYPE } from '../../cards/type.js';
import { BaseGameRule } from './baseRule.js';
import type { UIClientEvent } from '../../../../types/client';
import { UIEventTypes } from '../events/client.js';
import { GameRulePriority, GameState } from '../../interface.js';
import { placeCardEvent } from '../events/gameEvents.js';
import { CardDeck } from '../../cards/deck.js';
import { CardType } from './common/card.js';
import { GameInteraction } from './common/interaction.js';

export class BasicGameRule extends BaseGameRule {
  name = 'basic-game';

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryPlaceCard;

  readonly priority = GameRulePriority.low;

  public applyRule = (
    state: GameState,
    event: UIClientEvent,
    pile: CardDeck
  ) => {
    if (event.event !== UIEventTypes.tryPlaceCard) {
      return {
        newState: state,
        moveCount: 0
      };
    }

    const allowed = GameInteraction.canThrowCard(
      event.playerId,
      <Card>event.payload.card,
      state
    );

    if (allowed) {
      GameInteraction.placeCard(
        <Card>event.payload.card,
        event.playerId,
        state
      );
    }

    return {
      newState: state,
      moveCount: allowed ? 1 : 0
    };
  };

  getEvents = (state: GameState, event: UIClientEvent) =>
    event.event !== UIEventTypes.tryPlaceCard
      ? []
      : [
          placeCardEvent(
            event.playerId,
            <Card>event.payload.card,
            event.payload.id,
            GameInteraction.canThrowCard(
              event.playerId,
              <Card>event.payload.card,
              state
            )
          )
        ];
}
