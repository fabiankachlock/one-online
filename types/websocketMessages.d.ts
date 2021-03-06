export type PlayerChangeMessage = {
	players: {
		name: string;
		id: string;
	}[];
};

export type GameStartMessage = {
	start: true;
	url: string;
};

export type GameStopMessage = {
	stop: true;
};

export type OptionsChangeMessage = {
	options: {
		name: string;
		description: string;
	}[];
};
