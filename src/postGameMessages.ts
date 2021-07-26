import { Response } from 'express';

export const PostGameMessages = {

    error: (res: Response, error: string) => res.json({ error: error }),

    stats: (res: Response, winner: string, url: string, id: string) => res.json({
        winner: winner,
        playAgainUrl: url,
        gameId: id
    })
}