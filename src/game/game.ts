import { Game, GameOptions, Player } from "./type";
import { v4 as uuid } from 'uuid';

export const NewGame = (options: GameOptions): Game => ({
    name: options.name,
    password: options.password,
    public: options.public,
    host: options.host,
    hash: uuid(),
    meta: {
        players: 1,
        running: false,
        player: [options.host],
        options: {
            penaltyCard: true,
            timeMode: false,
            striktMode: false,
            addUp: true,
            cancleWithReverse: false,
            placeDirect: false,
            takeUntilFit: false,
            throwSame: false,
            exchange: false,
            globalExchange: false,
        }
    }
})

export const NewPlayer = (name: string): Player => ({
    name,
    id: uuid()
})