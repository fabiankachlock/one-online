import { Game } from "../type";
import { UIEvent, UIEventCardPayload, UIEventTypes } from '../messages/events';
import { GameWebsockets } from "../../gameServer.js";
import { updateGameMessage } from "../messages/types.js";


export class GameRunner {

    constructor(private game: Game) { }

    public handle = (event: UIEvent) => {
        if (event.event === UIEventTypes.card) {
            this.game.state.topCard = (event.payload as UIEventCardPayload).card

            this.game.state.cardAmounts[this.game.state.player] -= 1

            this.game.state.player = this.game.state.playerLinks[this.game.state.player][this.game.state.direction];

            this.game.state.stack.push((event.payload as UIEventCardPayload).card)

            GameWebsockets.sendMessage(this.game.hash, updateGameMessage(
                this.game.state.player,
                this.game.state.topCard,
                Object.entries(this.game.state.cardAmounts).map(([id, amount]) => ({ id, amount })),
                []
            ))
        }
    }

}