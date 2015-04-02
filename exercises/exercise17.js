function Exercise17(canvasId) {
    var canvas = document.getElementById(canvasId);

    this.arrow = 10;
    this.xRetreat = 50;
    this.yRetreat = 50;
    this.numberCount = 10;
    this.xMultiplier = 1000;
    this.yMultiplier = 1000;
    this.width = canvas.width;
    this.height = canvas.height;

    if (!canvas.getContext) {
        return;
    }

    this.context = canvas.getContext('2d');
    this.context.font = "14pt Helvetica";
    this.context.fillStyle = "black";
    this.context.lineWidth = 1;
}

Exercise17.prototype.build = function(missDigitsX, missDigitsY, radix) {
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.fillStyle = "black";

    this.radix = radix || 10;
    this.buildFractal(missDigitsX, missDigitsY);
    this.ruler();
};

Exercise17.prototype.buildFractal = function(missDigitsX, missDigitsY) {
    var missDigitsXStr = this.missDigitsToString(missDigitsX);
    var missDigitsYStr = this.missDigitsToString(missDigitsY);

    for(var i = 0; i < 1; i+=0.001) {
        if(!this.containsMissNumber(missDigitsXStr, i.toPrecision(4))) {
            for (var j = 0; j < 1; j+0.001) {
                if (!this.containsMissNumber(missDigitsYStr, j.toPrecision(4))) {
                    this.point(Math.floor(i*this.xMultiplier), Math.floor(j*this.yMultiplier));
                }
            }
        }
    }
};

Exercise17.prototype.containsMissNumber = function(missDigitsStr, currentNumber) {
    var currentNumberStr = Number(currentNumber).toString(this.radix).substr(0, 5);
    for (var i = 0; i < missDigitsStr.length; i++) {
        if (currentNumberStr.indexOf(missDigitsStr[i]) != -1) {
            return true;
        }
    }
    return false;
};

Exercise17.prototype.missDigitsToString = function(missDigits) {
    var missDigitsStr = [];
    for (var i = 0; i < missDigits.length; i++) {
        missDigitsStr.push(String(missDigits[i]));
    }
    return missDigitsStr;
};

Exercise17.prototype.point = function(x, y){
    this.context.fillRect(x + this.xRetreat, y + this.yRetreat, 1, 1);
};

Exercise17.prototype.ruler = function() {
    var xShift = this.xMultiplier / this.numberCount;
    var yShift = this.yMultiplier / this.numberCount;
    this.context.beginPath();

    /** x coordinate line **/
    this.context.moveTo(0, this.yRetreat);
    this.context.lineTo(this.width, this.yRetreat);

    this.context.moveTo(this.width - this.arrow, this.yRetreat - this.arrow);
    this.context.lineTo(this.width, this.yRetreat);
    this.context.lineTo(this.width - this.arrow, this.yRetreat + this.arrow);
    /** x coordinate line **/

    /** y coordinate line **/
    this.context.moveTo(this.xRetreat, 0);
    this.context.lineTo(this.xRetreat, this.height);

    this.context.moveTo(this.xRetreat - this.arrow, this.height - this.arrow);
    this.context.lineTo(this.xRetreat, this.height);
    this.context.lineTo(this.xRetreat + this.arrow, this.height - this.arrow);
    /** y coordinate line **/

    /** Zero point **/
    this.context.fillText("0", this.xRetreat - 15, this.yRetreat - 10);
    /** Zero point **/

    /** x coordinates **/
    var xPosition = this.xRetreat + xShift;
    for(var i = 0; i < this.numberCount; i++) {
        this.context.moveTo(xPosition, this.yRetreat - 5);
        this.context.lineTo(xPosition, this.yRetreat + 5);
        this.context.fillText(Number(i + 1).toString(), xPosition - 13, this.yRetreat - 10);
        xPosition += xShift;
    }
    /** x coordinates **/

    /** y coordinates **/
    var yPosition = this.yRetreat + yShift;
    for(var j = 0; j < this.numberCount; j++) {
        this.context.moveTo(this.xRetreat - 5, yPosition);
        this.context.lineTo(this.xRetreat + 5, yPosition);
        this.context.fillText(Number(j + 1).toString(), this.xRetreat - 35, yPosition + 6);
        yPosition += yShift;
    }
    /** y coordinates **/

    this.context.strokeStyle = "black";
    this.context.stroke();
};