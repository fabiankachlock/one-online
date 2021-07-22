import { Card } from "../type.js";
export declare type UIEventCardPayload = {
    card: Card;
    type: string;
};
export declare type UIEventDrawPayload = {
    cards: Card[];
    type: string;
};
export declare type UIEvevntPayload = UIEventCardPayload | UIEventDrawPayload;
export declare type UIEvent = {
    eid: number;
    event: string;
    playerId: string;
    payload: UIEvevntPayload;
};
export declare enum UIEventTypes {
    card = "card",
    draw = "draw"
}
