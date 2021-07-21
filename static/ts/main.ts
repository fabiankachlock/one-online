import { getRandomCard } from "./card.js"
import { state, connect } from "./game.js"
import { prepareUi, setTopCard, pushCardToDeck } from "./uiEvents.js"

(() => {
    prepareUi()
    //verify()
    connect()
    setTopCard(state.topCard)
    state.isCurrent = true
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            pushCardToDeck(getRandomCard())
        }, 600 * i)
    }
})()