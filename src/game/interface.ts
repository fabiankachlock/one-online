import { CardDeck } from './cards/deck.js';
import { Card } from './cards/type.js';
import { Player } from './players/player.js';
import type { UIClientEvent } from '../../types/client';

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
}

export interface GameStoreRef {
  save(): void;
  checkPlayer(id: string, name: string): boolean;
  queryPlayers(): Player[];
  destroy(): void;
}
