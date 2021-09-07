"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readAccessToken = exports.useAccessToken = exports.createAccessToken = void 0;
var index_1 = require("./implementations/accessToken/index");
var uuid_1 = require("uuid");
var createAccessToken = function (forGame) {
    var token = (uuid_1.v4() + uuid_1.v4()).replace(/-/g, '');
    index_1.TokenStore.storeToken(token, forGame);
    return token;
};
exports.createAccessToken = createAccessToken;
var useAccessToken = function (token) {
    var gameId = index_1.TokenStore.useToken(token);
    return gameId.length === 0 ? undefined : gameId;
};
exports.useAccessToken = useAccessToken;
var readAccessToken = function (token) {
    var gameId = index_1.TokenStore.readToken(token);
    return gameId.length === 0 ? undefined : gameId;
};
exports.readAccessToken = readAccessToken;
