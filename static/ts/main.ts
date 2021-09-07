import { connect, verify } from './game.js';
import { prepareUi } from './uiEvents.js';

(async () => {
  prepareUi();
  await verify();
  connect();
})();
