var express = require('express');
var http = require('http');
var socketio = require('socket.io');

// create the servers
var app = express();
var server = http.Server(app);
var io = socketio(server);

// route to static files
app.use(express.static('public'));

// listen
server.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});
