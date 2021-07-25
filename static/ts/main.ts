import { connect, verify } from "./game.js"
import { displayPlayers, prepareUi, pushCardToDeck, selectPlayer, setTopCard } from "./uiEvents.js"

(() => {
    prepareUi()
    verify()
    connect()
    // displayPlayers([
    //     {
    //         name: 'abc',
    //         id: '123',
    //         cardAmount: 3
    //     },
    //     {
    //         name: 'abc2',
    //         id: '1232',
    //         cardAmount: 6
    //     },
    //     {
    //         name: 'abcd',
    //         id: '1232322',
    //         cardAmount: 6
    //     }
    // ])
    // selectPlayer('123')
    // pushCardToDeck({ type: 'ct/4', color: 'cc/red' })
    // pushCardToDeck({ type: 'ct/4', color: 'cc/red' })
    // pushCardToDeck({ type: 'ct/4', color: 'cc/red' })
    // pushCardToDeck({ type: 'ct/4', color: 'cc/red' })
    // setTopCard({ type: 'ct/4', color: 'cc/red' })
})()