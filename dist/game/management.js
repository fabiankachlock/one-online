"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinGame = exports.CreateGame = void 0;
var game_1 = require("./game");
var gameStore_1 = require("../store/gameStore");
var CreateGame = function (name, password, publicMode, hostId) {
    var game = game_1.NewGame(name, password, publicMode, hostId);
    gameStore_1.GameStore.storeGame(game);
    return game.hash;
};
exports.CreateGame = CreateGame;
var JoinGame = function (name, playerId, password) {
    var game = gameStore_1.GameStore.getGameByName(name);
    if (!game || game.password !== password)
        return undefined;
    game.state.player = __spreadArray(__spreadArray([], game.state.player), [
        playerId
    ]);
    return game.hash;
};
exports.JoinGame = JoinGame;
