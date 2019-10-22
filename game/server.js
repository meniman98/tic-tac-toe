var express = require("express");
var app = express();
app.use(express.static("public"));
var http = require("http").Server(app);
var port = 55000;

http.listen(port, function() {
    console.log("listening on: " + port);
});

app.use(express.static("client"));

app.get("/", function(req, res) {
	res.sendFile(__dirname + "/client/index.html");
});


var io = require("socket.io")(http);

var playerCount = 0;
var players = [];
var playerCharacter;

io.on("connection", function(socket) {
    playerCount++;
    // socket.on("test", function() {
    //     console.log("test received");
    // });

    if(playerCount === 1) {
        playerCharacter = "X";
    } else if (playerCount === 2) {
        playerCharacter = "O";
        socket.emit("disableTurn");
    } else {
        playerCharacter = "unknown";
    }

    socket.player = {
        id:playerCount,
        player: playerCharacter
    };

    players.push(socket.player);



    io.emit("playing", {playerCount:playerCount});


    socket.emit("getPlayer", socket.player.player);

    console.log("connected client: " + socket.player.id + " " + socket.player.player);

    socket.broadcast.emit("enablePlayer");

    socket.on("clickedCell",function(data) {
        console.log("clicked: " + data.clicked + " player: " + data.player);
        io.emit("fillCell", data);
        socket.emit("disableTurn");
        socket.broadcast.emit("enableTurn");
    });

    socket.on("winGame",function(data) {
        io.emit("playerWon", data);
    });

    socket.on("disconnect",function() {
        console.log("disconnected client: " + socket.player.id + " " + socket.player.player);
        playerCount--;
    });
});
