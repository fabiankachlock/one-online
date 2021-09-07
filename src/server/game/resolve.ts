import { Request, Response } from 'express';
import { requireActiveGame, requireLogin } from '../../helper';

export const HandleWaitResolve = async (req: Request, res: Response) => {
  if (requireActiveGame(req, res)) return;

  res.send('/api/v1/game/ws/wait?' + req.session.gameId);
};

export const HandlePlayResolve = async (req: Request, res: Response) => {
  if (requireActiveGame(req, res) || requireLogin(req, res)) return;

  res.send(
    '/api/v1/game/ws/play?' + req.session.gameId + '?' + req.session.userId
  );
};
