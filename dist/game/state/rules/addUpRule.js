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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUpRule = void 0;
var client_js_1 = require("../events/client.js");
var interface_js_1 = require("../../interface.js");
var basicRule_js_1 = require("./basicRule.js");
var baseRule_js_1 = require("./baseRule.js");
var gameEvents_js_1 = require("../events/gameEvents.js");
var options_js_1 = require("../../options.js");
var card_js_1 = require("./common/card.js");
var interaction_js_1 = require("./common/interaction.js");
var draw_js_1 = require("./common/draw.js");
/**
 * How this works:
 *
 * Since the rule has to override both placeCard and drawCard mechanisms the rule got split up.
 * Both sub rules are combined in the AddUpRule
 */
var AddUpRule = /** @class */ (function (_super) {
    __extends(AddUpRule, _super);
    function AddUpRule(placeCardRule, drawCardRule) {
        if (placeCardRule === void 0) { placeCardRule = new AddUpPlaceCardRule(); }
        if (drawCardRule === void 0) { drawCardRule = new AppUpDrawRule(); }
        var _this = _super.call(this) || this;
        _this.placeCardRule = placeCardRule;
        _this.drawCardRule = drawCardRule;
        _this.name = 'add-up';
        // define option, which has to be activated, to activate this rule
        _this.associatedRule = options_js_1.OptionKey.addUp;
        _this.isResponsible = function (state, event) {
            return _this.drawCardRule.isResponsible(state, event) ||
                _this.placeCardRule.isResponsible(state, event);
        };
        _this.priority = interface_js_1.GameRulePriority.medium;
        _this.applyRule = function (state, event, pile) {
            // determine responsible sub rule
            if (_this.placeCardRule.isResponsible(state, event)) {
                return _this.placeCardRule.applyRule(state, event, pile);
            }
            return _this.drawCardRule.applyRule(state, event, pile);
        };
        _this.getEvents = function (state, event) {
            // determine responsible sub rule
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
            return event.event === client_js_1.UIEventTypes.tryPlaceCard &&
                card_js_1.CardType.isDraw(state.topCard.type) &&
                card_js_1.CardType.isDraw(event.payload.card.type);
        };
        // override basic canThrowCard
        _this.canThrowCard = function (card, top, topActivated) {
            var fits = card.type === top.type || card.color === top.color;
            if (card_js_1.CardType.isDraw(top.type) &&
                !card_js_1.CardType.isDraw(card.type) &&
                !topActivated)
                return false;
            return card_js_1.CardType.isWild(card.type) || fits;
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
            // can't throw, if the card isn't in the players deck
            if (!interaction_js_1.GameInteraction.hasCard(event.playerId, card, state)) {
                allowed = false;
            }
            if (allowed) {
                // perform basic card placement
                interaction_js_1.GameInteraction.placeCard(card, event.playerId, state);
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
        _this.priority = interface_js_1.GameRulePriority.low;
        _this.isResponsible = function (state, event) {
            return event.event === client_js_1.UIEventTypes.tryDraw;
        };
        _this.applyRule = function (state, event, pile) {
            _this.lastEvent = draw_js_1.GameDrawInteraction.performDraw(state, event, pile, draw_js_1.GameDrawInteraction.getRecursiveDrawAmount(state.stack.slice()));
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
