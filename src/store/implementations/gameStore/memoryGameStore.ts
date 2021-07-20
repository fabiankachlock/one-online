import { Game } from "../../../game/type"
import { GameStoreType } from "../../gameStore"

const gamesMap: { [key: string]: Game } = {}
const gameNameMap: { [key: string]: string } = {}

export const MemoryGameStore: GameStoreType = {
    storeGame: (game: Game) => {
        gamesMap[game.hash] = game
        gameNameMap[game.name] = game.hash
    },

    getGame: (id: string) => gamesMap[id] as Game | undefined,
    getGameByName: (name: string) => gamesMap[gameNameMap[name]] as Game | undefined,

    remove: (id: string) => {
        const game = gamesMap[id]
        delete gamesMap[id]
        delete gameNameMap[game.name]
    },

    getPublicGames: () => Object.entries(gamesMap).map(p => p[1]).filter(g => g.public && !g.meta.running).map(g => ({ name: g.name, player: g.meta.players })) as { name: string, player: number }[],

    all: () => Object.entries(gamesMap).map(g => g[1])
}
