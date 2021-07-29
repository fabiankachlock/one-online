"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRef = void 0;
var index_js_1 = require("./implementations/accessToken/index.js");
var index_js_2 = require("./implementations/gameStore/index.js");
var index_js_3 = require("./implementations/playerStore/index.js");
var createRef = function (game) { return ({
    save: function () { return index_js_2.GameStore.storeGame(game); },
    queryPlayers: function () {
        return Array.from(game.meta.players).map(function (id) { return ({
            id: id,
            name: index_js_3.PlayerStore.getPlayerName(id) || 'noname'
        }); });
    },
    checkPlayer: function (id, name) {
        var storedId = index_js_3.PlayerStore.getPlayerId(name);
        var storedName = index_js_3.PlayerStore.getPlayerName(id);
        return id === storedId && storedName === name;
    },
    destroy: function () {
        index_js_2.GameStore.remove(game.key);
        index_js_1.TokenStore.deleteTokensForGame(game.key);
    }
}); };
exports.createRef = createRef;
