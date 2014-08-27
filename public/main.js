(function() {

	//Configure requestAnimationFrame
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	window.requestAnimationFrame = requestAnimationFrame;

	//Configure web sockets
	window.WebSocket = window.WebSocket || window.MozWebSocket;

})();

$(document).ready(function() {
	
	var cnv = $("canvas")[0],
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

    //Render scene
	function render() {

		ctx.clearRect(0, 0, cnv.width, cnv.height);


	    requestAnimationFrame(render);

	}

	requestAnimationFrame(render);

});