import { Card } from "./type.js";
export declare const getRandomCard: () => Card;
export declare type CardDeckOptions = {
    realisticDraw: boolean;
};
export declare class CardDeck {
    private refillBuffer;
    private realisticDraw;
    private deck;
    constructor(refillBuffer?: number, fromStack?: Card[], realisticDraw?: boolean);
    draw(): Card;
    private get checkRefill();
    private refill;
}
