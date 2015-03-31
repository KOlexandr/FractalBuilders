function Exercise16_1(canvasId) {
    var canvas = document.getElementById(canvasId);

    this.arrow = 10;
    this.shift = 90;
    this.yCoordinate = 25;
    this.heightPoint = 75;
    this.xMultiplier = 1000;
    this.width = canvas.width;
    this.height = canvas.height;
    this.verticalRulerLine = 50;

    if (!canvas.getContext) {
        return;
    }

    this.context = canvas.getContext('2d');
    this.context.font = "14pt Helvetica";
    this.context.lineWidth = 1;

    this.context.fillStyle = "#000000";
}

Exercise16_1.prototype.build = function(missNumbers) {
    this.buildFractal(missNumbers);
    this.ruler();
};

Exercise16_1.prototype.buildFractal = function(missNumbersVector) {
    var missNumbersStr = [];
    for (var i = 0; i < missNumbersVector.length; i++) {
        missNumbersStr.push(String(missNumbersVector[i]));
    }

    for (var j = 0; j < 10000; j++) {
        var flag = true;
        var randNum = Math.random();
        var strNum = String(randNum).substr(0, 5);
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

Exercise16_1.prototype.pointX = function(x){
    this.context.fillRect(x * this.xMultiplier + this.verticalRulerLine, this.yCoordinate, 1, 5);
};

Exercise16_1.prototype.ruler = function() {
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

    this.context.fillText("0", 35, this.heightPoint + 20);

    var position = this.verticalRulerLine + this.shift;
    for(var i = 0; i < 10; i++) {
        this.context.moveTo(position, this.heightPoint - 5);
        this.context.lineTo(position, this.heightPoint + 5);
        this.context.fillText(String((i + 1) / 10), position - 13, this.heightPoint + 20);
        position += this.shift;
    }

    this.context.strokeStyle = "#000";
    this.context.stroke();
};