var playAgainUrl = '';
var setupPlayAgain = function () {
    var btn = document.getElementById('again');
    btn.onclick = function () {
        window.location.href = playAgainUrl;
    };
};
var setupLeave = function () {
    var btn = document.getElementById('leave');
    btn.onclick = function () {
        window.location.href = '../';
        fetch('/api/v1/leave', {
            method: 'post',
            headers: {
                'Content-Type': ' application/json'
            }
        });
        window.location.href = '../';
    };
};
(function () {
    window.location.hash = '';
    setupPlayAgain();
    setupLeave();
    fetch('/api/v1/game/stats')
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
            document.getElementById('winner').innerText =
                'Winner: ' + res.winner;
        }
    });
})();
export {};
