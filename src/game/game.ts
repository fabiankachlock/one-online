import { ALL_CARDS, CARD_COLOR, CARD_TYPE, Game, GameOptions, Player } from "./type";
import { v4 as uuid } from 'uuid';
import { constructPlayerLinks } from "./management";

export const NewGame = (options: GameOptions): Game => ({
    name: options.name,
    password: options.password,
    public: options.public,
    host: options.host,
    hash: uuid(),
    meta: {
        playerCount: 1,
        running: false,
        player: [options.host],
        options: {
            penaltyCard: true,
            timeMode: false,
            strictMode: false,
            addUp: true,
            cancleWithReverse: false,
            placeDirect: false,
            takeUntilFit: false,
            throwSame: false,
            exchange: false,
            globalExchange: false,
        }
    },
    state: {
        player: '',
        playerLinks: {},
        direction: 'left',
        topCard: {
            type: CARD_TYPE.none,
            color: CARD_COLOR.none,
        },
        stack: [],
    }
})

export const NewPlayer = (name: string): Player => ({
    name,
    id: uuid()
})

export const prepareGame = (game: Game): Game => {

    game = constructPlayerLinks(game)

    game.state.player = game.meta.player[Math.floor(Math.random() * game.meta.playerCount)]

    game.state.topCard = ALL_CARDS[Math.floor(Math.random() * ALL_CARDS.length)]

    game.meta.running = true

    return game
}