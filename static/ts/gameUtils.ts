import { Card } from "./card.js"

export type UIEvent = {
    event: string;
    playerId: string;
    eid: number;
    playload: {};
}

export type UIEventPayload = {}

export enum UIEventType {
    tryDraw = 'draw',
    tryPlaceCard = 'card'
}

export type GameUpdateMessage = {
    isCurrent: boolean;
    currentPlayer: string;
    topCard: Card;
    players: {
        id: string;
        amount: number;
    }[]
    events: {
        type: string;
        players: string[];
    }[];
}

export type GameInitMessage = {
    event: 'init-game';
    players: {
        id: string;
        name: string;
        cardAmount: number;
    }[]
    isCurrent: boolean;
    currentPlayer: string;
    topCard: Card;
    deck: Card[];
}

export type PlayerMeta = {
    name: string;
    id: string;
    cardAmount: number;
}

export type GameState = {
    isCurrent: boolean;
    topCard: Card;
    players: PlayerMeta[],
}
