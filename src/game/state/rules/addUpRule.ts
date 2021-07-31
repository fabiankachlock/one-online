import { Card, CARD_TYPE } from '../../cards/type.js';
import type { UIClientEvent } from '../../../../types/client';
import { UIEventTypes } from '../events/client.js';
import { GameEvent, GameRulePriority, GameState } from '../../interface.js';
import { CardDeck } from '../../cards/deck.js';
import { BasicGameRule } from './basicRule.js';
import { BaseGameRule } from './baseRule.js';
import { drawEvent, placeCardEvent } from '../events/gameEvents.js';

const isDraw = (t: CARD_TYPE) =>
  t === CARD_TYPE.draw2 ||
  t === CARD_TYPE.wildDraw2 ||
  t === CARD_TYPE.wildDraw4;

const isWild = (t: CARD_TYPE) =>
  t === CARD_TYPE.wild ||
  t === CARD_TYPE.wildDraw2 ||
  t === CARD_TYPE.wildDraw4;

export class AddUpRule extends BasicGameRule {
  constructor(
    private placeCardRule = new AddUpPlaceCardRule(),
    private drawCardRule = new AppUpDrawRule()
  ) {
    super();
  }

  name = 'add-up';

  isResponsible = (state: GameState, event: UIClientEvent) =>
    this.drawCardRule.isResponsible(state, event) ||
    this.placeCardRule.isResponsible(state, event);

  readonly priority = GameRulePriority.medium;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    if (this.placeCardRule.isResponsible(state, event)) {
      return this.placeCardRule.applyRule(state, event, pile);
    }
    return this.drawCardRule.applyRule(state, event, pile);
  };

  getEvents = (state: GameState, event: UIClientEvent) => {
    if (this.placeCardRule.isResponsible(state, event)) {
      return this.placeCardRule.getEvents(state, event);
    }
    return this.drawCardRule.getEvents(state, event);
  };
}

class AddUpPlaceCardRule extends BasicGameRule {
  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryPlaceCard && isDraw(state.topCard.type);

  private readonly canThrowCard = (
    card: Card,
    top: Card,
    topActivated: boolean
  ): boolean => {
    const fits = card.type === top.type || card.color === top.color;

    if (isDraw(top.type) && !isDraw(card.type) && !topActivated) return false;

    return isWild(card.type) || fits;
  };

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    if (event.event !== UIEventTypes.tryPlaceCard) {
      return {
        newState: state,
        moveCount: 0
      };
    }

    const card = <Card>event.payload.card;
    const top = <Card>state.topCard;

    const allowed = this.canThrowCard(
      card,
      top,
      state.stack[state.stack.length - 1].activatedEvent
    );

    if (allowed) {
      state.stack.push({
        card: card,
        activatedEvent: false
      });
      state.topCard = card;

      const cardIndex = state.decks[event.playerId].findIndex(
        c => c.type === card.type && c.color === card.color
      );
      state.decks[event.playerId].splice(cardIndex, 1);
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
            this.canThrowCard(
              <Card>event.payload.card,
              state.topCard,
              state.stack[state.stack.length - 1].activatedEvent
            )
          )
        ];
}

class AppUpDrawRule extends BaseGameRule {
  private getDrawAmount = (
    stack: { card: Card; activatedEvent: boolean }[]
  ) => {
    let amount = 0;
    let top = stack.pop();

    while (top && isDraw(top.card.type) && !top.activatedEvent) {
      amount += parseInt(top.card.type.slice(-1));
      top = stack.pop();
    }

    return amount;
  };

  private lastEvent: GameEvent | undefined;

  readonly priority = GameRulePriority.low;

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryDraw;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    let drawAmount = 1; // standart draw
    const alreadyActivated = state.stack[state.stack.length - 1].activatedEvent;

    if (isDraw(state.topCard.type) && !alreadyActivated) {
      drawAmount = this.getDrawAmount(state.stack.slice());
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
