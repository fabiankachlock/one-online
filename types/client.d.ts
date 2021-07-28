import { Card } from "./index.js";

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

export type UIPlaceCardEvent = {
    eid: number;
    event: UIEventTypes.tryPlaceCard;
    playerId: string;
    payload: UIEventCardPayload;
}

export type UIEventCardPayload = {
    card: Card;
    id: string;
}

export type UIDrawCardEvent = {
    eid: number;
    event: UIEventTypes.tryDraw;
    playerId: string;
    payload: {}
}

export type UIClientEvent = UIPlaceCardEvent | UIDrawCardEvent

export type UIEventPayload = UIEventCardPayload | {}

export type PlayerMeta = {
    name: string;
    id: string;
    cardAmount: number;
}