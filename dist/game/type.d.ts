export declare type Game = {
    name: string;
    password: string;
    public: boolean;
    hash: string;
    host: string;
    state: {
        players: number;
        running: boolean;
        player: string[];
    };
};
export declare type Player = {
    name: string;
    id: string;
};
export declare type GameOptions = {
    name: string;
    password: string;
    public: boolean;
    host: string;
};
