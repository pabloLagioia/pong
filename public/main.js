(function() {

	//Configure requestAnimationFrame
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;

	//Configure web sockets
	window.WebSocket = window.WebSocket || window.MozWebSocket;

})();

var objects = [];
$(document).ready(function() {
	
	var cnv = document.getElementsByTagName("canvas")[0],
		ctx = cnv.getContext("2d"),
		connection = new WebSocket("ws://127.0.0.1:8080"),
		connectionStatus = "noConnection",
		connectionStatusMessages = {
			"noConnection": "Not Connected",
			"ok": "Connected",
			"error": "Connection error"
		},
		locations = [],
		isMouseDown = false;

	//Handle connection open
    connection.onopen = function () {
    	connectionStatus = "ok";
    };
 
 	//Handle error
    connection.onerror = function (error) {
        connectionStatus = "error";
    };
 
 	//Handle incomming messages
    connection.onmessage = function (message) {


    };
	//instantiate (drawable) game objects
	objects.push(new GameObject({color: "red", y: 180, type: "pad", name: "pad1"}));
	objects.push(new GameObject({color: "black", x: 620, y: 180, type: "pad", name: "pad2"}));
	objects.push(new GameObject({color: "black", x: cnv.width / 2, y: cnv.height / 2, type: "ball", width: 30}));

	var renderers = {
		ctx: ctx,
		pad: function (obj) {
			this.ctx.fillStyle = obj.color;
			this.ctx.fillRect(obj.position.x, obj.position.y, obj.size.width, obj.size.height);
		},
		ball: function (obj) {
			this.ctx.beginPath();
			this.ctx.fillStyle = obj.color;
			this.ctx.arc(obj.position.x, obj.position.y, obj.size.width / 2, 0, Math.PI * 2, false);
			this.ctx.fill();
			this.ctx.stroke();
		}
	};

	function gameLoop() {
		input();
		render();
		requestAnimationFrame(gameLoop);
	}

	function input() {

	}

    //Render scene
	function render() {

		ctx.clearRect(0, 0, cnv.width, cnv.height);

		objects.forEach(function (obj) {
			renderers[obj.type](obj);
		});

	}

	requestAnimationFrame(gameLoop);

});

function GameObject (options) {
	this.position = {x: options.x || 0, y : options.y || 0};
	this.size = { width: options.width || 20, height: options.height || 100};
	this.color = options.color || "black";
	this.name = options.name;

	if (typeof options.type == "string") {
		this.type = options.type.toLowerCase();
	} else {
		throw new Error("Required parameter type is undefined or not a string");
	}
}