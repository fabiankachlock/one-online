import { Card } from './index.js';

export enum GameEventTypes {
	draw = 'draw',
	card = 'place-card'
}

export type DrawEventPayload = {
	cards: Card[];
};

export type PlaceCardEventPayload = {
	card: Card;
	id: string;
	allowed: boolean;
};

type Payloads = DrawEventPayload | PlaceCardEventPayload;

export default Payloads;
