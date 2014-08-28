var WebSocketServer = require("websocket").server,
    http = require("http"),
    project = require("./package.json"),
    config = require("./config.json"),
    path = require("path"),
    fs = require("fs"),
    Ball = require("./Ball"),
    Espectator = require("./Espectator"),
    Player = require("./Player"),
    Client = require("./Client"),
    clients = {
        players: [],
        espectators: [],
    },
    ball = new Ball(),
    server,
    wsServer;

server = http.createServer(function(req, res) {

    if ( req.url == "/" ) {
        req.url = "index.html";
    }

    var filePath = path.join(__dirname, "public", req.url);

    fs.exists(filePath, function(exists) {

        // var stat = fs.statSync(filePath);

        if ( exists ) {

            var readStream = fs.createReadStream(filePath);
            // We replaced all the event handlers with a simple call to readStream.pipe()
            readStream.pipe(res);
            
        } else {

            res.writeHead(404);
            res.end();

            console.error("File", filePath, "does not exist");
        }

    });


});

server.listen(config.port, function() {
    console.log(project.name, "running on port", config.port);
});

// create the server
wsServer = new WebSocketServer({
    httpServer: server
});

// WebSocket server
wsServer.on('request', function(request) {

    var connection = request.accept(null, request.origin),
        client;

    if ( clients.players.length < 2 ) {

        client = new Player(connection);
        client.index = clients.players.length - 1;

        clients.players.push(client);

        //We only listen to players
        connection.on('message', function(message) {

            var data = JSON.parse(message.utf8Data);

            client[data.move]();

        });

        console.log("New player!");

    } else {
        
        client = new Espectator(connection);
        client.index = espectators.length - 1;

        clients.espectators.push(client);

        console.log("Espectator joined!");

    }

    connection.on('close', function(connection) {

        clients[client.type].splice(client.index, 1);

        console.log(client.type, "disconnected!");

        // if ( client.type == "" ) {

            // console.log("Looking for a replacement in the espectators");

            // if ( clients.players.length < 2 && clients.spectators.length > 0 ) {

            //     clients.players.push(clients.spectators.pop());

            // }

        // }

    });

});

function loop() {

    var state = {
        gameState = "waiting"
    };

    // if ( clients.players.length > 2 ) {

        state.type = "playing";

        ball.x += ball.direction.x * ball.speed;
        ball.y += ball.direction.y * ball.speed;

        if ( ball.y < 0 || ball.y + ball.height > config.gameArea.height ) {
            ball.direction.y *= -1;
        }

        if ( ball.x < 0 ) {
            state.type = "end";
            state.winner = "pad2";
        }

        if ( ball.x + ball.width > config.gameArea.width ) {
            state.type = "end";
            state.winner = "pad1";
        }

        var pad1 = clients.players[0].pad,
            pad2 = clients.players[1].pad;

        if ( checkCollision(ball, pad1) || checkCollision(ball, pad2) ) {

            ball.direction.x *= -1;

            while (checkCollision(ball, pad1) || checkCollision(ball, pad2)) {
                ball.x += ball.direction.x * ball.speed;
            }

        }

        state.pad1 = pad1;
        state.pad2 = pad2;
        state.ball = ball;

    // }

    var stringifiedState = JSON.stringify(state);

    clients.players.forEach(function(player) {
        player.connection.sendUTF(stringifiedState);
    });

    clients.espectators.forEach(function(spectator) {
        spectator.connection.sendUTF(stringifiedState);
    });

};

function checkCollision(ball, pad) {

    if ( ball.y + ball.height < pad.y ) return false;
    if ( ball.y > pad.y + pad.height ) return false;
    if ( ball.x + ball.width < pad.x ) return false;
    if ( ball.x > pad.x + pad.width ) return false;

    return true;

}

var loopHandle = setInterval(loop, 10);