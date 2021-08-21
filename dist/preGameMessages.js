"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.PreGameMessages = void 0;
var optionDescriptions_1 = require("./game/optionDescriptions");
var options_1 = require("./game/options");
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
    },
    optionsList: function (res) {
        return res.json((Object.entries(optionDescriptions_1.OptionDescriptions)).map(function (_a) {
            var _b = __read(_a, 2), id = _b[0], data = _b[1];
            return (__assign(__assign({ id: id }, data), { defaultOn: options_1.DefaultOptions[id] === true }));
        }));
    }
};
