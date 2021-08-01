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
exports.UnoButtonRule = void 0;
var baseRule_js_1 = require("./baseRule.js");
var interface_js_1 = require("../../interface.js");
var client_js_1 = require("../events/client.js");
var UnoButtonRule = /** @class */ (function (_super) {
    __extends(UnoButtonRule, _super);
    function UnoButtonRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'uno-button-press';
        _this.priority = interface_js_1.GameRulePriority.low;
        _this.isResponsible = function (state, event) { return event.event === client_js_1.UIEventTypes.uno; };
        _this.applyRule = function (state, event, pile) {
            // setup Interrupt
            return {
                newState: state,
                moveCount: 0
            };
        };
        _this.getEvents = function (state, event) { return []; };
        return _this;
    }
    return UnoButtonRule;
}(baseRule_js_1.BaseGameRule));
exports.UnoButtonRule = UnoButtonRule;
