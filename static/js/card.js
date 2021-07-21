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
var _a, _b;
export var CARD_COLOR = {
    green: 'cc/green',
    red: 'cc/red',
    blue: 'cc/blue',
    yellow: 'cc/yellow',
    none: 'none'
};
export var CARD_TYPE = {
    '1': 'ct/1',
    '2': 'ct/2',
    '3': 'ct/3',
    '4': 'ct/4',
    '5': 'ct/5',
    '6': 'ct/6',
    '7': 'ct/7',
    '8': 'ct/8',
    '9': 'ct/9',
    '0': 'ct/0',
    skip: 'ct/skip',
    draw2: 'ct/draw2',
    reverse: 'ct/reverse',
    wild: 'ct/wild',
    wildDraw4: 'ct/wildDraw4',
    wildDraw2: 'ct/wildDraw2',
    none: 'none'
};
export var isColorCard = function (type) { return /\/\d$|skip$|draw2$|reverse$/.test(type); };
export var ALL_CARDS = __spreadArray([], __read(Object.entries(CARD_TYPE).map(function (_a) {
    var _b = __read(_a, 2), t = _b[1];
    if (isColorCard(t)) {
        return Object.entries(CARD_COLOR).map(function (_a) {
            var _b = __read(_a, 2), c = _b[1];
            return ({
                color: c,
                type: t
            });
        });
    }
    else {
        return {
            color: 'none',
            type: t
        };
    }
}).flat()));
export var CARD_DECK = __spreadArray(__spreadArray(__spreadArray([], __read(ALL_CARDS)), __read(ALL_CARDS.filter(function (c) { return c.type !== CARD_TYPE[0]; }))), __read([CARD_TYPE.wild, CARD_TYPE.wildDraw2, CARD_TYPE.wildDraw4].map(function (t) { return ([
    {
        color: 'none',
        type: t
    },
    {
        color: 'none',
        type: t
    }
]); }).flat()));
export var getRandomCard = function () { return CARD_DECK[Math.floor(Math.random() * CARD_DECK.length)]; };
export var setBackgoundPosition = function (elm, x, y) {
    elm.setAttribute('style', '--x: ' + x + '; --y: ' + y + ';');
};
export var CARD_X_OFFSET = (_a = {},
    _a[CARD_TYPE['0']] = 0,
    _a[CARD_TYPE['1']] = 1,
    _a[CARD_TYPE['2']] = 2,
    _a[CARD_TYPE['3']] = 3,
    _a[CARD_TYPE['4']] = 4,
    _a[CARD_TYPE['5']] = 5,
    _a[CARD_TYPE['6']] = 6,
    _a[CARD_TYPE['7']] = 7,
    _a[CARD_TYPE['8']] = 8,
    _a[CARD_TYPE['9']] = 9,
    _a[CARD_TYPE.skip] = 10,
    _a[CARD_TYPE.reverse] = 11,
    _a[CARD_TYPE.draw2] = 12,
    _a[CARD_TYPE.wild] = 13,
    _a[CARD_TYPE.wildDraw4] = 13,
    _a[CARD_TYPE.wildDraw2] = 13,
    _a);
console.log(CARD_X_OFFSET, CARD_TYPE);
export var CARD_Y_OFFSET = (_b = {},
    _b[CARD_COLOR.red] = 0,
    _b[CARD_COLOR.yellow] = 1,
    _b[CARD_COLOR.green] = 2,
    _b[CARD_COLOR.blue] = 3,
    _b[CARD_TYPE.wild] = 0,
    _b[CARD_TYPE.wildDraw4] = 1,
    _b[CARD_TYPE.wildDraw2] = 2,
    _b);
export var displayCard = function (elm, card) {
    if (isColorCard(card.type)) {
        console.log(card.type, CARD_X_OFFSET[card.type], CARD_Y_OFFSET[card.color]);
        setBackgoundPosition(elm, CARD_X_OFFSET[card.type], CARD_Y_OFFSET[card.color]);
    }
    else {
        setBackgoundPosition(elm, CARD_X_OFFSET[card.type], CARD_Y_OFFSET[card.type]);
    }
};
