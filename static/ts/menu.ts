import * as PreGame from "../../types/preGameMessages.js"

const nameKey = 'player-name'
const idKey = 'player-id'
const tokenKey = 'game-token'
const gameIdKey = 'game-id'

const resetGameData = () => {
    localStorage.setItem(gameIdKey, '')
    localStorage.setItem(tokenKey, '')
}

const createGame = (name: string, password: string, isPublic: boolean) => {
    if (name.length < 3 || (password.length < 3 && !isPublic)) {
        alert('Name and Password have to be at least 3 characters long')
        return
    }

    fetch('/create', {
        method: 'post',
        body: JSON.stringify(<PreGame.CreateBody>{
            name: name,
            password: isPublic ? 'open' : password,
            publicMode: isPublic,
            host: localStorage.getItem(idKey)
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    }).then(res => <Promise<PreGame.CreatedResponse | PreGame.ErrorResponse>>res.json()).then(res => {
        if ('error' in res) {
            alert(res.error)
        } else if (res.success) {
            localStorage.setItem(gameIdKey, res.id)
            window.location.href = res.url
        }
    })
}

const setupCreate = () => {
    resetGameData()

    const nameInput = <HTMLInputElement>document.getElementById('nameInput')
    const passwordInput = <HTMLInputElement>document.getElementById('passInput')
    const publicInput = <HTMLInputElement>document.getElementById('publicInput')
    const passwordDiv = <HTMLInputElement>document.getElementById('passBox')

    publicInput.onchange = () => {
        if (publicInput.checked) {
            passwordDiv.classList.add('hidden')
        } else {
            passwordDiv.classList.remove('hidden')
        }
    }

    document.getElementById('create')!.onclick = () => createGame(nameInput.value, passwordInput.value, publicInput.checked)
}

const joinGame = (gameId: string, password: string) => {
    fetch('/join', {
        method: 'post',
        body: JSON.stringify(<PreGame.JoinBody>{
            gameId: gameId,
            password: password,
            playerId: localStorage.getItem(idKey),
            playerName: localStorage.getItem(nameKey)
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    }).then(res => <Promise<PreGame.JoinedResponse | PreGame.ErrorResponse>>res.json()).then(res => {
        if ('error' in res) {
            alert(res.error)
        } else if (res.success) {
            localStorage.setItem(tokenKey, res.token)
            window.location.href = res.url
        }
    })
}


const setupJoin = () => {
    resetGameData()

    const container = <HTMLDivElement>document.getElementById('games')

    fetch('/games').then(res => <Promise<PreGame.GamesResponse>>res.json()).then(res => {
        container.innerHTML = ''
        for (let game of res) {
            const node = <HTMLParagraphElement>document.createElement('p')
            node.innerText = game.name + ' (' + game.player + ' player)'

            if (game.public === true) {
                node.innerText += ' (public)'
                node.onclick = () => joinGame(game.id, '')
            } else {
                node.onclick = () => window.location.href = '/verify.html#' + game
            }

            container.appendChild(node)
        }
    })
}


const setupVerify = () => {
    const input = <HTMLInputElement>document.getElementById('passInput')

    document.getElementById('gameName')!.innerText = 'Enter Password for "' + window.location.hash.substr(1) + '":'
    document.getElementById('join')!.onclick = () => {
        joinGame(window.location.hash.substr(1), input.value)
    }
}


const checkUserName = () => {
    let name = localStorage.getItem(nameKey)

    if (!name) {
        const num = Math.random().toString()
        name = 'user' + num.substr(3, 9)
        localStorage.setItem(nameKey, name)
    }

    fetch('/player/register', {
        method: 'post',
        body: JSON.stringify(<PreGame.PlayerRegisterBody>{
            name
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    }).then(res => <Promise<PreGame.PlayerRegisterResponse>>res.json()).then(res => {
        localStorage.setItem(idKey, res.id)
    })
}


const setupIndex = () => {
    resetGameData()

    const input = <HTMLInputElement>document.getElementById('nameInput')
    let name = localStorage.getItem(nameKey) || ''
    input.value = name

    input.onchange = () => {
        name = input.value
        localStorage.setItem(nameKey, name)
        fetch('/player/changeName', {
            method: 'post',
            body: JSON.stringify({
                id: localStorage.getItem(idKey),
                name
            }),
            headers: {
                'Content-Type': ' application/json'
            }
        }).then(res => res.json()).then(res => {
            localStorage.setItem(idKey, res.id)
        })
    }
}

(() => {
    checkUserName()

    let fileName = window.location.href

    if (!fileName) return
    else if ((fileName.split('/').pop() ?? '').length === 0 || /index.html/.test(fileName)) setupIndex();
    else if (/create.html/.test(fileName)) setupCreate();
    else if (/join.html/.test(fileName)) setupJoin();
    else if (/verify.html/.test(fileName)) setupVerify();

    const backButton = <HTMLButtonElement>document.getElementById('back')
    if (backButton) backButton.onclick = () => window.location.href = '../'
})()