import { BaseGameRule } from './baseRule.js';
import type { UIClientEvent } from '../../../../types/client';
import {
  GameEvent,
  GameInterrupt,
  GameInterruptReason,
  GameRulePriority,
  GameState
} from '../../interface.js';
import { CardDeck } from '../../cards/deck.js';
import { UIEventTypes } from '../events/client.js';
import { drawEvent } from '../events/gameEvents.js';
import { Card } from '../../cards/type.js';
import { OptionKey } from '../../options.js';

export class UnoButtonRule extends BaseGameRule {
  name = 'uno-button-press';

  associatedRule = OptionKey.penaltyCard;

  readonly priority = GameRulePriority.low;

  readonly timeoutInterval: number = 2000;
  readonly penaltyCards: number = 2;

  private interrupts: Record<string, NodeJS.Timeout> = {};
  private interruptCancelled: Set<string> = new Set();
  private cardsAmounts: Record<string, number> = {};

  onGameUpdate = (state: GameState, outgoingEvents: GameEvent[]) => {
    // check for players with 0 cards --> setup timeout
    for (const [playerId, deck] of Object.entries(state.decks)) {
      if (deck.length === this.cardsAmounts[playerId]) continue;
      else {
        // detect card amount change --> reset interrupt state
        this.cardsAmounts[playerId] = deck.length;
        this.interruptCancelled.delete(playerId);
        delete this.interrupts[playerId];
      }

      // only setup interrupt when one card is left && the interrupt inst already cancelled
      if (deck.length === 1 && !this.interruptCancelled.has(playerId)) {
        this.interrupts[playerId] = setTimeout(
          () => this.handleTimeout(playerId),
          this.timeoutInterval
        );
      }
    }
  };

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.uno;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    // clear timeout --> remove penalty
    if (this.interrupts[event.playerId]) {
      clearTimeout(this.interrupts[event.playerId]);
      delete this.interrupts[event.playerId];
      this.interruptCancelled.add(event.playerId);
    }

    return {
      newState: state,
      moveCount: 0
    };
  };

  private handleTimeout = (playerId: string) => {
    // timeout exceed --> interrupt game & send penalty
    delete this.interrupts[playerId];
    this.interruptGame({
      reason: GameInterruptReason.unoExpire,
      targetPlayers: [playerId]
    });
  };

  isResponsibleForInterrupt = (interrupt: GameInterrupt) =>
    interrupt.reason === GameInterruptReason.unoExpire;

  onInterrupt = (
    interrupt: GameInterrupt,
    state: GameState,
    pile: CardDeck
  ) => {
    const events: GameEvent[] = [];

    // send penalty cards
    for (const pId of interrupt.targetPlayers) {
      const cards: Card[] = [];
      for (let i = 0; i < this.penaltyCards; i++) {
        cards.push(pile.draw());
      }

      state.decks[pId].push(...cards);
      events.push(drawEvent(pId, cards));
    }

    return {
      newState: state,
      moveCount: 0,
      events: events
    };
  };
}
