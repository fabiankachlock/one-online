"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerApiHandler = void 0;
var changeName_1 = require("./changeName");
var register_1 = require("./register");
exports.PlayerApiHandler = {
    register: register_1.HandleRegisterPlayer,
    changeName: changeName_1.HandleChangePlayerName
};
