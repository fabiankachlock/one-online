/// <reference path="../../express-session.d.ts" />
import { Request, Response } from 'express';
import { requireActiveGame, requireAuthToken } from '../../helper';
import { Logging } from '../../logging';
import { PreGameMessages } from '../../preGameMessages';
import { readAccessToken } from '../../store/accessToken';
import { GameStore } from '../../store/implementations/gameStore';
import { requireLogin } from '../../helper';

const accessByGameId = (req: Request, res: Response): boolean => {
  const { gameId, userId } = req.session;

  const game = GameStore.getGame(gameId);
  if (!game) return false;

  if (game.meta.host === userId) {
    Logging.Game.info(`[Access] host accessed ${gameId} direct`);
    game.playerManager.joinHost(userId);
    PreGameMessages.verify(res, userId);
    return true;
  }

  return false;
};

const accessByToken = (req: Request, res: Response): boolean => {
  const { gameId, activeToken, userId } = req.session;

  const computedGameId = readAccessToken(activeToken || '');
  const game = GameStore.getGame(computedGameId || '');

  if (computedGameId && game) {
    if (userId === game.meta.host) {
      Logging.Game.warn(`[Access] host accessed ${gameId} via token`);
      game.playerManager.joinHost(userId);
      PreGameMessages.verify(res, userId);
      return true;
    } else {
      Logging.Game.info(`[Access] player accessed ${computedGameId}`);
      game.playerManager.joinPlayer(req.session.activeToken);
      PreGameMessages.verify(res, req.session.userId);
      return true;
    }
  }

  return false;
};

export const HandleAccessGame = async (req: Request, res: Response) => {
  if (requireLogin(req, res)) return;
  if (requireActiveGame(req, res)) return;

  const { gameId, activeToken } = req.session;

  // when a game id is given it should be the host, so try joining as host
  if (gameId && accessByGameId(req, res)) {
    return;
  } else if (gameId) {
    Logging.Game.warn(
      `[Access] tried accessing game with gameId ${req.session.gameId}`
    );
  }

  if (requireAuthToken(req, res)) return;

  // try joining as player
  if (accessByToken(req, res)) {
    return;
  }

  const computedGameId = readAccessToken(activeToken || '');

  // test is the game exists for better error message
  if (computedGameId) {
    Logging.Game.warn(
      `[Access] player tried accessing with wrong token ${computedGameId}`
    );
    PreGameMessages.error(res, 'Error: Token cannot be verified');
    return;
  }

  Logging.Game.warn(
    `[Access] player tried accessing nonexisting game ${computedGameId}`
  );
  PreGameMessages.error(res, 'Error: Game cannot be found');
};
