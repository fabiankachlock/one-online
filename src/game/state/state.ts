import { stringify } from "uuid";
import { PlayerStore } from "../../store/implementations/playerStore/index.js";
import { CardDeck } from "../cards/deck.js";
import { CARD_COLOR } from "../cards/type.js";
import { GameMeta } from "../game.js";
import { GameRule, GameState } from "../interface.js";
import { GameOptionsType } from "../options.js";
import { Player } from "../players/player.js";
import { UIClientEvent } from "./events/uiEvents.js";
import { GameStateNotificationManager } from './gameNotifications.js';
import { BasicDrawRule } from "./rules/basicDrawRule.js";
import { BasicGameRule } from './rules/basicRule';
import { ReverseGameRule } from "./rules/reverseRule.js";

export class GameStateManager {

    private state: GameState
    private notificationManager: GameStateNotificationManager;
    private players: Player[];

    private readonly rules: GameRule[] = [
        new BasicGameRule(),
        new BasicDrawRule(),
        new ReverseGameRule()
    ]

    constructor(
        private gameId: string,
        private metaData: GameMeta,
        private options: GameOptionsType,
        private readonly pile = new CardDeck(10, [], true)
    ) {
        this.state = {
            direction: 'left',
            currentPlayer: Array.from(metaData.players)[Math.floor(Math.random() * this.metaData.playerCount)],
            topCard: pile.draw(),
            stack: [],
            decks: {}
        }
        this.notificationManager = new GameStateNotificationManager(this.gameId);
        this.players = Array.from(metaData.players).map(id => ({
            id,
            name: PlayerStore.getPlayerName(id) || 'noname'
        }))
    }

    public prepare = () => {
        console.log('[Game]', this.gameId, 'preparing state')
        Array.from(this.metaData.players).map(pid => {
            this.state.decks[pid] = [];

            for (let i = 0; i < this.options.options.numberOfCards; i++) {
                this.state.decks[pid].push(this.pile.draw())
            }
        })

        // allow just 'normal' (digit) cards as top card
        while (!/^ct\/\d$/.test(this.state.topCard.type)) {
            this.state.topCard = this.pile.draw()
        }
        this.state.stack = [
            {
                card: this.state.topCard,
                activatedEvent: false
            }
        ]
    }

    public start = () => {
        console.log('[Game]', this.gameId, 'init game')
        this.notificationManager.notifyGameInit(this.players, this.state)
    }

    public clear = () => {

    }

    public handleEvent = (event: UIClientEvent) => {
        const responsibleRules = this.getResponsibleRules(event)

        const rule = this.getProritiesedRules(responsibleRules)

        if (!rule) {
            console.log('No responsible rule for event')
            return
        }

        const copy = JSON.parse(JSON.stringify(this.state))

        const result = rule.applyRule(copy, event, this.pile)

        const events = rule.getEvents(this.state, event)

        this.state = result.newState

        for (let i = result.moveCount; i > 0; i--) {
            this.state.currentPlayer = this.metaData.playerLinks[event.playerId][this.state.direction]
        }

        console.log('generated events:', events)

        this.notificationManager.notifyGameUpdate(
            this.players,
            this.state.currentPlayer,
            this.state.topCard,
            Object.entries(this.state.decks).map(([id, cards]) => ({ id, amount: cards.length })),
            events
        )
    }

    private getResponsibleRules = (event: UIClientEvent): GameRule[] => this.rules.filter(r => r.isResponsible(this.state, event))

    private getProritiesedRules = (rules: GameRule[]): GameRule | undefined => rules.sort((a, b) => a.priority - b.priority).pop()
}