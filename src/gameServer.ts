import http from 'http';
import Websocket, { Server as WebsocketServer } from 'ws';
import { handleGameMessage } from './game/messages/handler';

const wsMap: { [id: string]: Websocket[] } = {}

export const GameServer = new WebsocketServer({ noServer: true });
export const GameServerPath = '/game/ws/active'

GameServer.on('connection', (ws, req) => {
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

    console.log('[Websocket] connected - game: ' + gameid)

    ws.on('message', msg => {
        handleGameMessage(msg.toString())
    });

    ws.on('close', () => {
        wsMap[gameid] = wsMap[gameid].filter(w => w !== ws)
    });
});


export const GameWebsockets = {

    sendMessage: (gameid: string, message: string) => {
        wsMap[gameid].forEach(ws => {
            ws.send(message)
        })
    }

}