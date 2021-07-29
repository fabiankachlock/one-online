"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logging = void 0;
var logger_js_1 = require("./logger.js");
exports.Logging = {
    Server: new logger_js_1.Logger('Server'),
    Hit: new logger_js_1.Logger('Hit'),
    Game: new logger_js_1.Logger('Game'),
    Player: new logger_js_1.Logger('Player'),
    Websocket: new logger_js_1.Logger('Websockets'),
    App: new logger_js_1.Logger(''),
    PlayerStore: new logger_js_1.Logger('Store', 'Player'),
    GamesStore: new logger_js_1.Logger('Store', 'Games'),
    TokenStore: new logger_js_1.Logger('Store', 'Token'),
    Watcher: new logger_js_1.Logger('Watcher')
};
