import { Response } from 'express';
export declare const PreGameMessages: {
    error: (res: Response, error: string) => Response<any, Record<string, any>>;
    created: (res: Response, key: string) => Response<any, Record<string, any>>;
    joined: (res: Response, token: string) => Response<any, Record<string, any>>;
    verify: (res: Response) => Response<any, Record<string, any>>;
    tokenResponse: (res: Response, gameId: string) => Response<any, Record<string, any>>;
};
