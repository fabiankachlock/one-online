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

/**
 * How this works:
 *
 * Whenever some game update occurs every players card count gets checked.
 * > If it changed, all timeouts get deleted (example player had to draw a second card).
 * > If the current count is 1 a interrupt get's scheduled
 *
 * When some player hits the uno button, this rule get's applied.
 * > This will cancel the interrupt and all is fine.
 *
 * When some timeout exceeds the game gets interrupted.
 * > The interrupt handler will catch teh interrupt and send the penalty cards to the player.
 */

export class UnoButtonRule extends BaseGameRule {
  name = 'uno-button-press';

  associatedRule = OptionKey.penaltyCard;

  readonly priority = GameRulePriority.low;

  readonly timeoutInterval: number = 2000;
  readonly penaltyCards: number = 2;

  private interrupts: Record<string, NodeJS.Timeout> = {};
  private interruptCancelled: Set<string> = new Set();
  private cardsAmounts: Record<string, number> = {};

  // listen to game updates
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

  // get's called when some player pressed the uno button
  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    // clear timeout --> remove penalty
    if (this.interrupts[event.playerId]) {
      clearTimeout(this.interrupts[event.playerId]);
      delete this.interrupts[event.playerId];
      this.interruptCancelled.add(event.playerId);
    }

    // don't change actual state
    return {
      newState: state,
      moveCount: 0,
      events: []
    };
  };

  // handler, when time for pressing the uno button exceed
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

  // handle interrupt (send penalty to player)
  onInterrupt = (
    interrupt: GameInterrupt,
    state: GameState,
    pile: CardDeck
  ) => {
    const events: GameEvent[] = [];

    // send penalty cards
    for (const pId of interrupt.targetPlayers) {
      const cards: Card[] = [];
      // draw cards
      for (let i = 0; i < this.penaltyCards; i++) {
        cards.push(pile.draw());
      }

      // ..and update deck
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
