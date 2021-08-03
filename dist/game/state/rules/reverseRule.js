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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReverseGameRule = void 0;
var type_js_1 = require("../../cards/type.js");
var client_js_1 = require("../events/client.js");
var interface_js_1 = require("../../interface.js");
var basicRule_js_1 = require("./basicRule.js");
var ReverseGameRule = /** @class */ (function (_super) {
    __extends(ReverseGameRule, _super);
    function ReverseGameRule(supervisor) {
        if (supervisor === void 0) { supervisor = new basicRule_js_1.BasicGameRule(); }
        var _this = _super.call(this) || this;
        _this.supervisor = supervisor;
        _this.name = 'reverse';
        _this.isResponsible = function (state, event) {
            return event.event === client_js_1.UIEventTypes.tryPlaceCard &&
                event.payload.card.type === type_js_1.CARD_TYPE.reverse;
        };
        _this.priority = interface_js_1.GameRulePriority.medium;
        _this.applyRule = function (state, event, pile) {
            var result = _this.supervisor.applyRule(state, event, pile);
            if (result.moveCount > 0) {
                // reverse
                state.direction = state.direction === 'left' ? 'right' : 'left';
            }
            return __assign(__assign({}, result), { moveCount: result.moveCount > 0
                    ? Object.keys(state.decks).length === 2
                        ? 0 // only two players -> stay at the current
                        : 1 // more than two players -> move to the next
                    : 0 });
        };
        return _this;
    }
    return ReverseGameRule;
}(basicRule_js_1.BasicGameRule));
exports.ReverseGameRule = ReverseGameRule;
