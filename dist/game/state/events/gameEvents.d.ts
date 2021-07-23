import { Card } from "../../cards/type.js";
import { GameEvent } from "../../interface.js";
export declare const emptyEvent: () => GameEvent;
export declare const internalDrawEvent: (player: string, amount: number) => GameEvent;
export declare const drawEvent: (player: string, cards: Card[]) => GameEvent;
export declare const placeCardEvent: (player: string, card: Card, cardId: string, allowed: boolean) => GameEvent;
