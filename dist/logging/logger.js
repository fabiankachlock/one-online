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
var Logger = /** @class */ (function () {
    function Logger(prefix) {
        var _this = this;
        this.info = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return console.info.apply(console, __spreadArray([_this.prefix], __read(data)));
        };
        this.warn = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return console.info.apply(console, __spreadArray(['[Warn]', _this.prefix], __read(data)));
        };
        this.log = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return console.info.apply(console, __spreadArray([_this.prefix], __read(data)));
        };
        this.error = function () {
            var data = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                data[_i] = arguments[_i];
            }
            return console.info.apply(console, __spreadArray(['[Error]', _this.prefix], __read(data)));
        };
        if (prefix.length > 0) {
            this.prefix = '[' + prefix + ']';
        }
        else {
            this.prefix = '>';
        }
    }
    return Logger;
}());
exports.Logger = Logger;
