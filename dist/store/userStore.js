"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerStore = void 0;
var playerMap = {};
var playerNameMap = {};
exports.PlayerStore = {
    storePlayer: function (player) {
        playerMap[player.name] = player.id;
        playerNameMap[player.id] = player.name;
    },
    getPlayerId: function (name) { return playerMap[name]; },
    getPlayerName: function (id) { return playerNameMap[id]; },
    changePlayerName: function (id, newName) {
        var oldName = playerNameMap[id];
        delete playerMap[oldName];
        playerMap[newName] = id;
        playerNameMap[id] = newName;
    },
};
