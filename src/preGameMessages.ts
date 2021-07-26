import { Response } from 'express';

export const PreGameMessages = {

    error: (res: Response, error: string) => res.json({ error: error }),

    created: (res: Response, key: string) => res.json({
        success: true,
        url: '/wait_host.html',
        id: key
    }),

    joined: (res: Response, token: string) => res.json({
        success: true,
        url: '/wait.html',
        token: token,
    }),

    verify: (res: Response) => res.json({ ok: true }),

    tokenResponse: (res: Response, gameId: string) => res.json({ gameId: gameId })
}