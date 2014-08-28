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
		moving = false,
		locations = [],
		isMouseDown = false;

    var pad1 = new GameObject({color: "red", y: 180, type: "pad", name: "pad1"});
    var pad2 = new GameObject({color: "black", x: 620, y: 180, type: "pad", name: "pad2"});
    var ball = new GameObject({color: "black", x: cnv.width / 2, y: cnv.height / 2, type: "ball", width: 30});

//instantiate (drawable) game objects
    objects.push(pad1);
    objects.push(pad2);
    objects.push(ball);

	//Handle connection open
    connection.onopen = function (msg) {
        connectionMessages( msg );
    };
 
 	//Handle error
    connection.onerror = function (msg) {
        connectionMessages( msg );
    };
 
 	//Handle incomming messages
    connection.onmessage = function (event) {
        var data = JSON.parse(event.data);
        if (data) {
            pad1.position.x = data.pad1.x;
            pad1.position.y = data.pad1.y;
            pad2.position.x = data.pad2.x;
            pad2.position.y = data.pad2.y;
            ball.position.x = data.ball.x;
            ball.position.y = data.ball.y;
        }
    };

    var connectionMessages = function(msg) {
        console.debug(msg.type);
    };

    var sendMessages = function(movement) {
        connection.send( JSON.stringify({"move": movement}) );
    };

	function gameLoop() {
		input();
		render();
		requestAnimationFrame(gameLoop);
	}

	function input() {
        if (moving) {
            connection.send(JSON.stringify({move: moving}));
        }
	}

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

	jQuery("body").on("keydown", function (e) {

		if (e.keyCode == 38) {
            e.preventDefault();
			moving = "up";
		}
		if (e.keyCode == 40) {
            e.preventDefault();
			moving = "down";
		}
	});

	jQuery("body").on("keyup", function (e) {
		if (e.keyCode == 38 || e.keyCode == 40) {
            e.preventDefault();
			moving = false;
		}
	});

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