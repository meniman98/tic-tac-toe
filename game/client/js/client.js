var Client = {};
Client.socket = io("http://localhost:55000");
Client.countPlayers;

Client.sendTest = function(){
    console.log("test sent");
    Client.socket.emit('test');
};

Client.socket.on("playing", function(data) {
    document.getElementById("players").innerHTML = data.playerCount;
});

Client.socket.on("getPlayer",function(data){
    console.log("player" + data)
    startGame(data + "");
    Client.checkAvailablePlayers();
});


Client.checkAvailablePlayers = function() {

    var playersNumber = document.getElementById("players").innerHTML;
    playersNumber = parseInt(playersNumber);

    if(playersNumber < 2){
        document.getElementById("notEnoughPlayers").style.display = "block";
        document.getElementById("enoughPlayers").style.display = "none";
        return false;
    } else if (playersNumber === 2) {
        //enough
        document.getElementById("notEnoughPlayers").style.display = "none";
        document.getElementById("enoughPlayers").style.display = "none";
        return true;
    } else if (playersNumber > 2) {
        //lobby filled
        document.getElementById("notEnoughPlayers").style.display = "none";
        document.getElementById("enoughPlayers").style.display = "block";
        return false;
    }
}


Client.socket.on("enablePlayer", function () {
    Client.checkAvailablePlayers();
});

Client.sendClick = function(number, player) {
    var elementClicked = number;
    var player = player;
    Client.socket.emit("clickedCell",{clicked:elementClicked, player:player});
}

Client.gameWon = function(player) {
    Client.socket.emit('winGame', player);
}

Client.socket.on("playerWon", function (data) {
    winGame(data);
});

Client.socket.on("disableTurn", function () {
    document.getElementById("mainGame").classList.add("disableClick")
});

Client.socket.on("enableTurn", function () {
    document.getElementById("mainGame").classList.remove("disableClick")
});

Client.socket.on("fillCell", function (data) {
    console.log(data.clicked + " " + data.player)
    var row = document.getElementById("gameGrid").rows;
    for (var i = 0; i < row.length; i++) {
        for (var j = 0; j < row[i].cells.length; j++ ) {
            var cellNumber = row[i].cells[j].getAttribute("number");
            cellNumber = parseInt(cellNumber);

            if(cellNumber === data.clicked) {
                row[i].cells[j].classList.add("player" + data.player)
                row[i].cells[j].innerHTML = data.player;
                row[i].cells[j].removeEventListener('click', cellClickedFunction);
            }
        }
    }
});
