import { Card, CARD_TYPE } from '../../cards/type.js';
import type { UIClientEvent } from '../../../../types/client';
import { UIEventTypes } from '../events/client.js';
import { GameEvent, GameRulePriority, GameState } from '../../interface.js';
import { CardDeck } from '../../cards/deck.js';
import { BasicGameRule } from './basicRule.js';
import { BaseGameRule } from './baseRule.js';
import { placeCardEvent } from '../events/gameEvents.js';
import { OptionKey } from '../../options.js';
import { CardType } from './common/card.js';
import { GameInteraction } from './common/interaction.js';
import { GameDrawInteraction } from './common/draw.js';

/**
 * How this works:
 *
 * Since the rule has to override both placeCard and drawCard mechanisms the rule got split up.
 * Both sub rules are combined in the AddUpRule
 */

export class AddUpRule extends BasicGameRule {
  constructor(
    private placeCardRule = new AddUpPlaceCardRule(),
    private drawCardRule = new AppUpDrawRule()
  ) {
    super();
  }

  name = 'add-up';

  // define option, which has to be activated, to activate this rule
  associatedRule = OptionKey.addUp;

  isResponsible = (state: GameState, event: UIClientEvent) =>
    this.drawCardRule.isResponsible(state, event) ||
    this.placeCardRule.isResponsible(state, event);

  readonly priority = GameRulePriority.medium;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    // determine responsible sub rule
    if (this.placeCardRule.isResponsible(state, event)) {
      return this.placeCardRule.applyRule(state, event, pile);
    }
    return this.drawCardRule.applyRule(state, event, pile);
  };

  getEvents = (state: GameState, event: UIClientEvent) => {
    // determine responsible sub rule
    if (this.placeCardRule.isResponsible(state, event)) {
      return this.placeCardRule.getEvents(state, event);
    }
    return this.drawCardRule.getEvents(state, event);
  };
}

class AddUpPlaceCardRule extends BasicGameRule {
  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryPlaceCard &&
    CardType.isDraw(state.topCard.type) &&
    CardType.isDraw(<CARD_TYPE>event.payload.card.type);

  // override basic canThrowCard
  private readonly canThrowCard = (
    card: Card,
    top: Card,
    topActivated: boolean
  ): boolean => {
    const fits = card.type === top.type || card.color === top.color;

    if (
      CardType.isDraw(top.type) &&
      !CardType.isDraw(card.type) &&
      !topActivated
    )
      return false;

    return CardType.isWild(card.type) || fits;
  };

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    if (event.event !== UIEventTypes.tryPlaceCard) {
      return {
        newState: state,
        moveCount: 0,
        events: []
      };
    }

    const card = <Card>event.payload.card;
    const top = <Card>state.topCard;

    let newEvents: GameEvent[] = [];
    let allowed = this.canThrowCard(
      card,
      top,
      state.stack[state.stack.length - 1].activatedEvent
    );

    // can't throw, if the card isn't in the players deck
    if (!GameInteraction.hasCard(event.playerId, card, state)) {
      allowed = false;
    }

    if (allowed) {
      // perform basic card placement
      GameInteraction.placeCard(card, event.playerId, state);
      newEvents = [
        placeCardEvent(
          event.playerId,
          <Card>event.payload.card,
          event.payload.id,
          true
        )
      ];
    }

    return {
      newState: state,
      moveCount: allowed ? 1 : 0,
      events: newEvents
    };
  };
}

class AppUpDrawRule extends BaseGameRule {
  readonly priority = GameRulePriority.low;

  isResponsible = (state: GameState, event: UIClientEvent) =>
    event.event === UIEventTypes.tryDraw;

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => {
    const newEvent = GameDrawInteraction.performDraw(
      state,
      event,
      pile,
      GameDrawInteraction.getRecursiveDrawAmount(state.stack.slice())
    );

    return {
      newState: state,
      moveCount: 1,
      events: [newEvent]
    };
  };
}
