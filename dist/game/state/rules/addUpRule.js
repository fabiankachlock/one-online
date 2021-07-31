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
exports.AddUpRule = void 0;
var type_js_1 = require("../../cards/type.js");
var client_js_1 = require("../events/client.js");
var interface_js_1 = require("../../interface.js");
var basicRule_js_1 = require("./basicRule.js");
var baseRule_js_1 = require("./baseRule.js");
var gameEvents_js_1 = require("../events/gameEvents.js");
var isDraw = function (t) {
    return t === type_js_1.CARD_TYPE.draw2 ||
        t === type_js_1.CARD_TYPE.wildDraw2 ||
        t === type_js_1.CARD_TYPE.wildDraw4;
};
var isWild = function (t) {
    return t === type_js_1.CARD_TYPE.wild ||
        t === type_js_1.CARD_TYPE.wildDraw2 ||
        t === type_js_1.CARD_TYPE.wildDraw4;
};
var AddUpRule = /** @class */ (function (_super) {
    __extends(AddUpRule, _super);
    function AddUpRule(placeCardRule, drawCardRule) {
        if (placeCardRule === void 0) { placeCardRule = new AddUpPlaceCardRule(); }
        if (drawCardRule === void 0) { drawCardRule = new AppUpDrawRule(); }
        var _this = _super.call(this) || this;
        _this.placeCardRule = placeCardRule;
        _this.drawCardRule = drawCardRule;
        _this.name = 'add-up';
        _this.isResponsible = function (state, event) {
            return _this.drawCardRule.isResponsible(state, event) ||
                _this.placeCardRule.isResponsible(state, event);
        };
        _this.priority = interface_js_1.GameRulePriority.medium;
        _this.applyRule = function (state, event, pile) {
            if (_this.placeCardRule.isResponsible(state, event)) {
                return _this.placeCardRule.applyRule(state, event, pile);
            }
            return _this.drawCardRule.applyRule(state, event, pile);
        };
        _this.getEvents = function (state, event) {
            if (_this.placeCardRule.isResponsible(state, event)) {
                return _this.placeCardRule.getEvents(state, event);
            }
            return _this.drawCardRule.getEvents(state, event);
        };
        return _this;
    }
    return AddUpRule;
}(basicRule_js_1.BasicGameRule));
exports.AddUpRule = AddUpRule;
var AddUpPlaceCardRule = /** @class */ (function (_super) {
    __extends(AddUpPlaceCardRule, _super);
    function AddUpPlaceCardRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isResponsible = function (state, event) {
            return event.event === client_js_1.UIEventTypes.tryPlaceCard && isDraw(state.topCard.type);
        };
        _this.canThrowCard = function (card, top, topActivated) {
            var fits = card.type === top.type || card.color === top.color;
            if (isDraw(top.type) && !isDraw(card.type) && !topActivated)
                return false;
            return isWild(card.type) || fits;
        };
        _this.applyRule = function (state, event, pile) {
            if (event.event !== client_js_1.UIEventTypes.tryPlaceCard) {
                return {
                    newState: state,
                    moveCount: 0
                };
            }
            var card = event.payload.card;
            var top = state.topCard;
            var allowed = _this.canThrowCard(card, top, state.stack[state.stack.length - 1].activatedEvent);
            if (allowed) {
                state.stack.push({
                    card: card,
                    activatedEvent: false
                });
                state.topCard = card;
                var cardIndex = state.decks[event.playerId].findIndex(function (c) { return c.type === card.type && c.color === card.color; });
                state.decks[event.playerId].splice(cardIndex, 1);
            }
            return {
                newState: state,
                moveCount: allowed ? 1 : 0
            };
        };
        _this.getEvents = function (state, event) {
            return event.event !== client_js_1.UIEventTypes.tryPlaceCard
                ? []
                : [
                    gameEvents_js_1.placeCardEvent(event.playerId, event.payload.card, event.payload.id, _this.canThrowCard(event.payload.card, state.topCard, state.stack[state.stack.length - 1].activatedEvent))
                ];
        };
        return _this;
    }
    return AddUpPlaceCardRule;
}(basicRule_js_1.BasicGameRule));
var AppUpDrawRule = /** @class */ (function (_super) {
    __extends(AppUpDrawRule, _super);
    function AppUpDrawRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.getDrawAmount = function (stack) {
            var amount = 0;
            var top = stack.pop();
            while (top && isDraw(top.card.type) && !top.activatedEvent) {
                amount += parseInt(top.card.type.slice(-1));
                top = stack.pop();
            }
            return amount;
        };
        _this.priority = interface_js_1.GameRulePriority.low;
        _this.isResponsible = function (state, event) {
            return event.event === client_js_1.UIEventTypes.tryDraw;
        };
        _this.applyRule = function (state, event, pile) {
            var _a;
            var drawAmount = 1; // standart draw
            var alreadyActivated = state.stack[state.stack.length - 1].activatedEvent;
            if (isDraw(state.topCard.type) && !alreadyActivated) {
                drawAmount = _this.getDrawAmount(state.stack.slice());
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
    return AppUpDrawRule;
}(baseRule_js_1.BaseGameRule));
