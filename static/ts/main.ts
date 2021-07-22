import { getRandomCard } from "./card.js"
import { connect, verify } from "./game.js"
import { prepareUi, pushCardToDeck } from "./uiEvents.js"

(() => {
    prepareUi()
    verify()
    connect()
})()