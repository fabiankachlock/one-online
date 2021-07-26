import { Card } from "./cards/type.js";
import { Player } from "./players/player.js";

type PreGameErrorMessage = {
    error: string;
}

type PreGameCreatedMessage = {
    success: boolean;
    url: string;
    id: string;
}

type PreGameJoinedMessage = {
    success: boolean;
    url: string;
    id: string;
}

type PreGameVerifyMessage = {
    ok: boolean;
}

type PostGameSummaryMessage = {
    winner: string;
    playAgainUrl: string;
    gameId: string;
}

type WaitingPlayerChangeMessage = {
    players: Player[];
}

type WaitingGameStartMessage = {
    start: true;
    url: string;
}

type WaitingGameStopMessage = {
    stop: true;
}

type GameInitMessage = {
    event: 'init-game';
    players: {
        id: string;
        name: string;
        cardAmount: number;
    }[]
    currentPlayer: string;
    isCurrent: boolean;
    topCard: Card;
    deck: Card[];
}

type GameUpdateMessage = {
    event: 'update'
    currentPlayer: string;
    isCurrent: boolean;
    topCard: Card;
    direction: 'left' | 'right';
    players: {
        id: string;
        cardAmount: number;
    }[]
    events: {
        type: string;
        payload: {};
    }[];
}