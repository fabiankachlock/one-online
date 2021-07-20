
import { NewGame } from './game';
import { GameStore } from '../store/implementations/gameStore/';
import { GameOptions } from './type';
import { WaitingWebsockets } from '../waitingServer';
import { PlayerStore } from '../store/implementations/playerStore/';

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

    WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
        players: game.meta.player.map(p => PlayerStore.getPlayerName(p))
    }))

    GameStore.storeGame(game)
}