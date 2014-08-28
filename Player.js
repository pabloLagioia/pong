var Client = require("./Client"),
	Pad = require("./Pad"),
	config = require("./config");

function Player(connection) {
    this.connection = connection;
    this.pad = new Pad();
    this.type = "players";
};

Player.prototype = new Client;

Player.prototype.up = function() {
    this.pad.y -= config.pad.speed;
};

Player.prototype.down = function() {
    this.pad.y += config.pad.speed;
};

module.exports = Player;