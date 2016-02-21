'use strict';
const Alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
const Base = Alphabet.length
module.exports = {}

module.exports.encode = function encode (num) {
    if (num == 0) 
        return Alphabet[0];

    let s = "";

    while (num > 0)
    {  
        s = Alphabet[num % Base] + s;
        num = Math.floor(num / Base);
    }

    return s
}

module.exports.decode = function decode (str) {
    var i = 0;

    for (let c of str)
    {
        i = (i * Base) + Alphabet.indexOf(c);
    }

    return i;
}
