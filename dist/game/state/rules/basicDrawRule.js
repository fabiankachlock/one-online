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
exports.BasicDrawRule = void 0;
var type_js_1 = require("../../cards/type.js");
var gameRule_js_1 = require("./gameRule.js");
var uiEvents_js_1 = require("../events/uiEvents.js");
var gameEvents_js_1 = require("../events/gameEvents.js");
var BasicDrawRule = /** @class */ (function (_super) {
    __extends(BasicDrawRule, _super);
    function BasicDrawRule() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isDraw = function (t) { return t === type_js_1.CARD_TYPE.draw2 || t === type_js_1.CARD_TYPE.wildDraw2 || t === type_js_1.CARD_TYPE.wildDraw4; };
        _this.getDrawAmount = function (t) { return parseInt(t.slice(-1)); };
        _this.isResponsible = function (state, event) { return event.event === uiEvents_js_1.UIEventTypes.draw; };
        _this.getEvent = function (state, event) {
            var drawAmount = 1; // standart draw
            if (_this.isDraw(state.topCard.type)) {
                drawAmount = _this.getDrawAmount(state.topCard.type);
            }
            return gameEvents_js_1.internalDrawEvent(event.playerId, drawAmount, Infinity);
        };
        return _this;
    }
    return BasicDrawRule;
}(gameRule_js_1.BaseGameRule));
exports.BasicDrawRule = BasicDrawRule;
