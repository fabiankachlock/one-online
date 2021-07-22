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
    isCurrent: boolean;
    topCard: Card;
}

type GameUpdateMessage = {
    event: 'update'
    isCurrent: boolean;
    topCard: Card;
    players: {
        id: string;
        cardAmount: number;
    }[]
    events: {
        type: string;
        players: string[];
    }[];
}