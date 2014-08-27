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
        client.index = players.length - 1;

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

        if ( client.type == "" )

        console.log("Looking for a replacement in the espectators");

        // if ( clients. ) {

        // }

    });

});

function loop() {

    var gameState = "waiting";

    if ( clients.players.length > 2 ) {



    }

    var state = JSON.stringify({
        type: gameState,
        pad1: clients.players[0],
        pad2: clients.players[1],
        ball: ball
    });

    clients.players.forEach(function(player) {
        player.connection.sendUTF(state);
    });

    clients.espectators.forEach(function(spectator) {
        spectator.connection.sendUTF(state);
    });

};

var loopHandle = setInterval(loop, 10);