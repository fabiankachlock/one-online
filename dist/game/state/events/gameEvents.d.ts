import { Card } from "../../cards/type.js";
import { GameEvent } from "../../interface.js";
export declare const emptyEvent: () => GameEvent;
export declare const internalDrawEvent: (player: string, amount: number, priority: number) => GameEvent;
export declare const drawEvent: (player: string, cards: Card[], priority: number) => GameEvent;
export declare const placeCardEvent: (player: string, card: Card, cardId: string, allowed: boolean, priority: number) => GameEvent;
