"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireGameInfo = exports.requireActiveGame = exports.requireAuthToken = exports.requireLogin = void 0;
var requireLogin = function (req, res) {
    if (req.session.userId && req.session.userName) {
        return false;
    }
    res.json({
        error: 'This operation needs you to be logged in!'
    });
    return true;
};
exports.requireLogin = requireLogin;
var requireAuthToken = function (req, res) {
    if (req.session.activeToken) {
        return false;
    }
    res.json({
        error: 'This operation needs you to have a valid auth token!'
    });
    return true;
};
exports.requireAuthToken = requireAuthToken;
var requireActiveGame = function (req, res) {
    if (req.session.gameId) {
        return false;
    }
    res.json({
        error: 'This operation needs to be in an active game'
    });
    return true;
};
exports.requireActiveGame = requireActiveGame;
var requireGameInfo = function (req, res) {
    if (req.session.activeToken || req.session.gameId) {
        return false;
    }
    res.json({
        error: 'This operation needs you to have a valid auth token or game id!'
    });
    return true;
};
exports.requireGameInfo = requireGameInfo;
