import { Card } from "./type.js"
import { CARD_DECK, shuffle } from "./utils.js"


export const getRandomCard = () => CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)]

export type CardDeckOptions = {
    realisticDraw: boolean;
}

export class CardDeck {

    private deck: Card[] = []

    constructor(
        private refillBuffer: number = 0,
        fromStack: Card[] = [],
        private realisticDraw: boolean = true
    ) {
        this.deck = [...fromStack]

        if (this.checkRefill) {
            this.refill()
        }
    }

    public draw(): Card {
        if (this.checkRefill) {
            this.refill()
        }

        return this.deck.pop()!
    }

    private get checkRefill(): boolean {
        return this.deck.length < this.refillBuffer && this.realisticDraw
    }

    private refill() {
        this.deck = [
            ...shuffle(CARD_DECK),
            ...this.deck
        ]
    }

}