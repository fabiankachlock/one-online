import { Card } from "../../cards/type.js";

export type UIEventCardPayload = {
    card: Card;
    id: string;
}

export type UIEvevntPayload = UIEventCardPayload;

export type UIClientEvent = {
    eid: number;
    event: string;
    playerId: string;
    payload: UIEvevntPayload;
}

export enum UIEventTypes {
    card = 'card',
    draw = 'draw',
    uno = 'uno'
}