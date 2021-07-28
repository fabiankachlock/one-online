import { Response } from 'express';
import * as PostGame from '../types/postGameMessages';

export const PostGameMessages = {
  error: (res: Response, error: string) =>
    res.json(<PostGame.ErrorResponse>{ error: error }),

  stats: (res: Response, winner: string, token: string, url: string) =>
    res.json(<PostGame.StatsResponse>{
      winner: winner,
      token: token,
      url: url
    })
};
