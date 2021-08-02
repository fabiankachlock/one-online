"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameInterruptReason = exports.GameRulePriority = void 0;
var GameRulePriority;
(function (GameRulePriority) {
    GameRulePriority[GameRulePriority["none"] = -1] = "none";
    GameRulePriority[GameRulePriority["low"] = 1] = "low";
    GameRulePriority[GameRulePriority["medium"] = 10] = "medium";
    GameRulePriority[GameRulePriority["hight"] = 100] = "hight";
    GameRulePriority[GameRulePriority["extraHight"] = 500] = "extraHight";
    GameRulePriority[GameRulePriority["Infinite"] = Infinity] = "Infinite";
})(GameRulePriority = exports.GameRulePriority || (exports.GameRulePriority = {}));
var GameInterruptReason;
(function (GameInterruptReason) {
    GameInterruptReason["unoExpire"] = "interruptReason/unoExpire";
})(GameInterruptReason = exports.GameInterruptReason || (exports.GameInterruptReason = {}));
