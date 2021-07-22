import { Response } from 'express';

export const PreGameMessages = {

    error: (res: Response, error: string) => res.json({ error: error }),

    created: (res: Response, key: string) => res.json({
        success: true,
        url: '/wait_host.html',
        id: key
    }),

    joined: (res: Response, key: string) => res.json({
        success: true,
        url: '/game.html#' + key,
        id: key
    }),

    verify: (res: Response) => res.json({ ok: true })


}