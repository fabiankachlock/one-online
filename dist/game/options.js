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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameOptions = exports.DefaultOptions = exports.OptionKey = void 0;
var OptionKey;
(function (OptionKey) {
    OptionKey["realisticDraw"] = "realisticDraw";
    OptionKey["takeUntilFit"] = "takeUntilFit";
    OptionKey["strictMode"] = "strictMode";
    OptionKey["timeMode"] = "timeMode";
    OptionKey["penaltyCard"] = "penaltyCard";
    OptionKey["addUp"] = "addUp";
    OptionKey["placeDirect"] = "placeDirect";
    OptionKey["cancelWithReverse"] = "cancelWithReverse";
    OptionKey["throwSame"] = "throwSame";
    OptionKey["exchange"] = "exchange";
    OptionKey["globalExchange"] = "globalExchange";
    OptionKey["none"] = "none";
})(OptionKey = exports.OptionKey || (exports.OptionKey = {}));
exports.DefaultOptions = {
    realisticDraw: true,
    takeUntilFit: false,
    timeMode: false,
    strictMode: false,
    penaltyCard: true,
    addUp: true,
    cancelWithReverse: false,
    placeDirect: false,
    throwSame: false,
    exchange: false,
    globalExchange: false,
    none: true,
    presets: {
        numberOfCards: 7
    }
};
var GameOptions = /** @class */ (function () {
    function GameOptions(options) {
        this.options = options;
    }
    Object.defineProperty(GameOptions.prototype, "all", {
        get: function () {
            return this.options;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GameOptions.prototype, "allActive", {
        get: function () {
            var _this = this;
            var keys = (Object.keys(OptionKey).filter(function (key) { return key !== OptionKey.none; }));
            return keys.filter(function (key) { return _this.options[key] === true; });
        },
        enumerable: false,
        configurable: true
    });
    GameOptions.default = function () {
        return new GameOptions(exports.DefaultOptions);
    };
    GameOptions.custom = function (options) {
        return new GameOptions(__assign({}, options));
    };
    GameOptions.prototype.resolveFromMessage = function (options) {
        var _this = this;
        Object.keys(this.options).forEach(function (key) {
            if (key in options) {
                _this.options[key] = options[key];
            }
        });
    };
    return GameOptions;
}());
exports.GameOptions = GameOptions;
