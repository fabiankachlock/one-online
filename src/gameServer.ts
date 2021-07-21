import http from 'http';
import Websocket, { Server as WebsocketServer } from 'ws';
import { isGameReady, startGame } from './game/game';
import { handleGameMessage } from './game/messages/handler';
import { GameStore } from './store/implementations/gameStore';
import { WaitingWebsockets } from './waitingServer';

const wsMap: { [id: string]: Websocket[] } = {}

export const GameServer = new WebsocketServer({ noServer: true });
export const GameServerPath = '/game/ws/play'

GameServer.on('connection', (ws, req) => {
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

    console.log('[Websocket] connected - game: ' + gameid)

    if (isGameReady(gameid, Object.keys(wsMap[gameid]).length)) {
        const game = GameStore.getGame(gameid)
        if (game) {
            console.log('[Websocket] starting game: ' + gameid)
            startGame(game)
            WaitingWebsockets.removeConnections(gameid)
        }
    }

    ws.on('message', msg => {
        handleGameMessage(msg.toString())
    });

    ws.on('close', () => {
        wsMap[gameid] = wsMap[gameid].filter(w => w !== ws)
    });
});


export const GameWebsockets = {

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