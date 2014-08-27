var config = require("./config");

function Ball(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = config.ball.width;
    this.height = config.ball.height;
    this.speed = config.ball.speed;
}

module.exports = Ball;