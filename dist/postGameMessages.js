"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostGameMessages = void 0;
exports.PostGameMessages = {
    error: function (res, error) { return res.json({ error: error }); },
    stats: function (res, winner, token, url) { return res.json({
        winner: winner,
        token: token,
        url: url
    }); }
};
