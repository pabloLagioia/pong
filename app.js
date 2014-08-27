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

    if ( clients.players.length > 2 ) {

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

        state.pad1 = clients.players[0].pad;
        state.pad2 = clients.players[1].pad;
        
        state.ball = ball;

    }

    var stringifiedState = JSON.stringify(state);

    clients.players.forEach(function(player) {
        player.connection.sendUTF(stringifiedState);
    });

    clients.espectators.forEach(function(spectator) {
        spectator.connection.sendUTF(stringifiedState);
    });

};

//var loopHandle = setInterval(loop, 10);
