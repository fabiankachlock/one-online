"use strict";
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleManager = void 0;
var addUpRule_1 = require("./rules/addUpRule");
var basicDrawRule_1 = require("./rules/basicDrawRule");
var basicRule_1 = require("./rules/basicRule");
var reverseRule_1 = require("./rules/reverseRule");
var skipRule_1 = require("./rules/skipRule");
var unoButtonRule_1 = require("./rules/unoButtonRule");
var RuleManager = /** @class */ (function () {
    function RuleManager(options, interrupt) {
        var e_1, _a;
        var _this = this;
        this.getResponsibleRules = function (event, state) {
            return _this.rules.filter(function (r) { return r.isResponsible(state, event); });
        };
        this.getResponsibleRulesForInterrupt = function (interrupt) {
            return _this.rules.filter(function (r) { return r.isResponsibleForInterrupt(interrupt); });
        };
        this.getPrioritizedRules = function (rules) {
            return rules.sort(function (a, b) { return a.priority - b.priority; }).pop();
        };
        this.rules = RuleManager.allRules.filter(function (r) { return options[r.associatedRule]; });
        try {
            for (var _b = __values(this.rules), _c = _b.next(); !_c.done; _c = _b.next()) {
                var rule = _c.value;
                rule.setupInterrupt(interrupt);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    }
    Object.defineProperty(RuleManager.prototype, "all", {
        get: function () {
            return __spreadArray([], __read(this.rules));
        },
        enumerable: false,
        configurable: true
    });
    RuleManager.allRules = [
        new basicRule_1.BasicGameRule(),
        new basicDrawRule_1.BasicDrawRule(),
        new reverseRule_1.ReverseGameRule(),
        new skipRule_1.SkipGameRule(),
        new addUpRule_1.AddUpRule(),
        new unoButtonRule_1.UnoButtonRule()
    ];
    return RuleManager;
}());
exports.RuleManager = RuleManager;
