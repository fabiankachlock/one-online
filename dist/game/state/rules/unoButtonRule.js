"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnoButtonRule = void 0;
var baseRule_js_1 = require("./baseRule.js");
var interface_js_1 = require("../../interface.js");
var client_js_1 = require("../events/client.js");
var gameEvents_js_1 = require("../events/gameEvents.js");
var options_js_1 = require("../../options.js");
/**
 * How this works:
 *
 * Whenever some game update occurs every players card count gets checked.
 * > If it changed, all timeouts get deleted (example player had to draw a second card).
 * > If the current count is 1 a interrupt get's scheduled
 *
 * When some player hits the uno button, this rule get's applied.
 * > This will cancel the interrupt and all is fine.
 *
 * When some timeout exceeds the game gets interrupted.
 * > The interrupt handler will catch teh interrupt and send the penalty cards to the player.
 */
var UnoButtonRule = /** @class */ (function (_super) {
    __extends(UnoButtonRule, _super);
    function UnoButtonRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'uno-button-press';
        _this.associatedRule = options_js_1.OptionKey.penaltyCard;
        _this.priority = interface_js_1.GameRulePriority.low;
        _this.timeoutInterval = 2000;
        _this.penaltyCards = 2;
        _this.interrupts = {};
        _this.interruptCancelled = new Set();
        _this.cardsAmounts = {};
        // listen to game updates
        _this.onGameUpdate = function (state, outgoingEvents) {
            var e_1, _a;
            var _loop_1 = function (playerId, deck) {
                if (deck.length === _this.cardsAmounts[playerId])
                    return "continue";
                else {
                    // detect card amount change --> reset interrupt state
                    _this.cardsAmounts[playerId] = deck.length;
                    _this.interruptCancelled.delete(playerId);
                    delete _this.interrupts[playerId];
                }
                // only setup interrupt when one card is left && the interrupt inst already cancelled
                if (deck.length === 1 && !_this.interruptCancelled.has(playerId)) {
                    _this.interrupts[playerId] = setTimeout(function () { return _this.handleTimeout(playerId); }, _this.timeoutInterval);
                }
            };
            try {
                // check for players with 0 cards --> setup timeout
                for (var _b = __values(Object.entries(state.decks)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), playerId = _d[0], deck = _d[1];
                    _loop_1(playerId, deck);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        };
        _this.isResponsible = function (state, event) {
            return event.event === client_js_1.UIEventTypes.uno;
        };
        // get's called when some player pressed the uno button
        _this.applyRule = function (state, event, pile) {
            // clear timeout --> remove penalty
            if (_this.interrupts[event.playerId]) {
                clearTimeout(_this.interrupts[event.playerId]);
                delete _this.interrupts[event.playerId];
                _this.interruptCancelled.add(event.playerId);
            }
            // don't change actual state
            return {
                newState: state,
                moveCount: 0
            };
        };
        // handler, when time for pressing the uno button exceed
        _this.handleTimeout = function (playerId) {
            // timeout exceed --> interrupt game & send penalty
            delete _this.interrupts[playerId];
            _this.interruptGame({
                reason: interface_js_1.GameInterruptReason.unoExpire,
                targetPlayers: [playerId]
            });
        };
        _this.isResponsibleForInterrupt = function (interrupt) {
            return interrupt.reason === interface_js_1.GameInterruptReason.unoExpire;
        };
        // handle interrupt (send penalty to player)
        _this.onInterrupt = function (interrupt, state, pile) {
            var e_2, _a, _b;
            var events = [];
            try {
                // send penalty cards
                for (var _c = __values(interrupt.targetPlayers), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var pId = _d.value;
                    var cards = [];
                    // draw cards
                    for (var i = 0; i < _this.penaltyCards; i++) {
                        cards.push(pile.draw());
                    }
                    // ..and update deck
                    (_b = state.decks[pId]).push.apply(_b, __spreadArray([], __read(cards)));
                    events.push(gameEvents_js_1.drawEvent(pId, cards));
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return {
                newState: state,
                moveCount: 0,
                events: events
            };
        };
        return _this;
    }
    return UnoButtonRule;
}(baseRule_js_1.BaseGameRule));
exports.UnoButtonRule = UnoButtonRule;
