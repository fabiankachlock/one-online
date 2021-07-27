import { Response } from 'express';
export declare const PostGameMessages: {
    error: (res: Response, error: string) => Response<any, Record<string, any>>;
    stats: (res: Response, winner: string, token: string, url: string) => Response<any, Record<string, any>>;
};
