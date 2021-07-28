"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameOptions = void 0;
var GameOptions = /** @class */ (function () {
    function GameOptions(options) {
        this.options = options;
    }
    Object.defineProperty(GameOptions.prototype, "ruleSet", {
        get: function () {
            return this.options.rules;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameOptions.prototype, "optionSet", {
        get: function () {
            return this.options.options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameOptions.prototype, "all", {
        get: function () {
            return this.options;
        },
        enumerable: false,
        configurable: true
    });
    GameOptions.default = function () {
        return new GameOptions({
            options: {
                realisticDraw: true,
                takeUntilFit: false,
                timeMode: false,
                strictMode: false,
                numberOfCards: 7
            },
            rules: {
                penaltyCard: true,
                addUp: true,
                cancleWithReverse: false,
                placeDirect: false,
                throwSame: false,
                exchange: false,
                globalExchange: false
            }
        });
    };
    GameOptions.custom = function (options) {
        return new GameOptions(__assign({}, options));
    };
    GameOptions.prototype.resolveFromMessage = function (options) {
        var _this = this;
        Object.entries(this.options.options).forEach(function (_a) {
            var _b = __read(_a, 1), optionKey = _b[0];
            if (optionKey in options) {
                _this.options[optionKey] = options[optionKey];
            }
        });
        Object.entries(this.options.rules).forEach(function (_a) {
            var _b = __read(_a, 1), optionKey = _b[0];
            if (optionKey in options) {
                _this.options[optionKey] = options[optionKey];
            }
        });
    };
    return GameOptions;
}());
exports.GameOptions = GameOptions;
