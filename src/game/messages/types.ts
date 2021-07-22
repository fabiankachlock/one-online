import { Card, Game, Player } from "../type";

export const startMessage = (game: Game): string => JSON.stringify({
    start: true,
    url: '/play/#' + game.hash
})

export const stopMessage = (): string => JSON.stringify({
    stop: true,
})

export const initGameMessage = (players: Player[], amountOfCards: number, currentPlayer: string, card: Card) => JSON.stringify({
    event: 'init-game',
    players,
    amountOfCards,
    currentPlayer,
    topCard: card
})

export type GameUpdateMessage = {
    currentPlayer: string;
    topCard: Card;
    player: {
        id: string;
        amount: number;
    }[]
    events: {
        type: string;
        players: string[];
    }[];
}

export const updateGameMessage = (
    currentPlayer: string,
    topCard: Card,
    player: {
        id: string,
        amount: number,
    }[],
    events: {
        type: string,
        players: string[],
    }[],
) => JSON.stringify({
    event: 'update',
    currentPlayer,
    topCard,
    player,
    events
})
