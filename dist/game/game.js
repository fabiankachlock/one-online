"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewPlayer = exports.NewGame = void 0;
var uuid_1 = require("uuid");
var NewGame = function (name, password, publicMode, hostId) { return ({
    name: name,
    password: password,
    public: publicMode,
    hash: uuid_1.v4(),
    state: {
        players: 1,
        running: false,
        player: [hostId]
    }
}); };
exports.NewGame = NewGame;
var NewPlayer = function (name) { return ({
    name: name,
    id: uuid_1.v4()
}); };
exports.NewPlayer = NewPlayer;
