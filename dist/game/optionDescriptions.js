"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapOptionsKeyToDescription = exports.OptionDescriptions = void 0;
var options_1 = require("./options");
exports.OptionDescriptions = (_a = {},
    _a[options_1.OptionKey.realisticDraw] = {
        name: 'Realistic draw',
        description: 'Simulate an actual draw from a pile of cards',
        implemented: true
    },
    _a[options_1.OptionKey.takeUntilFit] = {
        name: 'Take until it fits',
        description: 'You have to pick cards from the Draw-Pile until one fits.',
        implemented: false
    },
    _a[options_1.OptionKey.strictMode] = {
        name: 'Strict mode (experimental)',
        description: 'You can only take a card, when theres no other playable card left in your deck.',
        implemented: false
    },
    _a[options_1.OptionKey.timeMode] = {
        name: 'Time mode',
        description: "You have to take a penalty card, when you didn't place a card within 20 seconds.",
        implemented: false
    },
    _a[options_1.OptionKey.penaltyCard] = {
        name: 'Penalty card by UNO',
        description: 'You have to take 2 cards if you forgot to say "UNO" at you last card.',
        implemented: true
    },
    _a[options_1.OptionKey.addUp] = {
        name: 'Add up',
        description: 'You can throw another plus-card onto one.',
        implemented: true
    },
    _a[options_1.OptionKey.placeDirect] = {
        name: 'Place cards directly',
        description: 'You can place a cards immediately after you picked it from the Draw-Pile.',
        implemented: false
    },
    _a[options_1.OptionKey.cancelWithReverse] = {
        name: 'Cancel with reverse',
        description: 'You can throw a reverse card on a plus-card to cancel it, can be combined with "Add up".',
        implemented: false
    },
    _a[options_1.OptionKey.throwSame] = {
        name: 'Throw same card in between',
        description: 'If you had the same card as the one that was thrown, you can throw this card right in between. The game will continue at from you position.',
        implemented: false
    },
    _a[options_1.OptionKey.exchange] = {
        name: '7: Card exchange',
        description: 'When you throw a 7 you have to change your cards with the player of your desire.',
        implemented: false
    },
    _a[options_1.OptionKey.globalExchange] = {
        name: '0: Global card exchange',
        description: 'When you throw a 0 all cards get moved in playing direct by one player.',
        implemented: false
    },
    _a[options_1.OptionKey.none] = {
        name: '',
        description: '',
        implemented: true
    },
    _a);
var mapOptionsKeyToDescription = function (key) {
    return exports.OptionDescriptions[key];
};
exports.mapOptionsKeyToDescription = mapOptionsKeyToDescription;
