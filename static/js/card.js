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
export var CARD_Y_OFFSET = (_b = {},
    _b[CARD_COLOR.red] = 0,
    _b[CARD_COLOR.yellow] = 1,
    _b[CARD_COLOR.green] = 2,
    _b[CARD_COLOR.blue] = 3,
    _b[CARD_TYPE.wild] = 0,
    _b[CARD_TYPE.wildDraw4] = 1,
    _b[CARD_TYPE.wildDraw2] = 2,
    _b);
export var isColorCard = function (type) {
    return /\/\d$|skip$|draw2$|reverse$/.test(type);
};
export var isWildCard = function (type) {
    return /wild$|wildDraw2$|wildDraw4$/.test(type);
};
export var setBackgoundPosition = function (elm, x, y) {
    elm.setAttribute('style', '--x: ' + x + '; --y: ' + y + ';');
};
export var displayCard = function (elm, card) {
    if (isColorCard(card.type)) {
        setBackgoundPosition(elm, CARD_X_OFFSET[card.type], CARD_Y_OFFSET[card.color]);
    }
    else {
        setBackgoundPosition(elm, CARD_X_OFFSET[card.type], CARD_Y_OFFSET[card.type]);
    }
};
