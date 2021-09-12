import { Card } from './index.js';

interface UIBaseEvent {
	eid: number;
	event: UIEventTypes;
	playerId: string;
}

export enum UIEventTypes {
	tryPlaceCard = 'card',
	tryDraw = 'draw',
	uno = 'uno'
}

export type UIEventCardPayload = {
	card: Card;
	id: string;
};

type ClientEvent<Event, Payload = {}> = {
	eid: number;
	event: Event;
	playerId: string;
	payload: Payload;
};

export type UIPlaceCardEvent = ClientEvent<
	UIEventTypes.tryPlaceCard,
	UIEventCardPayload
>;

export type UIDrawCardEvent = ClientEvent<UIEventTypes.tryDraw>;

export type UIUnoPressEvent = ClientEvent<UIEventTypes.uno>;

export type UIClientEvent =
	| UIPlaceCardEvent
	| UIDrawCardEvent
	| UIUnoPressEvent;

export type UIEventPayload = UIEventCardPayload | {};

export type PlayerMeta = {
	name: string;
	id: string;
	cardAmount: number;
};
