"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryGameStore = void 0;
var gamesMap = {};
var gameNameMap = {};
exports.MemoryGameStore = {
    storeGame: function (game) {
        gamesMap[game.hash] = game;
        gameNameMap[game.name] = game.hash;
    },
    getGame: function (id) { return gamesMap[id]; },
    getGameByName: function (name) { return gamesMap[gameNameMap[name]]; },
    remove: function (id) {
        var game = gamesMap[id];
        delete gamesMap[id];
        delete gameNameMap[game.name];
    },
    getPublicGames: function () { return Object.entries(gamesMap).map(function (p) { return p[1]; }).filter(function (g) { return g.public && !g.meta.running; }).map(function (g) { return ({ name: g.name, player: g.meta.playerCount }); }); },
    all: function () { return Object.entries(gamesMap).map(function (g) { return g[1]; }); }
};
