import { Player } from "../game/type"

const playerMap: { [key: string]: string } = {}
const playerNameMap: { [key: string]: string } = {}

export const PlayerStore = {
    storePlayer: (player: Player) => {
        playerMap[player.name] = player.id
        playerNameMap[player.id] = player.name
    },

    getPlayerId: (name: string) => playerMap[name] as string | undefined,
    getPlayerName: (id: string) => playerNameMap[id] as string | undefined,

    changePlayerName: (id: string, newName: string) => {
        const oldName = playerNameMap[id]
        delete playerMap[oldName]
        playerMap[newName] = id
        playerNameMap[id] = newName
    },

    all: () => Object.entries(playerMap)
}


