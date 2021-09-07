import { Session } from 'express-session';
declare module 'express-session' {
	export interface Session {
		userName: string;
		userId: string;
		activeToken: string;
		gameId: string;
	}
	interface SessionData {
		userName: string;
		userId: string;
		activeToken: string;
		gameId: string;
	}
}
