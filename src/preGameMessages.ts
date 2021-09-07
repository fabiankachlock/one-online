import { Response } from 'express';
import type * as PreGame from '../types/preGameMessages';
import {
  OptionDescription,
  OptionDescriptions
} from './game/optionDescriptions';
import { DefaultOptions, OptionKey } from './game/options';

export const PreGameMessages = {
  error: (res: Response, error: string) =>
    res.json(<PreGame.ErrorResponse>{ error: error }),

  created: (res: Response) =>
    res.json(<PreGame.CreatedResponse>{
      success: true,
      url: '/wait_host.html'
    }),

  joined: (res: Response) =>
    res.json(<PreGame.JoinedResponse>{
      success: true,
      url: '/wait.html'
    }),

  verify: (res: Response) => res.json(<PreGame.VerifyResponse>{ ok: true }),

  optionsList: (res: Response) =>
    res.json(
      <PreGame.GameOptionsList>(<[OptionKey, OptionDescription][]>(
        Object.entries(OptionDescriptions)
      )).map(([id, data]) => ({
        id,
        ...data,
        defaultOn: DefaultOptions[id] === true
      }))
    )
};
