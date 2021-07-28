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
(function () {
    document.getElementById('leave').onclick = function () { return window.location.href = '../'; };
    window.location.hash = '';
    setupPlayAgain();
    fetch('/game/stats/' + gameId + '/' + playerId).then(function (res) { return res.json(); }).then(function (res) {
        if ('error' in res) {
            alert(res.error);
            window.location.href = '../';
        }
        else {
            console.log('received stats:', res);
            playAgainUrl = res.url;
            newToken = res.token;
            document.getElementById('winner').innerText = 'Winner: ' + res.winner;
        }
    });
})();
export {};
