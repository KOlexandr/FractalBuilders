function Mandel(screenXOff, screenYOff, x_extent, y_extent, context) {
    this.myScreenXOff = screenXOff;
    this.myScreenYOff = screenYOff;

    this.myXExtent = x_extent;
    this.myYExtent = y_extent;

    this.myRealMin = -2.1;
    this.myRealMax = 0.75;
    this.myImagMin = -1.2;
    this.myImagMax = 1.2;

    this.myMaxIter = 100;
    this.myRefine = 0;

    this._x = 0;
    this._y = 0;

    this.done = false;
    this.context = context;

    this.myColorMap = [];
    this.makeColorMap();
}

Mandel.prototype.iterate = function (real, imag) {
    var zr = 0;
    var zi = 0;

    var iterations = 0;

    while (true) {
        iterations++;
        if (iterations > this.myMaxIter) {
            return 0;
        }

        var zr_next = zr * zr - zi * zi + real;
        var zi_next = 2 * zi * zr + imag;

        zr = zr_next;
        zi = zi_next;

        if (zr * zr + zi * zi > 4) {
            return iterations;
        }
    }
};

Mandel.prototype.render = function () {
    if (this.done) {
        return;
    }

    var realSpan = this.myRealMax - this.myRealMin;
    var imagSpan = this.myImagMax - this.myImagMin;

    var ll = this._x + 10;               // how many columns to render at once
    for (; this._x < ll; ++this._x) {
        for (this._y = 0; this._y < this.myYExtent; ++this._y) {
            var fx = this._x / this.myXExtent;
            var fy = this._y / this.myYExtent;

            var real = fx * realSpan + this.myRealMin;
            var imag = fy * imagSpan + this.myImagMin;

            var color = this.iterate(real, imag);
            var colorStr = this.myColorMap[color % this.myColorMap.length];
            if (!color) {
                colorStr = "black";
            }

            this.context.fillStyle = colorStr;
            this.context.fillRect(this._x + this.myScreenXOff, this._y + this.myScreenYOff, 1, 1);
        }
    }

    if (this._x >= this.myXExtent) {
        this.done = true;
    }
};

Mandel.prototype.makeColorMap = function () {
    var r = 0;
    var g = 0;
    var b = 0;
    var i;

    for (i = 0; i < 64; ++i) {
        r += 4;
        this.myColorMap.push("rgb(" + r + "," + g + "," + b + ")");
    }

    for (i = 0; i < 256; ++i) {
        g++;
        this.myColorMap.push("rgb(" + r + "," + g + "," + b + ")");
    }

    r = 0;
    g = 255;
    b = 0;

    for (i = 0; i < 128; ++i) {
        g--;
        this.myColorMap.push("rgb(" + r + "," + g + "," + b + ")");
    }

    for (i = 0; i < 256; ++i) {
        b++;
        this.myColorMap.push("rgb(" + r + "," + g + "," + b + ")");
    }

    for (i = 0; i < 256; ++i) {
        r++;
        this.myColorMap.push("rgb(" + r + "," + g + "," + b + ")");
    }

    r = 0;
    g = 0;
    b = 255;

    for (i = 0; i < 128; ++i) {
        b--;
        this.myColorMap.push("rgb(" + r + "," + g + "," + b + ")");
    }

    for (i = 0; i < 256; ++i) {
        r++;
        this.myColorMap.push("rgb(" + r + "," + g + "," + b + ")");
    }

    for (i = 0; i < 256; ++i) {
        g++;
        this.myColorMap.push("rgb(" + r + "," + g + "," + b + ")");
    }
};