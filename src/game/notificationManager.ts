import { WaitingWebsockets } from '../waitingServer.js';
import { Player } from './players/player.js';
import type * as Messages from '../../types/websocketMessages';

export class GameNotificationManager {
  constructor(public gameId: string) {}

  public notifyPlayerChange = (players: Player[]) => {
    WaitingWebsockets.sendMessage(
      this.gameId,
      JSON.stringify(<Messages.PlayerChangeMessage>{
        players
      })
    );

    if (players.length <= 0) {
      WaitingWebsockets.removeConnections(this.gameId);
    }
  };

  public notifyGameStart = () => {
    WaitingWebsockets.sendMessage(
      this.gameId,
      JSON.stringify(<Messages.GameStartMessage>{
        start: true,
        url: '/play/#' + this.gameId
      })
    );
    WaitingWebsockets.removeConnections(this.gameId);
  };

  public notifyGameStop = () => {
    WaitingWebsockets.sendMessage(
      this.gameId,
      JSON.stringify(<Messages.GameStopMessage>{ stop: true })
    );
    WaitingWebsockets.removeConnections(this.gameId);
  };
}
