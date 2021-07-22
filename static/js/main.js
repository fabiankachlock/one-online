import { connect, verify } from "./game.js";
import { prepareUi } from "./uiEvents.js";
(function () {
    prepareUi();
    verify();
    connect();
})();
