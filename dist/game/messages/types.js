"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopMessage = exports.startMessage = void 0;
var startMessage = function (game) { return JSON.stringify({
    start: true,
    url: '/play/#' + game.hash
}); };
exports.startMessage = startMessage;
var stopMessage = function () { return JSON.stringify({
    stop: true,
}); };
exports.stopMessage = stopMessage;
