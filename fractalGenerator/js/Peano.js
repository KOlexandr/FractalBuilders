function Peano(steps, width, height, context) {
    this.x = [];
    this.y = [];
    this.steps = steps;
    this.positions = [];
    this.factor = {x: 3, y: 3};
    this.position = {x: 0, y: 0, angle: 0};

    this.additionSteps = 11;

    this.width = width;
    this.height = height;

    if(width == height) {
        this.xShift = 0;
        this.yShift = 0;
        this.size = height;
    } else if(width < height) {
        this.xShift = 0;
        this.size = width;
        this.yShift = (height - width) / 2;
    } else if(width > height) {
        this.yShift = 0;
        this.size = height;
        this.xShift = (width - height) / 2;
    }

    this.done = false;
    this.context = context;
    this.context.beginPath();
    this.context.clearRect(0, 0, this.width, this.height);
    this.pea(1, this.steps);

    this.xMultiplier = this.size / this.max(this.x) * this.steps;
    this.yMultiplier = this.size / this.max(this.y) * this.steps;
}

Peano.prototype.max = function(array) {
    var max = array[0];
    for(var i = 0; i < array.length; i++) {
        if(max < array[i]) {
            max = array[i];
        }
    }
    return max;
};

Peano.prototype.pea = function(g, n) {
    if (g == 0) {
        this.position.x += this.factor.x * Math.cos(this.position.angle + n);
        this.position.y += this.factor.y * Math.sin(this.position.angle + n);
        this.positions.push({x: this.position.x, y: this.position.y});
        this.x.push(this.position.x);
        this.y.push(this.position.y);
    }
    if (n < 0) {
        this.position.angle = this.position.angle + g * Math.PI / 2;
    } else if (n > 0) {
        for(var i = 0; i < this.additionSteps; i++) {
            this.pea(g * (((i + 1) % 3 ) != 0) * (1 - 2 * (i % 2)), (((i + 1) % 3) != 0) * (((3 * (i > 5)) + (-2 * (i > 5) + 1) * ((i + 1) % 3)) * n - n - 1))
        }
    }
};

Peano.prototype.render = function () {
    if (this.positions.length == 0) {
        this.done = true;
        return;
    }
    var position = this.positions.pop();
    this.context.lineTo(position.x * this. xMultiplier / this.steps + this.xShift, position.y * this.yMultiplier / this.steps + this.yShift);
    this.context.stroke();
};

Peano.prototype.iterate = function() {};