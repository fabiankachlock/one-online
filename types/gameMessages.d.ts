import GameEventPayload, { GameEventTypes } from './gameEvents';
import { Card } from './index.js';

export type GameEvent = {
	type: GameEventTypes;
	payload: GameEventPayload;
	players: string[];
};

export type GameInitMessage = {
	event: 'init-game';
	players: {
		id: string;
		name: string;
		cardAmount: number;
		order: number;
	}[];
	currentPlayer: string;
	isCurrent: boolean;
	topCard: Card;
	deck: Card[];
	uiOptions: {
		showOneButton: boolean;
	};
};

export type GameUpdateMessage = {
	event: 'update';
	currentPlayer: string;
	isCurrent: boolean;
	topCard: Card;
	direction: string;
	players: {
		id: string;
		amount: number;
	}[];
	events: GameEvent[];
};

export type GameFinishMessage = {
	event: 'finished';
	url: string;
};
