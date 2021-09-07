import { Request, Response } from 'express';
import { PreGameMessages } from '../../../preGameMessages';

export const HandleOptionsList = async (req: Request, res: Response) => {
  PreGameMessages.optionsList(res);
};
