function Exercise16(canvasId) {
    var canvas = document.getElementById(canvasId);

    this.arrow = 10;
    this.xRetreat = 50;
    this.yRetreat = 50;
    this.xMultiplier = 1000;
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

Exercise16.prototype.build = function(missDigits, radix) {
    this.context.fillStyle = "white";
    this.context.fillRect(0, 0, this.width, this.height);
    this.context.fillStyle = "black";

    this.radix = radix || 10;
    this.buildFractal(missDigits);
    this.ruler();
};

Exercise16.prototype.buildFractal = function(missDigits) {
    var missDigitsStr = this.missDigitsToString(missDigits);

    for(var i = 0, j = 0; i < 1; i+=0.001, j++) {
        if(!this.containsMissDigit(missDigitsStr, i.toString(this.radix).substr(0, 5))) {
            this.point(j);
        }
    }
};

Exercise16.prototype.containsMissDigit = function(missDigitsStr, currentNumberStr) {
    for (var i = 0; i < missDigitsStr.length; i++) {
        if (currentNumberStr.indexOf(missDigitsStr[i]) != -1) {
            return true;
        }
    }
    return false;
};

Exercise16.prototype.missDigitsToString = function(missDigits) {
    var missDigitsStr = [];
    for (var i = 0; i < missDigits.length; i++) {
        missDigitsStr.push(String(missDigits[i]));
    }
    return missDigitsStr;
};

Exercise16.prototype.point = function(x){
    this.context.fillRect(x + this.xRetreat, this.yRetreat + 10, 1, 5);
};

Exercise16.prototype.ruler = function() {
    var xShift = this.xMultiplier / this.radix;
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
    for(var i = 0; i < this.radix; i++) {
        this.context.moveTo(xPosition, this.yRetreat - 5);
        this.context.lineTo(xPosition, this.yRetreat + 5);
        this.context.fillText(Number(i + 1).toString(this.radix), xPosition - 13, this.yRetreat - 10);
        xPosition += xShift;
    }
    /** x coordinates **/

    this.context.strokeStyle = "black";
    this.context.stroke();
};