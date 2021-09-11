import { Card, CARD_TYPE } from '../../cards/type.js';
import { BaseGameRule } from './baseRule.js';
import type { UIClientEvent } from '../../../../types/client';
import { GameEvent, GameRulePriority, GameState } from '../../interface.js';
import { drawEvent } from '../events/gameEvents.js';
import { CardDeck } from '../../cards/deck.js';
import { UIEventTypes } from '../events/client.js';
import { CardType } from './common/card.js';
import { GameDrawInteraction } from './common/draw.js';

export class BasicDrawRule extends BaseGameRule {
  name = 'basic-draw';

  private lastEvent: GameEvent | undefined;

  readonly priority = GameRulePriority.low;

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryDraw;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    let drawAmount = 1; // standard draw
    const alreadyActivated = state.stack[state.stack.length - 1].activatedEvent;

    // only draw, if the top card is draw card and not already drawn
    if (CardType.isDraw(state.topCard.type) && !alreadyActivated) {
      // determine amount and mark card as activated
      drawAmount = GameDrawInteraction.getDrawAmount(state.topCard.type);
      state.stack[state.stack.length - 1].activatedEvent = true;
    }

    // draw cards
    const cards: Card[] = [];
    for (let i = 0; i < drawAmount; i++) {
      cards.push(pile.draw());
    }

    // give cards to player
    if (event.playerId in state.decks) {
      state.decks[event.playerId].push(...cards);
    }

    // store event
    this.lastEvent = drawEvent(event.playerId, cards);

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
