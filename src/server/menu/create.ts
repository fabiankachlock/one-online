import { Request, Response } from 'express';
import type * as PreGame from '../../../types/preGameMessages';
import { Game } from '../../game/game.js';
import { requireLogin } from '../../helper';
import { Logging } from '../../logging';
import { PreGameMessages } from '../../preGameMessages';

export const HandleCreateGame = async (req: Request, res: Response) => {
  const { name, password, publicMode } = <PreGame.CreateBody>req.body;

  if (requireLogin(req, res)) return;

  if (!name || !password) {
    Logging.Game.info(`[Created] call with missing information`);
    PreGameMessages.error(res, 'Error: Please fill in all information.');
    return;
  }

  const game = Game.create(name, password, req.session.userId, publicMode);
  Logging.Game.info(`[Created] ${game.key} ${game.isPublic ? '(public)' : ''}`);

  // set session
  req.session.gameId = game.key;

  PreGameMessages.created(res);
};
