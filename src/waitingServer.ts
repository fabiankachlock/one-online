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
        return
    }

    const gameid = parts[1]

    if (gameid in wsMap) {
        wsMap[gameid].push(ws)
    } else {
        wsMap[gameid] = [ws]
    }

    console.log('[Websocket] connected - waiting for ' + gameid)

    if (!GameStore.has(gameid)) {
        ws.close()
    } else {
        GameStore.getGame(gameid)!.joinedWaiting()
    }


    // WaitingWebsockets.sendMessage(game.key, JSON.stringify({
    //     players: game.meta.player.map(p => PlayerStore.getPlayerName(p))
    // }))

    // ws.on('message', (msg) => { });

    ws.on('close', () => {
        wsMap[gameid] = (wsMap[gameid] || []).filter(w => w !== ws)
    });
});


export const WaitingWebsockets = {

    sendMessage: (gameid: string, message: string) => {
        if (wsMap[gameid] && wsMap[gameid].length > 0) {
            wsMap[gameid].forEach(ws => {
                ws.send(message)
            })
        }
    },

    removeConnections: (id: string) => {
        if (wsMap[id] && wsMap[id].length > 0) {
            wsMap[id].forEach(ws => {
                ws.close()
            })
        }
        delete wsMap[id]
    }

}