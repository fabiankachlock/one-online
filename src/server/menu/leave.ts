import { Request, Response } from 'express';
import { requireLogin, requireGameInfo } from '../../helper';
import { Logging } from '../../logging';
import { PreGameMessages } from '../../preGameMessages';
import { useAccessToken } from '../../store/accessToken';
import { GameStore } from '../../store/implementations/gameStore';

export const HandleLeaveGame = async (req: Request, res: Response) => {
  if (requireLogin(req, res) || requireGameInfo(req, res)) return;

  const computedGameId =
    useAccessToken(req.session.activeToken || '') || req.session.gameId || '';

  const game = GameStore.getGame(computedGameId);

  if (game) {
    game.playerManager.leavePlayer(req.session.userId);
    Logging.Game.info(`[Leave] ${req.session.userId} leaved ${computedGameId}`);

    // reset session
    req.session.gameId = '';
    req.session.activeToken = '';

    res.send('');
  } else {
    Logging.Game.warn(
      `[Leave] ${req.session.userId} tried leaving nonexisting game ${computedGameId}`
    );

    // reset session
    req.session.gameId = '';
    req.session.activeToken = '';

    PreGameMessages.error(res, 'Error: Game cannot be found');
  }
};
