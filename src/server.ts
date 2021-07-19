require('dotenv').config()

import express from 'express';
import http from 'http';
import { NewPlayer } from './game/game';
import { CreateGame, JoinGame, LeaveGame } from './game/management';
import { GameStore } from './store/gameStore';
import { PlayerStore } from './store/userStore';
import { initWaitingServer } from './waitingServer';

const PORT = process.env.PORT || 4096;
const app = express()
const server = http.createServer(app);

app.use(express.static('static'));
app.use(express.json());

app.use(async (req, _res, next) => {
    console.info('[' + req.method + '] ' + req.url)
    next()
})

app.get('/games', async (_req, res) => {
    res.json(GameStore.getPublics())
})

app.post('/player/register', async (req, res) => {
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

app.post('/player/changeName', async (req, res) => {
    const { id, name } = req.body
    PlayerStore.changePlayerName(id, name)
})

app.post('/create', async (req, res) => {
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
            url: '/wait_host.html',
            id
        })
    }
})

app.post('/join', async (req, res) => {
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

app.post('/leave', async (req, res) => {
    const { game, player } = req.body
    LeaveGame(game, player)
    res.send('')
})

app.get('/game/status/:id', async (req, res) => {
    const id = req.params.id
    const game = GameStore.getGame(id)
    res.json(game?.state)
})

app.get('/dev/players', async (_req, res) => {
    res.json(PlayerStore.all())
})

app.get('/dev/games', async (_req, res) => {
    res.json(GameStore.all())
})

initWaitingServer(server)

server.listen(PORT, () => {
    console.log('[Info] Server running');
})