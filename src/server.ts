require('dotenv').config()

import express from 'express';
import http from 'http';
import { v4 as uuid } from 'uuid';
import * as PreGame from '../types/preGameMessages.js';
import { Game } from './game/game.js';
import { Player } from './game/players/player.js';
import { GameServer, GameServerPath } from './gameServer';
import { PostGameMessages } from './postGameMessages.js';
import { PreGameMessages } from './preGameMessages.js';
import { createAccessToken, useAccessToken } from './store/accessToken.js';
import { TokenStore } from './store/implementations/accessToken/index.js';
import { GameStore } from './store/implementations/gameStore/';
import { PlayerStore } from './store/implementations/playerStore/';
import { WaitingServer, WaitingServerPath } from './waitingServer';

const PORT = process.env.PORT || 4096;
const app = express()
const server = http.createServer(app);

app.use(async (req, _res, next) => {
    console.info('[' + req.method + '] ' + req.url)
    next()
})

app.use(express.static('static'));
app.use(express.json());

// Menu Endpoints
app.get('/games', async (_req, res) => {
    res.json(<PreGame.GamesResponse>GameStore.getGames())
})

app.post('/create', async (req, res) => {
    const { name, password, publicMode, host } = <PreGame.CreateBody>req.body

    if (!name || !password || !host) {
        PreGameMessages.error(res, 'Error: Please fill in all informations.')
        return
    }

    const game = Game.create(name, password, host, publicMode)

    PreGameMessages.created(res, game.key)
})

app.post('/join', async (req, res) => {
    const { gameId, playerId, playerName, password } = <PreGame.JoinBody>req.body

    if (!gameId || !playerId) {
        PreGameMessages.error(res, 'Error: Please fill in all informations.')
        return
    }

    const game = GameStore.getGame(gameId)

    if (game) {
        const token = createAccessToken(gameId)
        const success = game.preparePlayer(playerId, playerName, password, token)

        if (success) {
            PreGameMessages.joined(res, token)
        } else {
            TokenStore.deleteToken(token)
            PreGameMessages.error(res, 'Error: You can\'t join the game, make sure your password is correct')
        }
        return
    }

    PreGameMessages.error(res, 'Error: You can\'t join a game, that doesn\'t exists.')
})

app.post('/leave', async (req, res) => {
    const { gameId, playerId, playerName } = <PreGame.LeaveBody>req.body

    const game = GameStore.getGame(gameId)

    if (game) {
        game.leave(playerId, playerName)
        res.send('')
    } else {
        PreGameMessages.error(res, 'Error: Game cannot be found')
    }
})

app.post('/access', async (req, res) => {
    const { gameId, token } = <PreGame.AccessBody>req.body

    if (gameId) {
        const game = GameStore.getGame(req.body.gameId)
        if (game) {
            game.hostJoined()
            PreGameMessages.verify(res)
        } else {
            PreGameMessages.error(res, 'Error: Game cannot be found')
        }
        return
    }

    const computedGameId = useAccessToken(req.body.token || '')

    if (computedGameId) {
        const game = GameStore.getGame(computedGameId)
        if (game) {
            game.playerJoined(req.body.token)
            PreGameMessages.tokenResponse(res, computedGameId)
            return
        } else {
            PreGameMessages.error(res, 'Error: Game cannot be found')
        }
    } else {
        PreGameMessages.error(res, 'Error: Token cannot be verified')
    }
})

// Player Management
app.post('/player/register', async (req, res) => {
    const { name } = <PreGame.PlayerRegisterBody>req.body
    const id = PlayerStore.getPlayerId(name)

    if (id) {
        res.json({ id })
        return
    }

    const newPlayer: Player = {
        id: uuid(),
        name
    }

    PlayerStore.storePlayer(newPlayer)
    res.json(<PreGame.PlayerRegisterResponse>{ id: newPlayer.id })
})

app.post('/player/changeName', async (req, res) => {
    const { id, name } = <PreGame.PlayerChangeBody>req.body
    PlayerStore.changePlayerName(id, name)
    res.send('')
})

// Game Management
app.post('/game/options/:id', async (req, res) => {
    const id = req.params.id
    const game = GameStore.getGame(id)

    if (game) {
        game.options.resolveFromMessage(req.body)
        GameStore.storeGame(game)
        res.send('')
    } else {
        PreGameMessages.error(res, 'Error: Game cannot be found')
    }
})

app.get('/game/start/:id', async (req, res) => {
    const id = req.params.id
    const game = GameStore.getGame(id)

    if (game) {
        game.start()
        res.send('')
    } else {
        PreGameMessages.error(res, 'Error: Game cannot be found')
    }
})

app.get('/game/stop/:id', async (req, res) => {
    const id = req.params.id
    const game = GameStore.getGame(id)

    if (game) {
        game.stop()
        res.send('')
    } else {
        PreGameMessages.error(res, 'Error: Game cannot be found')
    }
})

app.get('/game/stats/:id/:player', async (req, res) => {
    const id = req.params.id
    const player = req.params.player
    const game = GameStore.getGame(id)

    if (game) {
        const stats = game.getStats(player)
        console.log('stats for player:', player, stats)
        PostGameMessages.stats(res, stats.winner, stats.token, stats.url)
    } else {
        PostGameMessages.error(res, 'Error: Game not found')
    }
})

app.get('/game/verify/:id/:player', async (req, res) => {
    const id = req.params.id
    const player = req.params.player
    const game = GameStore.getGame(id)

    if (game?.verify(player)) {
        PreGameMessages.verify(res)
    } else {
        PreGameMessages.error(res, 'Error: Not allowed to access game')
    }
})

// Dev
app.get('/dev/players', async (_req, res) => {
    res.json(PlayerStore.all())
})

app.get('/dev/games', async (_req, res) => {
    res.json(GameStore.all())
})

server.on('upgrade', function upgrade(request, socket, head) {
    const url = <string>request.url

    if (url.startsWith(WaitingServerPath)) {
        WaitingServer.handleUpgrade(request, socket, head, function done(ws) {
            WaitingServer.emit('connection', ws, request);
        });
    } else if (url.startsWith(GameServerPath)) {
        GameServer.handleUpgrade(request, socket, head, function done(ws) {
            GameServer.emit('connection', ws, request);
        });
    } else {
        socket.destroy();
    }
});

server.listen(PORT, () => {
    console.log('[Info] Server running');
})