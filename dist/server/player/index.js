"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerApiHandler = void 0;
var changeNAme_1 = require("./changeNAme");
var register_1 = require("./register");
exports.PlayerApiHandler = {
    register: register_1.HandleRegisterPlayer,
    changeName: changeNAme_1.HandleChangePlayerName
};
