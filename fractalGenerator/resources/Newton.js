function Newton(screenXOff, screenYOff, x_extent, y_extent, context) {
    this.myScreenXOff = screenXOff;
    this.myScreenYOff = screenYOff;

    this.myXExtent = x_extent;
    this.myYExtent = y_extent;

    this.myRealMin = -2.0;
    this.myRealMax = 2.0;
    this.myImagMin = -2.0;
    this.myImagMax = 2.0;

    this.myMaxIter = 50;
    this.myRefine = 0;

    this._x = 0;
    this._y = 0;

    this.myEO = false;

    this.myDone = false;
    this.context = context;
}

//
// The computations at the beginning of this function are for Newton's 
// iterative method of Znext = Z - f(Z)/f'(Z) which will converge on a root
// 
// In this case f(Z)  = Z^4 - 1
//              f'(Z) = 4Z^3
// where Z is a number in the complex plane: (x + iy) (the passed in variables)
//
// so, to find Znext we have to find a formula for ((x+iy)^4 - 1)/4(x+iy)^3 
// that gives the answer in format (a+ib)...
//
// http://www.wolframalpha.com/input/?i=(((x%2Biy)^4)-1)/(4*((x%2Biy)^3))
//
// the "alternate form assuming x and y are real" is what we use
//
Newton.prototype.iterate = function (x, y) {
    var colorStr;
    var iterations = 0;

    while (true) {
        iterations++;

        var x2 = x * x;
        var x3 = x2 * x;
        var x4 = x3 * x;
        var x6 = x3 * x3;

        var y2 = y * y;
        var y4 = y2 * y2;
        var y6 = y2 * y4;

        var denom = 4 * Math.pow((x2 + y2), 3);

        var rtemp = x * (3 * y2 + y6 + x6 + 3 * x4 * y2 - x2 + 3 * x2 * y4);
        rtemp /= denom;

        var itemp = y * (3 * x2 + y6 + 3 * x2 * y4 - y2 + x6 + 3 * x4 * y2);
        itemp /= denom;

        x = x - rtemp;
        y = y - itemp;

        //
        // for the equation being solved, f(Z)=Z^4-1, the iteration will converge
        // on one of four roots (-1,1,-i,i)  The tighter we make the threshold
        // around the roots the cleaner the picture will be
        //
        // each root gets its own color, and the starting point is colored with
        // the color of the root it ends up converging on.
        //
        var thresh = 0.000001;

        if (x > 1 - thresh && x < 1 + thresh) {
            colorStr = this.makeColorString(255, 0, 0, iterations);
            break;
        }
        if (x < -1 + thresh && x > -1 - thresh) {
            colorStr = this.makeColorString(0, 255, 0, iterations);
            break;
        }
        if (y > 1 - thresh && y < 1 + thresh) {
            colorStr = this.makeColorString(0, 0, 255, iterations);
            break;
        }
        if (y < -1 + thresh && y > -1 - thresh) {
            colorStr = this.makeColorString(255, 255, 0, iterations);
            break;
        }

        if (iterations >= this.myMaxIter) {
            colorStr = "rgb(0,0,0)";
            break;
        }
    }
    return colorStr;
};

Newton.prototype.render = function () {
    if (this.myDone) {
        return;
    }

    var realSpan = this.myRealMax - this.myRealMin;
    var imagSpan = this.myImagMax - this.myImagMin;

    var ll = this._x + 10;                // how many columns to render at once

    for (; this._x < ll; ++this._x) {
        if (this.myEO) {
            if (this._x % 2) {
                continue;
            }
        } else {
            if (!( this._x % 2 )) {
                continue;
            }
        }

        for (this._y = 0; this._y < this.myYExtent; ++this._y) {
            var fx = this._x / this.myXExtent;
            var fy = this._y / this.myYExtent;

            var real = fx * realSpan + this.myRealMin;
            var imag = fy * imagSpan + this.myImagMin;

            this.context.fillStyle = this.iterate(real, imag);
            if (this.myEO) {
                this.context.fillRect(this._x + this.myScreenXOff, this._y + this.myScreenYOff, 1, 1);
            } else {
                this.context.fillRect(this._x + this.myScreenXOff, this._y + this.myScreenYOff, 2, 1);
            }
        }
    }

    if (this._x >= this.myXExtent) {
        if (this.myEO) {
            this.myEO = false;
            this.myDone = true;
        } else {
            this._x = 0;
            this.myEO = true;
        }
    }
};

Newton.prototype.makeColorString = function (r, g, b, i) {
    i /= this.myMaxIter - 20;

    i *= 255;
    i = Math.floor(i);

    i -= this.myRefine * 50;

    if (i > 255) {
        i = 255;
    }
    if (i < 0) {
        i = 0;
    }

    if (r > 0) {
        r -= i;
    }
    if (g > 0) {
        g -= i;
    }
    if (b > 0) {
        b -= i;
    }
    return "rgb(" + r + "," + g + "," + b + ")";
};