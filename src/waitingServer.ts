import Websocket, { Server as WebsocketServer } from 'ws';
import { GameStore } from './store/implementations/gameStore/';
import { PlayerStore } from './store/implementations/playerStore/';

const wsMap: { [id: string]: Websocket[] } = {}

export const WaitingServer = new WebsocketServer({ noServer: true })
export const WaitingServerPath = '/game/ws/wait'

WaitingServer.on('connection', (ws, req) => {
    const parts = (req.url ?? '').split('?')
    if (parts?.length < 2) {
        ws.close()
    }

    const gameid = parts[1]

    if (gameid in wsMap) {
        wsMap[gameid].push(ws)
    } else {
        wsMap[gameid] = [ws]
    }

    console.log('[Websocket] connected - waiting for ' + gameid)

    const game = GameStore.getGame(gameid)
    if (game) {
        WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
            players: game.meta.player.map(p => PlayerStore.getPlayerName(p))
        }))
    } else {
        ws.close()
    }

    // ws.on('message', (msg) => { });

    ws.on('close', () => {
        wsMap[gameid] = wsMap[gameid].filter(w => w !== ws)
    });
});


export const WaitingWebsockets = {

    sendMessage: (gameid: string, message: string) => {
        wsMap[gameid].forEach(ws => {
            ws.send(message)
        })
    }

}