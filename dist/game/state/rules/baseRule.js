"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGameRule = void 0;
var interface_js_1 = require("../../interface.js");
var BaseGameRule = /** @class */ (function () {
    function BaseGameRule() {
        var _this = this;
        this.name = '__code-placeholder__';
        this.interruptGame = function () { };
        this.priority = interface_js_1.GameRulePriority.none;
        this.isResponsible = function (state, event) { return false; };
        this.getEvents = function (state, event) { return []; };
        this.applyRule = function (state, event, pile) { return ({
            newState: state,
            moveCount: 0
        }); };
        this.setupInterrupt = function (interruptHandler) {
            _this.interruptGame = interruptHandler;
        };
        this.isResponsibleForInterrupt = function (interrupt) { return false; };
        this.onInterrupt = function (interrupt, state, pile) { return ({
            newState: state,
            moveCount: 0,
            events: [],
        }); };
    }
    return BaseGameRule;
}());
exports.BaseGameRule = BaseGameRule;
