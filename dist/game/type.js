"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_CARDS = exports.isColorCard = exports.CARD_TYPE = exports.CARD_COLOR = void 0;
var CARD_COLOR;
(function (CARD_COLOR) {
    CARD_COLOR["green"] = "cc/green";
    CARD_COLOR["red"] = "cc/red";
    CARD_COLOR["blue"] = "cc/blue";
    CARD_COLOR["yellow"] = "cc/yellow";
    CARD_COLOR["none"] = "none";
})(CARD_COLOR = exports.CARD_COLOR || (exports.CARD_COLOR = {}));
var CARD_TYPE;
(function (CARD_TYPE) {
    CARD_TYPE["n1"] = "ct/1";
    CARD_TYPE["n2"] = "ct/2";
    CARD_TYPE["n3"] = "ct/3";
    CARD_TYPE["n4"] = "ct/4";
    CARD_TYPE["n5"] = "ct/5";
    CARD_TYPE["n6"] = "ct/6";
    CARD_TYPE["n7"] = "ct/7";
    CARD_TYPE["n8"] = "ct/8";
    CARD_TYPE["n9"] = "ct/9";
    CARD_TYPE["n0"] = "ct/0";
    CARD_TYPE["skip"] = "ct/skip";
    CARD_TYPE["draw2"] = "ct/draw2";
    CARD_TYPE["reverse"] = "ct/reverse";
    CARD_TYPE["wild"] = "ct/wild";
    CARD_TYPE["wildDraw4"] = "ct/wildDraw4";
    CARD_TYPE["wildDraw2"] = "ct/wildDraw2";
    CARD_TYPE["none"] = "none";
})(CARD_TYPE = exports.CARD_TYPE || (exports.CARD_TYPE = {}));
var isColorCard = function (type) { return /\/\d$|pause$|take2$|changeDirections$/.test(type); };
exports.isColorCard = isColorCard;
exports.ALL_CARDS = __spreadArray([], Object.entries(CARD_TYPE).map(function (_a) {
    var t = _a[1];
    if (exports.isColorCard(t)) {
        return Object.entries(CARD_COLOR).map(function (_a) {
            var c = _a[1];
            return ({
                color: c,
                type: t
            });
        });
    }
    else {
        return {
            color: CARD_COLOR.none,
            type: t
        };
    }
}).flat());
