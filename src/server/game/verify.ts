/// <reference path="../../express-session.d.ts" />
import { Request, Response } from 'express';
import { requireLogin, requireActiveGame } from '../../helper';
import { Logging } from '../../logging';
import { PreGameMessages } from '../../preGameMessages';
import { GameStore } from '../../store/implementations/gameStore';

export const HandleGameVerify = async (req: Request, res: Response) => {
  if (requireLogin(req, res) || requireActiveGame(req, res)) return;

  const id = req.session.gameId;
  const player = req.session.userId;
  const game = GameStore.getGame(id);

  if (game?.playerManager.verifyPlayer(player)) {
    Logging.Game.info(`[Verify] ${player} allowed for ${id}`);
    PreGameMessages.verify(res, req.session.userId);
  } else {
    Logging.Game.warn(
      `[Verify] tried verifying player ${player} on nonexisting game ${id}`
    );
    PreGameMessages.error(res, 'Error: Not allowed to access game');
  }
};
