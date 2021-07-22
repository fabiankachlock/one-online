import { Game } from "../../../game/game.js"
import { GameStoreType } from "../../gameStore"

const gamesMap: { [key: string]: Game } = {}
const gameNameMap: { [key: string]: string } = {}

export const MemoryGameStore: GameStoreType = {
    storeGame: (game: Game) => {
        gamesMap[game.key] = game
        gameNameMap[game.name] = game.key
    },

    getGame: (id: string) => gamesMap[id] as Game | undefined,

    remove: (id: string) => {
        const game = gamesMap[id]
        delete gamesMap[id]
        delete gameNameMap[game.name]
    },

    has: (id: string) => !!gamesMap[id],

    getPublicGames: () => Object.entries(gamesMap).map(p => p[1]).filter(g => g.isPublic && !g.meta.running).map(g => ({ name: g.name, id: g.key, player: g.meta.playerCount })) as { name: string, id: string, player: number }[],

    all: () => Object.entries(gamesMap).map(g => g[1])
}
