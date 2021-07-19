import http from 'http';
export declare const initWaitingServer: (server: http.Server) => void;
export declare const WaitingWebsockets: {
    sendMessage: (gameid: string, message: string) => void;
};
