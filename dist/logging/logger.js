"use strict";
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
exports.Logger = void 0;
var MultipleWhiteSpaceRegex = /\s+/g;
var Logger = /** @class */ (function () {
    function Logger(prefix) {
        var _this = this;
        var badges = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            badges[_i - 1] = arguments[_i];
        }
        this.bagdes = '';
        this.info = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return console.info(_this.logString.apply(_this, __spreadArray([_this.prefix, _this.bagdes], __read(data))));
        };
        this.warn = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return console.warn(_this.logString.apply(_this, __spreadArray(['[Warn]', _this.prefix, _this.bagdes], __read(data))));
        };
        this.log = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return console.log(_this.logString.apply(_this, __spreadArray([_this.prefix, _this.bagdes], __read(data))));
        };
        this.error = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return console.error(_this.logString.apply(_this, __spreadArray(['[Error]', _this.prefix, _this.bagdes], __read(data))));
        };
        this.addBadge = function (badge) {
            _this.badgeArray.push(badge);
            _this.constructBadges();
        };
        this.resetBadges = function () {
            _this.badgeArray = [];
            _this.constructBadges();
        };
        this.constructBadges = function () {
            _this.bagdes = _this.badgeArray.map(function (b) { return "[" + b + "]"; }).join(' ');
        };
        this.logString = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            var str = data.join(' ');
            return str.replace(MultipleWhiteSpaceRegex, ' ');
        };
        this.withBadge = function (badge) {
            return new (Logger.bind.apply(Logger, __spreadArray(__spreadArray([void 0, _this.prefixName], __read(_this.badgeArray)), [badge])))();
        };
        this.badgeArray = badges;
        this.prefixName = prefix;
        this.constructBadges();
        if (prefix.length > 0) {
            this.prefix = '[' + prefix + ']';
        }
        else {
            this.prefix = '>';
        }
        if (process.env.NODE_ENV === 'production') {
            this.info = function () { };
            this.log = function () { };
        }
    }
    return Logger;
}());
exports.Logger = Logger;
