import Websocket from 'ws';
export declare const WaitingServer: Websocket.Server;
export declare const WaitingServerPath = "/game/ws/wait";
export declare const WaitingWebsockets: {
    sendMessage: (gameid: string, message: string) => void;
    removeConnections: (id: string) => void;
};
