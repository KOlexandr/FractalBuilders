function showCantor(num, denom) {
    try {
        return "Cantor function f(" + num + "/" + denom + ") = " + cantor(num / denom);
    } catch(e) {
        return e;
    }
}

function cantor(n) {
    if(n > 1 || n < 0) {
        throw new Error('Invalid input argument');
    } else if (n == 1) {
        return 1;
    } else if (n == 0) {
        return 0;
    } else {
        var str = Number(n).toString(3);
        var oneIndex = str.indexOf("1");
        if(oneIndex != -1) {
            str = str.substring(0, oneIndex + 1);
        }
        var binaryNumberString = str.replace(/2/g, "1");
        return binaryFloatingPointToDecimal(binaryNumberString);
    }
}

function binaryFloatingPointToDecimal(binaryNumberString, accuracy) {
    accuracy = accuracy || 20;
    var integer = parseInt(binaryNumberString.substring(0, binaryNumberString.indexOf(".")), 2);
    var rest = binaryNumberString.substr(binaryNumberString.indexOf(".") + 1, accuracy);
    var real = 0;
    for(var i = 0; i < rest.length; i++) {
        real += Math.pow(2, -(i+1)) * parseInt(rest[i], 2);
    }
    return integer + real;
}

function initExercisesPage(){
    document.getElementById("ex1").innerHTML = showCantor(7, 8);
    document.getElementById("ex2").innerHTML = showCantor(6, 23);
    document.getElementById("ex5").innerHTML = showCantor(7, 65);

    new Exercise16("ex6").build([4]);
    new Exercise16("ex7").build([4, 6]);
    new Exercise16("ex8").build([3, 7]);
    new Exercise16("ex9").build([2, 4], 5);
    new Exercise16("ex10").build([1, 2, 4], 5);
    new Exercise17("ex11").build([3, 7], [3, 7], 10);
    new Exercise17("ex12").build([5, 9], [5, 9], 10);
    new Exercise17("ex13").build([2, 7], [3, 5, 8], 10);
    new Exercise17("ex14").build([4], [4], 5);
    new Exercise17("ex15").build([1, 3], [2, 4], 5);
}

function initDynamicExercisesPage(){
    var toNumbers = function(strings) {
        var numbers = [];
        for(var i = 0; i < strings.length; i++) {
            var number = parseInt(strings[i]);
            if(!isNaN(number)) {
                numbers.push(number);
            }
        }
        return numbers;
    };
    var countCantor = function () {
        var num = Number(document.getElementById("numerator").value);
        var denom = Number(document.getElementById("denominator").value);
        document.getElementById("cantorFunc").innerHTML = showCantor(num, denom);
    };
    var oneDimensionFunc = function () {
        var str = document.getElementById("odMissNumber").value;
        new Exercise16("oneDimension").build(toNumbers(str.split(",")));
    };
    var twoDimensionFunc = function () {
        var strX = document.getElementById("tdMissNumberX").value;
        var strY = document.getElementById("tdMissNumberY").value;
        new Exercise17("twoDimension").build(toNumbers(strX.split(",")), toNumbers(strY.split(",")));
    };

    document.getElementById("numerator").onchange = countCantor;
    document.getElementById("denominator").onchange = countCantor;
    document.getElementById("odButton").onclick = oneDimensionFunc;
    document.getElementById("tdButton").onclick = twoDimensionFunc;

    countCantor();
    oneDimensionFunc();
    twoDimensionFunc();
}