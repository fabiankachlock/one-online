import { Response } from 'express';
import type * as PostGame from '../types/postGameMessages';

export const PostGameMessages = {
  error: (res: Response, error: string) =>
    res.json(<PostGame.ErrorResponse>{ error: error }),

  stats: (res: Response, winner: string, url: string) =>
    res.json(<PostGame.StatsResponse>{
      winner: winner,
      url: url
    })
};
