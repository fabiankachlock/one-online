"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewPlayer = exports.NewGame = void 0;
var uuid_1 = require("uuid");
var NewGame = function (options) { return ({
    name: options.name,
    password: options.password,
    public: options.public,
    host: options.host,
    hash: uuid_1.v4(),
    meta: {
        players: 1,
        running: false,
        player: [options.host],
        options: {
            penaltyCard: true,
            timeMode: false,
            striktMode: false,
            addUp: true,
            cancleWithReverse: false,
            placeDirect: false,
            takeUntilFit: false,
            throwSame: false,
            exchange: false,
            globalExchange: false,
        }
    }
}); };
exports.NewGame = NewGame;
var NewPlayer = function (name) { return ({
    name: name,
    id: uuid_1.v4()
}); };
exports.NewPlayer = NewPlayer;
