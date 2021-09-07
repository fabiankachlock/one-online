import { HandleAccessGame } from './access';
import { HandleCreateGame } from './create';
import { HandleJoinGame } from './join';
import { HandleLeaveGame } from './leave';

export const MenuApiHandler = {
  access: HandleAccessGame,
  create: HandleCreateGame,
  join: HandleJoinGame,
  leave: HandleLeaveGame
};
