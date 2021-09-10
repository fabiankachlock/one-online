/// <reference path="./express-session.d.ts" />
import { Response, Request } from 'express';

export const requireLogin = (req: Request, res: Response): boolean => {
  if (req.session.userId && req.session.userName) {
    return false;
  }

  res.json({
    error: 'This operation needs you to be logged in!'
  });

  return true;
};

export const requireAuthToken = (req: Request, res: Response): boolean => {
  if (req.session.activeToken) {
    return false;
  }

  res.json({
    error: 'This operation needs you to have a valid auth token!'
  });

  return true;
};

export const requireActiveGame = (req: Request, res: Response): boolean => {
  if (req.session.gameId) {
    return false;
  }

  res.json({
    error: 'This operation needs to be in an active game'
  });

  return true;
};

export const requireGameInfo = (req: Request, res: Response): boolean => {
  if (req.session.activeToken || req.session.gameId) {
    return false;
  }

  res.json({
    error: 'This operation needs you to have a valid auth token or game id!'
  });

  return true;
};
