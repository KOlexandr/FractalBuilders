function Julia(screenXOff, screenYOff, x_extent, y_extent, context) {
    this.myScreenXOff = screenXOff;
    this.myScreenYOff = screenYOff;

    this.myXExtent = x_extent;
    this.myYExtent = y_extent;

    this.myRealMin = -1.7;
    this.myRealMax = 1.7;
    this.myImagMin = -1;
    this.myImagMax = 1;

    this.myMaxIter = 2000;
    this.myRefine = 0;

    this.myCR = -.8;
    this.myCI = .156;

    this._x = 0;
    this._y = 0;
    this.myBoxResolution = 100;
    this.myDone = false;
    this.context = context;
}

var SIZE_X = 100;
var HEIGHT = 600;

Julia.prototype.iterate = function (real, imag) {
    var zr = real;
    var zi = imag;

    var iterations = 0;

    while (true) {
        iterations++;
        if (iterations > this.myMaxIter) {
            return 0;
        }

        var zr_next = zr * zr - zi * zi + this.myCR;
        var zi_next = 2 * zi * zr + this.myCI;

        zr = zr_next;
        zi = zi_next;

        if (zr > 4) {
            return iterations;
        }
        if (zi > 4) {
            return iterations;
        }
    }
};

Julia.prototype.render = function () {
    if (this.myDone) {
        return;
    }

    if (this.boxes()) {
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

            var iterations = this.iterate(real, imag);
            this.context.fillStyle = this.makeColorString(iterations);
            this.context.fillRect(this._x + this.myScreenXOff, this._y + this.myScreenYOff, 1, 1);
        }
    }

    if (this._x >= this.myXExtent) {
        this.myDone = true;
    }
};

Julia.prototype.makeColorString = function (i) {
    var lim = 180;
    var sub = lim / 3;

    var p = (i / SIZE_X) * lim;
    var r = 0;
    var g = 0;
    var b = 0;
    var si, c;

    p = Math.floor(p);
    if (p > 0) {
        if (i > HEIGHT) {
            var x = 128;
            if (i > 800) {
                x = 255;
            }
            p = (i / HEIGHT) * x;
            p = Math.floor(p);
            r = p;
            g = p;
        } else if (p > lim - sub) {
            si = sub + sub + sub;
            c = p / si * 255;
            c *= .55;
            c = Math.floor(c);
            r = c;
        } else if (p > lim - sub - sub) {
            si = sub + sub;
            c = p / si * 255;
            c = Math.floor(c);
            c = 75 - c;
            g = c;
            r = 50 - g;
        } else {
            si = sub;
            c = p / si * 255;
            c = Math.floor(c);
            c = 75 - c;
            b = c;
            g = 50 - b;
        }
    }
    return "rgb(" + r + "," + g + "," + b + ")";
};

Julia.prototype.boxes = function () {
    if (this.myBoxResolution <= 0) {
        return false;
    }

    var realSpan = this.myRealMax - this.myRealMin;
    var imagSpan = this.myImagMax - this.myImagMin;

    for (this._x = 0; this._x < this.myXExtent; this._x += this.myBoxResolution) {
        for (this._y = 0; this._y < this.myYExtent; this._y += this.myBoxResolution) {
            var fx = (this._x + this.myBoxResolution / 2) / this.myXExtent;
            var fy = (this._y + this.myBoxResolution / 2) / this.myYExtent;

            var real = fx * realSpan + this.myRealMin;
            var imag = fy * imagSpan + this.myImagMin;

            var iterations = this.iterate(real, imag);
            this.context.fillStyle = this.makeColorString(iterations);
            this.context.fillRect(this._x + this.myScreenXOff, this._y + this.myScreenYOff, this.myBoxResolution, this.myBoxResolution);
        }
    }

    this.myBoxResolution -= 2;
    this._x = 0;
    this._y = 0;
    return true;
};