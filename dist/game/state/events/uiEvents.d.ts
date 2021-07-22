import { Card } from "../../cards/type.js";
export declare type UIEventCardPayload = {
    card: Card;
    id: string;
};
export declare type UIEvevntPayload = UIEventCardPayload;
export declare type UIClientEvent = {
    eid: number;
    event: string;
    playerId: string;
    payload: UIEvevntPayload;
};
export declare enum UIEventTypes {
    card = "card",
    draw = "draw",
    uno = "uno"
}
