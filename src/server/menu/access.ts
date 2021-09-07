import { Request, Response } from 'express';
import { requireActiveGame, requireAuthToken } from '../../helper';
import { Logging } from '../../logging';
import { PreGameMessages } from '../../preGameMessages';
import { readAccessToken } from '../../store/accessToken';
import { GameStore } from '../../store/implementations/gameStore';

export const HandleAccessGame = async (req: Request, res: Response) => {
  if (requireActiveGame(req, res)) return;

  if (req.session.gameId && !req.session.activeToken) {
    const game = GameStore.getGame(req.session.gameId);
    if (game) {
      Logging.Game.info(`[Access] host accessed ${req.session.gameId}`);
      game.joinHost();
      PreGameMessages.verify(res, req.session.userId);
    } else {
      Logging.Game.warn(
        `[Access] host tried accessing nonexisting game ${req.session.gameId}`
      );
      PreGameMessages.error(res, 'Error: Game cannot be found');
    }
    return;
  }

  if (requireAuthToken(req, res)) return;

  const computedGameId = readAccessToken(req.session.activeToken || '');

  if (computedGameId && req.session.activeToken) {
    const game = GameStore.getGame(computedGameId);
    if (game) {
      Logging.Game.info(`[Access] player accessed ${computedGameId}`);
      game.joinPlayer(req.session.activeToken);
      PreGameMessages.verify(res, req.session.userId);
      return;
    } else {
      Logging.Game.warn(
        `[Access] player tried accessing nonexisting game ${computedGameId}`
      );
      PreGameMessages.error(res, 'Error: Game cannot be found');
    }
  } else {
    Logging.Game.warn(
      `[Access] player tried accessing with wrong token ${computedGameId}`
    );
    PreGameMessages.error(res, 'Error: Token cannot be verified');
  }
};
