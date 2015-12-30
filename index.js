var express = require('express');
var http = require('http');
var socketio = require('socket.io');

// create the servers
var app = express();
var server = http.Server(app);
var io = socketio(server);

// set port from the environment or fall back
app.set('port', (process.env.PORT || 3000));
// route to static files
app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket) {
    socket.on('start', function(data) {
        socket.broadcast.emit('start', data);
    });
    socket.on('move', function(data) {
        socket.broadcast.emit('move', data);
    });
    socket.on('finish', function(data) {
        socket.broadcast.emit('finish', data);
    });
});

// listen
server.listen(app.get('port'), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('listening at http://%s:%s', host, port);
});
