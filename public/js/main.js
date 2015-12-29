(function(canvas) {
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
        move.apply(move, eventToXY(e));
    };

    canvas.addEventListener('mousedown', function(e) {
        if (e.which == 1) {
            start.apply(start, eventToXY(e));
            canvas.addEventListener('mousemove', onMouseMove);
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        if (e.which == 1) {
            finish();
            canvas.removeEventListener('mousemove', onMouseMove);
        }
    });

})(document.getElementById('scratchpad'));
