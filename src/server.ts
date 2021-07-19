require('dotenv').config()

import express from 'express';
import { NewPlayer } from './game/game';
import { CreateGame, JoinGame } from './game/management';
import { GameStore } from './store/gameStore';
import { PlayerStore } from './store/userStore';

const PORT = process.env.PORT || 4096;
const server = express()

server.use(express.static('static'));
server.use(express.json());

server.use(async (req, _res, next) => {
    console.info('[' + req.method + '] ' + req.url)
    next()
})

server.get('/games', async (_req, res) => {
    res.json(GameStore.getPublics())
})

server.post('/player/register', async (req, res) => {
    const { name } = req.body
    const id = PlayerStore.getPlayerId(name)

    if (id) {
        res.json({ id })
        return
    }

    const newPlayer = NewPlayer(name)
    PlayerStore.storePlayer(newPlayer)
    res.json({ id: newPlayer.id })
})

server.post('/player/changeName', async (req, res) => {
    const { id, name } = req.body
    PlayerStore.changePlayerName(id, name)
})

server.post('/create', async (req, res) => {
    const { name, password, publicMode, host } = req.body
    const id = CreateGame({
        name,
        password,
        public: publicMode,
        host
    })

    if (!id) {
        res.json({ error: 'An Error Occured' })
    } else {
        res.json({
            success: true,
            url: '/game.html#' + id,
            id
        })
    }
})

server.post('/join', async (req, res) => {
    const { game, player, password } = req.body
    const id = JoinGame(game, player, password)
    if (!id) {
        res.json({ error: 'Some Error' })
    } else {
        res.json({
            success: true,
            url: '/game.html#' + id,
            id
        })
    }
})

server.get('/dev/players', async (_req, res) => {
    res.json(PlayerStore.all())
})

server.get('/dev/games', async (_req, res) => {
    res.json(GameStore.all())
})

server.listen(PORT)