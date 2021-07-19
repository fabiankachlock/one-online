"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStore = void 0;
var gamesMap = {};
var gameNameMap = {};
exports.GameStore = {
    storeGame: function (game) {
        gamesMap[game.hash] = game;
        gameNameMap[game.name] = game.hash;
    },
    getGame: function (id) { return gamesMap[id]; },
    getGameByName: function (name) { return gamesMap[gameNameMap[name]]; },
    getPublics: function () { return Object.entries(gamesMap).map(function (p) { return p[1]; }).filter(function (g) { return g.public; }).map(function (g) { return ({ name: g.name, player: g.state.players }); }); },
    all: function () { return Object.entries(gamesMap).map(function (g) { return g[1]; }); }
};
