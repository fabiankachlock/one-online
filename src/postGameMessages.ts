import { Response } from 'express';

export const PostGameMessages = {

    error: (res: Response, error: string) => res.json({ error: error }),

    stats: (res: Response, winner: string, token: string, url: string) => res.json({
        winner: winner,
        token: token,
        url: url
    })
}