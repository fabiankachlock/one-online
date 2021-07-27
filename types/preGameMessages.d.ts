
export type ErrorResponse = {
    error: string;
}

export type CreatedResponse = {
    success: boolean;
    url: string;
    id: string;
}

export type JoinedResponse = {
    success: boolean;
    url: string;
    token: string;
}

export type VerifyResponse = {
    ok: boolean;
}

export type GameAccessResponse = {
    gameId: string;
}

export type GamesResponse = {
    name: string;
    id: string;
    public: boolean;
    player: number;
}[]

export type CreateBody = {
    name: string;
    password: string;
    publicMode: boolean;
    host: string;
}

export type JoinBody = {
    gameId: string;
    playerId: string;
    playerName: string;
    password: string;
}

export type LeaveBody = {
    gameId: string;
    playerId: string;
    playerName: string;
}

export type AccessBody = {
    gameId?: string;
    token?: string;
}

export type PlayerRegisterBody = {
    name: string;
}

export type PlayerRegisterResponse = {
    id: string;
}

export type PlayerChangeBody = {
    name: string;
    id: string;
}
