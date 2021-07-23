import { GameEvent } from "../../interface.js";


export const getPrioritisedEvent = (evts: GameEvent[]): GameEvent | undefined => {
    let top = undefined

    for (const evt of evts) {
        if (!top || top.priority < evt.priority) {
            top = evt
        }
    }

    return top
}