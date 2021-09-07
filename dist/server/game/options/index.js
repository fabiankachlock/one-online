"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameOptionsApiHandler = void 0;
var change_1 = require("./change");
var list_1 = require("./list");
exports.GameOptionsApiHandler = {
    change: change_1.HandleOptionsChange,
    list: list_1.HandleOptionsList
};
