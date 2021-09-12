import { UIPlaceCardEvent } from '../../../../../types/client';
import { Card } from '../../../cards/type';
import { GameState } from '../../../interface';
import { CardType } from './card';

export const GameInteraction = {
  hasCard: (playerId: string, card: Card, state: GameState): boolean => {
    return state.decks[playerId] && state.decks[playerId].includes(card);
  },

  canThrowCard: (playerId: string, card: Card, state: GameState): boolean => {
    const top = state.topCard;
    const activatedTop = state.stack[state.stack.length - 1].activatedEvent;
    const fits = card.type === top.type || card.color === top.color; // uno rule: same kind or color

    // can't throw, if the card isn't in the players deck
    if (!GameInteraction.hasCard(playerId, card, state)) {
      return false;
    }

    // can't throw (by default) if top card is draw (and not already drawn)
    if (CardType.isDraw(top.type) && !activatedTop) {
      return false;
    }

    // card can be throw, if it fits oder is a wild card
    return fits || CardType.isWild(card.type);
  },

  placeCard: (card: Card, playerId: string, state: GameState) => {
    // update state
    state.stack.push({
      card: card,
      activatedEvent: false
    });
    state.topCard = card;

    // remove card from players deck
    const cardIndex = state.decks[playerId].findIndex(
      c => c.type === card.type && c.color === card.color
    );
    state.decks[playerId].splice(cardIndex, 1);
  }
};
