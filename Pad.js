var config = require("./config");

function Pad(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.width = config.pad.width;
    this.height = config.pad.height;
}

module.exports = Pad;