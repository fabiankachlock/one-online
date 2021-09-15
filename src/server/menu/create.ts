/// <reference path="../../express-session.d.ts" />
import { Request, Response } from 'express';
import type * as PreGame from '../../../types/preGameMessages';
import { Game } from '../../game/game.js';
import { requireLogin } from '../../helper';
import { Logging } from '../../logging';
import { PreGameMessages } from '../../preGameMessages';
import { createAccessToken } from '../../store/accessToken';

export const HandleCreateGame = async (req: Request, res: Response) => {
  const { name, password, publicMode } = <PreGame.CreateBody>req.body;

  if (requireLogin(req, res)) return;

  if (!name || !password) {
    Logging.Game.info(`[Created] call with missing information`);
    PreGameMessages.error(res, 'Error: Please fill in all information.');
    return;
  }

  // create game
  const game = Game.create(name, password, req.session.userId, publicMode);
  Logging.Game.info(
    `[Created] ${game.key} ${game.meta.isPublic ? '(public)' : ''}`
  );

  // reset session
  req.session.gameId = '';
  req.session.activeToken = '';

  const hostToken = createAccessToken(game.key);

  const success = game.playerManager.registerPlayer(
    req.session.userId,
    publicMode ? '' : password,
    hostToken
  );

  if (success) {
    // set session
    req.session.gameId = game.key;
    req.session.activeToken = hostToken;
    PreGameMessages.created(res);

    return;
  } else {
    Logging.Game.warn(
      `[Created] Host ${req.session.userId} couldn\'t join game ${game.key}`
    );
    PreGameMessages.error(
      res,
      `Host ${req.session.userId} couldn\'t join game ${game.key}`
    );
    // delete game
    game.stop();
  }
};
