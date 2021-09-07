import { connect, verify } from './game.js';
import { prepareUi } from './uiEvents.js';

(async () => {
  const id = await verify();
  prepareUi(id);
  connect();
})();
