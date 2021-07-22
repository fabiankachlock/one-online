import { PlayerStore } from "../../store/implementations/playerStore/index.js";
import { CardDeck } from "../cards/deck.js";
import { GameMeta } from "../game.js";
import { GameEvent, GameRule, GameState } from "../interface.js";
import { GameOptionsType } from "../options.js";
import { Player } from "../players/player.js";
import { UIClientEvent } from "./events/uiEvents.js";
import { GameStateNotificationManager } from './gameNotifications.js';
import { BasicGameRule } from './rules/basicRule';

export class GameStateManager {

    private state: GameState
    private notificationManager: GameStateNotificationManager;
    private players: Player[];

    private readonly rules: GameRule[] = [
        new BasicGameRule()
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
        Array.from(this.metaData.players).map(pid => {
            this.state.decks[pid] = [];

            for (let i = 0; i < this.options.options.numberOfCards; i++) {
                this.state.decks[pid].push(this.pile.draw())
            }
        })
    }

    public start = () => {
        this.notificationManager.notifyGameInit(this.players, this.state)
    }

    public clear = () => {

    }

    public handleEvent = (event: UIClientEvent) => {

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

        // place Card
        this.state.stack.push(this.state.topCard)
        this.state.topCard = event.payload.card

        const cardIndex = this.state.decks[event.playerId].findIndex(c => c.type === event.payload.card.type && c.color === event.payload.card.color)
        this.state.decks[event.playerId].splice(cardIndex, 1)

        this.state.currentPlayer = this.metaData.playerLinks[event.playerId][this.state.direction]

        this.notificationManager.notifyGameUpdate(
            this.players,
            this.state.currentPlayer,
            this.state.topCard,
            Object.entries(this.state.decks).map(([id, cards]) => ({ id, amount: cards.length })),
            allowed ? allowedEvents : notAllowedEvents
        )
    }
}

/*
            GameWebsockets.sendMessage(this.game.hash, updateGameMessage(
                this.game.state.player,
                this.game.state.topCard,
                Object.entries(this.game.state.cardAmounts).map(([id, amount]) => ({ id, amount })),
                []
            ))
    */