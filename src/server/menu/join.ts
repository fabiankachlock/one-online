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

  if (game) {
    if (game.meta.host === req.session.userId && req.session.gameId) {
      // game id should be set
      req.session.gameId = game.key;
      req.session.activeToken = '';

      res.json(<PreGame.JoinedResponse>{
        success: true,
        url: '/wait_host.html'
      });
      return;
    }

    const token = createAccessToken(gameId);
    const success = game.playerManager.registerPlayer(
      req.session.userId,
      password,
      token
    );

    if (success) {
      Logging.Game.info(`[Join] ${req.session.userId} joined ${gameId}`);
      // set session
      req.session.gameId = game.key;
      req.session.activeToken = token;
      PreGameMessages.joined(res);
      return;
    } else {
      Logging.Game.warn(
        `[Join] ${req.session.userId} tried joining with wrong credentials ${gameId}`
      );
      TokenStore.deleteToken(token);

      // reset session
      req.session.gameId = '';
      req.session.activeToken = '';

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
