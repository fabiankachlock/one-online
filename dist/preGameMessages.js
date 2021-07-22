"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreGameMessages = void 0;
exports.PreGameMessages = {
    error: function (res, error) { return res.json({ error: error }); },
    created: function (res, key) { return res.json({
        success: true,
        url: '/wait_host.html',
        id: key
    }); },
    joined: function (res, key) { return res.json({
        success: true,
        url: '/game.html#' + key,
        id: key
    }); },
    verify: function (res) { return res.json({ ok: true }); }
};
