var _a;
var gameId = window.location.hash.substring(1);
var playerId = (_a = localStorage.getItem('player-id')) !== null && _a !== void 0 ? _a : '';
var playAgainUrl = '';
var newToken = '';
var setupPlayAgain = function () {
    var btn = document.getElementById('again');
    btn.onclick = function () {
        if (/_host/.test(playAgainUrl)) {
            localStorage.setItem('game-id', newToken);
        }
        else {
            localStorage.setItem('game-token', newToken);
        }
        window.location.href = playAgainUrl;
    };
};
var setupLeave = function () {
    var btn = document.getElementById('leave');
    btn.onclick = function () {
        window.location.href = '../';
        fetch('/leave', {
            method: 'post',
            body: JSON.stringify({
                gameId: localStorage.getItem('game-id'),
                playerId: playerId,
                playerName: localStorage.getItem('player-name')
            }),
            headers: {
                'Content-Type': ' application/json'
            }
        });
        delete localStorage['game-id'];
        window.location.href = '../';
    };
};
(function () {
    window.location.hash = '';
    setupPlayAgain();
    setupLeave();
    fetch('/game/stats/' + gameId + '/' + playerId)
        .then(function (res) {
        return res.json();
    })
        .then(function (res) {
        if ('error' in res) {
            alert(res.error);
            window.location.href = '../';
        }
        else {
            console.log('received stats:', res);
            playAgainUrl = res.url;
            newToken = res.token;
            document.getElementById('winner').innerText =
                'Winner: ' + res.winner;
        }
    });
})();
export {};
