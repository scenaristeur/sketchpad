(function(canvas, socket, sizeToolbar, colorToolbar, counter) {
    var ctx = canvas.getContext('2d');

    var oldPos = {};

    var size = 4;
    var color = '#222';

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // populate the toolbars
    for (var i=1; i<10; i++) {
        var lineSize = Math.round(i*2);
        var el = document.createElement('button');
        el.innerHTML = lineSize;
        el.dataset.size = lineSize;
        el.addEventListener('click', function() {
            size = this.dataset.size;
        });
        sizeToolbar.appendChild(el);
    }

    var colors = [];
    for (var i=0; i<10; i++) {
        colors.push('hsl('+(36*i-6)+', 93%, 47%)');
    }
    colors.push('#eee', '#222');
    for (var i=0; i<colors.length; i++) {
        var el = document.createElement('button');
        el.dataset.color = colors[i];
        el.style.background = colors[i];
        el.addEventListener('click', function() {
            color = this.dataset.color;
        });
        colorToolbar.appendChild(el);
    }

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
        if (e.buttons & 1) {
            var newPos = eventToXY(e);
            var data = {start: oldPos, end: newPos, size: size, color: color};
            socket.emit('line', data);
            line(oldPos, newPos, size, color);
            oldPos = newPos;
        }
    };

    canvas.addEventListener('mousedown', function(e) {
        if (e.which == 1) {
            oldPos = eventToXY(e);
            onMouseMove(e); // draw a single point
        }
    });

    canvas.addEventListener('mouseout', function(e) {
        oldPos = {};
    });

    canvas.addEventListener('mousemove', onMouseMove);

    // remote events
    socket.on('line', function(data) {
        line(data.start, data.end, data.size, data.color);
    });

    socket.on('num_clients', function(data) {
        counter.innerHTML = data;
    });

})(document.getElementById('scratchpad'), io(), document.getElementById('size-toolbar'), document.getElementById('color-toolbar'), document.getElementById('counter'));
