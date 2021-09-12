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
exports.BasicGameRule = void 0;
var baseRule_js_1 = require("./baseRule.js");
var client_js_1 = require("../events/client.js");
var interface_js_1 = require("../../interface.js");
var gameEvents_js_1 = require("../events/gameEvents.js");
var interaction_js_1 = require("./common/interaction.js");
var BasicGameRule = /** @class */ (function (_super) {
    __extends(BasicGameRule, _super);
    function BasicGameRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'basic-game';
        _this.isResponsible = function (state, event) {
            return event.event === client_js_1.UIEventTypes.tryPlaceCard;
        };
        _this.priority = interface_js_1.GameRulePriority.low;
        _this.applyRule = function (state, event, pile) {
            if (event.event !== client_js_1.UIEventTypes.tryPlaceCard) {
                return {
                    newState: state,
                    moveCount: 0
                };
            }
            var allowed = interaction_js_1.GameInteraction.canThrowCard(event.playerId, event.payload.card, state);
            if (allowed) {
                interaction_js_1.GameInteraction.placeCard(event.payload.card, event.playerId, state);
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
                    gameEvents_js_1.placeCardEvent(event.playerId, event.payload.card, event.payload.id, interaction_js_1.GameInteraction.canThrowCard(event.playerId, event.payload.card, state))
                ];
        };
        return _this;
    }
    return BasicGameRule;
}(baseRule_js_1.BaseGameRule));
exports.BasicGameRule = BasicGameRule;
