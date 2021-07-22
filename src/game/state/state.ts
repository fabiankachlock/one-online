import { GameMeta } from "../game.js";
import { GameOptionsType } from "../options.js";

export class GameStateManager {

    constructor(
        private metaData: GameMeta,
        private options: GameOptionsType
    ) { }



    public prepare = () => {

    }

    public clear = () => {

    }
}

/*

    state: {
        player: string;
        playerLinks: {
            [id: string]: {
                left: string;
                right: string;
            };
        }
        cardAmounts: {
            [id: string]: number;
        }
        direction: 'left' | 'right';
        topCard: Card;
        stack: Card[];
    };


    export const canPlaceCard = card => {
    const isWild = card.type === CARD_TYPE.wild || card.type === CARD_TYPE.wildDraw2 || card.type === CARD_TYPE.wildDraw4
    const isDraw = card.type === CARD_TYPE.draw2 || card.type === CARD_TYPE.wildDraw2 || card.type === CARD_TYPE.wildDraw4
    const isCancel = card.type === CARD_TYPE.reverse && state.topCard.type === CARD_TYPE.draw2 || state.topCard.type === CARD_TYPE.wildDraw2 || state.topCard.type === CARD_TYPE.wildDraw4
    const fits = card.type === state.topCard.type || card.color === state.topCard.color

    if (!options.addUp) {
        return (fits || isWild) && !isDraw
    } else {
        return fits
            || (options.cancleWithReverse && isCancel)
            || (options.addUp && (fits || isWild))
    }
}
    */