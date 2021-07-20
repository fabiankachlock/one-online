"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryPlayerStore = void 0;
var playerMap = {};
var playerNameMap = {};
exports.MemoryPlayerStore = {
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
    all: function () { return Object.entries(playerMap).map(function (_a) {
        var name = _a[0], id = _a[1];
        return ({ name: name, id: id });
    }); }
};
