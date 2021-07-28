"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreGameMessages = void 0;
exports.PreGameMessages = {
    error: function (res, error) {
        return res.json({ error: error });
    },
    created: function (res, key) {
        return res.json({
            success: true,
            url: '/wait_host.html',
            id: key
        });
    },
    joined: function (res, token) {
        return res.json({
            success: true,
            url: '/wait.html',
            token: token
        });
    },
    verify: function (res) { return res.json({ ok: true }); },
    tokenResponse: function (res, gameId) {
        return res.json({ gameId: gameId });
    }
};
