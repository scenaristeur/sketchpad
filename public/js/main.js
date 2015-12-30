(function(canvas, socket) {
    var ctx = canvas.getContext('2d');

    var oldPos = {};

    ctx.lineWidth = 5;
    ctx.strokeStyle = '#000';

    function eventToXY(e) {
        return {
            x: e.offsetX || e.layerX,
            y: e.offsetY || e.layerY
        };
    }

    function line(start, end) {
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();
    }

    function onMouseMove(e) {
        var newPos = eventToXY(e);
        socket.emit('line', {start: oldPos, end: newPos});
        line(oldPos, newPos);
        oldPos = newPos;
    };

    canvas.addEventListener('mousedown', function(e) {
        if (e.which == 1) {
            oldPos = eventToXY(e);
            canvas.addEventListener('mousemove', onMouseMove);
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        if (e.which == 1) {
            canvas.removeEventListener('mousemove', onMouseMove);
        }
    });

    // remote events
    socket.on('line', function(data) {
        line(data.start, data.end);
    });

})(document.getElementById('scratchpad'), io());
