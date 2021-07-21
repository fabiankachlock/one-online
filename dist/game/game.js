"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGame = exports.isGameReady = exports.prepareGame = exports.NewPlayer = exports.NewGame = void 0;
var type_1 = require("./type");
var uuid_1 = require("uuid");
var management_1 = require("./management");
var index_1 = require("../store/implementations/gameStore/index");
var gameServer_1 = require("../gameServer");
var types_1 = require("./messages/types");
var playerStore_1 = require("../store/implementations/playerStore");
var NewGame = function (options) { return ({
    name: options.name,
    password: options.password,
    public: options.public,
    host: options.host,
    hash: uuid_1.v4(),
    meta: {
        playerCount: 1,
        running: false,
        player: [options.host],
        options: {
            penaltyCard: true,
            timeMode: false,
            strictMode: false,
            addUp: true,
            cancleWithReverse: false,
            placeDirect: false,
            takeUntilFit: false,
            throwSame: false,
            exchange: false,
            globalExchange: false,
        }
    },
    state: {
        player: '',
        playerLinks: {},
        direction: 'left',
        topCard: {
            type: type_1.CARD_TYPE.none,
            color: type_1.CARD_COLOR.none,
        },
        stack: [],
    }
}); };
exports.NewGame = NewGame;
var NewPlayer = function (name) { return ({
    name: name,
    id: uuid_1.v4()
}); };
exports.NewPlayer = NewPlayer;
var prepareGame = function (game) {
    game = management_1.constructPlayerLinks(game);
    game.state.player = game.meta.player[Math.floor(Math.random() * game.meta.playerCount)];
    game.state.topCard = type_1.ALL_CARDS[Math.floor(Math.random() * type_1.ALL_CARDS.length)];
    game.meta.running = true;
    return game;
};
exports.prepareGame = prepareGame;
var isGameReady = function (id, playerAmount) {
    var game = index_1.GameStore.getGame(id);
    if (game && game.meta.playerCount === playerAmount) {
        return true;
    }
    return false;
};
exports.isGameReady = isGameReady;
var startGame = function (game) {
    gameServer_1.GameWebsockets.sendMessage(game.hash, types_1.initGameMessage(game.meta.player.map(function (pid) { return ({
        name: playerStore_1.PlayerStore.getPlayerName(pid) || 'noname',
        id: pid
    }); }), 7, // amountOfCards -> make option later
    game.state.player, game.state.topCard));
};
exports.startGame = startGame;
