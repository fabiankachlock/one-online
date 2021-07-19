import { Game } from "../game/type"

const gamesMap: { [key: string]: Game } = {}
const gameNameMap: { [key: string]: string } = {}

export const GameStore = {
    storeGame: (game: Game) => {
        gamesMap[game.hash] = game
        gameNameMap[game.name] = game.hash
    },

    getGame: (id: string) => gamesMap[id] as Game | undefined,
    getGameByName: (name: string) => gamesMap[gameNameMap[name]] as Game | undefined
}
