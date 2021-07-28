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
exports.SkipGameRule = void 0;
var type_js_1 = require("../../cards/type.js");
var client_js_1 = require("../../../../types/client.js");
var interface_js_1 = require("../../interface.js");
var basicRule_js_1 = require("./basicRule.js");
var SkipGameRule = /** @class */ (function (_super) {
    __extends(SkipGameRule, _super);
    function SkipGameRule(supervisor) {
        if (supervisor === void 0) { supervisor = new basicRule_js_1.BasicGameRule(); }
        var _this = _super.call(this) || this;
        _this.supervisor = supervisor;
        _this.isResponsible = function (state, event) { return event.event === client_js_1.UIEventTypes.card && event.payload.card.type === type_js_1.CARD_TYPE.skip; };
        _this.priority = interface_js_1.GameRulePriority.medium;
        _this.applyRule = function (state, event, pile) {
            var result = _this.supervisor.applyRule(state, event, pile);
            return __assign(__assign({}, result), { moveCount: result.moveCount > 0 ? 2 : 0 });
        };
        return _this;
    }
    return SkipGameRule;
}(basicRule_js_1.BasicGameRule));
exports.SkipGameRule = SkipGameRule;
