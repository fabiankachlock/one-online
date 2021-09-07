import { Request, Response } from 'express';
import type * as PreGame from '../../../../types/preGameMessages';
import { requireActiveGame } from '../../../helper';
import { Logging } from '../../../logging';
import { PreGameMessages } from '../../../preGameMessages';
import { GameStore } from '../../../store/implementations/gameStore';

export const HandleOptionsChange = async (req: Request, res: Response) => {
  if (requireActiveGame(req, res)) return;
  const id = req.session.gameId;
  const game = GameStore.getGame(id);

  if (game) {
    game.resolveOptions(<PreGame.OptionsChangeBody>req.body);
    GameStore.storeGame(game);
    Logging.Game.info(`[Options] changed game ${id}`);
    res.send('');
  } else {
    Logging.Game.warn(`[Options] tried changing nonexisting game ${id}`);
    PreGameMessages.error(res, 'Error: Game cannot be found');
  }
};
