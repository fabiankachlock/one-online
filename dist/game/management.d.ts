import { GameOptions } from './type';
export declare const CreateGame: (options: GameOptions) => string | undefined;
export declare const JoinGame: (name: string, playerId: string, password: string) => string | undefined;
export declare const LeaveGame: (id: string, playerId: string) => void;
