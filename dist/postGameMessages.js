"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostGameMessages = void 0;
exports.PostGameMessages = {
    error: function (res, error) { return res.json({ error: error }); },
    stats: function (res, winner, url, id) { return res.json({
        winner: winner,
        playAgainUrl: url,
        gameId: id
    }); }
};
