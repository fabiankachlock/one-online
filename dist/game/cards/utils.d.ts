import { Card, CARD_TYPE } from "./type.js";
export declare const isColorCard: (type: CARD_TYPE) => boolean;
export declare const ALL_CARDS: Card[];
export declare const CARD_DECK: Card[];
export declare const shuffle: <T>(array: T[]) => T[];
