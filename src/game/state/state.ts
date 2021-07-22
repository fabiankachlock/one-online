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
    */