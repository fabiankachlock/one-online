import { Game } from "../type";

export const startMessage = (game: Game): string => JSON.stringify({
    start: true,
    url: '/play/#' + game.hash
})

export const stopMessage = (): string => JSON.stringify({
    stop: true,
})