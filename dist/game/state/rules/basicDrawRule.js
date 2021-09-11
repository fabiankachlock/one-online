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
exports.BasicDrawRule = void 0;
var baseRule_js_1 = require("./baseRule.js");
var interface_js_1 = require("../../interface.js");
var gameEvents_js_1 = require("../events/gameEvents.js");
var client_js_1 = require("../events/client.js");
var card_js_1 = require("./common/card.js");
var draw_js_1 = require("./common/draw.js");
var BasicDrawRule = /** @class */ (function (_super) {
    __extends(BasicDrawRule, _super);
    function BasicDrawRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'basic-draw';
        _this.priority = interface_js_1.GameRulePriority.low;
        _this.isResponsible = function (state, event) {
            return event.event === client_js_1.UIEventTypes.tryDraw;
        };
        _this.applyRule = function (state, event, pile) {
            var _a;
            var drawAmount = 1; // standard draw
            var alreadyActivated = state.stack[state.stack.length - 1].activatedEvent;
            // only draw, if the top card is draw card and not already drawn
            if (card_js_1.CardType.isDraw(state.topCard.type) && !alreadyActivated) {
                // determine amount and mark card as activated
                drawAmount = draw_js_1.GameDrawInteraction.getDrawAmount(state.topCard.type);
                state.stack[state.stack.length - 1].activatedEvent = true;
            }
            // draw cards
            var cards = [];
            for (var i = 0; i < drawAmount; i++) {
                cards.push(pile.draw());
            }
            // give cards to player
            if (event.playerId in state.decks) {
                (_a = state.decks[event.playerId]).push.apply(_a, __spreadArray([], __read(cards)));
            }
            // store event
            _this.lastEvent = gameEvents_js_1.drawEvent(event.playerId, cards);
            return {
                newState: state,
                moveCount: 1
            };
        };
        _this.getEvents = function (state, event) {
            if (_this.lastEvent) {
                return [_this.lastEvent];
            }
            return [];
        };
        return _this;
    }
    return BasicDrawRule;
}(baseRule_js_1.BaseGameRule));
exports.BasicDrawRule = BasicDrawRule;
