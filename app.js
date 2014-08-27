var WebSocketServer = require("websocket").server,
    http = require("http"),
    project = require("./package.json"),
    config = require("./config.json"),
    path = require("path"),
    fs = require("fs"),
    clients = [],
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
        index = clients.length - 1;

    clients.push(connection);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
    connection.on('message', function(message) {

        //we should check the location is ok

        var data = message.utf8Data;


    });

    connection.on('close', function(connection) {
        //Remove client from list
        clients.splice(index, 1);
    });

});