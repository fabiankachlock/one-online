import Websocket from 'ws';
export declare const GameServer: Websocket.Server;
export declare const GameServerPath = "/game/ws/active";
export declare const GameWebsockets: {
    sendMessage: (gameid: string, message: string) => void;
};
