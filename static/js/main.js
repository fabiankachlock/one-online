import { getRandomCard } from "./card.js";
import { state, connect } from "./game.js";
import { prepareUi, setTopCard, pushCardToDeck } from "./uiEvents.js";
(function () {
    prepareUi();
    connect();
    setTopCard(state.topCard);
    state.isCurrent = true;
    for (var i = 0; i < 5; i++) {
        setTimeout(function () {
            pushCardToDeck(getRandomCard());
        }, 600 * i);
    }
})();
