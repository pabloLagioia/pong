var Client = require("./Client"),
	Pad = require("./Pad");

function Player(connection) {
    this.connection = connection;
    this.pad = new Pad();
    this.type = "players";
};

Player.prototype = new Client;

Player.prototype.up = function() {
    this.y -= config.pad.speed;
};

Player.prototype.down = function() {
    this.y += config.pad.speed;
};

module.exports = Player;