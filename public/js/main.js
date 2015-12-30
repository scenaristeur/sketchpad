(function(canvas, socket) {
    var ctx = canvas.getContext('2d');

    var oldPos = {};

    var size = 5;
    var color = '#000';

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    function eventToXY(e) {
        return {
            x: e.offsetX || e.layerX,
            y: e.offsetY || e.layerY
        };
    }

    function line(start, end, size, color) {
        var oldSize = ctx.lineWidth;
        var oldColor = ctx.fillStyle;

        ctx.lineWidth = size;
        ctx.strokeStyle = color;

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.closePath();

        ctx.lineWidth = oldSize;
        ctx.strokeStyle = oldColor;
    }

    function onMouseMove(e) {
        var newPos = eventToXY(e);
        var data = {start: oldPos, end: newPos, size: size, color: color};
        socket.emit('line', data);
        line(oldPos, newPos, size, color);
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
        line(data.start, data.end, data.size, data.color);
    });

})(document.getElementById('scratchpad'), io());
