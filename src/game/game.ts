import { Game, Player } from "./type";
import { v4 as uuid } from 'uuid';

export const NewGame = (name: string, password: string, publicMode: boolean, hostId: string): Game => ({
    name,
    password,
    public: publicMode,
    hash: uuid(),
    state: {
        players: 1,
        running: false,
        player: [hostId]
    }
})

export const NewPlayer = (name: string): Player => ({
    name,
    id: uuid()
})