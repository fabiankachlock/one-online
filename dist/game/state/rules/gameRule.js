"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGameRule = void 0;
var gameEvents_js_1 = require("../events/gameEvents.js");
var BaseGameRule = /** @class */ (function () {
    function BaseGameRule() {
        this.isAllowedToDraw = function (state, event) { return true; };
        this.isResponsible = function (state, event) { return false; };
        this.canThrowCard = function (card, top) { return true; };
        this.getEvent = function (state, event) { return gameEvents_js_1.emptyEvent(); };
    }
    return BaseGameRule;
}());
exports.BaseGameRule = BaseGameRule;
