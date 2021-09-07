export type ErrorResponse = {
	error: string;
};

export type CreatedResponse = {
	success: boolean;
	url: string;
};

export type JoinedResponse = {
	success: boolean;
	url: string;
};

export type VerifyResponse = {
	ok: boolean;
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
};

export type JoinBody = {
	gameId: string;
	password: string;
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
