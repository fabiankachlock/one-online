"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRulePriority = void 0;
var GameRulePriority;
(function (GameRulePriority) {
    GameRulePriority[GameRulePriority["none"] = -1] = "none";
    GameRulePriority[GameRulePriority["low"] = 1] = "low";
    GameRulePriority[GameRulePriority["medium"] = 10] = "medium";
    GameRulePriority[GameRulePriority["hight"] = 100] = "hight";
    GameRulePriority[GameRulePriority["extraHight"] = 500] = "extraHight";
    GameRulePriority[GameRulePriority["Infinite"] = Infinity] = "Infinite";
})(GameRulePriority = exports.GameRulePriority || (exports.GameRulePriority = {}));
