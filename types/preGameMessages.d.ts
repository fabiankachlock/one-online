export type ErrorResponse = {
	error: string;
};

export type CreatedResponse = {
	success: boolean;
	url: string;
	id: string;
};

export type JoinedResponse = {
	success: boolean;
	url: string;
	token: string;
};

export type VerifyResponse = {
	ok: boolean;
};

export type GameAccessResponse = {
	gameId: string;
};

export type GamesResponse = {
	name: string;
	id: string;
	public: boolean;
	player: number;
}[];

export type CreateBody = {
	name: string;
	password: string;
	publicMode: boolean;
	host: string;
};

export type JoinBody = {
	gameId: string;
	playerId: string;
	playerName: string;
	password: string;
};

export type LeaveBody = {
	gameId?: string;
	token?: string;
	playerId: string;
	playerName: string;
};

export type AccessBody = {
	gameId?: string;
	token?: string;
};

// Player management
export type PlayerRegisterBody = {
	name: string;
};

export type PlayerRegisterResponse = {
	name: string;
};

export type OptionsChangeBody = {
	[option: string]: boolean;
};

export type GameOptionsList = {
	id: string;
	name: string;
	description: string;
	implemented: boolean;
	defaultOn: boolean;
}[];
