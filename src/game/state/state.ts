import { resourceLimits } from "worker_threads";
import { PlayerStore } from "../../store/implementations/playerStore/index.js";
import { CardDeck } from "../cards/deck.js";
import { Card } from "../cards/type.js";
import { GameMeta } from "../game.js";
import { GameEvent, GameRule, GameState } from "../interface.js";
import { GameOptionsType } from "../options.js";
import { Player } from "../players/player.js";
import { getPrioritisedEvent } from "./events/eventUtil.js";
import { drawEvent } from "./events/gameEvents.js";
import { UIClientEvent, UIEventTypes } from "./events/uiEvents.js";
import { GameStateNotificationManager } from './gameNotifications.js';
import { BasicDrawRule } from "./rules/basicDrawRule.js";
import { BasicGameRule } from './rules/basicRule';

export class GameStateManager {

    private state: GameState
    private notificationManager: GameStateNotificationManager;
    private players: Player[];

    private readonly rules: GameRule[] = [
        new BasicGameRule(),
        new BasicDrawRule()
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
    }

    public start = () => {
        console.log('[Game]', this.gameId, 'init game')
        this.notificationManager.notifyGameInit(this.players, this.state)
    }

    public clear = () => {

    }

    public handleEvent = (event: UIClientEvent) => {
        if (event.event === UIEventTypes.card) {
            this.handlePlaceCard(event)
        } else if (event.event === UIEventTypes.draw) {
            this.handleDrawCard(event)
        }
    }

    private handlePlaceCard = (event: UIClientEvent) => {
        const allowedEvents: GameEvent[] = []
        const notAllowedEvents: GameEvent[] = []

        let allowed = true
        for (let rule of this.rules) {
            if (rule.isResponsible(this.state, event)) {
                if (!rule.canThrowCard(event.payload.card, this.state.topCard)) {
                    allowed = false
                    notAllowedEvents.push(rule.getEvent(this.state, event))
                } else {
                    allowedEvents.push(rule.getEvent(this.state, event))
                }
            }
        }

        console.log('generated events: allowed', allowedEvents, 'not allowed', notAllowedEvents)

        // place Card if allowed
        if (allowed) {
            this.state.stack.push(this.state.topCard)
            this.state.topCard = event.payload.card

            const cardIndex = this.state.decks[event.playerId].findIndex(c => c.type === event.payload.card.type && c.color === event.payload.card.color)
            this.state.decks[event.playerId].splice(cardIndex, 1)

            this.state.currentPlayer = this.metaData.playerLinks[event.playerId][this.state.direction]
        }

        this.notificationManager.notifyGameUpdate(
            this.players,
            this.state.currentPlayer,
            this.state.topCard,
            Object.entries(this.state.decks).map(([id, cards]) => ({ id, amount: cards.length })),
            allowed ? allowedEvents : notAllowedEvents
        )
    }

    private handleDrawCard = (event: UIClientEvent) => {
        const events: GameEvent[] = []

        let allowed = true
        for (let rule of this.rules) {
            if (rule.isResponsible(this.state, event)) {
                if (!rule.isAllowedToDraw(this.state, event)) {
                    allowed = false
                }
                events.push(rule.getEvent(this.state, event))
            }
        }

        console.log('generated events: allowed', events)

        const prioritisedEvent = getPrioritisedEvent(events)
        let finalEvent = prioritisedEvent

        // draw cards
        if (allowed && prioritisedEvent) {
            if (prioritisedEvent.type.startsWith('[i]')) {
                const cards: Card[] = []
                for (let i = 0; i < (prioritisedEvent.payload as { amount: number }).amount; i++) {
                    cards.push(this.pile.draw())
                }
                finalEvent = drawEvent(prioritisedEvent.players.pop() || 'noname', cards, 1)
            }

            this.state.decks[event.playerId].push(...(finalEvent?.payload as { cards: Card[] }).cards)

            this.state.currentPlayer = this.metaData.playerLinks[event.playerId][this.state.direction]
        }

        this.notificationManager.notifyGameUpdate(
            this.players,
            this.state.currentPlayer,
            this.state.topCard,
            Object.entries(this.state.decks).map(([id, cards]) => ({ id, amount: cards.length })),
            finalEvent ? [finalEvent] : []
        )
    }
}