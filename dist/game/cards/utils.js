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
exports.shuffle = exports.CARD_DECK = exports.ALL_CARDS = exports.VALID_CARD_COLOR = exports.VALID_CARD_TYPES = exports.isColorCard = void 0;
var type_js_1 = require("./type.js");
var isColorCard = function (type) { return /\/\d$|skip$|draw2$|reverse$/.test(type); };
exports.isColorCard = isColorCard;
exports.VALID_CARD_TYPES = Object.entries(type_js_1.CARD_TYPE).map(function (_a) {
    var _b = __read(_a, 2), t = _b[1];
    return t;
}).filter(function (t) { return t !== type_js_1.CARD_TYPE.none; });
exports.VALID_CARD_COLOR = Object.entries(type_js_1.CARD_COLOR).map(function (_a) {
    var _b = __read(_a, 2), c = _b[1];
    return c;
}).filter(function (c) { return c !== type_js_1.CARD_COLOR.none; });
exports.ALL_CARDS = __spreadArray([], __read(exports.VALID_CARD_TYPES.map(function (t) {
    if (exports.isColorCard(t)) {
        return exports.VALID_CARD_COLOR.map(function (c) { return ({
            color: c,
            type: t
        }); });
    }
    else {
        return {
            color: type_js_1.CARD_COLOR.none,
            type: t
        };
    }
}).flat()));
exports.CARD_DECK = __spreadArray(__spreadArray(__spreadArray([], __read(exports.ALL_CARDS)), __read(exports.ALL_CARDS.filter(function (c) { return c.type !== type_js_1.CARD_TYPE.n0; }))), __read([type_js_1.CARD_TYPE.wild, type_js_1.CARD_TYPE.wildDraw2, type_js_1.CARD_TYPE.wildDraw4].map(function (t) { return ([
    {
        color: type_js_1.CARD_COLOR.none,
        type: t
    },
    {
        color: type_js_1.CARD_COLOR.none,
        type: t
    }
]); }).flat()));
var shuffle = function (array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = __read([array[j], array[i]], 2), array[i] = _a[0], array[j] = _a[1];
    }
    return array;
};
exports.shuffle = shuffle;
