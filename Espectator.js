var Client = require("./Client");

function Espectator(connection) {
    this.connection = connection;
    this.type = "espectators";
};

Espectator.prototype = new Client;

module.exports = Espectator;