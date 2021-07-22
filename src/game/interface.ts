import { Card } from "./cards/type.js";
import { Player } from "./players/player.js";
import { UIClientEvent } from "./state/events/uiEvents.js";

export type GameEvent = {
    type: string;
    payload: {};
    players: string[];
}

export type GameState = {
    direction: 'left' | 'right';
    currentPlayer: string;
    topCard: Card;
    stack: Card[];
    decks: {
        [player: string]: Card[];
    }
}

export interface GameRule {
    isResponsible(state: GameState, event: UIClientEvent): boolean;
    canThrowCard(card: Card, top: Card): boolean;
    isAllowedToDraw(state: GameState, event: UIClientEvent): boolean;
    getEvent(state: GameState, event: UIClientEvent): GameEvent;
}

export interface GameStoreRef {
    save(): void;
    checkPlayer(id: string, name: string): boolean;
    queryPlayers(): Player[];
    destroy(): void;
}