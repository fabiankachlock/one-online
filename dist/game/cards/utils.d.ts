import { Card, CARD_COLOR, CARD_TYPE } from "./type.js";
export declare const isColorCard: (type: CARD_TYPE) => boolean;
export declare const VALID_CARD_TYPES: CARD_TYPE[];
export declare const VALID_CARD_COLOR: CARD_COLOR[];
export declare const ALL_CARDS: Card[];
export declare const CARD_DECK: Card[];
export declare const shuffle: <T>(array: T[]) => T[];
