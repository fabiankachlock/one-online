/// <reference path="../../express-session.d.ts" />
import { Request, Response } from 'express';
import { requireLogin, requireActiveGame } from '../../helper';
import { Logging } from '../../logging';
import { PostGameMessages } from '../../postGameMessages';
import { GameStore } from '../../store/implementations/gameStore';

export const HandleGameStats = async (req: Request, res: Response) => {
  if (requireLogin(req, res) || requireActiveGame(req, res)) return;

  const id = req.session.gameId;
  const player = req.session.userId;
  const game = GameStore.getGame(id);

  if (game) {
    const stats = game.getStats(player);
    Logging.Game.info(`[Stats] ${player} fetched stats for ${id}`);
    PostGameMessages.stats(res, stats.winner, stats.url);
  } else {
    Logging.Game.warn(
      `[Stats] ${player} tried fetching stats for nonexisting game ${id}`
    );
    PostGameMessages.error(res, 'Error: Game not found');
  }
};
