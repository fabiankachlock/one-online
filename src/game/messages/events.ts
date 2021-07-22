import { Card } from "../cards/type.js";

export type UIEventCardPayload = {
    card: Card;
    type: string;
}

export type UIEventDrawPayload = {
    cards: Card[];
    type: string;
}

export type UIEvevntPayload = UIEventCardPayload | UIEventDrawPayload;

export type UIEvent = {
    eid: number;
    event: string;
    playerId: string;
    payload: UIEvevntPayload;
}

export enum UIEventTypes {
    card = 'card',
    draw = 'draw'
}