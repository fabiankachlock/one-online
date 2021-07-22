import { GameWebsockets } from "../gameServer.js";
import { WaitingWebsockets } from "../waitingServer.js";
import { Card } from "./cards/type.js";
import { Player } from "./players/player.js";

export class GameNotificationManager {

    constructor(
        public gameId: string
    ) { }

    public notifyPlayerChange = (players: Player[]) => {
        WaitingWebsockets.sendMessage(this.gameId, JSON.stringify({
            players
        }))

        if (players.length <= 0) {
            WaitingWebsockets.removeConnections(this.gameId)
        }
    }

    public notifyGameStart = () => {
        WaitingWebsockets.sendMessage(this.gameId, JSON.stringify({
            start: true,
            url: '/play/#' + this.gameId
        }))
        WaitingWebsockets.removeConnections(this.gameId)
    }

    public notifyGameStop = () => {
        WaitingWebsockets.sendMessage(this.gameId, JSON.stringify({ stop: true }))
        WaitingWebsockets.removeConnections(this.gameId)
    }
}