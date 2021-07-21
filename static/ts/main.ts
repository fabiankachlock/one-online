import { getRandomCard } from "./card.js"
import { connect, verify } from "./game.js"
import { prepareUi, pushCardToDeck } from "./uiEvents.js"

(() => {
    prepareUi()
    verify()
    connect()
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            pushCardToDeck(getRandomCard())
        }, 600 * i)
    }
})()