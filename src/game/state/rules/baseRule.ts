import {
  GameEvent,
  GameInterrupt,
  GameRule,
  GameRulePriority,
  GameState
} from '../../interface.js';
import type { UIClientEvent } from '../../../../types/client';
import { CardDeck } from '../../cards/deck';
import { OptionKey } from '../../options.js';

export abstract class BaseGameRule implements GameRule {
  constructor() {}

  name = '__code-placeholder__';

  associatedRule = OptionKey.none;

  protected interruptGame: (interrupt: GameInterrupt) => void = () => {};

  readonly priority = GameRulePriority.none;

  isResponsible = (state: GameState, event: UIClientEvent) => false;

  getEvents = (state: GameState, event: UIClientEvent) => [] as GameEvent[];

  applyRule = (state: GameState, event: UIClientEvent, pile: CardDeck) => ({
    newState: state,
    moveCount: 0
  });

  setupInterrupt = (interruptHandler: (interrupt: GameInterrupt) => void) => {
    this.interruptGame = interruptHandler;
  };

  isResponsibleForInterrupt = (interrupt: GameInterrupt) => false;

  onInterrupt = (
    interrupt: GameInterrupt,
    state: GameState,
    pile: CardDeck
  ) => ({
    newState: state,
    moveCount: 0,
    events: <GameEvent[]>[]
  });

  onGameUpdate = (state: GameState, outgoingEvents: GameEvent[]) => {};
}
