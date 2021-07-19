import { Game, GameOptions, Player } from "./type";
import { v4 as uuid } from 'uuid';

export const NewGame = (options: GameOptions): Game => ({
    name: options.name,
    password: options.password,
    public: options.public,
    host: options.host,
    hash: uuid(),
    state: {
        players: 1,
        running: false,
        player: [options.host]
    }
})

export const NewPlayer = (name: string): Player => ({
    name,
    id: uuid()
})