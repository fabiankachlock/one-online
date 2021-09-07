import { Request, Response } from 'express';
import { Player } from '../../../types';
import type * as PreGame from '../../../types/preGameMessages';
import { Logging } from '../../logging';
import { PlayerStore } from '../../store/implementations/playerStore';
import { v4 as uuid } from 'uuid';

export const HandleRegisterPlayer = async (req: Request, res: Response) => {
  const sessionUserId = req.session.userId;
  const { name } = <PreGame.PlayerRegisterBody>req.body;

  // Case 1: player already logged in
  if (sessionUserId) {
    const userName = req.session.userName;

    // Case 1.1: all data already in session
    if (userName) {
      // verify credentials
      const storedName = PlayerStore.getPlayerName(sessionUserId);
      if (storedName === userName) {
        return res.json(<PreGame.PlayerRegisterVerifiedResponse>{ ok: true });
      } else {
        return res.json(<PreGame.PlayerRegisterResponse>{ name: storedName });
      }
    } else {
      // Case 1.2: missing user name, but registered
      const userName = PlayerStore.getPlayerName(sessionUserId);

      if (userName) {
        // set session
        req.session.userName = userName;

        return res.json(<PreGame.PlayerRegisterResponse>{ name: userName });
      }
    }
  }

  // Case 2: registered, not logged in
  const id = PlayerStore.getPlayerId(name);
  if (id) {
    // set session
    req.session.userId = id;
    req.session.userName = name;

    return res.json(<PreGame.PlayerRegisterResponse>{ name: name });
  }

  // Case 3: not registered
  if (name) {
    const newId = uuid();
    const newPlayer: Player = {
      id: newId,
      name
    };

    Logging.Player.info(`player ${newId} registered under name ${name}`);
    PlayerStore.storePlayer(newPlayer);

    // set session
    req.session.userId = newId;
    req.session.userName = name;

    return res.json(<PreGame.PlayerRegisterResponse>{ name: name });
  }

  // Case 4: no registered and no information
  res.json(<PreGame.ErrorResponse>{
    error: 'Not enough information provided for register'
  });
};
