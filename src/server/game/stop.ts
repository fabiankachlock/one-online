/// <reference path="../../express-session.d.ts" />
import { Request, Response } from 'express';
import { requireActiveGame } from '../../helper';
import { Logging } from '../../logging';
import { PreGameMessages } from '../../preGameMessages';
import { GameStore } from '../../store/implementations/gameStore';

export const HandleGameStop = async (req: Request, res: Response) => {
  if (requireActiveGame(req, res)) return;

  const id = req.session.gameId;
  const game = GameStore.getGame(id);

  if (game) {
    Logging.Game.info(`[Stop] ${id}`);
    game.stop();
    res.send('');
  } else {
    Logging.Game.warn(`[Stop] tried stopping nonexisting game ${id}`);
    PreGameMessages.error(res, 'Error: Game cannot be found');
  }
};
