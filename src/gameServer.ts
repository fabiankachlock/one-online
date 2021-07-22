import Websocket, { Server as WebsocketServer } from 'ws';
import { GameStore } from './store/implementations/gameStore';

const wsMap: { [id: string]: { [player: string]: Websocket } } = {}

export const GameServer = new WebsocketServer({ noServer: true });
export const GameServerPath = '/game/ws/play'

GameServer.on('connection', (ws, req) => {
    const parts = (req.url ?? '').split('?')
    if (parts?.length < 3) {
        console.log('[Websocket] connection refused - invalid params', parts)
        ws.close()
        return
    }

    const gameid = parts[1]
    const playerid = parts[2]

    if (!wsMap[gameid]) {
        wsMap[gameid] = {}
    }

    wsMap[gameid][playerid] = ws

    console.log('[Websocket] connected - game: ' + gameid)

    const game = GameStore.getGame(gameid)

    if (game && game.isReady(Object.keys(wsMap[gameid]).length)) {
        const game = GameStore.getGame(gameid)
        if (game) {
            console.log('[Websocket] starting game: ' + gameid)

            game.prepare()
            game.start()

            Object.entries(wsMap[gameid]).forEach(([, ws]) => {
                ws.on('message', game.eventHandler())
            })
        }
    }

    ws.on('close', () => {
        console.log('[Websocket] closed', playerid, 'on game', gameid)
        delete wsMap[gameid][playerid]
    });
});


export const GameWebsockets = {

    sendMessage: (gameid: string, message: string) => {
        if (wsMap[gameid]) {
            Object.entries(wsMap[gameid]).forEach(([, ws]) => {
                ws.send(message)
            })
        }
    },

    sendIndividual: (gameId: string, playerId: string, message: string) => {
        const ws = wsMap[gameId][playerId]
        if (ws) {
            ws.send(message)
        }
    },

    removeConnections: (id: string) => {
        if (wsMap[id]) {
            Object.entries(wsMap[id]).forEach(([, ws]) => {
                ws.close()
            })
        }
        delete wsMap[id]
    }

}