
export type Game = {
    name: string;
    password: string;
    public: boolean;
    hash: string;
    host: string;
    state: {
        players: number;
        running: boolean;
        player: string[];
    }
}

export type Player = {
    name: string;
    id: string;
}

export type GameOptions = {
    name: string;
    password: string;
    public: boolean;
    host: string;
}