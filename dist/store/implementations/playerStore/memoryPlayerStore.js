"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
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
        var _b = __read(_a, 2), name = _b[0], id = _b[1];
        return ({ name: name, id: id });
    }); }
};
