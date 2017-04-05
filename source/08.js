function Prefixer(prefix) {
    this.prefix = prefix;
}

Prefixer.prototype.prefixArray = function (arr) { // (A)
    'use strict';

    console.log(this);

    return arr.map(function (x) { // (B)
        // Doesn’t work:
        //console.log(this);
        //return this.prefix + x; // (C)
        return 2 * x;
    });
};

var arr = [1,2];

var test = new Prefixer("ql");

console.log(test.prefixArray(arr));
