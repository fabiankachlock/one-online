/// <reference path="../../express-session.d.ts" />
import { Request, Response } from 'express';
import type * as PreGame from '../../../types/preGameMessages';
import { Logging } from '../../logging';
import { PlayerStore } from '../../store/implementations/playerStore';

export const HandleChangePlayerName = async (req: Request, res: Response) => {
  const { name } = <PreGame.PlayerRegisterBody>req.body;
  const id = req.session.userId;

  PlayerStore.changePlayerName(id, name);
  Logging.Player.info(`player ${id} changed name to ${name}`);

  res.send(<PreGame.PlayerRegisterResponse>{ name: name });
};
