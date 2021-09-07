import { HandleChangePlayerName } from './changeName';
import { HandleRegisterPlayer } from './register';

export const PlayerApiHandler = {
  register: HandleRegisterPlayer,
  changeName: HandleChangePlayerName
};
