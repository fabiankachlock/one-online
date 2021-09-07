import { HandleChangePlayerName } from './changeNAme';
import { HandleRegisterPlayer } from './register';

export const PlayerApiHandler = {
  register: HandleRegisterPlayer,
  changeName: HandleChangePlayerName
};
