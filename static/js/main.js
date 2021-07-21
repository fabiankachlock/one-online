import { getRandomCard } from "./card.js";
import { connect, verify } from "./game.js";
import { prepareUi, pushCardToDeck } from "./uiEvents.js";
(function () {
    prepareUi();
    verify();
    connect();
    for (var i = 0; i < 5; i++) {
        setTimeout(function () {
            pushCardToDeck(getRandomCard());
        }, 600 * i);
    }
})();
