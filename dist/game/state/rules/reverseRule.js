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
exports.ReverseGameRule = void 0;
var type_js_1 = require("../../cards/type.js");
var uiEvents_js_1 = require("../events/uiEvents.js");
var interface_js_1 = require("../../interface.js");
var basicRule_js_1 = require("./basicRule.js");
var ReverseGameRule = /** @class */ (function (_super) {
    __extends(ReverseGameRule, _super);
    function ReverseGameRule(supervisor) {
        if (supervisor === void 0) { supervisor = new basicRule_js_1.BasicGameRule(); }
        var _this = _super.call(this) || this;
        _this.supervisor = supervisor;
        _this.isResponsible = function (state, event) { return event.event === uiEvents_js_1.UIEventTypes.card && event.payload.card.type === type_js_1.CARD_TYPE.reverse; };
        _this.priority = interface_js_1.GameRulePriority.medium;
        _this.applyRule = function (state, event, pile) {
            console.log('REVERSE');
            var result = _this.supervisor.applyRule(state, event, pile);
            // reverse
            state.direction = state.direction === 'left' ? 'right' : 'left';
            return result;
        };
        return _this;
    }
    return ReverseGameRule;
}(basicRule_js_1.BasicGameRule));
exports.ReverseGameRule = ReverseGameRule;
