require('dotenv').config()

import express from 'express';
import { NewPlayer } from './game/game';
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
    res.json([
        {
            name: 'abc',
            player: 2
        },
        {
            name: 'efg',
            player: 4,
        }
    ])
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

})

server.post('/join', async (req, res) => {
    const { game, pass } = req.body
    if (Math.random() > 0.5) {
        res.json({ error: 'Some Error' })
    } else {
        res.json({
            success: true,
            url: '/game.html'
        })
    }
})

server.listen(PORT)