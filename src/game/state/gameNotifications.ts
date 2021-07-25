import { GameWebsockets } from "../../gameServer.js"
import { Card } from "../cards/type.js"
import { GameState } from "../interface.js"
import { Player } from "../players/player.js"

export class GameStateNotificationManager {

    constructor(
        public gameId: string
    ) { }

    public notifyGameUpdate = (
        players: Player[],
        currentPlayer: string,
        topCard: Card,
        direction: 'left' | 'right',
        playerCards: {
            id: string,
            amount: number,
        }[],
        events: {
            type: string,
            payload: {}
            players: string[],
        }[],
    ) => {
        for (let player of players) {
            GameWebsockets.sendIndividual(this.gameId, player.id, JSON.stringify({
                event: 'update',
                currentPlayer: currentPlayer,
                isCurrent: currentPlayer === player.id,
                topCard: topCard,
                direction,
                players: playerCards,
                events: events.filter(e => e.players.includes(player.id)).map(e => ({ type: e.type, payload: e.payload }))
            }))
        }
    }

    public notifyGameInit = (
        players: Player[],
        state: GameState
    ) => {

        const mapped: {
            id: string;
            name: string;
            cardAmount: number;
        }[] = players.map(p => ({
            id: p.id,
            name: p.name,
            cardAmount: state.decks[p.id].length
        }))

        for (let player of players) {
            GameWebsockets.sendIndividual(this.gameId, player.id, JSON.stringify({
                event: 'init-game',
                players: mapped,
                currentPlayer: state.currentPlayer,
                isCurrent: state.currentPlayer === player.id,
                topCard: state.topCard,
                deck: state.decks[player.id]
            }))
        }
    }
}