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
var index_js_1 = require("../../../logging/index.js");
var map = {};
exports.AccessTokenMemoryStore = {
    storeToken: function (token, gameId) {
        map[token] = gameId;
        index_js_1.Logging.TokenStore.log("stored token " + token);
    },
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
        index_js_1.Logging.TokenStore.log("used token " + token);
        return gameId || '';
    },
    all: function () { return Object.entries(map).map(function (o) { return ({ token: o[0], gameId: o[1] }); }); }
};
