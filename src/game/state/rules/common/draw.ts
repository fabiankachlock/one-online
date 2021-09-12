import { UIClientEvent } from '../../../../../types/client';
import { CardDeck } from '../../../cards/deck';
import { Card } from '../../../cards/type';
import { GameEvent, GameState } from '../../../interface';
import { drawEvent } from '../../events/gameEvents';
import { CardType } from './card';

export const GameDrawInteraction = {
  getDrawAmount: (cardType: string) => parseInt(cardType.slice(-1)),
  getRecursiveDrawAmount: (
    stack: { card: Card; activatedEvent: boolean }[]
  ) => {
    stack = [...stack]; // copy stack to be save

    let amount = 0;
    let top = stack.pop();

    while (top && CardType.isDraw(top.card.type) && !top.activatedEvent) {
      amount += parseInt(top.card.type.slice(-1));
      top = stack.pop();
    }

    return amount;
  },

  performDraw: (
    state: GameState,
    event: UIClientEvent,
    pile: CardDeck,
    amount: number
  ): GameEvent => {
    const alreadyActivated = state.stack[state.stack.length - 1].activatedEvent;
    // draw only one card, if it isn't enforced by a card
    let drawAmount = 1;

    // only draw, if the top card is draw card and not already drawn
    if (CardType.isDraw(state.topCard.type) && !alreadyActivated) {
      // mark card as activated
      state.stack[state.stack.length - 1].activatedEvent = true;
      drawAmount = amount;
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
    return drawEvent(event.playerId, cards);
  }
};
