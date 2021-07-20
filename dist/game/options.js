"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOptions = void 0;
var resolveOptions = function (game, options) {
    var gameOptions = game.meta.options;
    Object.entries(gameOptions).forEach(function (_a) {
        var optionKey = _a[0];
        if (optionKey in options) {
            // @ts-expect-error
            game.meta.options[optionKey] = options[optionKey];
        }
    });
    return game;
};
exports.resolveOptions = resolveOptions;
