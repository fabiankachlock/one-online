import { Response } from 'express';
import * as PreGame from '../types/preGameMessages.js';

export const PreGameMessages = {

    error: (res: Response, error: string) => res.json(<PreGame.ErrorResponse>{ error: error }),

    created: (res: Response, key: string) => res.json(<PreGame.CreatedResponse>{
        success: true,
        url: '/wait_host.html',
        id: key
    }),

    joined: (res: Response, token: string) => res.json(<PreGame.JoinedResponse>{
        success: true,
        url: '/wait.html',
        token: token,
    }),

    verify: (res: Response) => res.json(<PreGame.VerifyResponse>{ ok: true }),

    tokenResponse: (res: Response, gameId: string) => res.json(<PreGame.GameAccessResponse>{ gameId: gameId })
}