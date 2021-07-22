
export type Game = {
    name: string;
    password: string;
    public: boolean;
    hash: string;
    host: string;
    meta: {
        playerCount: number;
        running: boolean;
        player: string[];
        options: {
            penaltyCard: boolean;
            timeMode: boolean;
            strictMode: boolean;
            addUp: boolean;
            cancleWithReverse: boolean;
            placeDirect: boolean;
            takeUntilFit: boolean;
            throwSame: boolean;
            exchange: boolean;
            globalExchange: boolean;
        }
    };
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
}

export type Player = {
    name: string;
    id: string;
}

export type GameOptions = {
    name: string;
    password: string;
    public: boolean;
    host: string;
}

export enum CARD_COLOR {
    green = 'cc/green',
    red = 'cc/red',
    blue = 'cc/blue',
    yellow = 'cc/yellow',
    none = 'none'
}

export enum CARD_TYPE {
    n1 = 'ct/1',
    n2 = 'ct/2',
    n3 = 'ct/3',
    n4 = 'ct/4',
    n5 = 'ct/5',
    n6 = 'ct/6',
    n7 = 'ct/7',
    n8 = 'ct/8',
    n9 = 'ct/9',
    n0 = 'ct/0',
    skip = 'ct/skip',
    draw2 = 'ct/draw2',
    reverse = 'ct/reverse',
    wild = 'ct/wild',
    wildDraw4 = 'ct/wildDraw4',
    wildDraw2 = 'ct/wildDraw2',
    none = 'none'
}

export type Card = {
    color: CARD_COLOR;
    type: CARD_TYPE;
}

export const isColorCard = (type: CARD_TYPE) => /\/\d$|pause$|take2$|changeDirections$/.test(type)

export const ALL_CARDS = [
    ...Object.entries(CARD_TYPE).map(([, t]) => {
        if (isColorCard(t)) {
            return Object.entries(CARD_COLOR).map(([, c]) => ({
                color: c,
                type: t
            }))
        } else {
            return {
                color: CARD_COLOR.none,
                type: t
            }
        }
    }).flat()
]
