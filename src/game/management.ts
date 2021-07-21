
import { NewGame } from './game';
import { GameStore } from '../store/implementations/gameStore/';
import { Game, GameOptions } from './type';
import { WaitingWebsockets } from '../waitingServer';
import { PlayerStore } from '../store/implementations/playerStore/';
import { GameWebsockets } from '../gameServer';

export const CreateGame = (options: GameOptions): string | undefined => {
    const game = NewGame(options)

    if (!GameStore.getGameByName(game.name)) {
        GameStore.storeGame(game)
        return game.hash
    }

    return undefined
}

export const JoinGame = (name: string, playerId: string, password: string): string | undefined => {
    const game = GameStore.getGameByName(name)

    if (!game || game.password !== password) return undefined

    if (!game.meta.player.includes(playerId)) {
        game.meta.player = [
            ...game.meta.player,
            playerId
        ]
        game.meta.playerCount = game.meta.player.length
    }

    WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
        players: game.meta.player.map(p => PlayerStore.getPlayerName(p))
    }))

    GameStore.storeGame(game)

    return game.hash
}

export const LeaveGame = (id: string, playerId: string) => {
    const game = GameStore.getGame(id)

    if (!game) return

    game.meta.player = game.meta.player.filter(p => p !== playerId)
    game.meta.playerCount = game.meta.player.length

    if (game.meta.playerCount > 0) {
        WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
            players: game.meta.player.map(p => PlayerStore.getPlayerName(p))
        }))
    } else {
        GameWebsockets.removeConnections(game.hash)
        GameStore.remove(game.hash)
    }

    GameStore.storeGame(game)
}

export const constructPlayerLinks = (game: Game): Game => {
    const players = game.meta.player

    players.forEach((p, index) => {
        let leftLink: string;
        if (index < players.length - 1) {
            leftLink = players[index + 1]
        } else {
            leftLink = players[0]
        }

        let rightLink: string;
        if (index > 0) {
            rightLink = players[index - 1]
        } else {
            rightLink = players[players.length - 1]
        }

        game.state.playerLinks[p] = {
            left: leftLink,
            right: rightLink
        }
    })

    return game
}