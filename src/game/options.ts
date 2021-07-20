import { Game } from "./type";

export const resolveOptions = (game: Game, options: Record<string, any>): Game => {
    const gameOptions = game.meta.options

    Object.entries(gameOptions).forEach(([optionKey]) => {
        if (optionKey in options) {
            // @ts-expect-error
            game.meta.options[optionKey] = options[optionKey]
        }
    })

    return game
}