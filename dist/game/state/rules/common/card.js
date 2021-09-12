"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardType = void 0;
var type_1 = require("../../../cards/type");
exports.CardType = {
    isDraw: function (t) {
        return t === type_1.CARD_TYPE.draw2 ||
            t === type_1.CARD_TYPE.wildDraw2 ||
            t === type_1.CARD_TYPE.wildDraw4;
    },
    isWild: function (t) {
        return t === type_1.CARD_TYPE.wild ||
            t === type_1.CARD_TYPE.wildDraw2 ||
            t === type_1.CARD_TYPE.wildDraw4;
    }
};
