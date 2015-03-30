function main(width, height) {
    var canvas = document.getElementById('canvas');
    width = width || canvas.width;
    height = height || canvas.height;

    if (!canvas.getContext) {
        return;
    }

    var context = canvas.getContext('2d');
    context.font = "14pt Helvetica";
    context.lineWidth = 1;

    document.getElementById("mm").addEventListener("click", function() {
        renderFractal(new Mandel(0, 0, width, height, context))
    });
    document.getElementById("j1").addEventListener("click", function() {
        renderFractal(new Julia(0, 0, width, height, context))
    });
    document.getElementById("j2").addEventListener("click", function() {
        var julia = new Julia(0, 0, width, height, context);
        julia.myCR = -0.4;
        julia.myCI = 0.6;
        renderFractal(julia)
    });
    document.getElementById("nm").addEventListener("click", function() {
        renderFractal(new Newton(0, 0, width, height, context))
    });
}

function renderFractal(fractal) {
    fractal.render();
    if (!fractal.myDone) {
        setTimeout(function() {
            renderFractal(fractal);
        }, 1);
    }
}