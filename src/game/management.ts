
import { NewGame } from './game';
import { GameStore } from '../store/gameStore';
import { GameOptions } from './type';

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

    GameStore.storeGame(game)

    return game.hash
}

export const LeavGame = (name: string, playerId: string) => {
    const game = GameStore.getGameByName(name)

    if (!game) return

    game.state.player = game.state.player.filter(p => p !== playerId)

    GameStore.storeGame(game)
}