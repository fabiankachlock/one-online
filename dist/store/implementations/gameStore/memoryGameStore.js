"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryGameStore = void 0;
var gamesMap = {};
var gameNameMap = {};
exports.MemoryGameStore = {
    storeGame: function (game) {
        gamesMap[game.key] = game;
        gameNameMap[game.name] = game.key;
    },
    getGame: function (id) { return gamesMap[id]; },
    remove: function (id) {
        var game = gamesMap[id];
        delete gamesMap[id];
        delete gameNameMap[game.name];
    },
    has: function (id) { return !!gamesMap[id]; },
    getPublicGames: function () { return Object.entries(gamesMap).map(function (p) { return p[1]; }).filter(function (g) { return g.isPublic && !g.meta.running; }).map(function (g) { return ({ name: g.name, id: g.key, player: g.meta.playerCount }); }); },
    all: function () { return Object.entries(gamesMap).map(function (g) { return g[1]; }); }
};
