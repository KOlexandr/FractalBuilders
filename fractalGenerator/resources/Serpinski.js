// Constructor which initializes the canvas widget
function Sierpinski(width, height, context) {
    this.width = width;
    this.height = height;

    if(width == height) {
        this.screenXOff = 0;
        this.screenYOff = 0;
        this.size = height;
    } else if(width < height) {
        this.screenXOff = 0;
        this.screenYOff = (height - width) / 2;
        this.size = width;
    } else if(width > height) {
        this.screenXOff = (width - height) / 2;
        this.screenYOff = 0;
        this.size = height;
    }

    this.done = false;
    this.context = context;

    this.depth = 0;
    this.maxDepth = 6;
}

Sierpinski.prototype.render = function () {
    if (this.done) {
        return;
    }

    this.context.clearRect(0, 0, this.width, this.height);

    // Draw the initial square (white)
    this.context.fillStyle = "white";
    this.drawSquare(this.screenXOff, this.screenYOff, this.size);

    this.context.fillStyle = "#000000";
    if (this.depth > this.maxDepth) { // make sure that depth doesn't get too high
        this.depth = this.maxDepth;
        this.done = true;
    } else {
        this.depth += 1;
    }

    this.removeCenterSquare(this.screenXOff, this.screenYOff, this.size, this.depth);
};

// Draw a Sierpinski carpet with the given recursion depth
Sierpinski.prototype.iterate = function() {};

// Draw a filled rectangle which is defined by the upper left corner x,y and its size
Sierpinski.prototype.drawSquare = function(x, y, size) {
    this.context.fillRect(x, y, size, size);
};

// Cut the square into 9 subsquares. Remove the center square (draw black)
// and execute this process for the remaining 8 subsquares.
Sierpinski.prototype.removeCenterSquare = function(x, y, size, depth) {
    if (depth > 0) {
        var subSize = size/3;

        // Remove the center square
        this.drawSquare(x+subSize, y+subSize, subSize);

        if (depth > 1) {
            // Recursively remove center square for the
            // remaining filled squares
            for (var i = 0; i < 3; ++i) {
                for (var j = 0; j < 3; ++j) {
                    if (i !== 1 || j !== 1) {
                        this.removeCenterSquare(x + i*subSize, y + j*subSize, subSize, depth - 1);
                    }
                }
            }
        }
    }
};