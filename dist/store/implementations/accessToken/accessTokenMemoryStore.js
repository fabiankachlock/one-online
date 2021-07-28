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
exports.AccessTokenMemoryStore = void 0;
var map = {};
exports.AccessTokenMemoryStore = {
    storeToken: function (token, gameId) { return (map[token] = gameId); },
    deleteToken: function (token) { return delete map[token]; },
    deleteTokensForGame: function (gameId) {
        return Object.entries(map)
            .filter(function (_a) {
            var _b = __read(_a, 2), id = _b[1];
            return gameId === id;
        })
            .forEach(function (_a) {
            var _b = __read(_a, 1), token = _b[0];
            return exports.AccessTokenMemoryStore.deleteToken(token);
        });
    },
    useToken: function (token) {
        var gameId = map[token];
        exports.AccessTokenMemoryStore.deleteToken(token);
        return gameId || '';
    }
};
