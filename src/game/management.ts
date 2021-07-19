
import { NewGame } from './game';
import { GameStore } from '../store/gameStore';
import { GameOptions } from './type';
import { WaitingWebsockets } from '../waitingServer';
import { PlayerStore } from '../store/userStore';

export const CreateGame = (options: GameOptions): string => {
    const game = NewGame(options)

    GameStore.storeGame(game)

    return game.hash
}

export const JoinGame = (name: string, playerId: string, password: string): string | undefined => {
    const game = GameStore.getGameByName(name)

    if (!game || game.password !== password) return undefined

    game.state.player = [
        ...game.state.player,
        playerId
    ]

    WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
        players: game.state.player.map(p => PlayerStore.getPlayerName(p))
    }))

    GameStore.storeGame(game)

    return game.hash
}

export const LeavGame = (name: string, playerId: string) => {
    const game = GameStore.getGameByName(name)

    if (!game) return

    game.state.player = game.state.player.filter(p => p !== playerId)

    GameStore.storeGame(game)
}