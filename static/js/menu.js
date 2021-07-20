const nameKey = 'player-name'
const idKey = 'player-id'
const gameIdKey = 'game-id'

const setupCreate = () => {
    document.getElementById('create').onclick = () => {
        const nameInput = document.getElementById('nameInput')
        const passInput = document.getElementById('passInput')
        const publicInput = document.getElementById('publicInput')

        if (nameInput.value.length < 3 || passInput.value.length < 3) {
            alert('Name and Password have to be at least 3 characters long')
            return
        }

        fetch('/create', {
            method: 'post',
            body: JSON.stringify({
                name: nameInput.value,
                password: passInput.value,
                publicMode: publicInput.checked,
                host: localStorage.getItem(idKey)
            }),
            headers: {
                'Content-Type': ' application/json'
            }
        }).then(res => res.json()).then(res => {
            if (res.error) {
                alert(res.error)
            } else if (res.success) {
                localStorage.setItem(gameIdKey, res.id)
                window.location.href = res.url
            }
        })
    }
}

const setupJoin = () => {

    const join = game => () => window.location.href = '/verify.html#' + game
    const input = document.getElementById('nameInput')
    const container = document.getElementById('games')
    document.getElementById('join').onclick = () => join(input.value)()

    fetch('/games').then(res => res.json()).then(res => {
        container.innerHTML = ''
        for (let game of res) {
            const node = document.createElement('p')
            node.innerText = game.name + ' (' + game.player + ' player)'
            node.onclick = () => join(game.name)()
            container.appendChild(node)
        }
    })
}

const setupVerify = () => {

    const input = document.getElementById('passInput')

    const join = () => {
        fetch('/join', {
            method: 'post',
            body: JSON.stringify({
                game: window.location.hash.substr(1),
                password: input.value,
                player: localStorage.getItem(idKey)
            }),
            headers: {
                'Content-Type': ' application/json'
            }
        }).then(res => res.json()).then(res => {
            if (res.error) {
                alert(res.error)
            } else if (res.success) {
                localStorage.setItem(gameIdKey, res.id)
                window.location.href = res.url
            }
        })
    }

    document.getElementById('gameName').innerText = 'Enter Password for "' + window.location.hash.substr(1) + '":'
    document.getElementById('join').onclick = join
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
        body: JSON.stringify({
            name
        }),
        headers: {
            'Content-Type': ' application/json'
        }
    }).then(res => res.json()).then(res => {
        localStorage.setItem(idKey, res.id)
    })
}

const setupIndex = () => {
    const input = document.getElementById('nameInput')
    let name = localStorage.getItem(nameKey)
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

const setupGame = () => {
    fetch('/game/status/' + localStorage.getItem(gameIdKey)).then(res => res.json()).then(res => {
        if (res) {
            if (res.running) {
                window.location.href = '/play/#' + localStorage.getItem(gameIdKey)
            } else {
                window.location.href = '/wait.html'
            }
        } else {
            window.location.href = '../'
            alert('Somthing went wrong')
        }
    })
}

(() => {
    checkUserName()

    let fileName = window.location.href

    if (!fileName) return
    else if ((fileName.split('/').pop() ?? '').length === 0 || /index.html/.test(fileName)) setupIndex();
    else if (/create.html/.test(fileName)) setupCreate();
    else if (/join.html/.test(fileName)) setupJoin();
    else if (/verify.html/.test(fileName)) setupVerify();
    else if (/game.html/.test(fileName)) setupGame();

    const backButton = document.getElementById('back')
    if (backButton) backButton.onclick = () => window.location.href = '../'
})()