function Main() {
    var that = this;
    var canvas = document.getElementById('canvas');
    var width = canvas.width;
    var height = canvas.height;

    if (!canvas.getContext) {
        return;
    }

    var context = canvas.getContext('2d');
    context.font = "14pt Helvetica";
    context.lineWidth = 1;

    document.getElementById("sf").addEventListener("click", function() {
        changeButtonStatus(true);
        that.renderFractal(new Sierpinski(width, height, context))
    });
    document.getElementById("pc").addEventListener("click", function() {
        changeButtonStatus(true);
        that.renderFractal(new Peano(6, width, height, context))
    });

    document.getElementById("start").addEventListener("click", function() {
        changeButtonStatus(true);
        if(null != that.fractal) {
            that.fractal.done = false;
            that.renderFractal(that.fractal);
        }
    });
    document.getElementById("stop").addEventListener("click", function() {
        changeButtonStatus(false);
        if(null != that.fractal) {
            that.fractal.done = true;
        }
    });
}

Main.prototype.renderFractal = function(fractal) {
    var that = this;
    this.fractal = fractal;
    fractal.render();
    if (!fractal.done) {
        setTimeout(function () {
            that.renderFractal(fractal);
        }, 1);
    } else {
        changeButtonStatus(false);
    }
};

function changeButtonStatus(disable) {
    var buttons = document.getElementsByTagName("button");
    for(var i = 0; i < buttons.length; i++) {
        if(buttons[i].id != "stop" && buttons[i].id != "start") {
            buttons[i].disabled = disable ? "disabled" : "";
        }
    }
}