import { CardDeck } from './cards/deck.js';
import { Card } from './cards/type.js';
import { Player } from './players/player.js';
import type { UIClientEvent } from '../../types/client';
import { OptionKey } from './options.js';

export type GameEvent = {
  type: string;
  payload: {};
  players: string[];
};

export type GameState = {
  direction: 'left' | 'right';
  currentPlayer: string;
  topCard: Card;
  stack: {
    card: Card;
    activatedEvent: boolean;
  }[];
  decks: {
    [player: string]: Card[];
  };
};

export enum GameRulePriority {
  none = -1,
  low = 1,
  medium = 10,
  hight = 100,
  extraHight = 500,
  Infinite = Infinity
}

export interface GameRule {
  priority: number;
  name: string;
  associatedRule: OptionKey;

  // interrupts
  setupInterrupt(interruptHandler: (interrupt: GameInterrupt) => void): void;
  isResponsibleForInterrupt(interrupt: GameInterrupt): boolean;
  onInterrupt(
    interrupt: GameInterrupt,
    state: GameState,
    pile: CardDeck
  ): {
    newState: GameState;
    moveCount: number;
    events: GameEvent[];
  };

  // main functionality
  isResponsible(state: GameState, event: UIClientEvent): boolean;
  getEvents(state: GameState, event: UIClientEvent): GameEvent[];
  applyRule(
    state: GameState,
    event: UIClientEvent,
    pile: CardDeck
  ): {
    newState: GameState;
    moveCount: number;
  };

  // watchers
  onGameUpdate(state: GameState, outgoingEvents: GameEvent[]): void;
}

export interface GameStoreRef {
  save(): void;
  checkPlayer(id: string, name: string): boolean;
  queryPlayers(): Player[];
  destroy(): void;
}

export enum GameInterruptReason {
  unoExpire = 'interruptReason/unoExpire'
}

export type GameInterrupt = {
  reason: GameInterruptReason;
  targetPlayers: string[];
};
