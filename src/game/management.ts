
import { NewGame } from './game';
import { GameStore } from '../store/gameStore';

export const CreateGame = (name: string, password: string, publicMode: boolean, hostId: string): string => {
    const game = NewGame(name, password, publicMode, hostId)

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