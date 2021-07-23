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

export enum GameMessageTypes {
    init = 'init-game',
    update = 'update'
}
export type GameInitMessage = {
    event: GameMessageTypes.init;
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

export enum GameEventType {
    placeCard = 'place-card',
    drawCard = 'draw'
}

export type GameUpdateMessage = {
    event: GameMessageTypes.update;
    isCurrent: boolean;
    currentPlayer: string;
    topCard: Card;
    players: {
        id: string;
        amount: number;
    }[]
    events: {
        type: GameEventType;
        payload: {};
    }[];
}

export type PlaceCardPayload = {
    card: Card;
    id: string;
    allowed: boolean;
}

export type DrawCardPayload = {
    cards: Card[]
}
