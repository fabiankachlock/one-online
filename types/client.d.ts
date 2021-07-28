import { Card } from "./index.js";

export type UIClientEvent = {
    eid: number;
    event: UIEventTypes;
    playerId: string;
    payload: UIEvevntPayload;
}

export type UIEventCardPayload = {
    card: Card;
    id: string;
}

export type UIEvevntPayload = UIEventCardPayload | {};

export enum UIEventTypes {
    tryPlaceCard = 'card',
    tryDraw = 'draw',
    uno = 'uno'
}

export type PlayerMeta = {
    name: string;
    id: string;
    cardAmount: number;
}