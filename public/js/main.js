(function(canvas, socket) {
    var ctx = canvas.getContext('2d');

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000';

    function eventToXY(e) {
        return [e.offsetX || e.layerX, e.offsetY || e.layerY];
    }

    function start(x, y) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function move(x, y) {
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function finish() {
        ctx.closePath();
    }

    function onMouseMove(e) {
        var xy = eventToXY(e);
        socket.emit('move', xy);
        move.apply(move, xy);
    };

    canvas.addEventListener('mousedown', function(e) {
        var xy = eventToXY(e);
        var x = xy[0];
        var y = xy[1];

        if (e.which == 1) {
            socket.emit('start', xy);
            start.apply(start, xy);
            canvas.addEventListener('mousemove', onMouseMove);
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        if (e.which == 1) {
            finish();
            socket.emit('finish');
            canvas.removeEventListener('mousemove', onMouseMove);
        }
    });

    // remote events
    socket.on('start', function(data) {
        start.apply(start, data);
    });
    socket.on('move', function(data) {
        move.apply(move, data);
    });
    socket.on('finish', function(data) {
        finish();
    });

})(document.getElementById('scratchpad'), io());
