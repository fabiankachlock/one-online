/// <reference path="../../express-session.d.ts" />
import { Request, Response } from 'express';
import type * as PreGame from '../../../types/preGameMessages';
import { requireLogin } from '../../helper';
import { Logging } from '../../logging';
import { PreGameMessages } from '../../preGameMessages';
import { createAccessToken } from '../../store/accessToken';
import { TokenStore } from '../../store/implementations/accessToken';
import { GameStore } from '../../store/implementations/gameStore';

export const HandleJoinGame = async (req: Request, res: Response) => {
  const { gameId, password } = <PreGame.JoinBody>req.body;

  if (requireLogin(req, res)) return;

  if (!gameId) {
    Logging.Game.info(`[Join] call with missing information`);
    PreGameMessages.error(res, 'Error: Please fill in all information.');
    return;
  }

  const game = GameStore.getGame(gameId);

  // reset session
  req.session.gameId = '';
  req.session.activeToken = '';

  if (game) {
    const token = createAccessToken(gameId);
    const success = game.playerManager.registerPlayer(
      req.session.userId,
      password,
      token
    );

    if (success) {
      // set session
      req.session.gameId = game.key;
      req.session.activeToken = token;

      Logging.Game.info(
        `[Join] ${req.session.userId} ${
          req.session.userId === game.meta.host ? '(host)' : ''
        } joined ${gameId}`
      );

      PreGameMessages.joined(res, req.session.userId === game.meta.host);
      return;
    } else {
      Logging.Game.warn(
        `[Join] ${req.session.userId} tried joining with wrong credentials ${gameId}`
      );
      TokenStore.deleteToken(token);

      PreGameMessages.error(
        res,
        "Error: You can't join the game, make sure your password is correct"
      );
    }

    return;
  }

  Logging.Game.warn(
    `[Join] ${req.session.userId} tried joining nonexisting game ${gameId}`
  );
  PreGameMessages.error(
    res,
    "Error: You can't join a game, that doesn't exists."
  );
};
