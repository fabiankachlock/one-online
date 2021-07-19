import { GameOptions } from './type';
export declare const CreateGame: (options: GameOptions) => string;
export declare const JoinGame: (name: string, playerId: string, password: string) => string | undefined;
export declare const LeavGame: (name: string, playerId: string) => void;
