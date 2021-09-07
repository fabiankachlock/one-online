"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuApiHandler = void 0;
var access_1 = require("./access");
var create_1 = require("./create");
var join_1 = require("./join");
var leave_1 = require("./leave");
exports.MenuApiHandler = {
    access: access_1.HandleAccessGame,
    create: create_1.HandleCreateGame,
    join: join_1.HandleJoinGame,
    leave: leave_1.HandleLeaveGame
};
