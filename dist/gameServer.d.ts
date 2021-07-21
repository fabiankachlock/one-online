import Websocket from 'ws';
export declare const GameServer: Websocket.Server;
export declare const GameServerPath = "/game/ws/play";
export declare const GameWebsockets: {
    sendMessage: (gameid: string, message: string) => void;
    removeConnections: (id: string) => void;
};
