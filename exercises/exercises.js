function ñantorFunction(n) {
    // calculate function of Ñantor
    // n must be in [0,1] interval
    if (n < 0 || n > 1) {
        throw new Error('Invalid input argument');
    } else if (n == 0 || n == 1) {
        return n;
    } else {
        return step(0, 1, n, 0.5);
    }
}

function step(left, right, arg, ordinate) {
    var partLen = (right - left) / 3;
    if ((arg >= left + partLen) && (arg <= right - partLen)) {
        return ordinate;
    } else if (arg < (right + left) / 2) {
        return step(left, left + partLen, arg, ordinate - ordinate / 2);
    } else {
        return step(right - partLen, right, arg, ordinate + ordinate / 2);
    }
}

function showCantor(num, denom) {
    return "Cantor function f(" + num + "/" + denom + ") = " + ñantorFunction(num/denom)
}

function test(){
    document.getElementById("ex1").innerHTML = showCantor(7, 8);
    document.getElementById("ex2").innerHTML = showCantor(6, 23);
    document.getElementById("ex5").innerHTML = showCantor(7, 65);

    new Exercise16("ex6").build([4]);
    new Exercise16("ex7").build([4, 6]);
    new Exercise16("ex8").build([3, 7]);
    new Exercise16("ex9").build([2, 4], 5);
    new Exercise16("ex10").build([1, 2, 4], 5);
}