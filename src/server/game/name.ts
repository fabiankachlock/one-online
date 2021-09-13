/// <reference path="../../express-session.d.ts" />
import { Request, Response } from 'express';
import { requireActiveGame } from '../../helper';
import { Logging } from '../../logging';
import { GameStore } from '../../store/implementations/gameStore';

export const HandleGameName = async (req: Request, res: Response) => {
  if (requireActiveGame(req, res)) return;

  const id = req.session.gameId;
  const game = GameStore.getGame(id);

  if (game) {
    res.send(game.meta.name);
  } else {
    Logging.Game.warn(`tried getting name of nonexisting game ${id}`);
    res.send('');
  }
};
