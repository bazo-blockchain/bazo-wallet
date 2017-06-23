// starts a very simple node webserver in the dist folder

var fs = require("fs");
var host = "127.0.0.1";
var port = 7070;
var express = require("express");
var compression = require("compression");

var app = express();
app.use(compression({filter: function (req, res) {
	if (req.headers['x-no-compression']) {
		return false;
	}
	return compression.filter(req, res);
}}));
app.use(express.static(__dirname + "/dist"));

app.get("/", function(request, response) {
	response.send("started on http://" + host + ":" + port);
});

app.listen(port, host);
