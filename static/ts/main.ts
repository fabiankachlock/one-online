import { connect, verify } from './game.js';
import { prepareUi } from './uiEvents.js';

/**
 * enable debugging for mobile devices
 */

const oldConsole = Object.assign({}, window.console);

window.console = (() => {
  const consoleKeys = Object.keys(window.console);

  // @ts-ignore
  const spy: Console = {};

  for (const key of consoleKeys) {
    // @ts-ignore
    if (typeof window.console[key] === 'function') {
      // @ts-ignore
      spy[key] = (...args) => {
        window.localStorage.setItem(
          '_log-' + Date.now().toString(),
          JSON.stringify(args)
        );
        // @ts-ignore
        oldConsole[key](...args);
      };
    } else {
      // @ts-ignore
      spy[key] = oldConsole[key];
    }
  }

  return spy;
})();

(async () => {
  const id = await verify();
  prepareUi(id);
  connect();
})();
