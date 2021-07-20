"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructPlayerLinks = exports.LeaveGame = exports.JoinGame = exports.CreateGame = void 0;
var game_1 = require("./game");
var gameStore_1 = require("../store/implementations/gameStore/");
var waitingServer_1 = require("../waitingServer");
var playerStore_1 = require("../store/implementations/playerStore/");
var CreateGame = function (options) {
    var game = game_1.NewGame(options);
    if (!gameStore_1.GameStore.getGameByName(game.name)) {
        gameStore_1.GameStore.storeGame(game);
        return game.hash;
    }
    return undefined;
};
exports.CreateGame = CreateGame;
var JoinGame = function (name, playerId, password) {
    var game = gameStore_1.GameStore.getGameByName(name);
    if (!game || game.password !== password)
        return undefined;
    if (!game.meta.player.includes(playerId)) {
        game.meta.player = __spreadArray(__spreadArray([], game.meta.player), [
            playerId
        ]);
    }
    waitingServer_1.WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
        players: game.meta.player.map(function (p) { return playerStore_1.PlayerStore.getPlayerName(p); })
    }));
    gameStore_1.GameStore.storeGame(game);
    return game.hash;
};
exports.JoinGame = JoinGame;
var LeaveGame = function (id, playerId) {
    var game = gameStore_1.GameStore.getGame(id);
    if (!game)
        return;
    game.meta.player = game.meta.player.filter(function (p) { return p !== playerId; });
    waitingServer_1.WaitingWebsockets.sendMessage(game.hash, JSON.stringify({
        players: game.meta.player.map(function (p) { return playerStore_1.PlayerStore.getPlayerName(p); })
    }));
    gameStore_1.GameStore.storeGame(game);
};
exports.LeaveGame = LeaveGame;
var constructPlayerLinks = function (game) {
    var players = game.meta.player;
    players.forEach(function (p, index) {
        var leftLink;
        if (index < players.length - 1) {
            leftLink = players[index + 1];
        }
        else {
            leftLink = players[0];
        }
        var rightLink;
        if (index > 0) {
            rightLink = players[index - 1];
        }
        else {
            rightLink = players[players.length - 1];
        }
        game.state.playerLinks[p] = {
            left: leftLink,
            right: rightLink
        };
    });
    return game;
};
exports.constructPlayerLinks = constructPlayerLinks;
