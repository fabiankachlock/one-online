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
var type_js_1 = require("../../cards/type.js");
var baseRule_js_1 = require("./baseRule.js");
var interface_js_1 = require("../../interface.js");
var gameEvents_js_1 = require("../events/gameEvents.js");
var client_js_1 = require("../events/client.js");
var BasicDrawRule = /** @class */ (function (_super) {
    __extends(BasicDrawRule, _super);
    function BasicDrawRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isDraw = function (t) {
            return t === type_js_1.CARD_TYPE.draw2 ||
                t === type_js_1.CARD_TYPE.wildDraw2 ||
                t === type_js_1.CARD_TYPE.wildDraw4;
        };
        _this.getDrawAmount = function (t) { return parseInt(t.slice(-1)); };
        _this.priority = interface_js_1.GameRulePriority.low;
        _this.isResponsible = function (state, event) {
            return event.event === client_js_1.UIEventTypes.tryDraw;
        };
        _this.applyRule = function (state, event, pile) {
            var _a;
            var drawAmount = 1; // standart draw
            var alreadyActivated = state.stack[state.stack.length - 1].activatedEvent;
            if (_this.isDraw(state.topCard.type) && !alreadyActivated) {
                drawAmount = _this.getDrawAmount(state.topCard.type);
                state.stack[state.stack.length - 1].activatedEvent = true;
            }
            var cards = [];
            for (var i = 0; i < drawAmount; i++) {
                cards.push(pile.draw());
            }
            (_a = state.decks[event.playerId]).push.apply(_a, __spreadArray([], __read(cards)));
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
