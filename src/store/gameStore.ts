import { Game } from "../game/type"

const gamesMap: { [key: string]: Game } = {}
const gameNameMap: { [key: string]: string } = {}

export const GameStore = {
    storeGame: (game: Game) => {
        gamesMap[game.hash] = game
        gameNameMap[game.name] = game.hash
    },

    getGame: (id: string) => gamesMap[id] as Game | undefined,
    getGameByName: (name: string) => gamesMap[gameNameMap[name]] as Game | undefined,

    getPublics: () => Object.entries(gamesMap).map(p => p[1]).filter(g => g.public).map(g => ({ name: g.name, player: g.state.players })) as { name: string, player: number }[],

    all: () => Object.entries(gamesMap).map(g => g[1])
}
