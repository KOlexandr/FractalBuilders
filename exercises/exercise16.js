function Exercise16(canvasId) {
    var canvas = document.getElementById(canvasId);

    this.arrow = 10;
    this.numberCount = 10;
    this.yCoordinate = 25;
    this.heightPoint = 75;
    this.xMultiplier = 1000;
    this.width = canvas.width;
    this.height = canvas.height;
    this.verticalRulerLine = 50;
    this.shift = this.xMultiplier / this.numberCount;

    if (!canvas.getContext) {
        return;
    }

    this.context = canvas.getContext('2d');
    this.context.font = "14pt Helvetica";
    this.context.lineWidth = 1;

    this.context.fillStyle = "#000000";
}

Exercise16.prototype.build = function(missNumbers, radix, iterations) {
    this.radix = radix || 10;
    this.iterations = iterations || 10000;
    this.buildFractal(missNumbers);
    this.ruler();
};

Exercise16.prototype.buildFractal = function(missNumbersVector) {
    var missNumbersStr = [];
    for (var i = 0; i < missNumbersVector.length; i++) {
        missNumbersStr.push(String(missNumbersVector[i]));
    }

    for (var j = 0; j < this.iterations; j++) {
        var flag = true;
        var randNum = Math.floor(Math.random() * this.xMultiplier);
        var strNum = randNum.toString(this.radix);
        for (var h = 0; h < missNumbersStr.length; h++) {
            if (strNum.indexOf(missNumbersStr[h]) != -1) {
                flag = false;
                break;
            }
        }
        if (flag) {
            this.pointX(randNum);
        }
    }
};

Exercise16.prototype.pointX = function(x){
    this.context.fillRect(x + this.verticalRulerLine, this.yCoordinate, 1, 5);
};

Exercise16.prototype.ruler = function() {
    this.context.beginPath();
    this.context.moveTo(0, this.heightPoint);
    this.context.lineTo(this.width, this.heightPoint);

    this.context.moveTo(this.width - this.arrow, this.heightPoint - this.arrow);
    this.context.lineTo(this.width, this.heightPoint);
    this.context.lineTo(this.width - this.arrow, this.heightPoint + this.arrow);

    this.context.moveTo(this.verticalRulerLine, 0);
    this.context.lineTo(this.verticalRulerLine, this.height);

    this.context.moveTo(this.verticalRulerLine - this.arrow, this.arrow);
    this.context.lineTo(this.verticalRulerLine, 0);
    this.context.lineTo(this.verticalRulerLine + this.arrow, this.arrow);

    this.context.fillText("0", this.verticalRulerLine - 15, this.heightPoint + 20);

    var position = this.verticalRulerLine + this.shift;
    for(var i = 0; i < this.numberCount; i++) {
        this.context.moveTo(position, this.heightPoint - 5);
        this.context.lineTo(position, this.heightPoint + 5);
        this.context.fillText(Number((i + 1)/10).toString(), position - 13, this.heightPoint + 20);
        position += this.shift;
    }

    this.context.strokeStyle = "#000";
    this.context.stroke();
};