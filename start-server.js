var fs = require("fs");
var host = "127.0.0.1";
var port = 7070;
var express = require("express");

var app = express();
app.use(express.static(__dirname + "/dist"));

app.get("/", function(request, response) { //root dir
    response.send("Hello!!");
});

app.listen(port, host);