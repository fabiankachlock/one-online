import { Card } from "../../cards/type.js";
import { GameEvent } from "../../interface.js";
export declare const emptyEvent: () => GameEvent;
export declare const drawEvent: (player: string, amount: number) => GameEvent;
export declare const placeCardEvent: (player: string, card: Card, cardId: string, allowed: boolean) => GameEvent;
