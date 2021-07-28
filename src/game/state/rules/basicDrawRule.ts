import { Card, CARD_TYPE } from '../../cards/type.js';
import { BaseGameRule } from './baseRule.js';
import type { UIClientEvent } from '../../../../types/client';
import { GameEvent, GameRulePriority, GameState } from '../../interface.js';
import { drawEvent } from '../events/gameEvents.js';
import { CardDeck } from '../../cards/deck.js';
import { UIEventTypes } from '../events/client.js';

export class BasicDrawRule extends BaseGameRule {
  name = 'basic-draw';

  private isDraw = (t: CARD_TYPE) =>
    t === CARD_TYPE.draw2 ||
    t === CARD_TYPE.wildDraw2 ||
    t === CARD_TYPE.wildDraw4;

  private getDrawAmount = (t: string) => parseInt(t.slice(-1));

  private lastEvent: GameEvent | undefined;

  readonly priority = GameRulePriority.low;

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryDraw;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    let drawAmount = 1; // standart draw
    const alreadyActivated = state.stack[state.stack.length - 1].activatedEvent;

    if (this.isDraw(state.topCard.type) && !alreadyActivated) {
      drawAmount = this.getDrawAmount(state.topCard.type);
      state.stack[state.stack.length - 1].activatedEvent = true;
    }

    const cards: Card[] = [];
    for (let i = 0; i < drawAmount; i++) {
      cards.push(pile.draw());
    }

    state.decks[event.playerId].push(...cards);

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
